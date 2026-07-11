import { useMutation } from "@tanstack/react-query"
import { signup } from "@/services/auth.services"
import { showErrorToast, showSuccessToast } from "@/utils/toast"
import { useNavigate } from "react-router-dom";

export default function useSignup() {
    const navigate= useNavigate();
    const { isLoading: isSigningUp, mutate: signupUser } = useMutation({
        mutationFn: (data) => signup(data),
        onSuccess: () => {
            showSuccessToast("Analyst account created successfully");
            window.location.reload();
            navigate("/login");
        },
        onError: (error) => {
            showErrorToast(error?.response?.data?.message || "Signup failed. Please try again.");
        }
    });

    return { isSigningUp, signupUser };
}