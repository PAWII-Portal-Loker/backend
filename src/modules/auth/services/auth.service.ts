import { ServiceError } from "@types";
import Redis from "ioredis";
import { SignInDto } from "../dtos/auth/signIn.dto";
import { TokenDto } from "../dtos/auth/token.dto";
import moment from "moment";
import { days_7 } from "@consts";
import {
  decodeToken,
  generateAccessToken,
  generateRefreshToken,
} from "@utils/jwtToken";
import { SignOutDto } from "../dtos/auth/signOut.dto";
import RedisService from "@base/redisService";
import { IsLoginDto } from "../dtos/auth/isLogin.dto";

class AuthService extends RedisService {
  constructor(redisClient: Redis) {
    super(redisClient);
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

    const generateAndSetRefreshToken = () => {
      const newRefreshToken = generateRefreshToken(tokenPayload);
      this.set(loginKey, newRefreshToken, days_7);
      return newRefreshToken;
    };

    // get stored refresh token
    const storedToken = await this.get(loginKey);
    if (!storedToken) {
      return {
        accessToken: newAccessToken,
        refreshToken: generateAndSetRefreshToken(),
      };
    }

    // decode refresh token
    const decodedToken = decodeToken(storedToken, "refresh");
    if (!decodedToken) {
      return {
        accessToken: newAccessToken,
        refreshToken: generateAndSetRefreshToken(),
      };
    }

    // check if refresh token expired
    if (moment(moment().toDate()).isAfter(decodedToken.exp)) {
      return {
        accessToken: newAccessToken,
        refreshToken: generateAndSetRefreshToken(),
      };
    }

    return {
      accessToken: newAccessToken,
      refreshToken: storedToken,
    };
  }

  public signOut(signData: Partial<SignOutDto>): boolean {
    const loginKey = `login:${signData.userId}:${signData.deviceId}`;
    this.asyncDel(loginKey);

    return true;
  }

  public async isLogin(
    signData: Partial<IsLoginDto>,
  ): Promise<boolean | ServiceError> {
    const loginKey = `login:${signData.userId}:${signData.deviceId}`;
    const storedToken = await this.get(loginKey);
    if (storedToken === signData.refreshToken) {
      return true;
    }

    return false;
  }
}

export default AuthService;
