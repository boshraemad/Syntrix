import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlusSquare, Search, Filter, ListPlus } from 'lucide-react';

export default function DiscoverSideBar() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  
  // حالة لفتح وإغلاق القوائم (Accordion state)
  const [openSections, setOpenSections] = useState({ popular: true, available: true });

  const popularFields = ["agent.hostname", "agent.version"];
  const availableFields = [
    { name: "@timestamp", type: "date" },
    { name: "agent.ephemeral_id", type: "string" },
    { name: "agent.hostname", type: "string" },
    { name: "agent.id", type: "string" },
    { name: "agent.name", type: "string" },
    { name: "agent.type", type: "string" },
    { name: "agent.version", type: "string" },
    { name: "data_stream.dataset", type: "string" },
    { name: "data_stream.namespace", type: "string" },
    { name: "data_stream.type", type: "string" },
    { name: "ecs.version", type: "string" },
    { name: "error.message", type: "string" },
    { name: "event.action", type: "string" },
    { name: "event.code", type: "string" },
    { name: "event.created", type: "date" },
    { name: "event.kind", type: "string" },
    { name: "event.outcome", type: "string" },
    { name: "event.provider", type: "string" },
    { name: "host.name", type: "string" },
    { name: "log.level", type: "string" },
    { name: "message", type: "string" },
  ];

  // دالة لإضافة أو إزالة الفلتر عند الضغط عليه
  const toggleFilter = (filterName) => {
    setSelectedFilters((prev) =>
      prev.includes(filterName)
        ? prev.filter((item) => item !== filterName) // إزالة إذا كان موجوداً
        : [...prev, filterName] // إضافة إذا لم يكن موجوداً
    );
  };

  return (
    <aside className="col-span-2 h-full bg-primary border-r border-white/10 flex flex-col overflow-hidden">
      
      {/* 1. منطقة البحث العلوية */}
      <div className="p-3 flex gap-2 items-center">
        {/* أيقونة التبديل الصغيرة */}
        <button className="p-1.5 border border-white/20 rounded hover:bg-white/5 cursor-pointer">
          <ListPlus size={16} />
        </button>
        
        {/* حقل البحث */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input 
            type="text" 
            placeholder="Search field names" 
            className="w-full bg-transparent border border-white/20 rounded py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:border-third/50"
          />
        </div>

        {/* أيقونة الفلتر الزرقاء */}
        <button className="bg-button/80 p-1.5 rounded flex items-center gap-1 cursor-pointer hover:bg-button">
          <Filter size={14} />
          <span className="text-xs">0</span>
        </button>
      </div>

      {/* 2. قائمة التصنيفات (Fields Categories) */}
      <div className="w-64 bg-[#030712] h-screen text-gray-300 p-4 font-sans border-r border-gray-800 overflow-y-auto">
      
        {/* Popular Fields Section */}
        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-3 hover:text-white"
            onClick={() => setOpenSections(prev => ({ ...prev, popular: !prev.popular }))}
          >
            <div className="flex items-center gap-2">
              {openSections.popular ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              <span className="text-sm font-semibold">Popular fields</span>
            </div>
            <span className="bg-gray-800 text-xs px-2 py-0.5 rounded-full">2</span>
          </div>

          {openSections.popular && (
            <div className="space-y-2 ml-6">
              {popularFields.map((field) => (
                <div 
                  key={field}
                  onClick={() => toggleFilter(field)}
                  className={`flex items-center gap-2 text-sm cursor-pointer hover:text-third transition-colors ${selectedFilters.includes(field) ? 'text-third font-bold' : ''}`}
                >
                  <div className="bg-gray-800 p-1 rounded text-[10px] font-bold">k</div>
                  {field}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Fields Section */}
        <div>
          <div 
            className="flex items-center justify-between cursor-pointer mb-3 hover:text-white"
            onClick={() => setOpenSections(prev => ({ ...prev, available: !prev.available }))}
          >
            <div className="flex items-center gap-2">
              {openSections.available ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              <span className="text-sm font-semibold">Available fields</span>
            </div>
            <span className="bg-gray-800 text-[10px] px-2 py-0.5 rounded-full">534</span>
          </div>

          {openSections.available && (
            <div className="space-y-2 ml-6 mb-6">
              {availableFields.map((field) => (
                <div 
                  key={field.name}
                  onClick={() => toggleFilter(field.name)}
                  className={`flex items-center gap-2 text-sm cursor-pointer hover:text-third transition-colors ${selectedFilters.includes(field.name) ? 'text-third font-bold' : ''}`}
                >
                  <div className="bg-gray-800/50 p-1 rounded text-[10px] font-bold">
                    {field.type[0]}
                  </div>
                  {field.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add a field Button */}
        <button className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-700 rounded-md py-2 text-sm font-medium hover:bg-gray-800 transition-all active:scale-95">
          <PlusSquare size={18} />
          Add a field
        </button>

        {/* عرض الفلاتر المختارة للتأكد */}
        <div className="mt-8 pt-4 border-t border-gray-800">
          <p className="text-[10px] uppercase text-gray-500 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-1">
            {selectedFilters.map(f => (
              <span key={f} className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}