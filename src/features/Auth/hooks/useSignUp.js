import { useMutation } from "@tanstack/react-query"
import { signUp } from "@/services/auth.services"
import { useNavigate } from "react-router-dom"
import { showErrorToast , showSuccessToast } from "@/utils/toast"

export default function useSignUp() {
    const navigate=useNavigate();
    const {isLoading:isLogging , mutate:signUpUser} = useMutation({
    mutationFn:(data)=>signUp(data),
    onSuccess:()=>{
        showSuccessToast("user signed up successfully");
        navigate("/login");
    },
    onError:(error)=>{
        showErrorToast( error?.error.message || "Signing up failed. Please try again." );
    }
  })

  return {isLogging , signUpUser}
}
