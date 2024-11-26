import { Request, Response } from "express";
import BaseController from "@base/controller";
import { SignInDto, SignInSchema } from "../dtos/auth/signIn.dto";
import AuthService from "../services/auth.service";
import { SignOutSchema } from "../dtos/auth/signOut.dto";
import UserSubservice from "@user/services/user.subservice";
import { StatusNotFound } from "@utils/statusCodes";
import { IsLoginSchema } from "../dtos/auth/isLogin.dto";

class AuthController extends BaseController {
  private userSubservice = new UserSubservice();
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService(this.redisDatabase.getClient());
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
        // TODO: strict validation untuk device-id
        deviceId: res.getHeader("device-id") as string,
        refreshToken: res.getHeader("x-refresh-token") as string,
      };

      const signIn = await this.authService.signIn(signData);
      if (this.isServiceError(res, signIn)) {
        return;
      }

      return this.handleSuccess(res, {
        message: "Success signing in",
        data: signIn,
      });
    });
  }

  private async signOut() {
    this.router.post(
      "/v1/auth/signout",
      async (req: Request, res: Response) => {
        const reqBody = this.validate(req, res, SignOutSchema);
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

        const signOut = this.authService.signOut(reqBody);
        return this.handleSuccess(res, {
          message: "Success signing in",
          data: signOut,
        });
      },
    );
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
