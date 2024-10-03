import { BucketItemStat, Client } from 'minio';
import { default as S3_EVENTS } from '../events';
import { FileObject, S3Client } from '../s3-client-base';
import { Logger } from '@/lib/logger';
import { EventEmitter, Readable } from 'stream';

export class S3ClientMinio extends S3Client {
  constructor(config: Record<string, any>, logger: Logger, eventEmitter: EventEmitter) {
    super(config, logger, eventEmitter);
    this.s3 = new Client(this.config.s3Client);
  }

  async getAsStream(file: string | FileObject) {
    const found = await this.findFile(file);

    if (!found.length) {
      throw new Error('File not found!');
    }

    return await this.s3.getObject(found[0].bucket, found[0].fileName);
  }

  async statObject(bucket: string, filename: string) {
    return this.s3.statObject(bucket, filename);
  }

  async getObjectStats(file: string | FileObject): Promise<BucketItemStat | null> {
    const { fileName, bucketName } = this.makeFileObject(file);
    try {
      const found = await this.findFile(file);

      if (!found.length) {
        throw new Error('File not found!');
      }

      const stat = await this.statObject(found[0].bucket, found[0].fileName);
      return stat;
    } catch (err) {
      this.emit(S3_EVENTS.S3_RECEIVE_FILE_STREAM_ERROR, {
        file,
        path: `${bucketName}/${fileName}`,
        error: err
      });
    }
    return null;
  }

  async getAsStreamWithRange(
    file: string | FileObject,
    start: number,
    end: number
  ): Promise<ReadableStream | null> {
    const { fileName, bucketName } = this.makeFileObject(file);
    let stream = null;
    try {
      const found = await this.findFile(file);

      if (!found.length) {
        throw new Error('File not found!');
      }

      stream = await this.s3.getPartialObject(
        found[0].bucket,
        found[0].fileName,
        start,
        end
      );
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

    const data: ReadableStream = iteratorToStream(nodeStreamToIterator(stream!));

    return data;
  }
}

async function* nodeStreamToIterator(stream: Readable) {
  for await (const chunk of stream) {
    yield new Uint8Array(chunk);
  }
}

function iteratorToStream(iterator: AsyncGenerator<Uint8Array, void, unknown>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    }
  });
}
