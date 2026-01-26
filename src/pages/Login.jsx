import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary font-popns ">
      <div className="w-[90%] flex items-center flex-col">
          <h1 className='font-bold text-font text-6xl mb-10'>Syntrix</h1>
          <form className='text-font flex flex-col gap-2 justify-between'>
           <div className='flex flex-col gap-2'>
           <label className='text-sm'>Username</label>
           <input type="text"className='px-6 py-1 border-third border rounded-md'/>
           </div>
           <div className='flex flex-col gap-2 mb-6'>
           <label className='text-sm'>Password</label>
           <input type="password" className='px-6 py-1 border-third border rounded-md'/>
           </div>
            <Button className="bg-button hover:bg-third cursor-pointer font-[700] text-lg">Login</Button>
            <Link to="/forgot-password" className='text-font text-xs text-center'>forgot Password?</Link>
          </form>
      </div>
    </div>
  )
}
