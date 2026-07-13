import { useQuery } from '@tanstack/react-query';
import { getServicesByUser } from '@/services/services.services';

export default function useGetServicesByUser(userId, customParams = {}) {
  const params = { page: 1, limit: 10, ...customParams };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userServices', userId, params],
    queryFn: () => getServicesByUser(userId, params),
    enabled: !!userId && userId !== 'undefined' && userId !== 'null',
    placeholderData: (previousData) => previousData,
  });

  return {
    services: data?.data || (Array.isArray(data) ? data : []),
    meta: data?.meta || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}