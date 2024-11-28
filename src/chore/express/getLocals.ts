import { NextFunction, Request, Response } from "express";

// extend the Response interface
export function getLocals(_: Request, res: Response, next: NextFunction) {
  res.getLocals = (key: ExpressLocalsKey) => {
    return res.locals[key];
  };

  next();
}
