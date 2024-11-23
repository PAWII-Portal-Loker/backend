// import BaseService from "@base/service";
// import { Pagination, ServiceError } from "@types";
// import {
//   StatusBadRequest,
//   StatusConflict,
//   StatusNotFound,
// } from "@utils/statusCodes";
// import { FilterQuery, isValidObjectId } from "mongoose";

// class XxxxxService extends BaseService<XxxxDto> {
//   constructor() {
//     super(XxxxModel);
//   }

//   public async getAll(
//     filters: FilterQuery<unknown>,
//     paginator?: Pagination,
//   ): Promise<XxxxDto[] | ServiceError> {
//     const xxxxx = await this.find(filters, paginator);
//     if (!xxxxx) {
//       return this.throwError("Error getting xxxxx", StatusBadRequest);
//     }

//     return xxxxx;
//   }

//   public async getById(id: string): Promise<XxxxDto | ServiceError> {
//     if (!isValidObjectId(id)) {
//       return this.throwError("Invalid xxxxx ID", StatusBadRequest);
//     }

//     const xxxxx = await this.findOne({ _id: id });
//     if (!xxxxx) {
//       return this.throwError("xxxxx not found", StatusNotFound);
//     }

//     return xxxxx;
//   }

//   public async create(data: Partial<XxxxDto>): Promise<XxxxDto | ServiceError> {
//     const xxxxx = await this.findOne({ email: data.email });
//     if (xxxxx) {
//       return this.throwError("xxxxx already exists", StatusConflict);
//     }

//     const newxxxxx = await this.create(data);
//     if (!newxxxxx) {
//       return this.throwError("Error creating xxxxx", StatusBadRequest);
//     }

//     return newxxxxx;
//   }
// }

// export default XxxxxService;
