import React from 'react'
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
export default function ForgotPasswordPage() {
    const {register , handleSubmit} = useForm();
    const onSubmit=async (data)=>{
        if(!data){
            return;
        }
        console.log(data);
    }
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 relative overflow-hidden">
      
    {/* تأثير التوهج في الخلفية (Blob) */}
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-third/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-button/20 rounded-full blur-[120px] pointer-events-none"></div>

    <div className="w-full max-w-md relative z-10">
      {/* الكرت الأساسي */}
      <div className="bg-primary/80 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
        
        {/* الأيقونة العلوية */}
        <div className="w-16 h-16 bg-second/50 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-white/5">
          <Mail className="text-third" size={32} />
        </div>

        <h1 className="text-font text-3xl font-bold text-center mb-3">Forgot Password?</h1>
        <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-font text-sm font-medium mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                {...register("email", { required: true })}
                type="email" 
                placeholder="name@company.com"
                className="w-full bg-second/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-font focus:outline-none focus:border-third focus:ring-1 focus:ring-third/50 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-button hover:bg-third text-font font-bold py-3 rounded-xl transition-all shadow-lg shadow-button/20 cursor-pointer active:scale-[0.98]"
          >
            Reset Password
          </button>
        </form>

        {/* العودة لتسجيل الدخول */}
        <div className="mt-8 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-font text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  </div>
  )
}
