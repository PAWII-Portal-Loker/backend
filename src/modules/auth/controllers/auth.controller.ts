import { Request, Response } from "express";
import BaseController from "@base/controller";
import { SignInDto, SignInSchema } from "../dtos/signIn.dto";
import AuthService from "../services/auth.service";
import UserSubservice from "@user/services/user.subservice";
import { StatusNotFound } from "@consts/statusCodes";

class AuthController extends BaseController {
  private userSubservice = new UserSubservice();
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService(this.redisClient);
    this.signIn();
    this.signOut();
    this.isLogin();
  }

  private async signIn() {
    this.router.post("/v1/auth/signin", async (req: Request, res: Response) => {
      const reqBody = this.validate(req, res, SignInSchema);
      if (!reqBody) {
        return;
      }

      const user = await this.userSubservice.validateLogin(reqBody);
      if (this.isServiceError(res, user)) {
        return;
      }

      // passing role when role system is implemented
      const signData: Partial<SignInDto> = {
        userId: user._id as string,
        deviceId: res.locals.deviceId,
        refreshToken: res.getHeader("x-refresh-token") as string,
      };

      const signIn = await this.authService.signIn(signData);
      if (this.isServiceError(res, signIn)) {
        return;
      }

      res.setHeader("x-access-token", signIn.accessToken);
      res.setHeader("x-refresh-token", signIn.refreshToken);
      res.setHeader("x-user-id", user._id as string);

      return this.handleSuccess(res, {
        message: "Success signing in",
      });
    });
  }

  private async signOut() {
    this.router.post(
      "/v1/auth/signout",
      this.mustAuthorized,
      async (_: Request, res: Response) => {
        const isUserExists = await this.userSubservice.isUserExists({
          _id: res.getLocals("userId"),
        });
        if (this.isServiceError(res, isUserExists)) {
          return;
        }
        if (!isUserExists) {
          return this.handleError(res, {
            statusCode: StatusNotFound,
            message: "User not found",
          });
        }

        const signOut = this.authService.signOut({
          userId: res.getLocals("userId"),
          deviceId: res.getLocals("deviceId"),
        });

        return this.handleSuccess(res, {
          message: "Success signing out",
          data: signOut,
        });
      },
    );
  }

  private async isLogin() {
    this.router.get(
      "/v1/auth/is-login",
      this.mustAuthorized,
      async (_: Request, res: Response) => {
        const isUserExists = await this.userSubservice.isUserExists({
          _id: res.getLocals("userId"),
        });
        if (this.isServiceError(res, isUserExists)) {
          return;
        }
        if (!isUserExists) {
          return this.handleError(res, {
            statusCode: StatusNotFound,
            message: "User not found",
          });
        }

        const [isLogin, userRole] = await Promise.all([
          this.authService.isLogin({
            userId: res.getLocals("userId"),
            deviceId: res.getLocals("deviceId"),
            refreshToken: res.getHeader("x-refresh-token") as string,
          }),
          this.userSubservice.getRoleByUserId(res.getLocals("userId")),
        ]);
        if (
          this.isServiceError(res, isLogin) ||
          this.isServiceError(res, userRole)
        ) {
          return;
        }

        return this.handleSuccess(res, {
          message: "Success signing in",
          data: {
            isLogin,
            role: isLogin ? userRole : null,
          },
        });
      },
    );
  }
}

export default AuthController;
