import { useQuery } from '@tanstack/react-query';
import { fetchAlertByIdService } from '@/services/alerts.services';

// Hook لجلب تفاصيل الـ Alert بموجب الـ ID
export function useGetAlertById(alertId) {
    return useQuery({
      queryKey: ['alert', alertId],
      queryFn: () => fetchAlertByIdService(alertId),
      enabled: !!alertId, // التأكد من وجود ID قبل إرسال الطلب
    });
  }