import { api } from '@/services';
import { RegisterFormData } from '../schemas/auth.schema';
import { LoginResponse } from '../types';

class AuthService {
  private baseUrl = 'users';

  async login(username: string, password: string) {
    const response = await api.post<LoginResponse>(`${this.baseUrl}/login`, { username, password });
    return response;
  }

  async logout() {
    const response = await api.post(`${this.baseUrl}/logout`);
    return response;
  }

  async refreshToken(refreshToken: string) {
    const response = await api.post(`${this.baseUrl}/tokens/refresh`, { refreshToken });
    return response;
  }

  async getCurrentUser() {
    const response = await api.get(`${this.baseUrl}/me/profile`);
    return response;
  }

  async register(payload: Omit<RegisterFormData, 'confirmPassword'>) {
    const response = await api.post<LoginResponse>(`${this.baseUrl}/register`, payload);
    return response;
  }
}

export const authService = new AuthService();
