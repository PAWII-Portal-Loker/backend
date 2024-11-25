import moment from "moment";
import { TokenPayloadDto } from "src/modules/auth/dtos/auth/token.dto";
import jwt from "jsonwebtoken";
import env from "./env";

export function generateAccessToken(payload: Partial<TokenPayloadDto>): string {
  const payloadToIssue: TokenPayloadDto = {
    userId: payload.userId ?? "-",
    iat: moment().toDate(),
    exp: moment().add(15, "m").toDate(),
    roleId: payload.roleId ?? "-",
  };

  return jwt.sign(payloadToIssue, env.get("ACCESS_TOKEN_SECRET"), {
    expiresIn: "15m", // 15 minutes
  });
}

export function generateRefreshToken(
  payload: Partial<TokenPayloadDto>,
): string {
  const payloadToIssue: TokenPayloadDto = {
    userId: payload.userId ?? "-",
    iat: moment().toDate(),
    exp: moment().add(7, "d").toDate(),
    roleId: payload.roleId ?? "-",
  };

  return jwt.sign(payloadToIssue, env.get("REFRESH_TOKEN_SECRET"), {
    expiresIn: "7d", // 7 days
  });
}

export function decodeToken(
  token: string,
  type: "access" | "refresh",
): TokenPayloadDto | null {
  try {
    const jwtSignKey =
      type === "access" ? "ACCESS_TOKEN_SECRET" : "REFRESH_TOKEN_SECRET";
    const decodedToken = jwt.verify(token, env.get(jwtSignKey)) as
      | TokenPayloadDto
      | unknown;

    if (!decodedToken || typeof decodedToken !== "object") {
      return null;
    }

    const validToken = decodedToken as TokenPayloadDto;
    if (
      !validToken.userId ||
      !validToken.roleId ||
      !validToken.iat ||
      !validToken.exp
    ) {
      return null;
    }

    return validToken;
  } catch (_) {
    return null;
  }
}
