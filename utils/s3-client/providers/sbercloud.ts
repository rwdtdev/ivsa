import { Logger } from '@/lib/logger';
import { FileObject, S3Client } from '../s3-client-base';
import { Client } from 'minio';
import { EventEmitter } from 'stream';

export class S3ClientSbercloud extends S3Client {
  constructor(config: Record<string, any>, logger: Logger, eventEmitter: EventEmitter) {
    super(config, logger, eventEmitter);

    this.s3 = new Client(this.config.s3Client);
  }

  bucketExists(bucket: string) {
    return this.s3.bucketExists(bucket);
  }

  makeBucket(bucketName: string) {
    return this.s3.makeBucket(bucketName);
  }

  statObject(bucketName: string, fileName: string) {
    return this.s3.statObject(bucketName, fileName);
  }

  listObjectsV2(bucketName: string, prefix = '', recursive = true, startAfter = '') {
    return this.s3.listObjectsV2(bucketName, prefix, recursive, startAfter);
  }

  putObject(bucketName: string, fileName: string, fileData: any, headers: any) {
    return this.s3.putObject(bucketName, fileName, fileData, headers);
  }

  async getAsStream(file: string | FileObject) {
    const found = await this.findFile(file);

    if (!found.length) {
      throw new Error('File not found!');
    }

    return await this.s3.getObject(found[0].bucket, found[0].fileName);
  }
}
