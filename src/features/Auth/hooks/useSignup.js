import { useMutation } from "@tanstack/react-query"
import { signup } from "@/services/auth.services"
import { showErrorToast, showSuccessToast } from "@/utils/toast"

export default function useSignup() {

    const { isLoading: isSigningUp, mutate: signupUser } = useMutation({
        mutationFn: (data) => signup(data),
        onSuccess: () => {
            showSuccessToast("Analyst account created successfully");
            
        },
        onError: (error) => {
            showErrorToast(error?.response?.data?.message || "Signup failed. Please try again.");
        }
    });

    return { isSigningUp, signupUser };
}