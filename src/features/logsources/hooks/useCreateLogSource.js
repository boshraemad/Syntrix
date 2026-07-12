import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLogSource } from '@/services/logsource.services';

export default function useCreateLogSource() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createLogSource,
    onSuccess: () => {
      // عمل invalidate للـ list عشان تعيد جلب الداتا فوراً بعد الإضافة
      queryClient.invalidateQueries({ queryKey: ['logSources'] });
    },
  });

  return {
    createSource: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}