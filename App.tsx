import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import React, { useState } from 'react';
import { INITIAL_CONTENT, MOCK_CATEGORIES, MOCK_TAGS } from '@/shared';
import { queryClient } from '@/lib/query-client';
import { createAppRouter, RouterContext } from '@/app/routes/root-layout';
import { CMSService } from '@/services/cmsService';
import { UserRole } from '@/shared/types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState({
    name: 'Admin Moderator',
    role: UserRole.ADMIN,
  });

  const [service] = useState(() => new CMSService(INITIAL_CONTENT, MOCK_CATEGORIES, MOCK_TAGS));

  const [contentList, setContentList] = useState(service.getContent());
  const [categories, setCategories] = useState(service.getCategories());
  const [tags, setTags] = useState(service.getTags());

  const refreshData = () => {
    setContentList(service.getContent());
    setCategories(service.getCategories());
    setTags(service.getTags());
  };

  // Create router context
  const routerContext: RouterContext = {
    items: contentList,
    categories,
    tags,
    service,
    currentUser,
    setCurrentUser,
    refreshData,
  };

  // Create router instance with context
  const router = createAppRouter(routerContext);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={routerContext} />
      {/* React Query Devtools - only in development */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
};

export default App;
