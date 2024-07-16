import { S3ClientMinio } from './providers/minio';
import { S3ClientSbercloud } from './providers/sbercloud';

export function isS3ClientMinio(
  s3client: S3ClientMinio | S3ClientSbercloud
): s3client is S3ClientMinio {
  if (process.env.S3_CLIENT_TYPE?.toLowerCase() === 'minio') {
    return true;
  }
  return false;
}
