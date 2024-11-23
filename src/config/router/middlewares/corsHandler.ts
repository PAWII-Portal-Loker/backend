import { NextFunction, Request, Response } from "express";

export function corsHandler() {
  return (_: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Refresh-Token",
    );
    next();
  };
}
