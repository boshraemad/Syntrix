import { useQuery } from '@tanstack/react-query';
import { getServicesByDevice } from '@/services/services.services';

export default function useGetServicesByDevice(deviceId, customParams = {}) {
  const params = { page: 1, limit: 10, ...customParams };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['deviceServicesDirect', deviceId, params],
    queryFn: () => getServicesByDevice(deviceId, params),
    enabled: !!deviceId && deviceId !== 'undefined' && deviceId !== 'null',
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