import { api } from '@/services/apiService';
import { GetCategoriesResponse } from '../types';

class CategoryService {
  private baseUrl = 'categories';

  async getCategories() {
    const data = await api.get<GetCategoriesResponse>(`${this.baseUrl}/dashboard`);
    return data;
  }
}

export const categoryService = new CategoryService();
