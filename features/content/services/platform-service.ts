import { api } from '@/services';
import { GetPlatformsResponse } from '../types';

class PlatformService {
  private baseUrl = 'platform/dashboard/applications';

  async getPlatforms() {
    const data = await api.get<GetPlatformsResponse>(this.baseUrl);
    return data;
  }
}

export const platformService = new PlatformService();
