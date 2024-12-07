import { NextFunction, Request, Response } from "express";

export default function corsHandler() {
  return (_: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, x-device-id, x-user-id",
    );
    res.header(
      "Access-Control-Expose-Headers",
      "x-access-token, x-refresh-token, x-user-id",
    );
    res.header("Access-Control-Max-Age", "86400");

    next();
  };
}
