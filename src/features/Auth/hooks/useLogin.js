import { useMutation } from "@tanstack/react-query"
import { login } from "@/services/auth.services"
import { useNavigate } from "react-router-dom"
import { showErrorToast , showSuccessToast } from "@/utils/toast"
import { useAuth } from "@/context/AuthContext"

export default function useLogin() {
    const navigate=useNavigate();
    const {setAccessToken} = useAuth();
    const {isLoading:isLogging , mutate:loginUser} = useMutation({
    mutationFn:(data)=>login(data),
    onSuccess:(data)=>{
        showSuccessToast("user logged in successfully");
        setAccessToken(data.token)
        localStorage.setItem("token" , data.token);
        localStorage.setItem("user-data" , JSON.stringify(data.data));
        navigate("/");
    },
    onError:(error)=>{
        console.log(error)
        showErrorToast( error?.error.message || "Login failed. Please try again." );
    }
  })

  return {isLogging , loginUser}
}
