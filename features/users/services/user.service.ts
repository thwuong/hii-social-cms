import { api } from '@/services';
import queryString from 'query-string';
import { GetUsersParams, GetUsersResponse, User } from '../types';

/**
 * User Service
 * Handles all user-related API calls
 */
class UserService {
  private baseUrl = 'users';

  /**
   * Get users list with pagination
   */
  async getUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
    const searchParams = params ? queryString.stringify(params) : '';
    const response = await api.get<GetUsersResponse>(`${this.baseUrl}/dashboard`, {
      searchParams,
    });
    return response;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`${this.baseUrl}/${id}`);
    return response;
  }
}

export const userService = new UserService();
