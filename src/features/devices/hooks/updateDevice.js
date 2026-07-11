import { useMutation, useQueryClient } from '@tanstack/react-query';
// 🌟 تصحيح الـ Import هنا بإزالة الأقواس لتجنب الـ undefined
import axiosInstance from '@/config/axiosInstance';

const updateDevice = async ({ id, deviceData }) => {
  // 🌟 تعديل الـ URL ليتوافق مع الـ Prefix (/api/v1) المدمج أو المسار الكامل حسب السيرفر
  const res = await axiosInstance.patch(`/devices/${id}`, deviceData);
  return res.data;
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, deviceData }) => updateDevice({ id, deviceData }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device', variables.id] });
    },
    onError: (error) => {
      console.error("Error updating device:", error);
    }
  });
};