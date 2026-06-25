// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, PlusSquare, Database, Calendar } from 'lucide-react';
// import { ListPlus , Search , Filter ,  } from 'lucide-react';
// export default function DiscoverSideBar() {
//   const [selectedFilters, setSelectedFilters] = useState([]);
  
//   // حالة لفتح وإغلاق القوائم (Accordion state)
//   const [openSections, setOpenSections] = useState({ popular: true, available: true });

//   const popularFields = ["agent.hostname", "agent.version"];
//   const availableFields = [
//     { name: "@timestamp", type: "date" },
//     { name: "agent.ephemeral_id", type: "string" },
//     { name: "agent.hostname", type: "string" },
//     { name: "agent.id", type: "string" },
//     { name: "agent.name", type: "string" },
//     { name: "agent.type", type: "string" },
//     { name: "agent.version", type: "string" },
//     { name: "data_stream.dataset", type: "string" },
//     { name: "data_stream.namespace", type: "string" },
//     { name: "data_stream.type", type: "string" },
//     { name: "ecs.version", type: "string" },
//     { name: "error.message", type: "string" },
//     { name: "event.action", type: "string" },
//     { name: "event.code", type: "string" },
//     { name: "event.created", type: "date" },
//     { name: "event.kind", type: "string" },
//     { name: "event.outcome", type: "string" },
//     { name: "event.provider", type: "string" },
//     { name: "host.name", type: "string" },
//     { name: "log.level", type: "string" },
//     { name: "message", type: "string" },
//   ];

//   // دالة لإضافة أو إزالة الفلتر عند الضغط عليه
//   const toggleFilter = (filterName) => {
//     setSelectedFilters((prev) =>
//       prev.includes(filterName)
//         ? prev.filter((item) => item !== filterName) // إزالة إذا كان موجوداً
//         : [...prev, filterName] // إضافة إذا لم يكن موجوداً
//     );
//   };

//   return (
//     <aside className="col-span-2 h-full bg-primary border-r border-white/10 flex flex-col overflow-hidden">
      
//       {/* 1. منطقة البحث العلوية */}
//       <div className="p-3 flex gap-2 items-center">
//         {/* أيقونة التبديل الصغيرة */}
//         <button className="p-1.5 border border-white/20 rounded hover:bg-white/5 cursor-pointer">
//           <ListPlus size={16} />
//         </button>
        
//         {/* حقل البحث */}
//         <div className="relative flex-1">
//           <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
//           <input 
//             type="text" 
//             placeholder="Search field names" 
//             className="w-full bg-transparent border border-white/20 rounded py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:border-third/50"
//           />
//         </div>

//         {/* أيقونة الفلتر الزرقاء */}
//         <button className="bg-button/80 p-1.5 rounded flex items-center gap-1 cursor-pointer hover:bg-button">
//           <Filter size={14} />
//           <span className="text-xs">0</span>
//         </button>
//       </div>

//       {/* 2. قائمة التصنيفات (Fields Categories) */}
//       <div className="w-64 bg-[#030712] h-screen text-gray-300 p-4 font-sans border-r border-gray-800 overflow-y-auto">
      
//       {/* Popular Fields Section */}
//       <div className="mb-6">
//         <div 
//           className="flex items-center justify-between cursor-pointer mb-3 hover:text-white"
//           onClick={() => setOpenSections(prev => ({ ...prev, popular: !prev.popular }))}
//         >
//           <div className="flex items-center gap-2">
//             {openSections.popular ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
//             <span className="text-sm font-semibold">Popular fields</span>
//           </div>
//           <span className="bg-gray-800 text-xs px-2 py-0.5 rounded-full">2</span>
//         </div>

//         {openSections.popular && (
//           <div className="space-y-2 ml-6">
//             {popularFields.map((field) => (
//               <div 
//                 key={field}
//                 onClick={() => toggleFilter(field)}
//                 className={`flex items-center gap-2 text-sm cursor-pointer hover:text-third transition-colors ${selectedFilters.includes(field) ? 'text-third font-bold' : ''}`}
//               >
//                 <div className="bg-gray-800 p-1 rounded text-[10px] font-bold">k</div>
//                 {field}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Available Fields Section */}
//       <div>
//         <div 
//           className="flex items-center justify-between cursor-pointer mb-3 hover:text-white"
//           onClick={() => setOpenSections(prev => ({ ...prev, available: !prev.available }))}
//         >
//           <div className="flex items-center gap-2">
//             {openSections.available ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
//             <span className="text-sm font-semibold">Available fields</span>
//           </div>
//           <span className="bg-gray-800 text-[10px] px-2 py-0.5 rounded-full">534</span>
//         </div>

//         {openSections.available && (
//           <div className="space-y-2 ml-6 mb-6">
//             {availableFields.map((field) => (
//               <div 
//                 key={field.name}
//                 onClick={() => toggleFilter(field.name)}
//                 className={`flex items-center gap-2 text-sm cursor-pointer hover:text-third transition-colors ${selectedFilters.includes(field.name) ? 'text-third font-bold' : ''}`}
//               >
//                 <div className="bg-gray-800/50 p-1 rounded">
//                   {field.icon}
//                 </div>
//                 {field.name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Add a field Button */}
//       <button className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-700 rounded-md py-2 text-sm font-medium hover:bg-gray-800 transition-all active:scale-95">
//         <PlusSquare size={18} />
//         Add a field
//       </button>

