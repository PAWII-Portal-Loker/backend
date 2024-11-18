import { Pagination } from "@types";

class BasePagination {
  public paginate(
    page: number | undefined,
    limit: number | undefined,
  ): Pagination {
    return {
      page: page ?? 1,
      limit: limit ?? 10,
    };
  }

  public handlePagination(
    paginator: Pagination,
    count: number | null,
  ): Pagination {
    return {
      page: paginator.page,
      limit: paginator.limit,
      totalItems: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / paginator.limit),
    };
  }
}

export default BasePagination;
