import axiosInstance from "@/config/axiosInstance";

export async function login(data) {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
}

export async function logout() {
    // تم تمرير كائن فارغ كأرجومنت ثانٍ ليتم إرسال الـ Headers بشكل صحيح
    const res = await axiosInstance.post("/auth/logout", {});
    return res.data;
}

export async function logoutAll() {
    // تم تمرير كائن فارغ كأرجومنت ثانٍ ليتم إرسال الـ Headers بشكل صحيح
    const res = await axiosInstance.post("/auth/logout-all", {});
    return res.data;
}

export async function refreshToken() {
    const res = await axiosInstance.post("/auth/refresh");
    return res.data;
}
export async function getActiveSessions(){
    const res = await axiosInstance.get("/auth/sessions",{},{
        withCredentials: true 
    });
    return res.data.data;
}

export async function signup(data) {
    const res = await axiosInstance.post("/auth/signup", data);
    return res.data;
}

