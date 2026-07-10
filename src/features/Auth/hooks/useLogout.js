import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "@/services/auth.services"
import { useNavigate } from "react-router-dom"
import { showErrorToast, showSuccessToast } from "@/utils/toast"
import { useAuth } from "@/context/AuthContext"

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setAccessToken } = useAuth();

    const { isLoading: isLoggingOut, mutate: handleLogout } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            showSuccessToast("Logged out successfully");
            setAccessToken(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user-data");
            queryClient.clear(); // مسح كاش الـ React Query
            navigate("/login");
        },
        onError: (error) => {
            showErrorToast(error?.response?.data?.message || "Server error, logging out locally...");
            // خطة بديلة: مسح البيانات محلياً حتى لو السيرفر واجه مشكلة
            setAccessToken(null);
            localStorage.removeItem("token");
            queryClient.clear();
            navigate("/login");
        }
    });

    return { isLoggingOut, handleLogout };
}