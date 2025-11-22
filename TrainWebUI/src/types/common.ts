export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: string[];
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
