// import { Request, Response } from "express";
import BaseController from "@base/controller";

class XxxxxController extends BaseController {
  constructor() {
    super();
  }

  // private async getAllXxxxx() {
  //   this.router.get("/v1/xxxxs", async (req: Request, res: Response) => {
  //     const reqParam = this.validateQuery(req, res, UserGetSchema);
  //     if (!reqParam) {
  //       return;
  //     }

  //     const paginator = this.paginate(reqParam.page, reqParam.limit);

  //     const filters = this.xxxxFilter.handleFilter(reqParam);
  //     const [users, count] = await Promise.all([
  //       this.xxxxService.getAllUsers(filters, paginator),
  //       this.xxxxService.count(filters),
  //     ]);
  //     if (this.isServiceError(res, users)) {
  //       return;
  //     }

  //     return this.handleSuccess(
  //       res,
  //       {
  //         message: "Success getting xxxx",
  //         data: users,
  //       },
  //       this.handlePagination(paginator, count),
  //     );
  //   });
  // }

  // private async getById() {
  //   this.router.get("/v1/xxxx/:id", async (req: Request, res: Response) => {
  //     const userId = req.params.id;
  //     const user = await this.xxxxService.getUserById(userId);

  //     if (this.isServiceError(res, user)) {
  //       return;
  //     }

  //     return this.handleSuccess(res, {
  //       message: "Success getting xxxx",
  //       data: user,
  //     });
  //   });
  // }

  // private async create() {
  //   this.router.post("/v1/xxxx", async (req: Request, res: Response) => {
  //     const reqBody = this.validate<xxxxCreateDto>(req, res, UserCreateSchema);
  //     if (!reqBody) {
  //       return;
  //     }

  //     const newXxxx = await this.xxxxService.createXxxx(reqBody);
  //     if (this.isServiceError(res, newXxxx)) {
  //       return;
  //     }

  //     return this.handleSuccess(res, {
  //       statusCode: StatusCreated,
  //       message: "Success creating xxxx",
  //       data: newXxxx,
  //     });
  //   });
  // }
}

export default XxxxxController;
