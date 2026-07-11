import { useQuery } from '@tanstack/react-query';
import { getDeviceById } from '../services/deviceService';

export const useGetDeviceById = (id, includeServices = false, includeAlerts = false) => {
  return useQuery({
    // الـ queryKey يضم كل المتغيرات لضمان دقة الـ caching والتحديث
    queryKey: ['device', id, { includeServices, includeAlerts }],
    
    // استدعاء الـ service function وتمرير المتغيرات لها
    queryFn: () => getDeviceById(id, includeServices, includeAlerts),
    
    // عدم تفعيل الـ Request إلا في حال وجود id لمنع الـ Errors (مثلاً لو الـ id قادم من الـ URL params)
    enabled: !!id, 
    
    staleTime: 5000, // البيانات تعتبر fresh لمدة 5 ثوانٍ
  });
};