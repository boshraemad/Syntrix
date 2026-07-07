import { useQuery } from "@tanstack/react-query";
import { refreshToken } from "@/services/auth.services.js";
import axiosInstance from "@/config/axiosInstance";

export const useRefreshToken = () => {
  return useQuery({
    queryKey: ["refreshToken"],
    queryFn: async () => {
      try {
        const data = await refreshToken();
        
        // 1. Safely attach the fresh token to your Axios instance header
        const token = data.accessToken || data.token; // adjust based on your API response structure
        if (token) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          localStorage.setItem("token" , data.token);
        }
        
        // 2. If you are using global state (like Zustand or Redux), update it here:
        // useAuthStore.getState().setToken(token);

        return data;
      } catch (error) {
        // If the refresh token is expired or invalid, handle force logout here
        console.error("Session expired. Logging out...", error);
        // useAuthStore.getState().logout();
        throw error;
      }
    },
    
    // Refresh every 28 minutes (1,680,000 ms) to give a 2-minute buffer before a 30-min expiry
    refetchInterval: 1680000, 
    
    // Keeps the timer ticking even if the browser window is in the background
    refetchIntervalInBackground: true, 
    
    // Prevent aggressive automatic refetching on basic user actions
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: "always",
  });
};