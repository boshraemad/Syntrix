import React from 'react'
import Logo from './Logo'
import User from './User'
import { FaBars } from "react-icons/fa";
import { useLogout } from '../features/Auth/hooks/useLogout'; 
import { useLogoutAll } from '../features/Auth/hooks/useLogoutAll';

export default function NavBar({ onToggleSidebar }) {
  const savedTheme = localStorage.getItem('theme');
  
  const { isLoggingOut, handleLogout } = useLogout();
  const { isLoggingOutAll, handleLogoutAll } = useLogoutAll();

  return (
    <div className="bg-background border-b border-slate-200 dark:border-[#dadada]/5 h-14 flex justify-between items-center px-4 py-2">
        <div className='flex items-center gap-4'>
          <FaBars 
            className={`text-lg cursor-pointer ${savedTheme === 'light' ? 'text-black' : 'text-light dark:text-light'} hover:text-cyan-400 transition-colors`} 
            onClick={onToggleSidebar} 
          />
          <Logo/>
        </div>

        <div className='flex items-center gap-3'>
          {/* زرار الخروج العادي */}
          <button 
            onClick={() => handleLogout()} 
            disabled={isLoggingOut}
            className='px-3 py-1.5 border border-purple-500/20 text-slate-700 dark:text-gray-300 hover:bg-purple-500/20 hover:text-white dark:hover:text-white hover:border-purple-500/50 transition-colors cursor-pointer rounded-sm text-xs uppercase tracking-wider font-semibold disabled:opacity-5'
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>

          {/* زرار الخروج من كل الأجهزة */}
          <button 
            onClick={() => handleLogoutAll()} 
            disabled={isLoggingOutAll}
            className='px-3 py-1.5 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20 hover:text-white transition-colors cursor-pointer rounded-sm text-xs uppercase tracking-wider font-semibold disabled:opacity-5'
          >
            {isLoggingOutAll ? 'Clearing Sessions...' : 'Logout All Devices'}
          </button>
          
          <User/>
        </div>
    </div>
  )
}