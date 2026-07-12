import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLogSource } from '@/services/logsource.services';
import { showErrorToast } from '@/utils/toast'; // <-- استيراد دالة التوست الخاصة بالإيرور هنا

export default function useUpdateLogSource() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => updateLogSource(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['logSources'] });
      queryClient.invalidateQueries({ queryKey: ['logSource', variables.id] });
    },
    onError: (err) => {
      // إظهار رسالة الخطأ القادمة من السيرفر أو الرسالة التلقائية
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update log source';
      showErrorToast(errMsg);
    },
  });

  const updateSource = async (id, payload) => {
    return mutation.mutateAsync({ id, payload });
  };

  return {
    updateSource,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}