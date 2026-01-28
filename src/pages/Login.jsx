import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden font-poppins">
      
      {/* 1. التدرج العلوي (الوهج اللي فوق على الشمال) */}
      <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 2. الصورة اللي فوق يمين (الـ SVG بتاعك) */}
      <img 
        className='absolute -top-10 -right-10 w-64 md:w-96 opacity-80 pointer-events-none' 
        src="/Top-puple.svg" 
        alt="" 
      />

      {/* 3. الصورة اللي تحت شمال (الـ SVG بتاعك) */}
      <img 
        className='absolute -bottom-10 -left-10 w-64 md:w-96 opacity-80 pointer-events-none' 
        src="/bottom-puple.svg" 
        alt="" 
      />

      {/* 4. توهج إضافي ناحية اليمين لزيادة العمق */}
      <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-8 flex items-center flex-col z-10"
      >
          <motion.h1 
            className='font-bold text-white text-7xl mb-12 tracking-tight'
          >
            Syntrix
          </motion.h1>

          <form className='w-full text-white flex flex-col gap-6'>
            
            {/* Username Input */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-gray-300 ml-1'>Username</label>
              <input 
                type="text"
                placeholder="........................"
                className='px-4 py-3 bg-black/60 border-indigo-900/40 border rounded-xl outline-none focus:border-indigo-500 transition-all text-white placeholder-gray-500'
              />
            </div>

            {/* Password Input */}
            <div className='flex flex-col gap-2 mb-2'>
              <label className='text-sm font-medium text-gray-300 ml-1'>password</label>
              <input 
                type="password" 
                placeholder="*******"
                className='px-4 py-3 bg-black/60 border-indigo-900/40 border rounded-xl outline-none focus:border-indigo-500 transition-all text-white placeholder-gray-500'
              />
            </div>

            {/* Login Button */}
            <Button className="w-full bg-[#1e1b4b] hover:bg-indigo-900 text-white py-7 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-indigo-500/10">
              Login
            </Button>

            <Link 
              to="/forgot-password" 
              className='text-gray-400 text-sm text-center hover:text-white transition-colors'
            >
              Forgot password ?
            </Link>
          </form>
      </motion.div>
    </div>
  )
}