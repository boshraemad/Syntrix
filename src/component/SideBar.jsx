import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaHome, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineAnalytics, MdOutlineSecurity, MdSettings } from "react-icons/md";
import { TbTelescope } from "react-icons/tb";
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';

export default function SideBar({ isOpen, onClose }) {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();
  const sidebarRef = useRef(null);

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
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
      path: '/Analytics',
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
        { name: "Logs", path: "/observability/logs" },
        { name: "Hosts", path: "/observability/hosts" }
      ] 
    },
    {
      title: "Security",
      path: '/security',
      icon: <MdOutlineSecurity />,
      subLinks: [
        { name: "Detection", path: "/security/detection" },
        { name: "Alerts", path: "/security/alerts" }
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
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-background z-50 transition-all duration-300 ${isOpen ? 'w-72' : 'w-0'} overflow-hidden 
        border-r border-slate-200 dark:border-[#dadada]/5`}
      > 
        <div className="p-4 flex flex-col h-full w-72">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-white/5 pb-4">
            <Link to="/" className="px-2 hover:opacity-80 transition-opacity">
              <img src={logoImg} alt="Syntrix" className="h-24 object-contain" />
            </Link>
            <IoCloseOutline 
              className="text-3xl cursor-pointer text-gray-400 dark:text-white/50 hover:text-cyan-400 transition-all" 
              onClick={onClose} 
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
                    className={`flex items-center justify-between p-3 rounded-sm cursor-pointer transition-all 
                      ${active ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : 'hover:bg-purple-500/10 border-l-2 border-transparent'}`}
                  >
                    <Link
                      to={item.path || "#"} 
                      onClick={() => hasSubMenu && toggleSubMenu(item.title)}
                      className="flex items-center gap-3 flex-1"
                    >
                      <span className={`text-xl ${active ? 'text-cyan-400' : 'text-slate-400 dark:text-gray-500'}`}>{item.icon}</span>
                      <span className={`font-medium ${active ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-gray-500'}`}>{item.title}</span>
                    </Link>
                    
                    {hasSubMenu && (
                      <div 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSubMenu(item.title);
                        }}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md transition-all"
                      >
                        {openSubMenu === item.title ? 
                          <FaChevronDown className="text-xs text-slate-800 dark:text-white" /> : 
                          <FaChevronRight className="text-xs text-slate-400 dark:text-gray-500" />
                        }
                      </div>
                    )}
                  </div>

                  {/* Submenu */}
                  {hasSubMenu && openSubMenu === item.title && (
                    <div className="ml-9 mt-2 flex flex-col gap-1 border-l border-slate-200 dark:border-white/10 pl-4 transition-all">
                      {item.subLinks.map((sub, idx) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link 
                            key={idx} 
                            to={sub.path}
                            className={`text-sm py-2 px-2 rounded-sm transition-colors 
                              ${isSubActive ? 'text-cyan-400 bg-cyan-500/10 font-semibold' : 'text-slate-600 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white'}`}
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
          <button className="mt-auto cursor-pointer bg-gradient-to-r from-purple-500 to-cyan-500 text-white w-full py-2.5 rounded-sm font-bold flex items-center justify-center gap-2 transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] uppercase tracking-wider text-xs">
            <span className="text-lg">+</span> Add integration
          </button>
        </div>
      </div>
    </>
  );
}