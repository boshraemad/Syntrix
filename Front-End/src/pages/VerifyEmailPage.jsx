import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import AuthLayout from '@/components/AuthLayout';

export default function VerifyEmailPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Verification Code:", data.code);
    // Call the verification API here
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
          Check your email
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-500 text-sm leading-relaxed"
        >
          We've sent a 6-digit verification code to{' '}
          <span className="text-white font-medium">user@example.com</span>
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
        {/* Code Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            Verification Code
          </label>
          <input
            type="text"
            placeholder="000000"
            maxLength={6}
            {...register("code", {
              required: "Verification code is required",
              pattern: { value: /^[0-9]{6}$/, message: "Please enter a valid 6-digit code" }
            })}
            className={`w-full bg-transparent border-b ${errors.code ? 'border-red-400' : 'border-white/10'} px-0 py-3 text-2xl tracking-[0.5em] font-mono font-bold text-white text-center focus:outline-none focus:border-white transition-all placeholder:text-gray-800 placeholder:tracking-[0.5em]`}
          />
          {errors.code && (
            <p className="text-red-400 text-xs mt-1 text-center">{errors.code.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black font-bold py-4 rounded hover:bg-gray-200 transition-colors text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Verifying...' : 'Verify Email'}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </motion.form>

      {/* Resend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-10 pt-8 border-t border-white/5 text-center space-y-4"
      >
        <p className="text-gray-600 text-xs uppercase tracking-widest font-mono">
          Didn't receive the email?
        </p>
        <button className="text-gray-400 hover:text-white text-xs transition-colors cursor-pointer inline-flex items-center gap-2 uppercase tracking-widest font-mono">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Resend Code
        </button>
      </motion.div>
    </AuthLayout>
  );
}