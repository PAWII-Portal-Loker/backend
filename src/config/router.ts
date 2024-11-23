import { toSnakeCase } from "@utils/caseConvert";
import express, { NextFunction, Request, Response } from "express";
import env from "@utils/env";
import { StatusBadRequest } from "@utils/statusCodes";
import { baseErrorRes } from "@consts";

class Router {
  app: express.Application;
  port: number;

  constructor() {
    this.app = express();

    this.app.use(this.snakeCaseHandler());
    this.app.use(this.jsonParseHandler());
    this.app.use(express.urlencoded({ extended: true }));

    this.port = Number(env.get("BE_PORT"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  private jsonParseHandler() {
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
            statusCode: StatusBadRequest,
            message: "Invalid JSON body",
          }),
        );
      });
    };
  }

  private snakeCaseHandler() {
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
