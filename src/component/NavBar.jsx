import React from 'react'
import Logo from './Logo'
import User from './User'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'
import { logout , logoutAll } from '@/services/auth.services'
export default function NavBar() {
  const clickLogout = async()=>{
    logout();
  }
  return (
    <div className="bg-second h-11.25 flex justify-between items-center p-2">
        <Logo/>
        <SearchBar/>
        <div className='flex items-center gap-2'>
        <Link to="/login"><button onClick={clickLogout} className='px-6 py-0.5 bg-[#DCE2EA] cursor-pointer rounded-xl text-sm'>Logout</button></Link>
        <User/>
        </div>
    </div>
  )
}
