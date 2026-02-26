import { apiBasic } from '@/services/apiService';
import queryString from 'query-string';
import { GetCountriesParams, GetCountriesResponse } from '../types';

class CountryService {
  private baseUrl = 'platform/dashboard/countries';

  async getCountries(params: GetCountriesParams) {
    const queryParams = queryString.stringify(params);

    const data = await apiBasic.get<GetCountriesResponse>(`${this.baseUrl}?${queryParams}`);
    return data;
  }
}

export const countryService = new CountryService();
