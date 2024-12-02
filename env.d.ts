type EnvInterface = {
  ENVIRONMENT: string;

  BE_HOST: string;
  BE_PORT: number;

  // database
  MONGO_DB_HOST: string;
  MONGO_DB_PORT: number;
  MONGO_DB_NAME: string;
  REDIS_DB_HOST: string;
  REDIS_DB_PORT: number;

  // auth
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;

  // AWS - S3
  AWS_REGION: string;
  AWS_BUCKET_NAME: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
};
