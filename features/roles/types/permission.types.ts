export interface GetPermissionsResponse {
  has_next: boolean;
  limit: number;
  next_cursor: string;
  permissions: Permission[];
  total: number;
}

export interface Permission {
  created_at: string;
  description: string;
  id: string;
  module: string;
  name: string;
  slug: string;
  updated_at: string;
}

export interface PermissionGroup {
  [key: string]: Permission[];
}

export interface GetPermissionsParams {
  cursor?: string;
  limit?: number;
}

export interface CreatePermissionParams {
  name: string;
  description: string;
  module: string;
  slug: string;
}

export interface CreatePermissionResponse {
  permission: Permission;
}
