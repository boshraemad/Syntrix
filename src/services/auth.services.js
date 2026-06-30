import axiosInstance  from "@/config/axiosInstance";

export async function login(data){
        const res = await axiosInstance.post("/auth/login" , data);
        return res.data;
}

export async function logout(){
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
}

export async function logoutAll(){
    const res = await axiosInstance.post("/auth/logout-all");
    return res.data;
}

export async function VerifyEmail(data){
    const res = await axiosInstance.post("/auth/verify-email" , data);
    return res.data;
}

export async function forgotPassword(data){
    const res = await axiosInstance.post("/auth/forgot-password" , data);
    return res.data;
}

export async function resetPassword(data){
    const res = await axiosInstance.post("/auth/reset-password" , data);
    return res.data;
}

export async function refreshToken(){
    const res = await axiosInstance.post("/auth/refresh");
    return res.data;
}
