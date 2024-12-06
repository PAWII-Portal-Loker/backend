import express from "express";
import env from "@utils/env";
import { snakeCaseHandler } from "./middlewares/snakeCaseHandler";
import { jsonParseHandler } from "./middlewares/jsonParseHandler";
import { corsHandler } from "./middlewares/corsHandler";
import { requiredHeaders } from "./middlewares/requiredHeaders";
import { getLocals } from "@chore/express/getLocals";
import { setLocals } from "@chore/express/setLocals";

class Router {
  app: express.Application;
  host: string;
  port: number;

  constructor() {
    this.app = express();

    this.app.use(getLocals);
    this.app.use(setLocals);

    this.app.use(requiredHeaders());
    this.app.use(snakeCaseHandler());
    this.app.use(jsonParseHandler());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(corsHandler());

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
