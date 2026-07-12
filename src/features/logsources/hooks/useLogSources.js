import { useQuery } from '@tanstack/react-query';
import { getLogSources } from '@/services/logsource.services';

export default function useLogSources(params = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['logSources', params],
    queryFn: () => getLogSources(params),
    placeholderData: (previousData) => previousData, // بيمنع الـ flickering أثناء الـ pagination
  });

  return {
    data: data?.data || [],
    meta: data?.meta || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}