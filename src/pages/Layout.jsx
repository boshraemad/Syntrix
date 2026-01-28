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

      <main className='flex-1 overflow-y-auto min-h-screen text-font bg-canvas px-12 py-6.5'>
        <Outlet />
      </main>
    </div>
  </div>
  )
}
