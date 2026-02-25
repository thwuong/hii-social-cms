import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { contentService } from '../services/content-service';
import { Reel, ScheduleContentBatchPayload } from '../types';
import { transformReelContent } from '../utils';

/**
 * Hook để schedule content publish
 */
export const useScheduleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schedules }: ScheduleContentBatchPayload & { approving_status: string }) =>
      contentService.scheduleContent({ schedules }),
    onMutate: async (variables) => {
      const updates = variables.schedules.map(async (reel) => {
        const detailQueryKey = queryClient.getQueryCache().find({
          queryKey: queryKeys.content.details(reel.reel_id, variables.approving_status),
        })?.queryKey;

        if (!detailQueryKey) return null;

        await queryClient.cancelQueries({ queryKey: detailQueryKey });
        const previousData = queryClient.getQueryData(detailQueryKey);

        queryClient.setQueriesData({ queryKey: detailQueryKey }, (old: Reel | undefined) => {
          if (!old) return old;
          const updated = { ...old, is_pending: true };
          return transformReelContent(updated);
        });

        return { queryKey: detailQueryKey, previousData };
      });

      const previousDataArray = await Promise.all(updates);

      return { previousDataArray: previousDataArray.filter(Boolean) };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
      variables.schedules.forEach((reel) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.content.details(reel.reel_id, variables.approving_status),
        });
      });
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataArray) {
        context.previousDataArray.forEach((item) => {
          if (item?.queryKey && item?.previousData) {
            queryClient.setQueryData(item.queryKey, item.previousData);
          }
        });
      }
    },
  });
};
