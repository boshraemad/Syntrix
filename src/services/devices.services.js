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
  export const createDevice = async (deviceData) => {
    const res = await axiosInstance.post('/devices', deviceData);
    return res.data;
  };

  export const getDeviceById = async (id, includeServices = true, includeAlerts = true) => {

    const res = await axiosInstance.get(`/devices/${id}`, {
      params: {
        includeServices,
        includeAlerts,
      },
    });
    return res.data;
  };


export const deleteDevice = async (id) => {
  const res = await axiosInstance.delete(`/devices/${id}`);
  return res.data;
};
