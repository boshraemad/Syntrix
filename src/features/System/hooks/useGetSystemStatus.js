import { useQuery } from "@tanstack/react-query";
import { getSystemStatus } from "@/services/system.services";

export const useSystemStatus = () => {
  return useQuery({
    queryKey: ["systemStatus"],
    queryFn: getSystemStatus,
    
    // Optimizations for static initialization checks
    staleTime: Infinity,           // The system state won't change back to "first-run" once initialized
    refetchOnWindowFocus: false,   // Disable unnecessary background refetches on tab toggle
    refetchOnReconnect: false,
  });
};