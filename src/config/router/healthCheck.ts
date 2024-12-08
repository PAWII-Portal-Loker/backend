import RedisDatabase from "@config/databases/redis";
import { StatusOk } from "@consts/statusCodes";
import { Request, Response } from "express";
import mongoose from "mongoose";

export function healthCheck(_: Request, res: Response): void {
  const checks = [checkMongoDB(), checkRedisDB()];

  Promise.all(checks).then((results) => {
    res.status(StatusOk).json({ status: "ok", databases: results });
  });
}

async function checkMongoDB(): Promise<string> {
  try {
    const state = mongoose.connection.readyState;
    if (state === 1) {
      return "MongoDB: OK";
    } else {
      console.log("MongoDB: Disconnected");
      return "MongoDB: Disconnected";
    }
  } catch (error) {
    if (error instanceof Error) {
      return `MongoDB: Error - ${error.message}`;
    } else {
      return "MongoDB: Error";
    }
  }
}

async function checkRedisDB(): Promise<string> {
  const instance = RedisDatabase.getInstance();
  const redisClient = instance.getClient();

  try {
    await redisClient.ping();
    return "Redis: OK";
  } catch (error) {
    if (error instanceof Error) {
      return `Redis: Error - ${error.message}`;
    } else {
      return "Redis: Error";
    }
  }
}
