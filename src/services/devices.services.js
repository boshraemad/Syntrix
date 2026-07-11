import axiosInstance from "@/config/axiosInstance";

export const getDevices = async (params) => {
    const res = await axiosInstance.get('/devices', {
      params: {
        page: 1, 
        limit: 10,    
        ...params,    
      },
    });
    return res.data;
  };