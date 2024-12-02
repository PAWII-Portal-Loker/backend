import MongoDatabase from "@config/databases/mongo";
import RedisDatabase from "@config/databases/redis";
import Router from "@config/router";
import env from "@utils/env";
import UserController from "@user/controllers/user.controller";
import AuthController from "@auth/controllers/auth.controller";
import CompanyController from "@company/controllers/company.controller";

new MongoDatabase({
  dbHost: env.get("MONGO_DB_HOST"),
  dbPort: Number(env.get("MONGO_DB_PORT")),
  dbName: env.get("MONGO_DB_NAME"),
});

RedisDatabase.getInstance().initialize({
  dbHost: env.get("REDIS_DB_HOST"),
  dbPort: Number(env.get("REDIS_DB_PORT")),
});

const router = new Router();

router.app.use("/", new UserController().getRouter());
router.app.use("/", new AuthController().getRouter());
router.app.use("/", new CompanyController().getRouter());

router.app.get("/", (_, res) => {
  res.send("Hello from USER service");
});

router.listen();
