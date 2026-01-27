/**
 * Global Response Handler
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
}

interface PaginationRequest {
  limit?: number;
  page?: number;
  page_size?: number;
  sort_order?: 'asc' | 'desc';
  sort_by?: 'created_at' | 'updated_at';
  search?: string;
  is_previewed?: boolean;
}

interface Pagination {
  total: number;
  page: number;
  page_size: number;
  total_page: number;
}

export type { ApiResponse, PaginationRequest, Pagination };
