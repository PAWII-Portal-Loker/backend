import { NextFunction, Request, Response } from "express";

// extend the Response interface
export function setLocals(_: Request, res: Response, next: NextFunction) {
  res.setLocals = (key: ExpressLocalsKey, value: string | string[]) => {
    res.locals[key] = value;
  };

  next();
}
