import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StatusForbidden } from "@utils/statusCodes";
import env from "@utils/env";
import RedisDatabase from "@config/databases/redis";

class AuthMiddleware {
  private redisClient: RedisDatabase;

  constructor(redisClient: RedisDatabase) {
    this.redisClient = redisClient;
  }

  private generateAccessToken(payload: object): string {
    return jwt.sign(payload, env.get("ACCESS_TOKEN_SECRET"), {
      expiresIn: "15m", // 15 minutes
    });
  }

  private generateRefreshToken(payload: object): string {
    return jwt.sign(payload, env.get("REFRESH_TOKEN_SECRET"), {
      expiresIn: "7d", // 7 days
    });
  }

  async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.headers["x-refresh-token"] as string;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: "Refresh token is required",
          errors: [],
        });
      }

      // Verify the refresh token
      const decoded = jwt.verify(
        refreshToken,
        env.get("REFRESH_TOKEN_SECRET"),
      ) as { userId: string; iat: number };

      // Check Redis for token existence
      const redisKey = `refreshToken:${decoded.userId}:${refreshToken}`;
      const redisClient = this.redisClient.getClient();
      const tokenExists = await redisClient.get(redisKey);

      if (!tokenExists) {
        return res.status(StatusForbidden).json({
          success: false,
          statusCode: StatusForbidden,
          message: "Invalid or expired refresh token",
          errors: [],
        });
      }

      // Generate a new access token
      const newAccessToken = this.generateAccessToken({
        userId: decoded.userId,
      });

      // Optionally generate a new refresh token and replace the old one in Redis
      const newRefreshToken = this.generateRefreshToken({
        userId: decoded.userId,
      });
      await redisClient.set(redisKey, "valid", "EX", 7 * 24 * 60 * 60); // Refresh token expiry: 7 days

      res.setHeader("x-access-token", newAccessToken);
      res.setHeader("x-refresh-token", newRefreshToken);

      return next();
    } catch (_) {
      res.status(StatusForbidden).json({
        success: false,
        statusCode: StatusForbidden,
        message: "Failed to refresh token",
        errors: [],
      });
    }
  }
}

export default AuthMiddleware;
