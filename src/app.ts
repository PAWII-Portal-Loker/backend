import MongoDatabase from "@config/mongo.database";
import RedisDatabase from "@config/redis.database";
import Router from "@config/router";
import UserController from "@user/controllers/user.controller";
import env from "@utils/env";

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

router.app.get("/", (_, res) => {
  res.send("Hello from USER service");
});

router.listen();
