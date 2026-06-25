import React from 'react';
import { Settings, Wrench, PlusCircle } from 'lucide-react';
import dashboardImage1 from "../assets/dashboardImage1.png";
import dashboardImage2 from "../assets/dashboardImage2.png";
import dashboardImage3 from "../assets/dashboardImage3.png";
import discoverImage1 from "../assets/discoverImage1.png";
import discoverImage2 from "../assets/discoverImage2.png";
import discoverImage3 from "../assets/discoverImage3.png";
import canvasImage1 from "../assets/canvasImage1.png";
import canvasImage2 from "../assets/canvasImage2.png";
import mapImage from "../assets/mapImage.png";

export default function Analytics() {
  return (
    <div className="p-8 bg-[#030712] text-white min-h-screen font-sans">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 bg-[#1e293b]/50 px-4 py-2 rounded-full text-sm hover:bg-gray-700 transition-all border border-gray-800">
            <Settings size={16} /> <span>Manage</span>
          </button>
          <button className="flex items-center gap-2 bg-[#1e293b]/50 px-4 py-2 rounded-full text-sm hover:bg-gray-700 transition-all border border-gray-800">
            <Wrench size={16} /> <span>Dev tools</span>
          </button>
          <button className="flex items-center gap-2 bg-[#1e293b]/50 px-4 py-2 rounded-full text-sm hover:bg-gray-700 transition-all border border-gray-800">
            <PlusCircle size={16} /> <span>Add integrations</span>
          </button>
        </div>
      </div>

      {/* 2. Top Large Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Card 1: Discover */}
        <div className="group bg-[#0b1120] border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all">
          <div className="p-4 grid grid-cols-2 grid-rows-2 gap-2 h-[280px]">
            <div className="col-span-1 row-span-2 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
               <img src={discoverImage1} alt="img1" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
               <img src={discoverImage2} alt="img2" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
               <img src={discoverImage3} alt="img3" className="w-full h-full object-cover opacity-80" />
            </div>
          </div>
          <div className="p-5 border-t border-gray-800 bg-[#0f172a]">
            <h3 className="text-lg font-semibold">Discover</h3>
            <p className="text-gray-400 text-sm">Model, Predict, and detect.</p>
          </div>
        </div>

        {/* Card 2: Dashboard */}
        <div className="group bg-[#0b1120] border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all">
          <div className="p-4 flex flex-col gap-2 h-[280px]">
            <div className="h-1/2 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
               <img src={dashboardImage1} alt="img4" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="h-1/2 flex gap-2">
               <div className="w-1/2 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                  <img src={dashboardImage2} alt="img5" className="w-full h-full object-cover opacity-80" />
               </div>
               <div className="w-1/2 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                  <img src={dashboardImage3} alt="img6" className="w-full h-full object-cover opacity-80" />
               </div>
            </div>
          </div>
          <div className="p-5 border-t border-gray-800 bg-[#0f172a]">
            <h3 className="text-lg font-semibold">Dashboard</h3>
            <p className="text-gray-400 text-sm">Analyze data in dashboards.</p>
          </div>
        </div>
      </div>

      {/* 3. Bottom Cards Section (Centered) */}
      <div className="flex flex-col md:flex-row justify-center gap-8">
        
        {/* Card 3: Canvas (The one with 2 Images) */}
        <div className="group w-full md:w-[350px] bg-[#0b1120] border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all text-center">
          <div className="h-48 p-3 flex gap-2">
            <div className="w-1/2 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
               <img src={canvasImage1} alt="img7" className="w-full h-full object-cover opacity-70" />
            </div>
            <div className="w-1/2 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
               <img src={canvasImage2} alt="img8" className="w-full h-full object-cover opacity-70" />
            </div>
          </div>
          <div className="p-4 bg-[#0f172a] border-t border-gray-800">
            <h4 className="font-bold">Canvas</h4>
            <p className="text-xs text-gray-400 mt-1">Design pixel-perfect presentations.</p>
          </div>
        </div>

        {/* Card 4: Maps */}
        <div className="group relative w-full md:w-[350px] bg-[#0b1120] border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all text-center">
          <div className="h-48">
             <img src={mapImage} alt="map" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
             <div className="absolute top-2 right-2 bg-black/60 text-[10px] px-2 py-1 rounded border border-gray-700">Coming Soon</div>
          </div>
          <div className="p-4 bg-[#0f172a] border-t border-gray-800">
            <h4 className="font-bold">Maps</h4>
            <p className="text-xs text-gray-400 mt-1">Plot geographic data.</p>
          </div>
        </div>

      </div>
    </div>
  );
}