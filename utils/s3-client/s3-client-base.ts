/* eslint-disable */
// @ts-nocheck
// Временно, пока не вынесено в утилиты

import _ from 'underscore';
import moment from 'moment';
import mime from 'mime-types';
import { EventEmitter, Readable } from 'stream';
import { default as S3_EVENTS } from './events';
import { FILE_NOT_FOUND, BUCKET_NOT_FOUND, FOLDER_FORMAT } from './const';
import { Logger } from '@/lib/logger';
import { Client } from 'minio';

export type FileObject = {
  date: string;
  fileName: string;
  bucketName: string;
  objectType: string;
  bucket: string;
};

export class S3Client {
  protected config: Record<string, any>;
  private logger: Logger;
  private eventEmitter: EventEmitter;
  protected s3: Client;

  static parseUrl(url: string) {
    if (!url.startsWith('http')) {
      throw new Error('Invalid protocol!');
    }

    const { protocol, hostname, port } = new URL(url);

    return {
      endPoint: hostname,
      port: parseInt(port) || (protocol === 'https:' ? 443 : 80),
      useSSL: protocol === 'https:'
    };
  }

  static prepareConfig(config: Record<string, any>) {
    const buckets = { ...config.bucket };

    const uniqBuckets = _(buckets).chain().values().uniq().value();
    const defaultBucket =
      config['default-bucket'] || uniqBuckets.length === 1 ? uniqBuckets[0] : undefined;

    const res = {
      client: config.client,
      buckets,
      ...(defaultBucket && { defaultBucket }),
      autoCreateBucket: config['auto-create-bucket'] === true,
      calculateStatsOnDelete:
        _.isUndefined(config.calculateStatsOnDelete) ||
        _.isNull(config.calculateStatsOnDelete)
          ? true
          : config.calculateStatsOnDelete,
      folderFormat: config.folderFormat || FOLDER_FORMAT,
      s3Client: {
        region: config.region || 'us-east-1',
        accessKey: config['access-key'] || config.accessKey,
        secretKey: config['secret-key'] || config.secretKey,
        ...S3Client.parseUrl(config.url),
        ...(config.transport && { transport: config.transport }),
        ...(config.sessionToken && { sessionToken: config.sessionToken }),
        ...(config.partSize && { partSize: config.partSize }),
        ...(config.pathStyle && { pathStyle: config.pathStyle })
      }
    };

    return res;
  }

  constructor(config: Record<string, any>, logger: Logger, eventEmitter: EventEmitter) {
    this.config = S3Client.prepareConfig(config);
    this.logger = logger;
    this.eventEmitter = eventEmitter;
    this.s3 = null;
  }

  emit(event, opts) {
    if (this.eventEmitter) {
      this.eventEmitter.emit(event, opts);
    }
  }

  private addDateFolder = (date, fileName) => {
    if (!date) return fileName;

    const parts = [];
    const folder = moment(date).format(this.config.folderFormat);
    if (folder !== 'Invalid date') parts.push(folder);
    parts.push(fileName);

    return parts.join('/');
  };

  protected makeFileObject(file: string | FileObject) {
    const splitter = '/';
    if (!file) throw new Error('File is undefined!');

    if (_.isString(file)) {
      const splitted = file.split(splitter);
      if (splitted[0] === '') splitted.shift();
      if (splitted.length === 1) throw new Error('Undefined bucket in file name!');
      const bucketName = splitted.shift();
      const fileName = splitted.join('/');
      return { bucketName, fileName };
    }

    return _.omit(
      {
        ...file,
        fileName: this.addDateFolder(file.date, file.fileName)
      },
      'date'
    );
  }

  private bucketsToSearch({ bucketName, objectType }: Partial<FileObject>): string[] {
    let buckets;

    if (!objectType) {
      buckets = bucketName
        ? [bucketName]
        : this.config.defaultBucket
          ? [this.config.defaultBucket]
          : [];
    } else {
      buckets = [this.config.buckets[objectType]];
    }
    buckets = _.uniq(buckets || []);

    if (!buckets.length) throw Error('No buckets to search!');

    return buckets;
  }

  bucketToPut({ bucketName, objectType }: Partial<FileObject>): string {
    let bucket;

    if (!objectType) {
      bucket = !bucketName ? this.config.defaultBucket : bucketName;
    } else {
      bucket = this.config.buckets[objectType];
    }
    if (!bucket) throw new Error('No bucket!');

    return bucket;
  }

