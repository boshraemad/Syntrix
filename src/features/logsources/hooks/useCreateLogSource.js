import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLogSource } from '@/services/logsource.services';
import { showErrorToast } from '@/utils/toast'; // <-- استيراد دالة التوست الخاصة بالإيرور هنا

export default function useCreateLogSource() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createLogSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logSources'] });
    },
    onError: (err) => {
      // إظهار رسالة الخطأ القادمة من السيرفر أو الرسالة التلقائية
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to create log source';
      showErrorToast(errMsg);
    },
  });

  return {
    createSource: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}