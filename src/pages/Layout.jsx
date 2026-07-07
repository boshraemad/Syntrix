import NavBar from '@/component/NavBar'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '@/component/SideBar'
import { useRefreshToken } from '@/features/Auth/hooks/useRefreshToken'
import { showErrorToast } from '@/utils/toast'
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
    // Calling the hook starts the automatic background timer instantly
    const { error } = useRefreshToken();

    // Optional: If the initial token refresh fails completely (e.g., user is unauthenticated)
    if (error) {
      showErrorToast("User is not logged in or session expired.")
      console.log("User is not logged in or session expired.");
      // You can choose to allow them to view public routes, or let your router handle it
    }

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
