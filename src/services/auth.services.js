import axiosInstance  from "@/config/axiosInstance";

export async function login(data){
        const res = await axiosInstance.post("/Account/login" , data);
        return res.data;
}

export async function register(data){
        const res = await axiosInstance.post("/Account/register" , data);
        return res.data;
}

export async function VerifyEmail(data){
    const res = await axiosInstance.post("/Account/verifyEmail" , data);
    return res.data;
}

export async function forgotPassword(data){
    const res = await axiosInstance.post("/Account/ForgotPassword" , data);
    return res.data;
}

export async function resetPassword(data){
    const res = await axiosInstance.post("/Account/ResetPassword" , data);
    return res.data;
}

export async function userRefreshToken(data){
    const res = await axiosInstance.post("/Account/refresh-token" , data);
    return res.data;
}