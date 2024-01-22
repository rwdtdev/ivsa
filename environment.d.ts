declare namespace NodeJS {
  export interface ProcessEnv {
    readonly TRANSPORT_TYPE: string;
    readonly TRANSPORT_HOST: string;
    readonly TRANSPORT_PORT: number;
    readonly TRANSPORT_SECURE: boolean;
    readonly TRANSPORT_AUTH_USER: string;
    readonly TRANSPORT_AUTH_PASSWORD: string;
    readonly TRANSPORT_FROM: string;
  }
}
