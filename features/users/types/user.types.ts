export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetUsersResponse {
  pagination: Pagination;
  users: User[];
}

export interface Pagination {
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isDeleted: boolean;
  firstName: string;
  lastName: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
  role_id: string;
  avatar: string;
}

export interface Role {
  created_at: string;
  description: string;
  id: string;
  logo: string;
  name: string;
  slug: string;
}
