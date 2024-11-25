import { ServiceError } from "@types";
import { StatusBadRequest } from "@utils/statusCodes";
import Redis from "ioredis";
import { isValidObjectId } from "mongoose";
import { SignInDto } from "../dtos/auth/signIn.dto";
import { TokenDto, TokenPayloadDto } from "../dtos/auth/token.dto";
import jwt from "jsonwebtoken";
import moment from "moment";
import env from "@utils/env";
import { days_7 } from "@consts";
import BaseService from "@base/service";
import {
  decodeToken,
  generateAccessToken,
  generateRefreshToken,
} from "@utils/jwtToken";

class AuthService extends BaseService {
  private db: Redis;

  constructor(redisClient: Redis) {
    super();
    this.db = redisClient;
  }

  public async signIn(
    signData: Partial<SignInDto>,
  ): Promise<TokenDto | ServiceError> {
    const loginKey = `login:${signData.userId}:${signData.deviceId}`;
    const tokenPayload = {
      userId: signData.userId ?? "",
      roleId: "roleIdNotImplementedYet", // TODO: implement role system
    };
    const newAccessToken = generateAccessToken(tokenPayload);

    const storedToken = await this.db.get(loginKey);
    if (!storedToken) {
      const newRefreshToken = generateRefreshToken(tokenPayload);
      this.db.set(loginKey, newRefreshToken, "EX", days_7);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    }

    // check if refresh token not expired
    const decodedToken = decodeToken(storedToken, "refresh");
    if (!decodedToken) {
      const newRefreshToken = generateRefreshToken(tokenPayload);
      this.db.set(loginKey, newRefreshToken, "EX", days_7);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    }

    if (moment(moment()).isAfter(decodedToken.exp)) {
      const newRefreshToken = generateRefreshToken(tokenPayload);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    }

    return {
      accessToken: newAccessToken,
      refreshToken: storedToken,
    };
  }

  // public async create(data: Partial<XxxxDto>): Promise<XxxxDto | ServiceError> {
  //   const xxxxx = await this.findOne({ email: data.email });
  //   if (xxxxx) {
  //     return this.throwError("xxxxx already exists", StatusConflict);
  //   }

  //   const newxxxxx = await this.create(data);
  //   if (!newxxxxx) {
  //     return this.throwError("Error creating xxxxx", StatusBadRequest);
  //   }

  //   return newxxxxx;
  // }
}

export default AuthService;
