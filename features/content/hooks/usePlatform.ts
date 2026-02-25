import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { platformService } from '../services/platform-service';

const usePlatforms = () => {
  const platformsQuery = useQuery({
    queryKey: queryKeys.platforms.lists(),
    queryFn: () => platformService.getPlatforms(),
  });
  return platformsQuery;
};

export { usePlatforms };
