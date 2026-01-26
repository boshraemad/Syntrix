import React from 'react'
import Logo from './Logo'
import User from './User'
import SearchBar from './SearchBar'
export default function NavBar() {
  return (
    <div className="bg-second h-11.25 flex justify-between items-center p-2">
        <Logo/>
        <SearchBar/>
        <User/>
    </div>
  )
}
