import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logoutAll } from "@/services/auth.services"
import { useNavigate } from "react-router-dom"
import { showErrorToast, showSuccessToast } from "@/utils/toast"
import { useAuth } from "@/context/AuthContext"

export function useLogoutAll() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setAccessToken } = useAuth();

    const { isLoading: isLoggingOutAll, mutate: handleLogoutAll } = useMutation({
        mutationFn: logoutAll,
        onSuccess: () => {
            showSuccessToast("Logged out from all devices successfully");
            setAccessToken(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user-data");
            queryClient.clear();
            navigate("/login");
        },
        onError: (error) => {
            showErrorToast(error?.response?.data?.message || "Server error, clearing local session...");
            // خطة بديلة: الخروج محلياً في حال حدوث خطأ من طرف السيرفر
            setAccessToken(null);
            localStorage.removeItem("token");
            queryClient.clear();
            navigate("/login");
        }
    });

    return { isLoggingOutAll, handleLogoutAll };
}