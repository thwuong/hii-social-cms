import { useAuthStore, useUser } from '@/features/auth/stores/useAuthStore';
import { cn } from '@/lib';
import { Button, UserRole } from '@/shared';
import { UserProfile } from '@/shared/components/user-profile';
import { useSidebarStore } from '@/shared/stores/use-sidebar-store';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  FileText,
  Flag,
  History,
  ListPlus,
  PanelLeft,
  PieChart,
  Shield,
  SquarePen,
  Users,
} from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
  dashboard: <PieChart size={20} />,
  content: <FileText size={20} />,
  draft: <SquarePen size={20} />,
  playlists: <ListPlus size={20} />,
  report: <Flag size={20} />,
  audit: <History size={20} />,
  roles: <Shield size={20} />,
  users: <Users size={20} />,
};

function Sidebar() {
  const routerState = useRouterState();
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  const currentUser = useUser();
  const setCurrentUser = useAuthStore((state) => state.updateUser);

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', label: 'Tổng Quan' },
    { id: 'content', path: '/content', label: 'Tài Nguyên' },
    { id: 'draft', path: '/draft', label: 'Kiểm Duyệt' },
    { id: 'playlists', path: '/playlists', label: 'Danh sách phát' },
    { id: 'report', path: '/report', label: 'Báo Cáo Vi Phạm' },
    { id: 'audit', path: '/audit', label: 'Nhật Ký Hệ Thống' },
    { id: 'roles', path: '/roles', label: 'Quản Lý Vai Trò' },
    { id: 'users', path: '/users', label: 'Người Dùng' },
  ];

  const roles: UserRole[] = [UserRole.REVIEWER, UserRole.ADMIN];

  // Get current path
  const currentPath = routerState.location.pathname;

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-white/10 bg-black/80 p-6 backdrop-blur-md transition-all duration-300 sm:flex',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      <div className="flex items-start justify-between">
        {!isCollapsed && (
          <div className="mb-16 flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
            <Link to="/dashboard">
              <span className="text-xl font-black tracking-tighter text-white">
                Hii Social CMS.
              </span>
            </Link>
          </div>
        )}

        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className={cn(isCollapsed && 'mb-16')}
        >
          <PanelLeft size={18} />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul className="space-y-6">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={cn(
                    'group flex cursor-pointer items-center gap-2.5 font-mono tracking-widest uppercase transition-all duration-300 hover:text-white',
                    isActive ? 'text-white' : 'text-zinc-500',
                    isCollapsed ? 'justify-center' : 'hover:translate-x-2'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="shrink-0">{ICONS[item.id]}</div>
                  {!isCollapsed && (
                    <span className="overflow-hidden text-sm whitespace-nowrap">{item.label}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-4 h-[1px] flex-grow bg-gradient-to-r from-white to-transparent" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={cn(
          'mt-auto w-full space-y-4 border-t border-white/5',
          isCollapsed ? 'flex flex-col items-center' : ''
        )}
      >
        {/* User Profile */}
        <UserProfile isCollapsed={isCollapsed} />

        {/* Role Selector (Optional - for demo purposes) */}
        {currentUser && setCurrentUser && !isCollapsed && (
          <div className="space-y-1">
            <label className="mb-2 block font-mono text-xs text-zinc-600 uppercase">
              System Access
            </label>
            <div className="relative">
              <select
                value={currentUser.role}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, role: e.target.value as UserRole })
                }
                className="w-full cursor-pointer appearance-none rounded-none border border-white/10 bg-transparent px-3 py-2 font-mono text-sm text-zinc-400 uppercase transition-colors hover:border-zinc-500 focus:border-white focus:outline-none"
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

        {/* Status */}
        {!isCollapsed && (
          <div className="flex items-end justify-between font-mono">
            <div className="text-xs text-zinc-600">STATUS</div>
            <div className="text-xs text-white">SYNC // 100%</div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
