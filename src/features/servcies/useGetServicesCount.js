import { useQuery } from '@tanstack/react-query';
import { getServicesCount } from '@/services/services.services';

export default function useGetServicesCount() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['servicesCount'],
    queryFn: getServicesCount,
    staleTime: 1000 * 30, // البيانات تعتبر فريش لمدة 30 ثانية
  });

  return {
    count: data?.count || data || 0,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}