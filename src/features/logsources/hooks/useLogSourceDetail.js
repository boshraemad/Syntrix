import { useQuery } from '@tanstack/react-query';
import { getLogSourceById } from '@/services/logsource.services';

export default function useLogSourceDetail(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['logSource', id],
    queryFn: () => getLogSourceById(id),
    // الحماية: لن يتم إرسال الطلب نهائياً إذا كان الـ id غير موجود أو قيمته عبارة عن "undefined" كـ string
    enabled: !!id && id !== 'undefined' && id !== 'null',
  });

  return {
    source: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}