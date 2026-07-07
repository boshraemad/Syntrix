import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useSignUp from '@/features/Auth/hooks/useSignUp'
import { useForm } from 'react-hook-form'
import AuthLayout from '@/components/AuthLayout'

export default function SignUp() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onChange" })
  const { isLogging, signUpUser } = useSignUp();

  const onSubmit = (data) => {
    if (!data) return;
    console.log(data);
    signUpUser(data);
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
          Welcome
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
        {/* confirm Password Input */}
        <div className="space-y-2 group">
  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest transition-colors group-focus-within:text-white">
    Confirm Password
  </label>
  <input
    {...register("confirmPassword", { 
      required: "Confirm Password is required",
      validate: (value, formValues) => value === formValues.password || "Passwords do not match"
    })}
    type="password"
    placeholder="••••••••"
    className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-700"
  />
  {errors.confirmPassword && (
    <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
  )}
</div>


        <div className="flex items-center justify-end pt-2">

          <Link
            to="/login"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Already have an account?
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
      </motion.div>
    </AuthLayout>
  )
}