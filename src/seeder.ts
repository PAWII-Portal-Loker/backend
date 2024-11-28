import MongoDatabase from "@config/databases/mongo";
import env from "@utils/env";
import { RoleModel } from "./modules/role/models/role.model";

function main() {
  new MongoDatabase({
    dbHost: env.get("MONGO_DB_HOST"),
    dbPort: Number(env.get("MONGO_DB_PORT")),
    dbName: env.get("MONGO_DB_NAME"),
  });

  seedRole().then(() => {
    console.log("Seeding Role completed");
    process.exit(0);
  });
}

async function seedRole() {
  const roles = ["Company", "JobSeeker"];
  await RoleModel.insertMany(roles.map((role) => ({ name: role })));
}

main();
