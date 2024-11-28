import { baseErrorRes } from "@consts";
import { StatusUnauthorized } from "@utils/statusCodes";
import { NextFunction, Request, Response } from "express";

export function requiredHeaders() {
  return (req: Request, res: Response, next: NextFunction) => {
    const deviceId = req.headers["x-device-id"];
    if (!deviceId) {
      const errorRes = Object.assign({}, baseErrorRes, {
        statusCode: StatusUnauthorized,
        message: "Missing required headers",
        errors: ["x-device-id is required"],
      });

      res.status(StatusUnauthorized).json(errorRes);
      return;
    }

    res.locals.deviceId = deviceId;
    return next();
  };
}
