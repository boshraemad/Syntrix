import { Save } from 'lucide-react'
import React from 'react'
import DiscoverBottom from '@/component/DiscoverNavbar2'

export default function Discover() {
  return (
    <div className='text-font'><DiscoverBottom/></div>
<>
<div className='flex items-center justify-between'>
      <span className='bg-[#1F2029] text-font px-2.5 py-1'>Discover</span>
      <div className='flex items-center gap-3'>
      <ul className='flex items-center gap-5'>
        <li>New</li>
        <li>Open</li>
        <li>Share</li>
        <li>Alerts</li>
      </ul>
      <button className='flex items-center justify-center gap-2 bg-font text-third w-24.5 px-2.5 py-1 rounded-sm font-semibold cursor-pointer'><Save className='w-4 h-4'/><span className='text-xs'>Save</span></button>
      </div>
    </div>
</>
  )
}
