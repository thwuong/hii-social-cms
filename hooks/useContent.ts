/**
 * React Query Hook Example - Content Management
 *
 * Custom hooks sử dụng React Query để fetch và manage data
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/apiService';
import { queryKeys } from '../lib/query-client';
import { ContentItem, ContentStatus } from '../types';

/**
 * Fetch content list
 */
export const useContentList = (filters?: {
  status?: ContentStatus;
  category?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.content.list(filters || {}),
    queryFn: async () => {
      // Mock API call - replace với real API
      // return api.get<ContentItem[]>('content', { searchParams: filters });

      // For now, return mock data
      return [] as ContentItem[];
    },
    enabled: true, // Chỉ fetch khi enabled = true
  });
};

/**
 * Fetch single content
 */
export const useContent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.content.detail(id),
    queryFn: async () => {
      // return api.get<ContentItem>(`content/${id}`);
      return {} as ContentItem;
    },
    enabled: !!id, // Chỉ fetch khi có id
  });
};

/**
 * Create content mutation
 */
export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ContentItem>) => {
      // return api.post<ContentItem>('content', data);
      return {} as ContentItem;
    },
    onSuccess: () => {
      // Invalidate và refetch content list
      queryClient.invalidateQueries({ queryKey: queryKeys.content.lists() });
    },
    onError: (error) => {
      console.error('Create content error:', error);
    },
  });
};

/**
 * Update content mutation
 */
export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContentItem> }) => {
      // return api.put<ContentItem>(`content/${id}`, data);
      return {} as ContentItem;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific content và list
      queryClient.invalidateQueries({ queryKey: queryKeys.content.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.lists() });
    },
  });
};

/**
 * Delete content mutation
 */
export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // return api.delete(`content/${id}`);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.lists() });
    },
  });
};

/**
 * Update content status mutation
 */
export const useUpdateContentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContentStatus }) => {
      // return api.patch<ContentItem>(`content/${id}/status`, { status });
      return {} as ContentItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.lists() });
    },
  });
};

/**
 * Example usage in component:
 *
 * function ContentList() {
 *   const { data, isLoading, error } = useContentList({ status: ContentStatus.PUBLISHED });
 *   const createMutation = useCreateContent();
 *   const updateMutation = useUpdateContent();
 *
 *   const handleCreate = async () => {
 *     try {
 *       await createMutation.mutateAsync({ title: 'New Content' });
 *       // Success notification
 *     } catch (error) {
 *       // Error handling
 *     }
 *   };
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <div>{data?.map(item => <div key={item.id}>{item.title}</div>)}</div>;
 * }
 */
