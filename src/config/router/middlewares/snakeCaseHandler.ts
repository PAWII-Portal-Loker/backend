import { ObjToSnakeCase } from "@utils/caseConvert";
import { NextFunction, Request, Response } from "express";

export default function snakeCaseHandler() {
  return (_: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send.bind(res);

    res.send = (body: unknown): Response => {
      const snakeCasedBody = ObjToSnakeCase(JSON.parse(body as string));
      return originalSend(JSON.stringify(snakeCasedBody));
    };

    next();
  };
}
