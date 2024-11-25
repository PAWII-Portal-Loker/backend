import { ServiceError, StatusCodes } from "@types";

class BaseService {
  constructor() {}

  protected throwError(message: string, statusCode: StatusCodes): ServiceError {
    return { error: true, message, statusCode };
  }

  protected handleError(error: unknown): null {
    if (error instanceof Error) {
      console.error(new Error(error.message));
    } else {
      console.error(new Error("An error occurred"));
    }

    return null;
  }
}

export default BaseService;
