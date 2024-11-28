import moment from "moment";
import { TokenPayloadDto } from "src/modules/auth/dtos/auth/token.dto";
import jwt from "jsonwebtoken";
import env from "./env";
import { TOKEN_EXPIRED, TOKEN_INVALID } from "@consts";

export function generateAccessToken(payload: Partial<TokenPayloadDto>): string {
  const payloadToIssue: TokenPayloadDto = {
    userId: payload.userId ?? "-",
    roleId: payload.roleId ?? "-",
    iat: moment().unix(),
    exp: moment().add(1, "m").unix(),
  };

  return jwt.sign(payloadToIssue, env.get("ACCESS_TOKEN_SECRET"));
}

export function generateRefreshToken(
  payload: Partial<TokenPayloadDto>,
): string {
  const payloadToIssue: TokenPayloadDto = {
    userId: payload.userId ?? "-",
    iat: moment().unix(),
    exp: moment().add(24, "h").unix(),
    roleId: payload.roleId ?? "-",
  };

  return jwt.sign(payloadToIssue, env.get("REFRESH_TOKEN_SECRET"));
}

type DecodeTokenReturn = {
  err: string;
  token?: TokenPayloadDto;
};
export function decodeToken(
  type: "access" | "refresh",
  token: string,
): DecodeTokenReturn {
  try {
    const jwtSignKey =
      type === "access" ? "ACCESS_TOKEN_SECRET" : "REFRESH_TOKEN_SECRET";
    const decodedToken = jwt.verify(token, env.get(jwtSignKey)) as
      | TokenPayloadDto
      | unknown;

    if (!decodedToken || typeof decodedToken !== "object") {
      return { err: TOKEN_INVALID };
    }

    const validToken = decodedToken as TokenPayloadDto;
    if (
      !validToken.userId ||
      !validToken.roleId ||
      !validToken.iat ||
      !validToken.exp
    ) {
      return { err: TOKEN_INVALID };
    }

    return { err: "", token: validToken };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return { err: TOKEN_EXPIRED };
    }

    return { err: TOKEN_INVALID };
  }
}

export function isExpiredError(err: unknown): boolean {
  return err instanceof jwt.TokenExpiredError;
}

export function isTokenExpired(tokenExp: number): boolean {
  return moment(moment().unix()).isAfter(tokenExp);
}
