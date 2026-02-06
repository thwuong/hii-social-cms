import { api } from '@/services';
import queryString from 'query-string';
import {
  CreatePermissionParams,
  CreatePermissionResponse,
  GetPermissionsParams,
  GetPermissionsResponse,
} from '../types';

class PermissionService {
  private baseUrl = 'system/permissions';

  async getPermissions(params?: GetPermissionsParams) {
    const queryParams = queryString.stringify(params || {});
    const data = await api.get<GetPermissionsResponse>(`${this.baseUrl}?${queryParams}`);
    return data;
  }

  async createPermission(data: CreatePermissionParams) {
    const response = await api.post<CreatePermissionResponse>(this.baseUrl, data);
    return response;
  }
}

export const permissionService = new PermissionService();
