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
export async function refreshToken(){
    const res = await axiosInstance.post("/auth/refresh" , {} , {
        withCredentials: true 
    });
    return res.data;
}
export async function activeSessions(){
    const res = await axiosInstance.get("/auth/sessions");
    return res.data;
}