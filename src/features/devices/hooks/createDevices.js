import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDevice } from '@/services/devices.services';

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newDevice) => createDevice(newDevice),
    
    // 💡 أهم حتة: لما الـ Device يتضاف بنجاح، بنخلي الـ cache بتاع الـ devices القديم يعيد الفيتش تلقائياً
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
    onError: (error) => {
      console.error("Error creating device:", error);
    }
  });
};