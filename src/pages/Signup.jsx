import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useSignup from '../features/Auth/hooks/useSignup'
import { useForm } from 'react-hook-form'
import AuthLayout from '../components/AuthLayout'

export default function Signup() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onChange" })
  
  const { isSigningUp, signupUser } = useSignup();

  const onSubmit = (data) => {
    if (!data) return;
    signupUser(data);
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
          Create Account
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-500 text-sm"
        >
          Register a new analyst account into the SOC system.
        </motion.p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="space-y-6" // تم تقليل المسافة قليلاً لتناسب الحقول الإضافية
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Row for First Name & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name Input */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest transition-colors group-focus-within:text-white">
              First Name
            </label>
            <input
              {...register("firstName", { required: "First name is required" })}
              type="text"
              placeholder="John"
              className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-700"
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name Input */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest transition-colors group-focus-within:text-white">
              Last Name
            </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              type="text"
              placeholder="Doe"
              className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-700"
            />
            {errors.lastName && (
              <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest transition-colors group-focus-within:text-white">
            Email Address
          </label>
          <input
            {...register("email", { 
              required: "Email is required", 
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            type="email"
            placeholder="analyst@syntrix.local"
            className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-700"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest transition-colors group-focus-within:text-white">
            Phone Number
          </label>
          <input
            {...register("phoneNumber", { required: "Phone number is required" })}
            type="tel"
            placeholder="+201000000000"
            className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-700"
          />
          {errors.phoneNumber && (
            <p className="text-red-400 text-xs mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest transition-colors group-focus-within:text-white">
            Password
          </label>
          <input
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            type="password"
            placeholder="••••••••"
            className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-700"
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Link to Login */}
        <div className="flex items-center justify-end pt-2">
          <Link 
            to="/login" 
            className="text-xs text-gray-400 hover:text-white transition-colors select-none font-medium"
          >
            Already have an account? Sign In
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSigningUp}
          className="w-full bg-white text-black font-bold py-4 rounded hover:bg-gray-200 transition-colors mt-6 text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningUp ? 'Creating Account...' : 'Register Analyst'}
        </button>
      </motion.form>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center text-[10px] text-gray-600 font-mono tracking-widest uppercase"
      >
        SECURE GATEWAY // SYNTRIX_SYSTEM
      </motion.div>
    </AuthLayout>
  )
}