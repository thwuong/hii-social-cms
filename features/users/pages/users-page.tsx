import { UserRolesCard } from '@/features/roles/components/user-roles-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Typography } from '@/shared/ui';
import { Search, Users as UsersIcon } from 'lucide-react';
import { useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { UserTable } from '../components/user-table';
import { useUsers } from '../hooks';
import { User } from '../types';

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    data: users,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsers({
    search,
    limit: 20,
  });

  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });

  return (
    <div className="flex h-full flex-col space-y-8 p-4 sm:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Typography variant="h2" className="font-mono tracking-tighter text-white uppercase">
          QUẢN LÝ NGƯỜI DÙNG
        </Typography>

        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="TÌM KIẾM NGƯỜI DÙNG..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-white/10 bg-white/5 pl-10 font-mono text-xs text-white uppercase focus:ring-1 focus:ring-white/50"
            type="search"
            autoComplete="off"
            aria-label="Tìm kiếm người dùng"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`loading-${i + 1}`}
              className="h-16 w-full animate-pulse rounded-none bg-white/5"
            />
          ))}
        </div>
      )}
      {!isLoading && users && users.length > 0 && (
        <div className="flex flex-col space-y-4">
          <UserTable
            users={users}
            onManageRoles={(user) => setSelectedUser(user)}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            loadMoreRef={loadMoreRef}
          />
        </div>
      )}

      {!isLoading && users && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <UsersIcon size={48} className="mb-4 text-zinc-700" />
          <Typography variant="h3" className="mb-2 font-mono text-zinc-500 uppercase">
            Không tìm thấy người dùng
          </Typography>
        </div>
      )}

      {/* Roles Modal */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-2xl! border-white/10 bg-black p-0 sm:rounded-none">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-mono text-xl tracking-tighter text-white uppercase">
              QUẢN LÝ VAI TRÒ: {`${selectedUser?.firstName} ${selectedUser?.lastName}`}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">{selectedUser && <UserRolesCard userId={selectedUser.id} />}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
