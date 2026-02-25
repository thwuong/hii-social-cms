import { Outlet } from '@tanstack/react-router';
import React from 'react';

import { cn } from '@/lib';
import { useSidebarStore } from '@/shared/stores/use-sidebar-store';
import Sidebar from './sidebar';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex h-dvh w-full">
      <Sidebar />

      {/* Main Content */}
      <div
        className={cn(
          'relative z-10 flex h-dvh w-full flex-1 flex-col transition-all duration-300',
          isCollapsed ? 'sm:pl-20' : 'sm:pl-72'
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/10 bg-black/80 px-4 backdrop-blur sm:hidden">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-white" />
            <span className="font-bold tracking-tighter text-white">Hii Social CMS.</span>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 bg-black/80">{children || <Outlet />}</main>
      </div>
    </div>
  );
};

export default MainLayout;
