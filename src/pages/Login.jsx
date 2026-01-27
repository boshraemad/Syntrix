import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion' // مكتبة الانميشن

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden font-poppins">
      
      {/* دوائر الخلفية المضيئة (زي اللي في الصورة) */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-third/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-third/10 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md px-8 flex items-center flex-col z-10"
      >
          {/* Logo مع حركة نبض خفيفة */}
          <motion.h1 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className='font-bold text-white text-7xl mb-12 tracking-tight'
          >
            Syntrix
          </motion.h1>

          <form className='w-full text-white flex flex-col gap-5'>
            
            {/* Username Input */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-gray-300 ml-1'>Username</label>
              <motion.input 
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="........................"
                className='px-4 py-3 bg-black/40 border-third/50 border rounded-xl outline-none focus:border-third focus:ring-1 focus:ring-third transition-all text-white placeholder-gray-600'
              />
            </div>

            {/* Password Input */}
            <div className='flex flex-col gap-2 mb-4'>
              <label className='text-sm font-medium text-gray-300 ml-1'>password</label>
              <motion.input 
                whileFocus={{ scale: 1.02 }}
                type="password" 
                placeholder="******"
                className='px-4 py-3 bg-black/40 border-third/50 border rounded-xl outline-none focus:border-third focus:ring-1 focus:ring-third transition-all text-white placeholder-gray-600'
              />
            </div>

            {/* Login Button مع حركة عند الضغط */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full bg-[#1e1b4b] hover:bg-third text-white py-6 rounded-xl font-bold text-xl shadow-lg shadow-third/20 transition-all cursor-pointer">
                Login
              </Button>
            </motion.div>

            <Link 
              to="/forgot-password" 
              className='text-gray-400 text-sm text-center hover:text-white transition-colors mt-2'
            >
              Forgot password ?
            </Link>
          </form>
      </motion.div>
    </div>
  )
}