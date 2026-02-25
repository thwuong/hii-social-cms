import { createRoute } from '@tanstack/react-router';
import ContentPageComponent from '@/features/content/pages/content-page';
import { ContentProvider, contentSearchSchema } from '@/features/content';
import { mainLayoutRoute } from './_main';

export const contentRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/content',
  component: () => (
    <ContentProvider>
      <ContentPageComponent />
    </ContentProvider>
  ),
  validateSearch: contentSearchSchema,
});
