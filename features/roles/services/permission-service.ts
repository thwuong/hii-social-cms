import { api } from '@/services';
import queryString from 'query-string';
import { GetPermissionsParams, GetPermissionsResponse } from '../types';

class PermissionService {
  private baseUrl = 'system/permissions';

  async getPermissions(params?: GetPermissionsParams) {
    const queryParams = queryString.stringify(params || {});
    const data = await api.get<GetPermissionsResponse>(`${this.baseUrl}?${queryParams}`);
    return data;
  }
}

export const permissionService = new PermissionService();
