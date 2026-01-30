import { useAuthStore, useUser } from '@/features/auth/stores/useAuthStore';
import { UserRole } from '@/shared';
import { UserProfile } from '@/shared/components/user-profile';
import { Link, useRouterState } from '@tanstack/react-router';

function Sidebar() {
  const routerState = useRouterState();

  const currentUser = useUser();
  const setCurrentUser = useAuthStore((state) => state.updateUser);

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', label: 'Tổng Quan' },
    { id: 'content', path: '/content', label: 'Tài Nguyên' },
    { id: 'review', path: '/draft', label: 'Xét duyệt tài nguyên' },
    { id: 'playlists', path: '/playlists', label: 'Danh sách phát' },
    { id: 'report', path: '/report', label: 'Báo Cáo Vi Phạm' },
    { id: 'audit', path: '/audit', label: 'Nhật Ký Hệ Thống' },
  ];

  const roles: UserRole[] = [UserRole.EDITOR, UserRole.REVIEWER, UserRole.ADMIN];

  // Get current path
  const currentPath = routerState.location.pathname;

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col border-r border-white/10 bg-black/80 p-6 backdrop-blur-md sm:flex">
      <div className="mb-16 flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
        <span className="text-xl font-black tracking-tighter text-white">Hii Social CMS.</span>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul className="space-y-6">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`group flex cursor-pointer items-center font-mono text-xs tracking-widest uppercase transition-all duration-300 hover:translate-x-2 hover:text-white ${isActive ? 'text-white' : 'text-zinc-500'}`}
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

      <div className="mt-auto w-full space-y-4 border-t border-white/5 pt-10">
        {/* User Profile */}
        <UserProfile />

        {/* Role Selector (Optional - for demo purposes) */}
        {currentUser && setCurrentUser && (
          <div className="space-y-1">
            <label className="mb-2 block font-mono text-[10px] text-zinc-600 uppercase">
              System Access
            </label>
            <div className="relative">
              <select
                value={currentUser.role}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, role: e.target.value as UserRole })
                }
                className="w-full cursor-pointer appearance-none rounded-none border border-white/10 bg-transparent px-3 py-2 font-mono text-xs text-zinc-400 uppercase transition-colors hover:border-zinc-500 focus:border-white focus:outline-none"
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
        <div className="flex items-end justify-between font-mono">
          <div className="text-[10px] text-zinc-600">STATUS</div>
          <div className="text-[10px] text-white">SYNC // 100%</div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
