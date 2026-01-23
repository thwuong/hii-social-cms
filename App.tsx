import { RouterProvider } from '@tanstack/react-router';
import React, { useState } from 'react';
import { INITIAL_CONTENT, MOCK_CATEGORIES, MOCK_TAGS } from './constants';
import { createAppRouter, RouterContext } from './routes/root-layout';
import { CMSService } from './services/cmsService';
import { UserRole } from './types';

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

  return <RouterProvider router={router} context={routerContext} />;
};

export default App;
