import axiosInstance from "@/config/axiosInstance";

// 1. GET - جلب الخدمات (العام مع الفلاتر)
export const getServices = async (params = {}) => {
  const response = await axiosInstance.get("/services", { params });
  return response.data;
};

// 2. POST - إنشاء خدمة جديدة
export const createService = async (serviceData) => {
  const response = await axiosInstance.post("/services", serviceData);
  return response.data;
};

// 3. GET - جلب تفاصيل خدمة معينة بالـ ID
export const getServiceById = async (id) => {
  const response = await axiosInstance.get(`/services/${id}`);
  return response.data;
};

// 4. PATCH / PUT - تعديل الخدمة
export const patchService = async (id, serviceData) => {
  const response = await axiosInstance.patch(`/services/${id}`, serviceData);
  return response.data;
};

// 5. DELETE - حذف خدمة معينة
export const deleteService = async (id) => {
  const response = await axiosInstance.delete(`/services/${id}`);
  return response.data;
};

// 🌟 6. GET - جلب عدد الخدمات الإجمالي (/services/count)
export const getServicesCount = async () => {
  const response = await axiosInstance.get("/services/count");
  return response.data;
};

// 🌟 7. GET - جلب الخدمات الخاصة بمستخدم معين (/services/user/{userId})
export const getServicesByUser = async (userId, params = {}) => {
  const response = await axiosInstance.get(`/services/user/${userId}`, { params });
  return response.data;
};

// 🌟 8. GET - جلب الخدمات الخاصة بجهاز معين (/services/device/{deviceId})
export const getServicesByDevice = async (deviceId, params = {}) => {
  const response = await axiosInstance.get(`/services/device/${deviceId}`, { params });
  return response.data;
};