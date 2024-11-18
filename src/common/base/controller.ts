import AuthMiddleware from "@config/auth.middleware";
import RedisDatabase from "@config/redis.database";
import { Response as DataResponse, Pagination, ServiceError } from "@types";
import { StatusBadRequest, StatusOk } from "@utils/statusCodes";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  RequestHandler,
} from "express";
import { Router } from "express";
import * as Yup from "yup";
import BasePagination from "./pagination";

class BaseController extends BasePagination {
  protected router = Router();
  protected redisDatabase: RedisDatabase;
  protected authMiddleware: AuthMiddleware;

  constructor() {
    super();
    this.redisDatabase = RedisDatabase.getInstance();
    this.authMiddleware = new AuthMiddleware(this.redisDatabase);
  }

  public getRouter(): Router {
    return this.router;
  }

  protected get mustAuthorized(): RequestHandler {
    return this.authMiddleware.refreshAccessToken.bind(this.authMiddleware);
  }

  protected validate<T>(
    req: ExpressRequest,
    res: ExpressResponse,
    schema: Yup.Schema<T>,
    isQuery = false,
  ): T | null {
    const data = isQuery
      ? schema.cast(req.query, { stripUnknown: false })
      : req.body;

    try {
      schema.validateSync(data, { abortEarly: false });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const unknownParams =
          (error.inner[0].params?.unknown as string)?.split(", ") || [];

        const strictParamsErrors = unknownParams.map((param) => {
          return {
            field: param,
            message: `${param} is not allowed`,
          };
        });

        const schemaErrors = error.inner
          .filter((err) => err.path !== "")
          .map((err) => ({
            field: err.path,
            message: err.message,
          }));

        const errorResponse = {
          statusCode: StatusBadRequest,
          message: "Validation Error",
          errors: [...strictParamsErrors, ...schemaErrors],
        };

        res.json(Object.assign({}, baseErrorRes, errorResponse));
        return null;
      }
    }

    return data;
  }

  protected validateQuery<T>(
    req: ExpressRequest,
    res: ExpressResponse,
    schema: Yup.Schema<T>,
  ): T | null {
    return this.validate(req, res, schema, true);
  }

  protected handleSuccess(
    res: ExpressResponse,
    data: Partial<DataResponse>,
    pagination?: Pagination,
  ): void {
    res.json(Object.assign({}, baseSuccessRes, data, { pagination }));
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
