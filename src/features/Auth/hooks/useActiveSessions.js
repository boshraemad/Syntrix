// src/features/Auth/hooks/useActiveSessions.js
import { useQuery } from "@tanstack/react-query";
import { getActiveSessions } from "@/services/auth.services";

export const useActiveSessions = () => {
  return useQuery({
    queryKey: ["activeSessions"],
    queryFn: getActiveSessions,
    
    // Security dashboard optimizations
    refetchOnWindowFocus: true, // Refetches when analyst comes back to the tab to see updated devices
    staleTime: 1000 * 60 * 5,   // Data stays fresh in cache for 5 minutes
    
    onError: (error) => {
      console.error("Failed to fetch active sessions:", error);
    }
  });
};