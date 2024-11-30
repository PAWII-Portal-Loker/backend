export interface TokenDto {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayloadDto {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}
