import { DraftContentPageComponent } from '@/features/content/pages';
import { createRoute } from '@tanstack/react-router';
import { draftContentSearchSchema } from '@/features/content/schemas';
import { mainLayoutRoute } from './_main';

export const draftContentRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/draft',
  component: DraftContentPageComponent,
  validateSearch: draftContentSearchSchema,
});
