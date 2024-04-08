import { Logger } from '@/lib/logger';
import { EventEmitter } from 'stream';
import { S3Client } from '../s3-client-base';

export class S3ClientSbercloud extends S3Client {
  constructor(config: Record<string, any>, logger: Logger, eventEmitter: EventEmitter) {
    super(config, logger, eventEmitter);
    throw new Error('S3 Sbercloud provider is not immlemented');
  }
}
