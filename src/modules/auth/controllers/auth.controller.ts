import { Request, Response } from "express";
import BaseController from "@base/controller";
import { SignInDto, SignInSchema } from "../dtos/signIn.dto";
import AuthService from "../services/auth.service";
import UserSubservice from "@user/services/user.subservice";
import { StatusNotFound } from "@consts/statusCodes";
import { ForgetPasswordSchema } from "@auth/dtos/forgetPassword.dto";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { ResetPasswordSchema } from "@auth/dtos/resetPassword.dto";

class AuthController extends BaseController {
  private userSubservice = new UserSubservice();
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService(this.redisClient);
    this.signIn();
    this.signOut();
    this.isLogin();
    this.forgetPassword();
    this.resetPassword();
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

      const signData: Partial<SignInDto> = {
        userId: user._id as string,
        deviceId: res.locals.deviceId,
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
            role: isLogin ? userRole || null : null,
          },
        });
      },
    );
  }

  private async forgetPassword() {
    this.router.post(
      "/v1/auth/forget-password",
      async (req: Request, res: Response) => {
        const reqBody = this.validate(req, res, ForgetPasswordSchema);
        if (!reqBody) {
          return;
        }

        const user = await this.userSubservice.findOne({
          email: reqBody.email,
        });
        if (!user) {
          return this.handleError(res, {
            statusCode: StatusNotFound,
            message: "User not found",
          });
        }

        const resetToken = uuidv4();

        await this.redisClient.set(
          `forget-password:${resetToken}`,
          user._id as string,
          "EX",
          300,
        );

        // TODO: Send password reset email to the user with the reset token (e.g., using SendGrid, Mailgun)

        return this.handleSuccess(res, {
          message: "Password reset email sent",
        });
      },
    );
  }

  private async resetPassword() {
    this.router.post(
      "/v1/auth/reset-password",
      async (req: Request, res: Response) => {
        const reqBody = this.validate(req, res, ResetPasswordSchema);
        if (!reqBody) {
          return;
        }

        const { resetToken, newPassword } = reqBody;

        const userId = await this.redisClient.get(
          `forget-password:${resetToken}`,
        );

        if (!userId) {
          return this.handleError(res, {
            statusCode: StatusNotFound,
            message: "Invalid or expired reset token",
          });
        }

        const user = await this.userSubservice.findOne({ _id: userId });

        if (!user) {
          return this.handleError(res, {
            statusCode: StatusNotFound,
            message: "User not found",
          });
        }

        if (!newPassword) {
          return this.handleError(res, {
            statusCode: StatusNotFound,
            message: "New password is required",
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await this.userSubservice.update(
          { _id: userId },
          { password: hashedPassword },
        );

        if (this.isServiceError(res, updatedUser)) {
          return;
        }

        await this.redisClient.del(`forget-password:${resetToken}`);

        return this.handleSuccess(res, {
          message: "Password reset successful",
        });
      },
    );
  }
}

export default AuthController;
