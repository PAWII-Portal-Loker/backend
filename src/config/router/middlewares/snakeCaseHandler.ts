import { toSnakeCase } from "@utils/caseConvert";
import { NextFunction, Request, Response } from "express";

export function snakeCaseHandler() {
  return (_: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send.bind(res);

    res.send = (body: unknown): Response => {
      const snakeCasedBody = toSnakeCase(JSON.parse(body as string));
      return originalSend(JSON.stringify(snakeCasedBody));
    };

    next();
  };
}
