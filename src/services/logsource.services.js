import axiosInstance from "@/config/axiosInstance";
export const getLogSources = async (params = {}) => {
  const response = await axiosInstance.get("/log-sources", { params });
  return response.data;
};

export const getLogSourceById = async (id) => {
  const response = await axiosInstance.get(`/log-sources/${id}`);
  return response.data; 
};


export const createLogSource = async (logSourceData) => {
  const response = await axiosInstance.post("/log-sources", logSourceData);
  return response.data;
};

export const updateLogSource = async (id, logSourceData) => {
    const response = await axiosInstance.patch(`/log-sources/${id}`, logSourceData);
    return response.data;
  };