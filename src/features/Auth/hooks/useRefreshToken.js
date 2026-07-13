import { useQuery } from "@tanstack/react-query";
import { refreshToken } from "@/services/auth.services";
import axiosInstance from "@/config/axiosInstance";
import { showErrorToast } from "@/utils/toast";

export const useRefreshToken = () => {
  return useQuery({
    queryKey: ["refreshToken"],
    queryFn: async () => {
      // 1. نجيب الـ refreshToken من الـ localStorage
      const storedRefreshToken = localStorage.getItem("refreshToken");
      
      // لو مش موجودة، ارمي error فوراً عشان تروح للـ catch
      if (!storedRefreshToken) {
        throw new Error("No refresh token found");
      }

      try {
        // 2. نمرر الـ token للـ service عشان تتبعت في الـ Body
        const data = await refreshToken(storedRefreshToken);
        
        // 3. نحدث الـ accessToken الجديد في الـ headers والـ localStorage
        const newAccessToken = data.token; 
        if (newAccessToken) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          localStorage.setItem("token", newAccessToken);
        }
        
        // 4. لو الباك إند بيرجع كمان refreshToken جديدة (تحديث دوري)، نخزنها برضه
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        return data;
      } catch (error) {
        // لو الـ token منتهية أو ممسوحة، بنعمل تنظيف للمكان هنا
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user-data");
        
        showErrorToast("Session expired. Please login again.");
        console.error("Session expired. Logging out...", error);
        throw error;
      }
    },
    
    refetchInterval: 840000, // 14 دقيقة
    refetchIntervalInBackground: true, 
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: "always",
  });
};