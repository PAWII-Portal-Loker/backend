import { BaseFile } from "@types";
import AWSS3Instance from "./awsS3Instance";
import BaseService from "@base/service";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { minutes_15 } from "@consts";

class AWSS3Service extends BaseService {
  private awsS3Instance = AWSS3Instance.getInstance();
  private client = this.awsS3Instance.getClient();
  private bucketName = this.awsS3Instance.bucketName;

  constructor() {
    super();
  }

  public async getFile(key: string): Promise<string | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      return await getSignedUrl(this.client, command, {
        expiresIn: minutes_15,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async upload(files: BaseFile[]): Promise<UploadReturn | null> {
    const resultSuccess = [];
    const resultFailed = [];

    try {
      for (const file of files) {
        const fileKey = this.awsS3Instance.generateFileKey(file);
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
          Body: file.content,
        });

        const res = await this.client.send(command);
        if (res.$metadata.httpStatusCode === 200) {
          resultSuccess.push(fileKey);
        } else {
          resultFailed.push(fileKey);
        }
      }
    } catch (error) {
      this.handleError(error);
    }

    if (resultSuccess.length === 0) {
      return this.handleError("Failed to upload files");
    }

    return {
      success: resultSuccess,
      failed: resultFailed,
    };
  }

  public async deleteFile(key: string): Promise<boolean | null> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const res = await this.client.send(command);
      return res.$metadata.httpStatusCode === 204;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

interface UploadReturn {
  success: string[];
  failed: string[];
}

export default AWSS3Service;
