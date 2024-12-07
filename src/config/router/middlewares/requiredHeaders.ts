import { baseErrorRes } from "@consts";
import { StatusUnauthorized } from "@utils/statusCodes";
import { NextFunction, Request, Response } from "express";

const whitelistedRoutes = ["GET:/v1/files"];

export default function requiredHeaders() {
  return (req: Request, res: Response, next: NextFunction) => {
    const isWhitelisted = whitelistedRoutes.some((prefix) => {
      const [method, path] = prefix.split(":");
      return req.method === method && req.path.startsWith(path);
    });
    if (isWhitelisted) {
      return next();
    }

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

    res.setLocals("deviceId", deviceId);
    return next();
  };
}
