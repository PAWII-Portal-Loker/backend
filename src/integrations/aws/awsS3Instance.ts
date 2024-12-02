import { S3Client } from "@aws-sdk/client-s3";
import { BaseFile } from "@types";
import moment from "moment";

class AWSS3Instance {
  private static instance: AWSS3Instance;
  private awsS3Client: S3Client | null = null;
  public bucketName: string = "";

  private constructor() {}

  public static getInstance(): AWSS3Instance {
    if (!AWSS3Instance.instance) {
      AWSS3Instance.instance = new AWSS3Instance();
    }
    return AWSS3Instance.instance;
  }

  public initialize(config: AWSS3Config): void {
    if (this.awsS3Client) {
      throw new Error("AWSS3Instance is already initialized.");
    }
    this.bucketName = config.bucketName;
    this.awsS3Client = new S3Client({
      region: config.region,
    });
  }

  public getClient(): S3Client {
    if (!this.awsS3Client) {
      throw new Error(
        "AWSS3Instance is not initialized. Call `initialize()` first.",
      );
    }
    return this.awsS3Client;
  }

  public generateFileKey(file: BaseFile): string {
    const timestamp = moment().unix();
    const randomString = Math.random().toString(36).substring(2, 14);
    return `${timestamp}-${randomString}-${file.name}`;
  }
}

type AWSS3Config = {
  region: string;
  bucketName: string;
};

export default AWSS3Instance;
