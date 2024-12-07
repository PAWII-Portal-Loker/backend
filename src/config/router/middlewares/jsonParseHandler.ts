import { baseErrorRes } from "@consts";
import { StatusBadRequest } from "@consts/statusCodes";
import express, { NextFunction, Request, Response } from "express";

export default function jsonParseHandler() {
  return (req: Request, res: Response, next: NextFunction) => {
    express.json()(req, res, (err) => {
      if (!err) {
        return next();
      }

      if (!(err instanceof SyntaxError && "body" in err)) {
        return next(err);
      }

      return res.status(StatusBadRequest).json(
        Object.assign({}, baseErrorRes, {
          message: "Invalid JSON body",
        }),
      );
    });
  };
}
