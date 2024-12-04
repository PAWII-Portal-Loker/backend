import { FilterQuery } from "mongoose";

export type Response<T = unknown> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  pagination?: Pagination;
};

export type ErrorResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  errors: string[];
};

export type Pagination = {
  page: number;
  limit: number;
  totalItems?: number;
  totalPages?: number;
};

export type StatusCodes = number;

export type ServiceError = {
  error: boolean;
  message: string;
  statusCode: StatusCodes;
};

export type ValidationError = {
  errors: {
    field: string;
    message: string;
  }[];
};

export type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type OrderBy = "asc" | "desc";

export type Sorter = {
  sort: string;
  order: OrderBy;
};

export type DataFilter<T = unknown> = {
  query: FilterQuery<T>;
  sorter?: Sorter | null;
};

export type RequiredHeaders = {
  userId: string;
  deviceId: string;
  accessToken: string;
  refreshToken: string;
};

export type PaginatorDto = {
  page?: number;
  limit?: number;
};

export type SorterDto = {
  sort?: string;
  order?: string;
};

export type BaseFile = {
  name: string;
  size: number;
  type: string;
  extension: string;
  content: Buffer;
};

export type UploadedFile = {
  path: string;
};
