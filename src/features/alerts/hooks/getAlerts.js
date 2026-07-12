import { useQuery } from '@tanstack/react-query';
import { fetchAlertsService } from '@/services/alerts.services';

// Hook لجلب قائمة الـ Alerts
export function useGetAlerts({ severity, status, search }) {
  return useQuery({
    queryKey: ['alerts', { severity, status, search }],
    queryFn: () => fetchAlertsService({ severity, status, search }),
    placeholderData: (previousData) => previousData, // تجربة تصفح سلسة أثناء الكتابة
  });
}