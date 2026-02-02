import { Outlet } from '@tanstack/react-router';
import React from 'react';
import Sidebar from './sidebar';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen w-full flex-col sm:pl-72">
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
