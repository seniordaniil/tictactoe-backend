declare namespace NodeJS {
  interface ProcessEnv {
    readonly PORT: string;
    readonly DB_USER: string;
    readonly DB_PASSWORD: string;
  }
}
