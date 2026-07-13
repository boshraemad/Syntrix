import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createService } from '@/services/services.services';

export default function useCreateService(deviceId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      // تحديث كاش الـ services الخاص بالجهاز ده فوراً لإظهار الخدمة الجديدة في الجدول
      queryClient.invalidateQueries({ queryKey: ['deviceServices', deviceId] });
    },
  });

  return {
    createDeviceService: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}