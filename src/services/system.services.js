import axiosInstance from "@/config/axiosInstance";

export async function getSystemStatus(){
    const res = await axiosInstance.get("/system/status");
    return res.data;
}