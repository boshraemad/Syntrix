import { useQuery } from '@tanstack/react-query';
import { getDevices } from '@/services/devices.services';

export const useGetDevices = (params) => {
  return useQuery({
    queryKey: ['devices', params], 
    
    queryFn: () => getDevices(params),
    
    placeholderData: (keepPreviousData) => keepPreviousData, 
    staleTime: 5000,
  });
};