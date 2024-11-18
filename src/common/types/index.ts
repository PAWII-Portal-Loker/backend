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
