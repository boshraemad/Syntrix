import React from 'react'
import { useState } from 'react'
import { FaBars, FaHome, FaChevronRight } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5"; // أيقونة القفل
import { MdOutlineAnalytics, MdOutlineSecurity, MdSettings } from "react-icons/md";
import { TbTelescope } from "react-icons/tb"; // أيقونة Observability
import { Link } from 'react-router-dom';
export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false); 
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
              <Link 
                to={`/${item.title === "Home" ? "/" : item.title}`}
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg mb-2 cursor-pointer transition-all ${item.active ? 'bg-white/5 border border-third/50' : 'hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl text-white/70">{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </div>
                <FaChevronRight className="text-xs text-white/40" />
              </Link>
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
              {/* خلفية معتمة عند فتح القائمة (Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  )
}
