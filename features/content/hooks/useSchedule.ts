import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../services/content-service';
import { queryKeys } from '../query-keys';

interface ScheduleContentPayload {
  reel_id: string;
  scheduled_at: string;
}

/**
 * Hook để schedule content publish
 */
export const useScheduleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reel_id,
      scheduled_at,
    }: ScheduleContentPayload & { approving_status: string }) =>
      contentService.scheduleContent({ reel_id, scheduled_at }),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.content.details, variables.reel_id, variables.approving_status],
      });
    },
  });
};
