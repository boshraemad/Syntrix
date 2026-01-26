import React from 'react'
import { IoIosSearch } from "react-icons/io";

export default function SearchBar() {
  return (
    <div className='relative w-[500px] flex items-center text-white'>
      <IoIosSearch className='absolute left-3 text-xl' />
      <input 
        type="text" 
        placeholder='Search' 
        className='
          border-[1px] border-white/40 bg-transparent
          pl-10 pr-4 py-[4px] 
          rounded-full w-full 
          outline-none 
          placeholder-white/70 
          focus:border-white 
          transition-all
          focus:placeholder-transparent
        ' 
      />
    </div>
  )
}