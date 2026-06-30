import { useMutation } from "@tanstack/react-query"
import { forgotPassword } from "@/services/auth.services";
import { showErrorToast , showSuccessToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

export default function useForgotPassword() {
  const navigate = useNavigate();
  const {isLoading , mutate:userForgotPassword} = useMutation({
    mutationFn:(data)=>forgotPassword(data),
    onSuccess:(data)=>{
        showSuccessToast(data.message || "password has been reset successfully");
        navigate("/reset-password")
    },
    onError:(error)=>{
        showErrorToast( error?.response?.data.errors[0] || "couldnt reset password" );
    }
  })

  return {isLoading , userForgotPassword}
}
