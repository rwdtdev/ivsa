import { Logger } from './logger';
import { S3AwsClient } from './s3-client';

export const operativeStorage = new S3AwsClient(
  {
    client: process.env.S3_OPERATIVE_CLIENT_TYPE,
    proxy: process.env.S3_OPERATIVE_PROXY,
    useProxy: process.env.S3_OPERATIVE_USE_PROXY,
    useLogger: process.env.S3_OPERATIVE_USE_LOGGER,
    url: process.env.S3_OPERATIVE_URL,
    accessKey: process.env.S3_OPERATIVE_ACCESS_KEY,
    secretKey: process.env.S3_OPERATIVE_SECRET_KEY,
    timeout: process.env.S3_OPERATIVE_TIMEOUT,
    region: process.env.S3_OPERATIVE_REGION,
    bucket: process.env.S3_OPERATIVE_BUCKET_NAME,
    autoCreateBucket: process.env.S3_OPERATIVE_AUTO_CREATE_BUCKET
  },
  new Logger({ name: 'storage:operative' })
);

export const archiveStorage = new S3AwsClient(
  {
    client: process.env.S3_ARCHIVE_CLIENT_TYPE,
    proxy: process.env.S3_ARCHIVE_PROXY,
    useProxy: process.env.S3_ARCHIVE_USE_PROXY,
    useLogger: process.env.S3_ARCHIVE_USE_LOGGER,
    url: process.env.S3_OPERATIVE_URL,
    accessKey: process.env.S3_ARCHIVE_ACCESS_KEY,
    secretKey: process.env.S3_ARCHIVE_SECRET_KEY,
    timeout: process.env.S3_ARCHIVE_TIMEOUT,
    region: process.env.S3_ARCHIVE_REGION,
    bucket: process.env.S3_ARCHIVE_BUCKET_NAME,
    autoCreateBucket: process.env.S3_ARCHIVE_AUTO_CREATE_BUCKET
  },
  new Logger({ name: 'storage:archive' })
);
