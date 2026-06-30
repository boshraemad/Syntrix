import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import AuthLayout from '@/components/AuthLayout';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange"
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl font-semibold mb-2 text-white"
        >
          Reset Password
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-500 text-sm"
        >
          Enter your new password below.
        </motion.p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* New Password */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest transition-colors group-focus-within:text-white">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Must be at least 8 characters" }
              })}
              className={`w-full bg-transparent border-b ${errors.password ? 'border-red-400' : 'border-white/10'} px-0 py-2 pr-10 text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-700`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest transition-colors group-focus-within:text-white">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match"
            })}
            className={`w-full bg-transparent border-b ${errors.confirmPassword ? 'border-red-400' : 'border-white/10'} px-0 py-2 text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-700`}
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black font-bold py-4 rounded hover:bg-gray-200 transition-colors text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </motion.form>
    </AuthLayout>
  );
}