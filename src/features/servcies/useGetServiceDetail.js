import { useQuery } from '@tanstack/react-query';
import { getServiceById } from '@/services/services.services';

export default function useGetServiceDetail(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['serviceDetail', id],
    queryFn: () => getServiceById(id),
    enabled: !!id && id !== 'undefined' && id !== 'null',
  });

  return {
    service: data?.data || data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}