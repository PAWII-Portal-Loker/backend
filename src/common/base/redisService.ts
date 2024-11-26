import Redis, { RedisKey } from "ioredis";
import BaseService from "./service";

class RedisService extends BaseService {
  private db: Redis;

  constructor(redisClient: Redis) {
    super();
    this.db = redisClient;
  }

  protected async get(key: RedisKey): Promise<string | null> {
    try {
      return await this.db.get(key);
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async set(
    key: RedisKey,
    value: string | Buffer | number,
    expiryTime?: number,
  ): Promise<string | null> {
    try {
      if (expiryTime !== null && expiryTime !== undefined) {
        return await this.db.set(key, value, "EX", expiryTime);
      }

      return await this.db.set(key, value);
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async del(key: RedisKey): Promise<number | null> {
    try {
      return await this.db.del(key);
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected asyncDel(key: RedisKey) {
    try {
      this.db.del(key);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default RedisService;
