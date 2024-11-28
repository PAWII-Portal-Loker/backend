export interface TokenDto {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayloadDto {
  userId: string;
  roleId: string;
  iat: number;
  exp: number;
}
