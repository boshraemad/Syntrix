import { useMutation } from "@tanstack/react-query"
import { login } from "@/services/auth.services"
import { useNavigate } from "react-router-dom"
import { showErrorToast , showSuccessToast } from "@/utils/toast"
import { useAuth } from "@/context/AuthContext"

export default function useLogin() {
    const navigate = useNavigate();
    const { setAccessToken } = useAuth();
    
    const { isLoading: isLogging, mutate: loginUser } = useMutation({
    mutationFn: (data) => login(data),
    onSuccess: (data) => {
        showSuccessToast("user logged in successfully");
        
        // حفظ الـ accessToken في الكامبوننت/Context والـ localStorage
        setAccessToken(data.token);
        localStorage.setItem("token", data.token); // الـ accessToken
        
        // التعديل هنا: حفظ الـ refreshToken في الـ localStorage
        if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
        }
        
        localStorage.setItem("user-data", JSON.stringify(data.data));
        navigate("/");
    },
    onError: (error) => {
        console.log(error);
        showErrorToast(error?.response?.data?.message || error?.error?.message || "Login failed.");
    }
  });

  return { isLogging, loginUser };
}