import { Response as DataResponse, ServiceError } from "@types";
import { StatusBadRequest, StatusOk } from "@utils/statusCodes";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { Router } from "express";
import * as Yup from "yup";

class BaseController {
  protected router = Router();

  public getRouter(): Router {
    return this.router;
  }

  protected validate<T>(
    req: ExpressRequest,
    res: ExpressResponse,
    schema: Yup.Schema<T>,
  ): T | null {
    const data = req.body;
    try {
      schema.validateSync(data, { abortEarly: false });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorResponse = {
          statusCode: StatusBadRequest,
          message: "Validation Error",
          errors: error.inner.map((err) => ({
            field: err.path || "Unknown Field",
            message: err.message,
          })),
        };
        res.json(Object.assign({}, baseErrorRes, errorResponse));

        return null;
      }
    }

    return data;
  }

  protected handleSuccess(
    res: ExpressResponse,
    data: Partial<DataResponse>,
  ): void {
    res.json(Object.assign({}, baseSuccessRes, data));
  }

  protected handleError(
    res: ExpressResponse,
    err: Partial<ServiceError>,
  ): void {
    res.json(
      Object.assign({}, baseErrorRes, {
        statusCode: err.statusCode,
        message: err.message,
      }),
    );
  }

  protected isServiceError(obj: unknown | ServiceError): obj is ServiceError {
    return (obj as ServiceError).error !== undefined;
  }
}

const baseSuccessRes = Object.freeze({
  success: true,
  statusCode: StatusOk,
  message: "Success",
  data: {},
});

const baseErrorRes = Object.freeze({
  success: false,
  statusCode: 500,
  message: "Error",
  errors: [],
});

export default BaseController;
