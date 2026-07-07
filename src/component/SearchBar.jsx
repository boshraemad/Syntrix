import React from 'react'
import { IoIosSearch } from "react-icons/io";

export default function SearchBar() {
  return (
    <div className='relative w-[500px] flex items-center text-slate-500 dark:text-white'>
      <IoIosSearch className='absolute left-3 text-xl' />
      <input 
        type="text" 
        placeholder='Search' 
        className='
          border-[1px] border-slate-200 dark:border-white/40 bg-transparent
          pl-10 pr-4 py-[4px] 
          rounded-full w-full 
          outline-none 
          text-slate-800 dark:text-white
          placeholder-slate-400 dark:placeholder-white/70 
          focus:border-slate-400 dark:focus:border-white 
          transition-all
          focus:placeholder-transparent
        ' 
      />
    </div>
  )
}