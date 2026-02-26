import { Pagination } from '@/lib/types/api';

export interface GetLanguagesResponse {
  languages: Language[];
  pagination: Pagination;
}

export interface Language {
  id: number;
  name: string;
  slug: string;
}

export interface GetLanguagesParams {
  page?: number;
  limit?: number;
  q?: string;
}
