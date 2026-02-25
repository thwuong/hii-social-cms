// Role entity from API
export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

// API Response for list roles with cursor-based pagination
export interface GetRolesResponse {
  has_next: boolean;
  limit: number;
  next_cursor: string;
  roles: Role[];
}

// API Request for creating a role
export interface CreateRolePayload {
  name: string;
  slug: string;
  description: string;
  permissions: string[];
}

// API Request for updating a role
export interface UpdateRolePayload {
  name: string;
  slug: string;
  description: string;
  permissions: string[];
}

// Query params for getting roles
export interface GetRolesParams {
  cursor?: string;
  limit?: number;
}

// User role assignment
export interface UserRole {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: string[];
}

// API Request for assigning roles to user
export interface AssignRolesToUserPayload {
  role_id: string;
}

// API Response for getting user roles
export interface GetUserRolesResponse {
  data: UserRole[];
}
