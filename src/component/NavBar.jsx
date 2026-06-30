import React from 'react'
import Logo from './Logo'
import User from './User'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'
import { logout , logoutAll } from '@/services/auth.services'
import { FaBars } from "react-icons/fa";

export default function NavBar({ onToggleSidebar }) {
  const clickLogout = async () => {
    try {
      await logout(); 
      await logoutAll(); 
      console.log("Logged out from all devices successfully");
    } catch (error) {
      console.error("Error during logout process:", error);
    }
  };
  return (
    <div className="bg-background border-b border-[#dadada]/5 h-14 flex justify-between items-center px-4 py-2">
        <div className='flex items-center gap-4'>
          <FaBars 
            className="text-lg cursor-pointer text-white/60 hover:text-cyan-400 transition-colors" 
            onClick={onToggleSidebar} 
          />
          <Logo/>
        </div>
        <SearchBar/>
        <div className='flex items-center gap-4'>
        <Link to="/login"><button onClick={clickLogout} className='px-4 py-1.5 border border-purple-500/20 text-gray-300 hover:bg-purple-500/20 hover:text-white hover:border-purple-500/50 transition-colors cursor-pointer rounded-sm text-xs uppercase tracking-wider font-semibold'>Logout</button></Link>
        <User/>
        </div>
    </div>
  )
}

