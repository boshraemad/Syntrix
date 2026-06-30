import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useLogin from '@/features/Auth/hooks/useLogin'
import { useForm } from 'react-hook-form'
import AuthLayout from '@/components/AuthLayout'

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onChange" })
  const { isLogging, loginUser } = useLogin();

  const onSubmit = (data) => {
    if (!data) return;
    loginUser(data);
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
          Welcome back
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-500 text-sm"
        >
          Enter your credentials to access the SOC terminal.
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
            Email or Username
          </label>
          <input
            {...register("email", { required: true })}
            type="text"
            placeholder="analyst@syntrix.local"
            className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-700"
          />
          {errors.email?.type === "required" && (
            <p className="text-red-400 text-xs mt-1">Email is required</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest transition-colors group-focus-within:text-white">
            Password
          </label>
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="••••••••"
            className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-700"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-400 text-xs mt-1">Password is required</p>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between pt-2">
          <label
            className="flex items-center gap-3 cursor-pointer group/check"
            onClick={() => setRememberMe(!rememberMe)}
          >
            <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${rememberMe ? 'border-white bg-white' : 'border-white/20 group-hover/check:border-white/50'}`}>
              {rememberMe && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4l2.5 2.5L9 1" />
                </svg>
              )}
            </div>
            <span className="text-xs text-gray-400 group-hover/check:text-gray-200 transition-colors select-none">
              Remember me
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLogging}
          className="w-full bg-white text-black font-bold py-4 rounded hover:bg-gray-200 transition-colors mt-8 text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLogging ? 'Authenticating...' : 'Authenticate'}
        </button>
      </motion.form>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center text-[10px] text-gray-600 font-mono tracking-widest uppercase"
      >
        Built for CCSED Graduation Project 2026
      </motion.div>
    </AuthLayout>
  )
}