//       {/* عرض الفلاتر المختارة للتأكد (يمكنك حذفه لاحقاً) */}
//       <div className="mt-8 pt-4 border-t border-gray-800">
//         <p className="text-[10px] uppercase text-gray-500 mb-2">Active Filters:</p>
//         <div className="flex flex-wrap gap-1">
//           {selectedFilters.map(f => (
//             <span key={f} className="bg-third text-font text-[10px] px-2 py-1 rounded">
//               {f}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//     </aside>
//   );
// }




// src/components/DiscoverSideBar.jsx
import { useState } from "react";
import { ChevronDown, ChevronRight, Search, Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_ICON_MAP = {
  date: { label: "t", color: "text-yellow-400" },
  keyword: { label: "#", color: "text-blue-400" },
  text: { label: "t", color: "text-green-400" },
  ip: { label: "IP", color: "text-purple-400" },
  long: { label: "#", color: "text-orange-400" },
  _id: { label: "_", color: "text-gray-400" },
  _index: { label: "_", color: "text-gray-400" },
  _score: { label: "_", color: "text-gray-400" },
  _source: { label: "_", color: "text-gray-400" },
  _type: { label: "_", color: "text-gray-400" },
  _version: { label: "_", color: "text-gray-400" },
  _seq_no: { label: "_", color: "text-gray-400" },
  _primary_term: { label: "_", color: "text-gray-400" },
  _routing: { label: "_", color: "text-gray-400" },
};

function FieldTypeIcon({ type }) {
  const config = TYPE_ICON_MAP[type] || { label: "?", color: "text-gray-400" };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold border border-gray-600 flex-shrink-0",
        config.color
      )}
    >
      {config.label}
    </span>
  );
}

function FieldItem({ field, onAdd }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center gap-2 px-2 py-[3px] rounded cursor-pointer hover:bg-gray-700/50 group text-xs"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <FieldTypeIcon type={field.type} />
      <span className="text-gray-300 truncate flex-1">{field.name}</span>
      {hovered && (
        <button
          onClick={() => onAdd?.(field.name)}
          className="text-blue-400 hover:text-blue-300 flex-shrink-0"
          title="Add field as column"
        >
          <Plus size={12} />
        </button>
      )}
    </div>
  );
}

function CollapsibleSection({ title, count, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 w-full px-2 py-1.5 text-xs font-semibold text-gray-300 hover:text-white"
      >
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        <span className="flex-1 text-left">{title}</span>
        {badge !== undefined && (
          <span className="bg-gray-700 text-gray-300 rounded px-1.5 py-0.5 text-[10px] min-w-[22px] text-center">
            {badge}
          </span>
        )}
      </button>
      {open && <div className="mt-0.5">{children}</div>}
    </div>
  );
}

export default function DiscoverSideBar({ fields, onAddField }) {
  const [search, setSearch] = useState("");
  const [filterCount] = useState(0);

  const filterFields = (list) =>
    list.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <aside className="w-56 min-w-[210px] bg-[#111216] border-r border-gray-700/60 flex flex-col h-full overflow-hidden">
      {/* Field search */}
      <div className="p-2 border-b border-gray-700/60 flex items-center gap-1.5">
        <div className="flex-1 flex items-center gap-1.5 bg-gray-800 border border-gray-600/50 rounded px-2 py-1">
          <Search size={12} className="text-gray-500 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search field names"
            className="bg-transparent text-xs text-gray-300 placeholder-gray-600 outline-none w-full"
          />
        </div>
        <button className="relative flex items-center justify-center w-7 h-7 rounded border border-gray-600/50 bg-gray-800 text-gray-400 hover:text-white hover:border-gray-500">
          <Filter size={12} />
          {filterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>
      </div>

      {/* Scrollable field list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent py-2 px-1">
        <CollapsibleSection
          title="Popular fields"
          badge={fields.popular.length}
          defaultOpen
        >
          {filterFields(fields.popular).map((f) => (
            <FieldItem key={f.name} field={f} onAdd={onAddField} />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="Available fields"
          badge={fields.available.length}
          defaultOpen
        >
          {filterFields(fields.available).map((f) => (
            <FieldItem key={f.name} field={f} onAdd={onAddField} />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="Empty fields"
          badge={fields.empty.length}
        >
          {filterFields(fields.empty).map((f) => (
            <FieldItem key={f.name} field={f} onAdd={onAddField} />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="Meta fields"
          badge={fields.meta.length}
        >
          {filterFields(fields.meta).map((f) => (
            <FieldItem key={f.name} field={f} onAdd={onAddField} />
          ))}
        </CollapsibleSection>
      </div>

      {/* Add a field */}
      <div className="p-2 border-t border-gray-700/60">
        <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-blue-400 px-2 py-1.5 rounded hover:bg-gray-700/50 w-full">
          <Plus size={13} />
          Add a field
        </button>
      </div>
    </aside>
  );
}
