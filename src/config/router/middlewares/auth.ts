import { NextFunction, Request, Response } from "express";
import { StatusUnauthorized } from "@consts/statusCodes";
import {
  decodeToken,
  generateAccessToken,
  generateRefreshToken,
} from "@utils/jwtToken";
import Redis from "ioredis";
import RedisService from "@base/redisService";
import { baseErrorRes, days_7, TOKEN_EXPIRED, TOKEN_INVALID } from "@consts";
import { RequiredHeaders } from "@types";
import { isValidObjectId } from "mongoose";
import UserService from "@user/services/user.service";

class AuthMiddleware extends RedisService {
  private userService = new UserService();

  constructor(redisClient: Redis) {
    super(redisClient);
  }

  async mustAuthorized(req: Request, res: Response, next: NextFunction) {
    try {
      // validate required headers
      const headers = this.validateHeaders(req, res);
      if (!headers) {
        return;
      }

      const user = await this.userService.findOne({ _id: headers.userId });
      if (!user) {
        return this.throwUnauthorized(res, "Invalid user id");
      }

      res.setHeader("x-access-token", headers.accessToken);
      res.setHeader("x-refresh-token", headers.refreshToken);

      const accessToken = decodeToken("access", headers.accessToken);
      // [A1] if access token invalid
      if (accessToken.err === TOKEN_INVALID) {
        // console.log("A1");
        return this.throwUnauthorized(res, "Invalid access token");
      }

      // [A2] if access token expired
      if (accessToken.err === TOKEN_EXPIRED) {
        // console.log("A2");
        const tokenPayload = {
          userId: headers.userId ?? "",
          role: (user.role as string) ?? "",
        };

        const refreshToken = decodeToken("refresh", headers.refreshToken);
        // [R1] if refresh token invalid
        if (refreshToken.err === TOKEN_INVALID) {
          // console.log("R1");
          return this.throwUnauthorized(res, "Invalid refresh token");
        }

        // [R2] if refresh token expired
        if (refreshToken.err === TOKEN_EXPIRED) {
          // console.log("R2");
          const loginKey = `auth:${headers.userId}:${headers.deviceId}`;
          const storedToken = await this.get(loginKey);
          if (!storedToken) {
            return this.throwUnauthorized(
              res,
              "Unauthorized, please login again",
            );
          }

          if (storedToken !== headers.refreshToken) {
            this.set(loginKey, headers.refreshToken, days_7);
          }

          const newAccessToken = generateAccessToken(tokenPayload);
          const newRefreshToken = generateRefreshToken(tokenPayload);

          res.setHeader("x-access-token", newAccessToken);
          res.setHeader("x-refresh-token", newRefreshToken);

          this.set(loginKey, newRefreshToken, days_7);
        }

        // [R3] if refresh token not expired
        const validRefreshToken = !refreshToken.err && refreshToken?.token;
        if (validRefreshToken && validRefreshToken.userId !== headers.userId) {
          // console.log("R3");
          return this.throwUnauthorized(
            res,
            "User id mismatch in refresh token",
          );
        }

        // [R4] if refresh token not expired and user id match
        if (validRefreshToken && validRefreshToken.userId === headers.userId) {
          // console.log("R4");
          const loginKey = `auth:${headers.userId}:${headers.deviceId}`;
          const storedToken = await this.get(loginKey);
          if (!storedToken) {
            return this.throwUnauthorized(
              res,
              "Unauthorized, please login again",
            );
          }

          if (storedToken !== headers.refreshToken) {
            return this.throwUnauthorized(
              res,
              "Unauthorized, refresh token mismatch",
            );
          }

          const newAccessToken = generateAccessToken(tokenPayload);
          res.setHeader("x-access-token", newAccessToken);
          res.setLocals("userId", validRefreshToken.userId);
          res.setLocals("role", validRefreshToken.role);
        }
      }

      // [A3] if access token not expired but mismatch user id
      const validAccessToken = accessToken?.token;
      if (validAccessToken && validAccessToken.userId !== headers.userId) {
        // console.log("A3");
        return this.throwUnauthorized(res, "User id mismatch in access token");
      }

      // [A4] if access token not expired and user id match
      if (validAccessToken && validAccessToken.userId === headers.userId) {
        // console.log("A4");
        res.setLocals("userId", validAccessToken.userId);
        res.setLocals("role", validAccessToken.role);
      }

      return next();
    } catch (_) {
      res.status(StatusUnauthorized).json({
        success: false,
        statusCode: StatusUnauthorized,
        message: "Failed to refresh token",
        errors: [],
      });
    }
  }

  private validateHeaders(req: Request, res: Response): RequiredHeaders | null {
    const userId = req.headers["x-user-id"];
    const accessToken = req.headers["x-access-token"];
    const refreshToken = req.headers["x-refresh-token"];

    if (!userId || !accessToken || !refreshToken) {
      const errorRes = Object.assign({}, baseErrorRes, {
        statusCode: StatusUnauthorized,
        message: "Missing required headers",
        errors: [
          !userId && "x-user-id is required",
          !accessToken && "x-access-token is required",
          !refreshToken && "x-refresh-token is required",
        ].filter(Boolean),
      });

      res.status(StatusUnauthorized).json(errorRes);
      return null;
    }

    if (!isValidObjectId(userId)) {
      const errorRes = Object.assign({}, baseErrorRes, {
        statusCode: StatusUnauthorized,
        message: "Invalid user id",
        errors: [],
      });

      res.status(StatusUnauthorized).json(errorRes);
    }

    return {
      deviceId: res.getLocals("deviceId") as string,
      userId: userId as string,
      accessToken: accessToken as string,
      refreshToken: refreshToken as string,
    };
  }

  private throwUnauthorized(res: Response, msg?: string) {
    const errorRes = Object.assign({}, baseErrorRes, {
      statusCode: StatusUnauthorized,
      message: msg ?? "Forbidden",
    });

    res.status(StatusUnauthorized).json(errorRes);
  }
}

export default AuthMiddleware;
