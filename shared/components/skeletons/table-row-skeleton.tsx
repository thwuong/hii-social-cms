import { Skeleton } from './skeleton';

/**
 * Table Row Skeleton
 * Used in ContentTable loading state
 */
export function TableRowSkeleton() {
  return (
    <tr className="border-b border-white/10 hover:bg-white/5">
      {/* Content */}
      <td className="p-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </td>

      {/* Platform */}
      <td className="p-3">
        <Skeleton className="h-5 w-24" />
      </td>

      {/* Status */}
      <td className="p-3">
        <Skeleton className="h-5 w-16" />
      </td>

      {/* Date */}
      <td className="p-3">
        <Skeleton className="h-3 w-24" />
      </td>

      {/* Actions */}
      <td className="p-3">
        <Skeleton className="h-8 w-20" />
      </td>
    </tr>
  );
}
