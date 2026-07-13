import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteService } from '@/services/services.services';

export default function useDeleteService(deviceId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      // تحديث الجدول فوراً وإزالة الخدمة المحذوفة بصرياً
      queryClient.invalidateQueries({ queryKey: ['deviceServices', deviceId] });
    },
  });

  return {
    deleteDeviceService: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}