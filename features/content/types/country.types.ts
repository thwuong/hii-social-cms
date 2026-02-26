import { Pagination } from '@/lib/types/api';

export interface GetCountriesResponse {
  countries: Country[];
  pagination: Pagination;
}

export interface Country {
  id: number;
  name: string;
  code: string;
}

export interface GetCountriesParams {
  page?: number;
  limit?: number;
  q?: string;
}
