import React from 'react';
import { useForm } from 'react-hook-form';
import { MailCheck, ArrowRight, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VerifyEmailPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Verification Code:", data.code);
    // هنا يتم استدعاء الـ API للتحقق من الكود
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* تأثيرات الإضاءة في الخلفية */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-third/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-primary/80 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl text-center">
          
          {/* أيقونة النجاح */}
          <div className="w-20 h-20 bg-button/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-button/30 shadow-[0_0_20px_rgba(26,18,136,0.3)]">
            <MailCheck className="text-third" size={40} />
          </div>

          <h1 className="text-font text-3xl font-bold mb-3">Check your email</h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            We've sent a 6-digit verification code to <br/>
            <span className="text-font font-medium">user@example.com</span>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <input 
                type="text" 
                placeholder="Enter 6-digit code"
                maxLength={6}
                {...register("code", {
                  required: "Verification code is required",
                  pattern: { value: /^[0-9]{6}$/, message: "Please enter a valid 6-digit code" }
                })}
                className={`w-full bg-second/30 border ${errors.code ? 'border-red-500' : 'border-white/10'} rounded-xl py-4 text-center text-2xl tracking-[1em] font-bold text-font focus:outline-none focus:border-third transition-all placeholder:text-gray-700 placeholder:tracking-normal placeholder:text-sm placeholder:font-normal`}
              />
              {errors.code && (
                <p className="text-red-400 text-xs mt-2">{errors.code.message}</p>
              )}
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-button hover:bg-third text-font font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-button/20 cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* خيارات إعادة الإرسال */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
            <p className="text-gray-500 text-sm">Didn't receive the email?</p>
            <button className="flex items-center gap-2 mx-auto text-third hover:text-font font-medium text-sm transition-colors cursor-pointer">
              <RefreshCcw size={16} />
              Click to resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}