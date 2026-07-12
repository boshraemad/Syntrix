import axiosInstance from "@/config/axiosInstance";

/**
 * جلب قائمة التنبيهات مع الفلاتر والبحث من الـ Endpoint الحقيقية
 */
export const fetchAlertsService = async ({ severity, status, search }) => {
  const params = {};
  if (severity !== 'all') params.severity = severity.toUpperCase();
  if (status !== 'all') params.status = status;
  if (search.trim() !== '') params.search = search;
  
  // إعدادات افتراضية لجلب البيانات والترتيب
  params.limit = 100;
  params.sortBy = 'createdAt';
  params.sortOrder = 'desc';

  const response = await axiosInstance.get('/alerts', { params });
  return response.data;
};

/**
 * جلب تفاصيل تنبيه معين عن طريق الـ ID
 */
export const fetchAlertByIdService = async (alertId) => {
  const response = await axiosInstance.get(`/alerts/${alertId}`);
  return response.data;
};