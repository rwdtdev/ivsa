import { S3ClientSbercloud } from './providers/sbercloud';
import { S3ClientMinio } from './providers/minio';
import { Logger } from '@/lib/logger';
import { EventEmitter } from 'stream';

export class S3ClientProvider {
  static createClient(
    config: Record<string, any>,
    logger = new Logger({ name: 's3-client' }),
    eventEmitter: EventEmitter = new EventEmitter()
  ) {
    if (config.client && config.client.toLowerCase() === 'sbercloud') {
      return new S3ClientSbercloud(config, logger, eventEmitter);
    }

    return new S3ClientMinio(config, logger, eventEmitter);
  }
}
