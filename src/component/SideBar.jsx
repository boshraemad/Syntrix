import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaHome, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineAnalytics, MdOutlineSecurity, MdSettings } from "react-icons/md";
import { TbTelescope } from "react-icons/tb";
import { Link, useLocation } from 'react-router-dom';

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();
  const sidebarRef = useRef(null);

  // 1. إغلاق القائمة عند تغيير المسار
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // 2. إغلاق القائمة عند الضغط في أي مكان خارج الـ Sidebar
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    { title: "Home", path: "/", icon: <FaHome /> },
    { 
      title: "Analytics", 
      path: '/Analytics', // المسار الذي سيتم التوجه إليه عند الضغط
      icon: <MdOutlineAnalytics />,
      subLinks: [
        { name: "Discover", path: "/discover" },
        { name: "Dashboards", path: "/dashboards" },
        { name: "Canvas", path: "/canvas" },
        { name: "Maps", path: "/maps" },
        { name: "Machine Learning", path: "/machine-learning" },
        { name: "Visualize Library", path: "/visualize-library" }
      ]
    },
    { 
      title: "Observability", 
      path: '/observability',
      icon: <TbTelescope />, 
      subLinks: [
        { name: "Logs", path: "/logs" },
        { name: "Metrics", path: "/metrics" }
      ] 
    },
    { 
      title: "Security", 
      path: '/security',
      icon: <MdOutlineSecurity />, 
      subLinks: [
        { name: "Overview", path: "/overview" },
        { name: "Detections", path: "/detections" }
      ] 
    },
    { title: "Setting", path: "/setting", icon: <MdSettings /> },
  ];

  const isParentActive = (item) => {
    if (item.path === location.pathname) return true;
    if (item.subLinks) {
      return item.subLinks.some(sub => sub.path === location.pathname);
    }
    return false;
  };

  const toggleSubMenu = (title) => {
    setOpenSubMenu(openSubMenu === title ? null : title);
  };

  return (
    <>
      {/* زر الفتح */}
      {!isOpen && (
        <div className="p-4 fixed top-15 left-0 z-30">
          <FaBars 
            className="text-2xl cursor-pointer text-white hover:text-third transition-colors" 
            onClick={() => setIsOpen(true)} 
          />
        </div>
      )}

      {/* --- Sidebar --- */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-[#020617] z-50 transition-all duration-300 ${isOpen ? 'w-72' : 'w-0'} overflow-hidden 
        border-r border-third/40 
        shadow-[5px_0_25px_-5px_rgba(var(--third-rgb),0.4)]`}
      > 
        
        <div className="p-4 flex flex-col h-full w-72">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-third bg-clip-text text-transparent px-2">
              Syntrix
            </h2>
            <IoCloseOutline 
              className="text-3xl cursor-pointer text-white/50 hover:text-white transition-all" 
              onClick={() => setIsOpen(false)} 
            />
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item, index) => {
              const active = isParentActive(item);
              const hasSubMenu = !!item.subLinks;
              
              return (
                <div key={index} className="mb-2">
                  <div 
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all 
                      ${active ? 'bg-third/20 border border-third/50 shadow-[0_0_15px_rgba(var(--third-rgb),0.2)]' : 'hover:bg-white/5'}`}
                  >
                    {/* اللينك الأساسي للقسم */}
                    <Link 
                      to={item.path || "#"} 
                      onClick={() => hasSubMenu && toggleSubMenu(item.title)}
                      className="flex items-center gap-3 flex-1"
                    >
                      <span className={`text-xl ${active ? 'text-third' : 'text-white/70'}`}>{item.icon}</span>
                      <span className={`font-medium ${active ? 'text-white' : 'text-gray-400'}`}>{item.title}</span>
                    </Link>
                    
                    {/* سهم لفتح القائمة الفرعية بشكل منفصل لمنع الانتقال للصفحة عند الضغط عليه فقط */}
                    {hasSubMenu && (
                      <div 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSubMenu(item.title);
                        }}
                        className="p-1 hover:bg-white/10 rounded-md transition-all"
                      >
                        {openSubMenu === item.title ? 
                          <FaChevronDown className="text-xs text-third" /> : 
                          <FaChevronRight className="text-xs text-white/40" />
                        }
                      </div>
                    )}
                  </div>

                  {/* القائمة الفرعية */}
                  {hasSubMenu && openSubMenu === item.title && (
                    <div className="ml-9 mt-2 flex flex-col gap-1 border-l border-third/20 pl-4 transition-all">
                      {item.subLinks.map((sub, idx) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link 
                            key={idx} 
                            to={sub.path}
                            className={`text-sm py-2 px-2 rounded-md transition-colors 
                              ${isSubActive ? 'text-third bg-third/5 font-bold' : 'text-gray-500 hover:text-third/80'}`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom Action */}
          <button className="mt-auto cursor-pointer bg-white text-[#020617] w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-third hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <span className="text-xl">+</span> Add integration
          </button>
        </div>
      </div>
    </>
  );
}