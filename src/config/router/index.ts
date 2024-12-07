import express from "express";
import env from "@utils/env";
import { getLocals } from "@chore/express/getLocals";
import { setLocals } from "@chore/express/setLocals";
import {
  camelCaseHandler,
  corsHandler,
  jsonParseHandler,
  requiredHeaders,
  snakeCaseHandler,
} from "./middlewares";

class Router {
  app: express.Application;
  host: string;
  port: number;

  constructor() {
    this.app = express();

    this.app.use(corsHandler());

    this.app.use(getLocals);
    this.app.use(setLocals);

    this.app.use(requiredHeaders());
    this.app.use(snakeCaseHandler());
    this.app.use(jsonParseHandler());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(camelCaseHandler());

    this.host = env.get("BE_HOST");
    this.port = Number(env.get("BE_PORT"));
  }

  listen() {
    this.app.listen(this.port, this.host, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default Router;
