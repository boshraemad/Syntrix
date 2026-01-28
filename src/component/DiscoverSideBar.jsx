import React from 'react';
import { Search, ChevronRight, ListPlus, Filter } from 'lucide-react'; // استخدم أي مكتبة أيقونات تفضلها

export default function DiscoverSideBar() {
  const fieldCategories = [
    { name: "Popular fields", count: 8 },
    { name: "Available fields", count: 534 },
    { name: "Empty fields", count: 1023 },
    { name: "Meta fields", count: 9 },
  ];

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
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {fieldCategories.map((cat, index) => (
          <div 
            key={index} 
            className="group flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChevronRight size={14} className="text-gray-500 group-hover:text-white" />
              <span className="text-sm font-medium">{cat.name}</span>
            </div>
            <span className="bg-second/50 text-[10px] px-2 py-0.5 rounded-full text-gray-300">
              {cat.count}
            </span>
          </div>
        ))}
      </div>

      {/* 3. زر إضافة حقل (Add a field) - ثابت في الأسفل */}
      <div className="p-3 border-t border-white/10">
        <button className="w-full flex items-center justify-center gap-2 border border-white/10 py-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
          <ListPlus size={16} />
          <span className="text-sm font-bold">Add a field</span>
        </button>
      </div>
    </aside>
  );
}