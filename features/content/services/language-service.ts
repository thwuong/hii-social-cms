import { apiBasic } from '@/services/apiService';
import queryString from 'query-string';
import { GetLanguagesParams, GetLanguagesResponse } from '../types';

class LanguageService {
  private baseUrl = 'platform/dashboard/languages';

  async getLanguages(params: GetLanguagesParams) {
    const queryParams = queryString.stringify(params);

    const data = await apiBasic.get<GetLanguagesResponse>(`${this.baseUrl}?${queryParams}`);
    return data;
  }
}

export const languageService = new LanguageService();
