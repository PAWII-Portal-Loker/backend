import { Request, Response } from "express";
import {
  UserCreateDto,
  UserCreateSchema,
} from "@user/dtos/user/userCreate.dto";
import UserService from "@user/services/user.service";
import BaseController from "@base/controller";
import { StatusCreated } from "@utils/statusCodes";

class UserController extends BaseController {
  private userService = new UserService();

  constructor() {
    super();
    this.getAllUsers();
    this.getUserById();
    this.createUser();
  }

  // TODO: implement param filter and pagination builder
  // TODO: implement middleware
  private async getAllUsers() {
    this.router.get("/v1/users", async (_: Request, res: Response) => {
      const users = await this.userService.getAllUsers();
      if (this.isServiceError(users)) {
        return this.handleError(res, users);
      }

      return this.handleSuccess(res, {
        message: "Success getting users",
        data: users,
      });
    });
  }

  private async getUserById() {
    this.router.get("/v1/users/:id", async (req: Request, res: Response) => {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);

      if (this.isServiceError(user)) {
        return this.handleError(res, user);
      }

      return this.handleSuccess(res, {
        message: "Success getting user",
        data: user,
      });
    });
  }

  private async createUser() {
    this.router.post("/v1/users", async (req: Request, res: Response) => {
      const reqBody = this.validate<UserCreateDto>(req, res, UserCreateSchema);
      if (!reqBody) {
        return;
      }

      const newUser = await this.userService.createUser(reqBody);
      if (this.isServiceError(newUser)) {
        return this.handleError(res, newUser);
      }

      return this.handleSuccess(res, {
        statusCode: StatusCreated,
        message: "Success creating user",
        data: newUser,
      });
    });
  }
}

export default UserController;
