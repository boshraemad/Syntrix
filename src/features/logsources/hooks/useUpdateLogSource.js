import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLogSource } from '@/services/logsource.services';

export default function useUpdateLogSource() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => updateLogSource(id, payload),
    onSuccess: (data, variables) => {
      // تحديث الكاش لليستة وللفايل المعين ده تلقائياً
      queryClient.invalidateQueries({ queryKey: ['logSources'] });
      queryClient.invalidateQueries({ queryKey: ['logSource', variables.id] });
    },
  });

  // بنعدل الـ wrapper ده عشان يطابق نفس طريقة المناداة القديمة في الـ Modal
  const updateSource = async (id, payload) => {
    return mutation.mutateAsync({ id, payload });
  };

  return {
    updateSource,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}