import NavBar from '@/component/NavBar'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '@/component/SideBar'
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='h-screen bg-background flex flex-col overflow-hidden'>
    <NavBar onToggleSidebar={() => setSidebarOpen(true)} />

    <div className='flex flex-1 overflow-hidden'>
      <main className='flex-1 overflow-y-auto flex flex-col text-foreground bg-background relative'>
        <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Outlet />
      </main>
    </div>
  </div>
  )
}
