import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { categoryService } from '../services/category-service';

const useCategories = () => {
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: () => categoryService.getCategories(),
  });
  return categoriesQuery;
};

export { useCategories };
