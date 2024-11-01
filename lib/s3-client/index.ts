import { HttpsProxyAgent } from 'hpagent';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { capitalize } from '../helpers/string';
import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  waitUntilBucketExists,
  waitUntilObjectNotExists,
  BucketAlreadyExists,
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { S3ClientConfig } from './types';
import { Logger } from '../logger';

export class S3AwsClient {
  private s3: S3Client;
  private logger: Logger;
  public clientType: string;
  private config: S3ClientConfig;

  constructor(config: S3ClientConfig, logger: Logger) {
    this.logger = logger;
    this.config = config;
    this.clientType = capitalize(config.client);

    const proxyAgent = this.setupProxyAgent(config);

    this.s3 = new S3Client({
      requestHandler: new NodeHttpHandler({ logger, ...proxyAgent }),
      region: config.region,
      endpoint: config.url,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey
      },
      ...(config.useLogger === true && { logger })
    });
  }

  private setupProxyAgent({
    useProxy,
    proxy
  }: Pick<S3ClientConfig, 'useProxy' | 'proxy'>) {
    if (useProxy && proxy) {
      const proxyAgent = new HttpsProxyAgent({ proxy });

      return {
        httpAgent: proxyAgent,
        httpsAgent: proxyAgent
      };
    }
  }

  async init() {
    if (!this.config.autoCreateBucket) {
      this.logger.info(`Connection to ${this.clientType} established`);
      return;
    }

    try {
      if (!(await this.isExistBucket(this.config.bucket))) {
        await this.createBucket(this.config.bucket);
      }

      this.logger.info(`Connection to ${this.clientType} established`);
    } catch (err) {
      this.logger.info(`Connection to ${this.clientType} failed. ${err}`);
    }
  }

  async createBucket(bucketName: string) {
    const options = { Bucket: bucketName };

    try {
      const { Location } = await this.s3.send(new CreateBucketCommand(options));
      await waitUntilBucketExists(
        { client: this.s3, maxWaitTime: this.config.timeout },
        options
      );
      this.logger.info(`Bucket created with location ${Location}`);
    } catch (err) {
      if (err instanceof BucketAlreadyExists) {
        this.logger.error(`The bucket "${bucketName}" already exists`);
      }
    }
  }

  async isExistBucket(bucketName: string) {
    const { Buckets } = await this.s3.send(new ListBucketsCommand({}));

    if (!Buckets || Buckets.length === 0) {
      return false;
    }

    const existBucket = Buckets.find((bucket) => bucket === bucketName);

    return existBucket ? true : false;
  }

  async isExistObject(objectKey: string) {
    try {
      const response = await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.config.bucket,
          Key: objectKey
        })
      );

      return response.$metadata.httpStatusCode === 200 ? true : false;
    } catch (err: any) {
      this.logger.debug(`Error while check object existance. ${err.message}`);
      return false;
    }
  }

  async getListObjects(bucketName: string) {
    const { Contents } = await this.s3.send(
      new ListObjectsV2Command({
        Bucket: bucketName || this.config.bucket
      })
    );

    return Contents;
  }

  async getObjectStats(objectKey: string) {
    const stats = await this.s3.send(
      new HeadObjectCommand({
        Bucket: this.config.bucket,
        Key: objectKey
      })
    );

    return stats;
  }

  async getAsStream(objectKey: string, range?: string) {
    const response = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: objectKey,
        Range: range
      })
    );

    return response.Body?.transformToWebStream();
  }

  async putObjectStream(objectKey: string, stream: any) {
    const cmd = new Upload({
      client: this.s3,
      params: {
        Bucket: this.config.bucket,
        Key: objectKey,
        Body: stream
      }
    });

    await cmd.done();
  }

  async putObject(objectKey: string, data: any) {
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: objectKey,
      Body: data
    });

    await this.s3.send(command);
  }

  async deleteObject(objectKey: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: objectKey
      })
    );
    await waitUntilObjectNotExists(
      { client: this.s3, maxWaitTime: this.config.timeout },
      { Bucket: this.config.bucket, Key: objectKey }
    );
  }

  async deleteObjects(objectKeys: string[]) {
    const { Deleted } = await this.s3.send(
      new DeleteObjectsCommand({
        Bucket: this.config.bucket,
        Delete: {
          Objects: objectKeys.map((k) => ({ Key: k }))
        }
      })
    );

    for (const key in objectKeys) {
      await waitUntilObjectNotExists(
        { client: this.s3, maxWaitTime: this.config.timeout },
        { Bucket: this.config.bucket, Key: key }
      );
    }

    this.logger.debug({
      message: `Objects successfully deleted ${Deleted?.length} from operative storage`,
      deletedObjects: Deleted?.map((d) => d.Key)
    });
  }
}
