import { Pagination } from '@/lib/types/api';

// Categories Types
export interface GetCategoriesResponse {
  categories: Category[];
  pagination: Pagination;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}
