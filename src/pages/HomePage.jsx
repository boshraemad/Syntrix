import React, { useState } from 'react';
import { FaBars, FaHome, FaChevronRight } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5"; // أيقونة القفل
import { MdOutlineAnalytics, MdOutlineSecurity, MdSettings } from "react-icons/md";
import { TbTelescope } from "react-icons/tb"; // أيقونة Observability

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false); // حالة القائمة الجانبية

  const features = [
    { title: "Observability", desc: "Consolidate your logs, metrics, application traces, and system availability with purpose-built UIs." },
    { title: "Security", desc: "Prevent, collect, detect, and respond to threats for unified protection across your infrastructure." },
    { title: "Analytics", desc: "Explore, visualize, and analyze your data using a powerful suite of analytical tools and applications." }
  ];

  // بيانات القائمة الجانبية
  const menuItems = [
    { title: "Home", icon: <FaHome />, active: true },
    { title: "Analytics", icon: <MdOutlineAnalytics /> },
    { title: "Observability", icon: <TbTelescope /> },
    { title: "Security", icon: <MdOutlineSecurity /> },
    { title: "Setting", icon: <MdSettings /> },
  ];

  return (
    <div className="min-h-screen bg-primary text-white p-8 relative overflow-x-hidden">
      
      {/* --- Sidebar (Toggle Menu) --- */}
      <div className={`fixed top-0 left-0 h-full bg-primary border-r border-white/10 z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="p-4 flex flex-col h-full">
          {/* رأس القائمة */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold px-2">Syntrix</h2>
            <IoCloseOutline className="text-2xl cursor-pointer hover:text-third " onClick={() => setIsOpen(false)} />
          </div>

          {/* روابط القائمة */}
          <nav className="flex-1">
            {menuItems.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg mb-2 cursor-pointer transition-all ${item.active ? 'bg-white/5 border border-third/50' : 'hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl text-white/70">{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </div>
                <FaChevronRight className="text-xs text-white/40" />
              </div>
            ))}
          </nav>

          {/* الزرار السفلي في القائمة */}
          <button className="mt-auto cursor-pointer  bg-white text-primary w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-200">
            <span className="text-lg ">+</span> Add integration
          </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      {/* أيقونة فتح القائمة */}
      <FaBars className="text-2xl mb-3 cursor-pointer hover:text-third transition-colors" onClick={() => setIsOpen(true)} />

      <div className='px-[50px]'>
        <h1 className="text-3xl font-bold mb-12">Welcome home</h1>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-second/40 border border-white/10 rounded-2xl p-10 flex flex-col items-center text-center hover:bg-second/60 transition-all cursor-pointer group"
            >
              <div className="w-full h-40 bg-gradient-to-b from-third/50 to-transparent rounded-xl mb-6 group-hover:from-third/70 transition-all"></div>
              <h2 className="text-xl font-bold mb-4">{feature.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <hr className="border-white/10 mb-16" />

        {/* Get Started Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Get started by adding integrations</h2>
          <p className="text-gray-400 max-w-xl mb-10 leading-relaxed">
            To start working with your data, use one of our many ingest options. 
            Collect data from an app or service, or upload a file.
          </p>

          <div className="flex flex-wrap gap-6 items-center">
            <button className="bg-white cursor-pointer text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all">
              <span className="text-xl">+</span> Add integration
            </button>
            <button className="flex items-center cursor-pointer gap-2 text-white font-semibold hover:text-third transition-all">Try sample data</button>
            <button className="flex items-center gap-2 cursor-pointer text-white font-semibold hover:text-third transition-all">Upload a file</button>
          </div>
        </div>
      </div>

      {/* خلفية معتمة عند فتح القائمة (Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
}