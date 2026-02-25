import { useLogout } from '@/features/auth/hooks';
import { useUser } from '@/features/auth/stores/useAuthStore';
import { cn } from '@/lib';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { toast } from '@/shared/utils/toast';
import { useNavigate } from '@tanstack/react-router';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui';

/**
 * User Profile Component
 *
 * Hiển thị thông tin user hiện tại với dropdown menu
 * Style: Carbon Kinetic
 */
interface UserProfileProps {
  isCollapsed?: boolean;
}

export function UserProfile({ isCollapsed }: UserProfileProps) {
  const navigate = useNavigate();
  const user = useUser();
  const { logoutMutation } = useLogout();
  const isLoading = logoutMutation.isPending;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('LOGGED_OUT', {
          description: 'You have been logged out',
          duration: 2000,
        });
        navigate({ to: '/login' });
      },
      onError: () => {
        toast.error('LOGGED_OUT_FAILED', {
          description: 'Failed to log out',
          duration: 2000,
        });
      },
    });
  };

  if (!user) {
    return null;
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'group flex w-full items-center border border-white/10 bg-black/50 p-3 transition-all hover:border-white/20 hover:bg-white/5 focus:ring-1 focus:ring-white/50 focus:outline-none',
            isCollapsed ? 'justify-center p-0' : 'gap-3'
          )}
          title={isCollapsed ? user.username : undefined}
        >
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt="@shadcn" />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <>
              {/* User Info */}
              <div className="flex-1 text-left">
                <div className="font-mono text-sm font-bold tracking-wider text-white uppercase">
                  {user.username}
                </div>
                <div className="font-mono text-xs text-zinc-500 uppercase">{user.email}</div>
              </div>

              {/* Chevron */}
              <ChevronDown
                size={14}
                className="text-zinc-500 transition-transform group-hover:text-white group-data-[state=open]:rotate-180"
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="text-sm">ACCOUNT</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            toast.info('PROFILE', {
              description: 'Profile page coming soon',
            });
          }}
          className="text-sm"
        >
          <User size={14} className="mr-2" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            toast.info('SETTINGS', {
              description: 'Settings page coming soon',
            });
          }}
          className="text-sm"
        >
          <Settings size={14} className="mr-2" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-sm text-red-400 focus:bg-red-950/20 focus:text-red-400"
          disabled={isLoading}
        >
          <LogOut size={14} className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
