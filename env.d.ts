type S3ClientType = 'sbercloud' | 'minio';
type S3Region = 'ru-central-1' | 'us-east-1';

namespace NodeJS {
  interface ProcessEnv {
    APP_NAME: string;

    POSTGRES_HOSTNAME: string;
    POSTGRES_DB: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;

    DATABASE_URL: string;
    DATABASE_LOGS: boolean;

    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;

    TRANSPORT_AUTH_ENABLE: boolean;
    TRANSPORT_TYPE: string;
    TRANSPORT_HOST: string;
    TRANSPORT_PORT: number;
    TRANSPORT_SECURE: boolean;
    TRANSPORT_AUTH_USER: string;
    TRANSPORT_AUTH_PASSWORD: string;
    TRANSPORT_FROM: string;

    JWT_ACCESS_TOKEN_SECRET: string;
    JWT_REFRESH_TOKEN_SECRET: string;
    JWT_ACCESS_TOKEN_EXPIRATION: string;
    JWT_REFRESH_TOKEN_EXPIRATION: string;

    IVA_API_URL: string;
    IVA_APP_ID: string;
    IVA_APP_SECRET: string;
    IVA_APP_DOMAIN_ID: string;

    ASVI_API_KEY: string;
    OCRV_API_KEY: string;

    LOCATION_RECORDER_APP_KEY: string;

    S3_OPERATIVE_CLIENT_TYPE: S3ClientType;
    S3_OPERATIVE_REGION: S3Region;
    S3_OPERATIVE_URL: string;
    S3_OPERATIVE_ACCESS_KEY: string;
    S3_OPERATIVE_SECRET_KEY: string;
    S3_OPERATIVE_BUCKET_NAME: string;
    S3_OPERATIVE_TIMEOUT: number;
    S3_OPERATIVE_AUTO_CREATE_BUCKET: boolean;
    S3_OPERATIVE_USE_LOGGER: boolena;
    S3_OPERATIVE_USE_PROXY: boolean;
    S3_OPERATIVE_PROXY: string;

    S3_ARCHIVE_CLIENT_TYPE: S3ClientType;
    S3_ARCHIVE_REGION: S3Region;
    S3_ARCHIVE_URL: string;
    S3_ARCHIVE_ACCESS_KEY: string;
    S3_ARCHIVE_SECRET_KEY: string;
    S3_ARCHIVE_BUCKET_NAME: string;
    S3_ARCHIVE_TIMEOUT: number;
    S3_ARCHIVE_AUTO_CREATE_BUCKET: boolean;
    S3_ARCHIVE_USE_LOGGER: boolean;
    S3_ARCHIVE_USE_PROXY: boolean;
    S3_ARCHIVE_PROXY: string;

    TECHNICAL_SPEAKER_IVA_PROFILE_ID: string;

    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;
    ADMIN_EMAIL: string;
    ADMIN_IVA_PROFILE_ID: string;
  }
}
