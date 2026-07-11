import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteDevice } from '@/services/devices.services';

const DeviceDeleteManager = ({ deviceId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // بناء الـ Mutation الخاص بالحذف
  const deleteMutation = useMutation({
    mutationFn: () => deleteDevice(deviceId),
    
    onSuccess: () => {
      // 1. تحديث كاش الأجهزة في الخلفية
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      
      // 2. التوجيه إلى صفحة الـ hosts
      navigate('/hosts');
    },
  });

  const handleDeleteClick = () => {
    // نمرر الـ Promise الخاص بالـ mutation مباشرة لـ toast.promise 
    // ليتولى الـ Toast إظهار حالة التحميل، النجاح، أو الفشل تلقائياً
    toast.promise(
      deleteMutation.mutateAsync(), // نستخدم mutateAsync لتعود كـ Promise للمكتبة
      {
        loading: 'Deleting device from cluster...',
        success: 'Device permanently deleted successfully!',
        error: (err) => {
          // استخراج رسالة الخطأ القادمة من السيرفر (مثل 403 SOC_ADMIN required)
          return err.response?.data?.message || 'Failed to delete device. Access denied.';
        },
      },
      {
        // ستايل إضافي اختياري للـ Toast ليناسب طابع الـ Security Dashboard
        style: {
          minWidth: '250px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  };

  return (
    <button 
      onClick={handleDeleteClick} 
      disabled={deleteMutation.isPending}
      style={{ 
        backgroundColor: '#d32f2f', 
        color: 'white', 
        padding: '10px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: deleteMutation.isPending ? 'not-allowed' : 'pointer'
      }}
    >
      Delete Device
    </button>
  );
};

export default DeviceDeleteManager;