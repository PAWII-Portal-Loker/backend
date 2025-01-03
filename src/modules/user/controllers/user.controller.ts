import { Request, Response } from "express";
import { UserCreateDto, UserCreateSchema } from "@user/dtos/userCreate.dto";
import UserService from "@user/services/user.service";
import BaseController from "@base/controller";
import { StatusCreated } from "@consts/statusCodes";
import UserFilter from "@user/services/user.filterService";
import { UserGetSchema } from "@user/dtos/userReq.dto";
import { SignInDto } from "@auth/dtos/signIn.dto";
import AuthService from "@auth/services/auth.service";

class UserController extends BaseController {
  private userService = new UserService();
  private userFilter = new UserFilter();
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService(this.redisClient);
    this.getAllUsers();
    this.getUserById();
    this.createUser();
  }

  private async getAllUsers() {
    this.router.get(
      "/v1/users",
      this.mustAuthorized,
      async (req: Request, res: Response) => {
        const reqParam = this.validateQuery(req, res, UserGetSchema);
        if (!reqParam) {
          return;
        }

        const paginator = this.paginate(reqParam.page, reqParam.limit);
        const filters = this.userFilter.handleFilter(reqParam);

        const [users, count] = await Promise.all([
          this.userService.getAllUsers(filters, paginator),
          this.userService.count(filters),
        ]);
        if (this.isServiceError(res, users)) {
          return;
        }

        return this.handleSuccess(
          res,
          {
            message: "Success getting users",
            data: users,
          },
          this.handlePagination(paginator, count),
        );
      },
    );
  }

  private async getUserById() {
    this.router.get(
      "/v1/users/:id",
      this.mustAuthorized,
      async (req: Request, res: Response) => {
        const userId = req.params.id;
        const user = await this.userService.getUserById(userId);
        if (this.isServiceError(res, user)) {
          return;
        }

        return this.handleSuccess(res, {
          message: "Success getting user",
          data: user,
        });
      },
    );
  }

  private async createUser() {
    this.router.post("/v1/users", async (req: Request, res: Response) => {
      const reqBody = this.validate<UserCreateDto>(req, res, UserCreateSchema);
      if (!reqBody) {
        return;
      }

      const newUserId = await this.userService.createUser(reqBody);
      if (this.isServiceError(res, newUserId)) {
        return;
      }

      const newUser = await this.userService.getUserById(newUserId);
      if (this.isServiceError(res, newUser)) {
        return;
      }

      const signData: Partial<SignInDto> = {
        userId: newUserId as string,
        deviceId: res.locals.deviceId,
      };

      const signIn = await this.authService.signIn(signData);
      if (this.isServiceError(res, signIn)) {
        return;
      }

      res.setHeader("x-access-token", signIn.accessToken);
      res.setHeader("x-refresh-token", signIn.refreshToken);
      res.setHeader("x-user-id", newUserId);

      return this.handleSuccess(res, {
        statusCode: StatusCreated,
        message: "Success creating user",
        data: newUser,
      });
    });
  }
}

export default UserController;
