import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchService } from '@/services/services.services';

export default function useUpdateService(deviceId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => patchService(id, payload),
    onSuccess: () => {
      // تحديث كاش لستة الخدمات المرتبطة بالجهاز ده
      queryClient.invalidateQueries({ queryKey: ['deviceServices', deviceId] });
    },
  });

  return {
    updateDeviceService: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}