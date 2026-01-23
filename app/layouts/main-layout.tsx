import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import React from 'react';
import { UserRole } from '@/shared/types';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Get router context
  const routerState = useRouterState();
  const { currentUser, setCurrentUser } = routerState.matches[0]?.context || {};

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', label: 'Tổng Quan' },
    { id: 'content', path: '/content', label: 'Tài Nguyên' },
    { id: 'audit', path: '/audit', label: 'Nhật Ký Hệ Thống' },
  ];

  const roles: UserRole[] = [UserRole.EDITOR, UserRole.REVIEWER, UserRole.ADMIN];

  // Get current path
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex min-h-screen w-full">
      {/* Carbon Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col border-r border-white/10 bg-black/80 backdrop-blur-md p-10 sm:flex">
        <div className="flex items-center gap-3 mb-16">
          <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
          <span className="font-black text-xl tracking-tighter text-white">CARBON.</span>
        </div>

        <nav className="flex-1 flex flex-col">
          <ul className="space-y-6">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`group cursor-pointer flex items-center text-xs font-mono uppercase tracking-widest transition-all duration-300 hover:translate-x-2 hover:text-white ${isActive ? 'text-white' : 'text-zinc-500'}`}
                  >
                    {item.label}
                    {isActive && (
                      <div className="ml-4 h-[1px] flex-grow bg-gradient-to-r from-white to-transparent" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-10 border-t border-white/5 space-y-4">
          {currentUser && setCurrentUser && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-zinc-600 block mb-2">
                Truy Cập Hệ Thống
              </label>
              <div className="relative">
                <select
                  value={currentUser.role}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, role: e.target.value as UserRole })
                  }
                  className="w-full appearance-none bg-transparent border border-white/10 rounded-none py-2 px-3 text-xs font-mono text-zinc-400 focus:outline-none focus:border-white hover:border-zinc-500 transition-colors cursor-pointer uppercase"
                >
                  {roles.map((r) => (
                    <option key={r} value={r} className="bg-black text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-between items-end font-mono">
            <div className="text-[10px] text-zinc-600">TRẠNG THÁI</div>
            <div className="text-[10px] text-white">ĐỒNG BỘ // 100%</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col sm:pl-72 w-full min-h-screen relative z-10">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/10 bg-black/80 backdrop-blur px-4 sm:hidden">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-white" />
            <span className="font-bold text-white tracking-tighter">CARBON.</span>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:p-14">{children || <Outlet />}</main>
      </div>
    </div>
  );
};

export default MainLayout;
