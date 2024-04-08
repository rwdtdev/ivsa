import { Client } from 'minio';
import { default as S3_EVENTS } from '../events';
import { FileObject, S3Client } from '../s3-client-base';
import { Logger } from '@/lib/logger';
import { EventEmitter, Readable } from 'stream';

export class S3ClientMinio extends S3Client {
  static prepareConfig(config: Record<string, any>) {
    let protocol, endPoint, port;

    if (config.url) {
      const url = new URL(config.url);

      if (!config.url.startsWith('http')) {
        throw new Error('Invalid protocol!');
      }

      protocol = url.protocol;
      endPoint = url.hostname;
      port = parseInt(url.port);
    }

    return {
      ...S3Client.prepareConfig(config),
      minio: {
        endPoint: endPoint || config.endPoint,
        port: port || config.port,
        accessKey: config['access-key'] || config.accessKey,
        secretKey: config['secret-key'] || config.secretKey,
        useSSL: protocol === 'https:'
      }
    };
  }

  constructor(config: Record<string, any>, logger: Logger, eventEmitter: EventEmitter) {
    super(S3ClientMinio.prepareConfig(config), logger, eventEmitter);

    this.s3 = new Client(this.config.minio);
  }

  async getAsStream(file: string | FileObject): Promise<Readable | null> {
    const { fileName, bucketName } = this.makeFileObject(file);
    let stream = null;

    try {
      const found = await this.findFile(file);

      if (!found.length) {
        throw new Error('File not found!');
      }

      stream = await this.s3.getObject(found[0].bucket, found[0].fileName);
      this.emit(S3_EVENTS.S3_RECEIVE_FILE_STREAM_SUCCESS, {
        file,
        path: `${found[0].bucket}/${found[0].fileName}`,
        size: stream.readableLength || null
      });
    } catch (err) {
      this.emit(S3_EVENTS.S3_RECEIVE_FILE_STREAM_ERROR, {
        file,
        path: `${bucketName}/${fileName}`,
        size: stream?.readableLength || null,
        error: err
      });
    }

    return stream;
  }
}
