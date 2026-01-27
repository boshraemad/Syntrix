import React from 'react';
import { Settings, Wrench, PlusCircle, Search } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="p-8 text-white min-h-screen">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 mb-8 gap-4  ">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        
        <div className="flex flex-wrap gap-5 text-gray-400 text-sm">
          <button className="flex items-center cursor-pointer gap-2 hover:text-white transition-all">
            <Settings size={16} />
            <span>Manage</span>
          </button>
          <button className="flex items-center cursor-pointer gap-2 hover:text-white transition-all">
            <Wrench size={16} />
            <span>Dev tools</span>
          </button>
          <button className="flex items-center cursor-pointer gap-2 hover:text-white transition-all">
            <PlusCircle size={16} />
            <span>Add integrations</span>
          </button>
        </div>
      </div>

      {/* 2. Top Large Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Left Chart Card with Search */}
        <div className="bg-[#0b1120]/50 border cursor-pointer border-[#FFFFFF] rounded-lg p-4 min-h-[350px] relative">
          <div className="relative w-full max-w-sm">
            
          </div>
        </div>

        {/* Right Chart Card (Empty) */}
        <div className="bg-[#0b1120]/50 border border-[#FFFFFF] rounded-lg min-h-[350px]"></div></div>

      {/* 3. Bottom Integration Cards */}
      <div className="flex flex-wrap justify-center items-end gap-8">
        {/* Side Card 1 (Dark) */}
        <div className="w-56 h-56 bg-black/40 border border-[#FFFFFF] cursor-pointer rounded-md"></div>

        <div className="w-56 h-56 bg-black/40 border border-[#FFFFFF] cursor-pointer rounded-md"></div>

        {/* Side Card 2 (Dark) */}
        <div className="w-56 h-56 bg-black/40 border border-[#FFFFFF] cursor-pointer rounded-md"></div>
      </div>
    </div>
  );
}