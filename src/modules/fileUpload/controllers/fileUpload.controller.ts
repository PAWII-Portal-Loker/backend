import { Request, Response } from "express";
import BaseController from "@base/controller";
import { BaseFile } from "@types";
import { StatusNoContent } from "@consts/statusCodes";
import { MB_10 } from "@consts";
import AWSS3Service from "@integrations/aws/awsS3Service";
import parseFormData from "@config/router/middlewares/parser";

class FileUploadController extends BaseController {
  private awsS3Service = new AWSS3Service();

  constructor() {
    super();
    this.getFile();
    this.uploadFile();
    this.deleteFile();
  }

  private async getFile() {
    this.router.get("/v1/files/:key", async (req: Request, res: Response) => {
      const key = req.params.key;
      if (!key) {
        return this.handleError(res, {
          message: "Invalid file key",
        });
      }

      const result = await this.awsS3Service.getFile(key);
      if (this.isServiceError(res, result)) {
        return;
      }

      res.redirect(result as string);
    });
  }

  private async uploadFile() {
    this.router.post(
      "/v1/files",
      parseFormData,
      async (_: Request, res: Response) => {
        const files = res.locals.parsedFiles as BaseFile[];
        if (!files || !files.length) {
          return this.handleError(res, {
            message: "Invalid file(s) uploaded",
          });
        }

        for (const file of files) {
          if (file.size > MB_10) {
            return this.handleError(res, {
              message: "Some files exceed the 10MB limit",
            });
          }
        }

        const result = await this.awsS3Service.upload(files);
        if (this.isServiceError(res, result)) {
          return;
        }

        return this.handleSuccess(res, {
          message: `${result?.success.length}/${files.length} file(s) uploaded successfully`,
          data: result,
        });
      },
    );
  }

  private async deleteFile() {
    this.router.delete(
      "/v1/files/:key",
      async (req: Request, res: Response) => {
        const key = req.params.key;
        if (!key) {
          return this.handleError(res, {
            message: "Invalid file key",
          });
        }

        const result = this.awsS3Service.deleteFile(key);
        if (this.isServiceError(res, result)) {
          return;
        }

        return this.handleSuccess(res, {
          statusCode: StatusNoContent,
        });
      },
    );
  }
}

export default FileUploadController;
