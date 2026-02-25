// Platform Types

import { Pagination } from '@/lib/types/api';

export interface GetPlatformsResponse {
  applications: Application[];
  pagination: Pagination;
}

export interface Application {
  id: number;
  name: string;
  slug: string;
  url: string;
  api_key: string;
  is_get_all_reels: boolean;
  sort_reels: string;
  basic_auth: string;
  date_created: string;
  date_updated: string;
  max_file_size: number;
}
