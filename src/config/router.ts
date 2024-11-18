import { toSnakeCase } from "@utils/caseConvert";
import express, { NextFunction, Request, Response } from "express";
import env from "@utils/env";

class Router {
  app: express.Application;
  port: number;

  constructor() {
    this.app = express();

    this.app.use(this.snakeCaseHandler());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.port = Number(env.get("BE_PORT"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  snakeCaseHandler() {
    return (_: Request, res: Response, next: NextFunction) => {
      const originalSend = res.send.bind(res);

      res.send = (body: unknown): Response => {
        const snakeCasedBody = toSnakeCase(JSON.parse(body as string));
        return originalSend(JSON.stringify(snakeCasedBody));
      };

      next();
    };
  }
}

export default Router;
