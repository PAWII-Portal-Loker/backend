import Database from "@config/database";
import Router from "@config/router";
import UserController from "@user/controllers/user.controller";
import Env from "@utils/env";

const env = new Env<UserServiceEnv>(".env");

new Database({
  dbHost: env.get("DB_HOST"),
  dbPort: Number(env.get("DB_PORT")),
  dbUser: env.get("DB_USER"),
  dbPassword: env.get("DB_PASSWORD"),
  dbName: env.get("DB_NAME"),
});

const router = new Router(Number(env.get("BE_PORT")));

router.app.use("/", new UserController().getRouter());

router.app.get("/", (_, res) => {
  res.send("Hello from USER service");
});

router.listen();