  /**
   * Ищет файл в бакете, если находит, то возвращает объект с
   * именем бакета и статистикой по файлу, иначе пустое значение
   * @param {string} bucket Имя бакета.
   * @param {string} fileName Имя файла.
   * @returns {Promise<FoundFileObject|any|Error>}
   */
  async fileBucket(bucket: string, fileName: string): Promise<FileObject | void> {
    try {
      const stats = await this.statObject(bucket, fileName);

      return {
        fileName,
        bucket,
        stats
      };
    } catch (err) {
      if (err.code && (err.code === FILE_NOT_FOUND || err.code === BUCKET_NOT_FOUND))
        return;
      this.logger.error(err.stack || err);
      throw err;
    }
  }

  async findFile(file: string | FileObject): Promise<FileObject[]> {
    const { fileName, bucketName, objectType } = this.makeFileObject(file);
    const buckets = this.bucketsToSearch({ bucketName, objectType });
    return _.filter(
      await Promise.allSettled(
        buckets.map((bucket) => this.fileBucket(bucket, fileName))
      ),
      (item) => item.status === 'fulfilled' && item.value
    ).map((item) => item.value);
  }

  makeFilePath(file: string | FileObject): string {
    if (!file) return '';
    if (_.isString(file)) return file;

    return _.filter(
      [
        !file.objectType ? file.bucketName : this.config.buckets[file.objectType],
        file.date,
        file.fileName
      ],
      (part) => !!part
    ).join('/');
  }

  /**
   * Инициализирует инстанс: проверяет умолчание, создает бакеты
   * @returns {Promise<void|Array<boolean>>}
   */
  async init() {
    let result;
    if (!this.config.autoCreateBucket) {
      this.emit(S3_EVENTS.S3_INIT_SUCCESS);
      this.logger.info(`Connection to ${this.constructor.name} established`);
      return;
    }

    try {
      result = await Promise.all(
        _.values(this.config.buckets).map(async (bucket) => {
          if (!(await this.bucketExists(bucket))) {
            await this.makeBucket(bucket);
          }
          return true;
        })
      );
      this.emit(S3_EVENTS.S3_INIT_SUCCESS);
      this.logger.info(`Connection to ${this.constructor.name} established`);
    } catch (err) {
      this.emit(S3_EVENTS.S3_INIT_ERROR);
      this.logger.info(`Connection to ${this.constructor.name} failed. ${err}`);
    }

    return result;
  }

  async exists(file: string | FileObject) {
    let filePath;
    const { fileName, bucketName } = this.makeFileObject(file);
    filePath = `${bucketName}/${fileName}`;

    try {
      const found = await this.findFile(file);
      const isExist = found.length > 0;

      if (isExist) filePath = `${found[0].bucket}/${found[0].fileName}`;

      this.emit(S3_EVENTS.S3_CHECK_EXISTANSE_SUCCESS, {
        file,
        path: filePath,
        result: isExist
      });

      return isExist;
    } catch (err) {
      if (err.code && (err.code === FILE_NOT_FOUND || err.code === BUCKET_NOT_FOUND)) {
        this.emit(S3_EVENTS.S3_CHECK_EXISTANSE_SUCCESS, {
          file,
          path: filePath,
          result: false
        });
        return false;
      } else {
        this.emit(S3_EVENTS.S3_CHECK_EXISTANSE_ERROR, {
          file,
          path: filePath,
          result: null,
          error: err
        });
      }

      this.logger.error(err.stack || err);
      throw err;
    }
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async get(_file: string | FileObject) {
    throw new Error('Method "get" must be implemented');
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async getAsStream(file: string | FileObject): Promise<Readable | null> {
    throw new Error('Method "getAsStream" must be implemented');
  }

  getFileSizeOrNull(data: number): number | null {
    let size = null;
    try {
      if (data instanceof Readable && data.readable) size = data.readableLength;
      if (data instanceof Buffer) size = Buffer.byteLength(data);
      if (data instanceof String) size = data.length;
    } catch (err) {
      size = null;
      this.logger.error(`Can't get file size from "${typeof data}" type.`, err);
    }

    return size;
  }

  getContentType(filename: string) {
    const foundType = mime.lookup(filename);
    const type = foundType || 'application/octet-stream';

    return mime.contentType(type);
  }

  async delete() {
    throw new Error('Method "delete" must be implemented');
  }

  async deleteBatch() {
    throw new Error('Method "deleteBatch" must be implemented');
  }

  bucketExists(bucket) {
    throw new Error('Method "bucketExists" must be implemented');
  }

  statObject(bucket, filename) {
    // Закоммитил для работы просмотра видео инвентаризации
    // Раскомитить после имплементации
    throw new Error('Method "statObject" must be implemented');
  }

  listObjectsV2(bucket, prefix, recursive, startAfter) {
    throw new Error('Method "listObjectsV2" must be implemented');
  }
}
