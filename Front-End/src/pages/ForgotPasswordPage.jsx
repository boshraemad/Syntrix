import React from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import AuthLayout from '@/components/AuthLayout';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    if (!data) {
      return;
    }
    console.log(data);
  }

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
          Forgot Password?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-500 text-sm leading-relaxed"
        >
          No worries. Enter your email address and we'll send you a link to reset your password.
        </motion.p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="space-y-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Email Input */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest transition-colors group-focus-within:text-white">
            Email Address
          </label>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="name@company.com"
            className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-700"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black font-bold py-4 rounded hover:bg-gray-200 transition-colors text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Reset Password'}
        </button>
      </motion.form>

      {/* Back to Login */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-10"
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-xs transition-colors uppercase tracking-widest font-mono"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Back to Login
        </Link>
      </motion.div>
    </AuthLayout>
  )
}
