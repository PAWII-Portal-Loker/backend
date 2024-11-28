import { Request, Response } from "express";
import BaseController from "@base/controller";
import { SignInDto, SignInSchema } from "../dtos/auth/signIn.dto";
import AuthService from "../services/auth.service";
import UserSubservice from "@user/services/user.subservice";
import { StatusNotFound } from "@utils/statusCodes";
import { IsLoginSchema } from "../dtos/auth/isLogin.dto";

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

      // passing roleId when role system is implemented
      const signData: Partial<SignInDto> = {
        userId: user._id as string,
        deviceId: res.locals.deviceId,
        refreshToken: this.getHeader(res, "x-refresh-token"),
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
    this.router.post("/v1/auth/signout", async (_: Request, res: Response) => {
      const isUserExists = await this.userSubservice.isUserExists({
        _id: res.locals.userId,
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
        userId: res.locals.userId,
        deviceId: res.locals.deviceId,
      });

      return this.handleSuccess(res, {
        message: "Success signing in",
        data: signOut,
      });
    });
  }

  private async isLogin() {
    this.router.post(
      "/v1/auth/is-login",
      async (req: Request, res: Response) => {
        const reqBody = this.validate(req, res, IsLoginSchema);
        if (!reqBody) {
          return;
        }

        const isUserExists = await this.userSubservice.isUserExists({
          _id: reqBody.userId,
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

        const isLogin = this.authService.isLogin(reqBody);
        return this.handleSuccess(res, {
          message: "Success signing in",
          data: {
            isLogin,
            // TODO: return role when role system is implemented
          },
        });
      },
    );
  }
}

export default AuthController;
