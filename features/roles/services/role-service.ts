import { api } from '@/services';
import queryString from 'query-string';
import {
  AssignRolesToUserPayload,
  CreateRolePayload,
  GetRolesParams,
  GetRolesResponse,
  GetUserRolesResponse,
  Role,
  UpdateRolePayload,
} from '../types';

class RoleService {
  private baseUrl = 'system/roles';

  /**
   * Get list of roles with cursor-based pagination
   */
  async getRoles(params?: GetRolesParams) {
    const searchParams = queryString.stringify(params || {});
    const data = await api.get<GetRolesResponse>(
      `${this.baseUrl}${searchParams ? `?${searchParams}` : ''}`
    );
    return data;
  }

  /**
   * Create a new role
   */
  async createRole(payload: CreateRolePayload) {
    const data = await api.post<Role>(`${this.baseUrl}`, payload);
    return data;
  }

  /**
   * Update an existing role
   */
  async updateRole(id: string, payload: UpdateRolePayload) {
    const data = await api.put<Role>(`${this.baseUrl}/${id}`, payload);
    return data;
  }

  /**
   * Delete a role
   */
  async deleteRole(id: string) {
    const data = await api.delete(`${this.baseUrl}/${id}`);
    return data;
  }

  /**
   * Get all roles assigned to a specific user
   */
  async getUserRoles(userId: string) {
    const data = await api.get<GetUserRolesResponse>(`system/users/${userId}/roles`);
    return data;
  }

  /**
   * Assign one or more roles to a user
   */
  async assignRolesToUser(userId: string, payload: AssignRolesToUserPayload) {
    const data = await api.post(`system/users/${userId}/roles`, payload);
    return data;
  }

  /**
   * Revoke a specific role from a user
   */
  async revokeRoleFromUser(userId: string, roleId: string) {
    const data = await api.delete(`system/users/${userId}/roles/${roleId}`);
    return data;
  }
}

export const roleService = new RoleService();
