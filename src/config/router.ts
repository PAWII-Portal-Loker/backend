import { toSnakeCase } from "@utils/caseConvert";
import express, { NextFunction, Request, Response } from "express";

class Router {
  app: express.Application;
  port: number;

  constructor(port: string | number) {
    this.app = express();
    this.app.use(this.snakeCaseHandler());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.port = Number(port);
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
