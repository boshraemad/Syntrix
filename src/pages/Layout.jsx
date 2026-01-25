import NavBar from '@/component/NavBar'
import React from 'react'
import { Outlet } from 'react-router-dom'
export default function Layout() {
  return (
    <div className='h-screen bg-primary'>
        <NavBar/>
        <Outlet/>
    </div>
  )
}
