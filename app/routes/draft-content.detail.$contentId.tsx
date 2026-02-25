import { DraftContentDetailPageComponent, draftContentSearchSchema } from '@/features/content';
import { createRoute } from '@tanstack/react-router';
import { ContentProvider } from '@/features/content/components';
import { mainLayoutRoute } from './_main';

export const draftContentDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/draft/detail/$contentId',
  component: () => (
    <ContentProvider>
      <DraftContentDetailPageComponent />
    </ContentProvider>
  ),
  validateSearch: draftContentSearchSchema,
});
