export type S3ClientConfig = {
  client: 'sbercloud' | 'minio';
  proxy: string;
  useProxy: boolean;
  useLogger: boolean;
  url: string;
  accessKey: string;
  secretKey: string;
  timeout: number;
  region: string;
  bucket: string;
  autoCreateBucket: boolean;
};
