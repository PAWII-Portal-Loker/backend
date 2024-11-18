import dotenv from "dotenv";

class Env<T> {
  constructor(path?: string) {
    dotenv.config({ path: path });
  }

  get(key: keyof T): string {
    return process.env[key] ?? "";
  }
}

export default new Env<EnvInterface>(".env");
