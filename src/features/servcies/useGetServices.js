import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/services/services.services';

export default function useGetServices(deviceId, customParams = {}) {
  // دمج الـ deviceId تلقائياً مع الـ pagination الافتراضي من الـ Swagger
  const params = {
    deviceId,
    page: 1,
    limit: 10,
    ...customParams
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['deviceServices', deviceId, params],
    queryFn: () => getServices(params),
    // حماية: لن يتم إرسال الطلب إلا إذا كان الـ deviceId متاحاً وقيمته صالحة
    enabled: !!deviceId && deviceId !== 'undefined' && deviceId !== 'null',
    placeholderData: (previousData) => previousData,
  });

  return {
    // الـ Swagger موضح إن الـ response عبارة عن "Paginated services" 
    // فغالباً الداتا هترجع جوة array اسمه data أو الاستجابة نفسها
    services: data?.data || (Array.isArray(data) ? data : []),
    meta: data?.meta || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}
