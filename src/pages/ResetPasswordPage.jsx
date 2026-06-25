import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  // إعداد React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange" // التحقق أثناء الكتابة
  });

  // مراقبة قيمة كلمة المرور للمقارنة بها
  const password = watch("password");

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    // هنا يتم استدعاء الـ API الخاص بك
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* تأثيرات الإضاءة */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-third/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-primary/80 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-font text-3xl font-bold mb-2">Reset Password</h1>
            <p className="text-gray-400 text-sm">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* حقل كلمة المرور الجديدة */}
            <div>
              <label className="block text-font text-sm font-medium mb-2 ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Must be at least 8 characters" }
                  })}
                  className={`w-full bg-second/30 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-12 text-font focus:outline-none focus:border-third transition-all`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-font"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* حقل تأكيد كلمة المرور */}
            <div>
              <label className="block text-font text-sm font-medium mb-2 ml-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match"
                  })}
                  className={`w-full bg-second/30 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-4 text-font focus:outline-none focus:border-third transition-all`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-button hover:bg-third text-font font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-button/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}