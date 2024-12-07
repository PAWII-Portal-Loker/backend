import { ObjToCamelCase } from "@utils/caseConvert";
import { NextFunction, Request, Response } from "express";

export default function camelCaseHandler() {
  return (req: Request, _: Response, next: NextFunction) => {
    if (req.body) {
      req.body = ObjToCamelCase(req.body);
    }

    next();
  };
}
