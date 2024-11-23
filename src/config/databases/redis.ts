import Redis from "ioredis";

class RedisDatabase {
  private static instance: RedisDatabase;
  private redisClient: Redis | null = null;

  private constructor() {}

  public static getInstance(): RedisDatabase {
    if (!RedisDatabase.instance) {
      RedisDatabase.instance = new RedisDatabase();
    }
    return RedisDatabase.instance;
  }

  public initialize(redisConfig: RedisConfig): void {
    if (this.redisClient) {
      throw new Error("RedisDatabase is already initialized.");
    }

    this.redisClient = new Redis({
      host: redisConfig.dbHost,
      port: redisConfig.dbPort,
      db: 0,
    });

    this.redisClient.on("connect", () => {
      console.log("Connected to Redis");
    });

    this.redisClient.on("error", (err) => {
      throw new Error(`Redis DB connection error: ${err}`);
    });
  }

  public getClient(): Redis {
    if (!this.redisClient) {
      throw new Error(
        "RedisDatabase is not initialized. Call `initialize()` first.",
      );
    }
    return this.redisClient;
  }

  public async close(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
      console.log("Redis connection closed");
      this.redisClient = null;
    }
  }
}

type RedisConfig = {
  dbHost: string;
  dbPort: number;
};

export default RedisDatabase;
