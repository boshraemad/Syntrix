import NavBar from '@/component/NavBar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '@/component/SideBar'
export default function Layout() {
  return (
    <div className='h-screen bg-primary flex flex-col'>
    <NavBar />

    <div className='flex flex-1 overflow-hidden'>
      <SideBar />

      <main className='flex-1 overflow-y-auto min-h-screen px-12.5 text-font p-8 bg-canvas'>
        <Outlet />
      </main>
    </div>
  </div>
  )
}
