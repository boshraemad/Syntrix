// import React, { useState } from 'react';
// import { LuFilter, LuPlus, LuSearch, LuCalendarDays, LuRefreshCw } from "react-icons/lu";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function DiscoverBottom() {
//   const [startDate, setStartDate] = useState(new Date("2026-12-10T01:44:20"));
//   const [endDate, setEndDate] = useState(new Date("2026-12-10T01:44:21"));
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleRefresh = () => {
//     // هنا نتأكد أن القيم المحدثة هي التي تظهر في الكونسول
//     console.log("Current Start Date:", startDate);
//     console.log("Current End Date:", endDate);
//     alert(`Filtering from: ${startDate.toLocaleString()} to ${endDate.toLocaleString()}`);
//   };

//   return (
//     <div className="w-full bg-[#020617] border-y border-white/5 p-2 flex items-center gap-2 font-poppins text-sm">
      
//       {/* الأزرار الجانبية */}
//       <div className="flex border border-white/10 rounded-md overflow-hidden bg-white/5">
//         <button className="p-2 hover:bg-white/10 text-gray-400 border-r border-white/10 transition-colors">
//           <LuFilter size={18} />
//         </button>
//         <button className="p-2 hover:bg-white/10 text-gray-400 transition-colors">
//           <LuPlus size={18} />
//         </button>
//       </div>

//       {/* حقل البحث */}
//       <div className="flex-1 relative group">
//         <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
//         <input 
//           type="text" 
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Filter your data using KQL syntax"
//           className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
//         />
//       </div>

//       {/* منطقة اختيار التاريخ والوقت */}
//       <div className="flex items-center border border-white/10 rounded-md bg-white/5 relative">
//         <div className="p-2 bg-indigo-900/30 text-indigo-400 border-r border-white/10">
//           <LuCalendarDays size={18} />
//         </div>
        
//         <div className="flex items-center px-2 gap-1 text-gray-300">
//           <DatePicker
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             showTimeSelect
//             timeFormat="HH:mm:ss"
//             timeIntervals={1} // يسمح باختيار دقيق جداً
//             dateFormat="MMM d, yyyy @ HH:mm:ss"
//             className="bg-transparent outline-none w-[175px] cursor-pointer hover:text-white text-center py-1"
//             popperPlacement="bottom-end"
//             popperModifiers={[{ name: 'preventOverflow', options: { boundary: 'viewport' } }]}
//           />
//           <span className="text-gray-600 font-bold">→</span>
//           <DatePicker
//             selected={endDate}
//             onChange={(date) => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//             showTimeSelect
//             timeFormat="HH:mm:ss"
//             timeIntervals={1}
//             dateFormat="MMM d, yyyy @ HH:mm:ss"
//             className="bg-transparent outline-none w-[175px] cursor-pointer hover:text-white text-center py-1"
//             popperPlacement="bottom-end"
//           />
//         </div>
//       </div>

//       {/* زر التحديث */}
//       <button 
//         onClick={handleRefresh}
//         className="flex items-center gap-2 bg-indigo-600/90 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-all font-medium shadow-lg shadow-indigo-500/20 active:scale-95 cursor-pointer"
//       >
//         <LuRefreshCw size={16} />
//         <span>Refresh</span>
//       </button>

//       {/* تحسين الـ Dark Mode للـ Picker وتعديل الـ Z-Index */}
//       <style>{`
//         .react-datepicker-popper {
//           z-index: 9999 !important;
//         }
//         .react-datepicker {
//           background-color: #0f172a !important;
//           border: 1px solid #334155 !important;
//           border-radius: 8px !important;
//           font-family: inherit !important;
//           box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
//         }
//         .react-datepicker__header {
//           background-color: #1e293b !important;
//           border-bottom: 1px solid #334155 !important;
//         }
//         .react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker__time-name {
//           color: #f8fafc !important;
//         }
//         .react-datepicker__day {
//           color: #cbd5e1 !important;
//         }
//         .react-datepicker__day:hover {
//           background-color: #4f46e5 !important;
//           color: white !important;
//         }
//         .react-datepicker__day--selected, .react-datepicker__day--in-range {
//           background-color: #4338ca !important;
//           color: white !important;
//         }
//         .react-datepicker__time-container {
//           border-left: 1px solid #334155 !important;
//           background-color: #0f172a !important;
//           width: 85px !important;
//         }
//         .react-datepicker__time-box {
//             width: 85px !important;
//         }
//         .react-datepicker__time-list-item {
//           color: #cbd5e1 !important;
//           background-color: #0f172a !important;
//         }
//         .react-datepicker__time-list-item:hover {
//           background-color: #4f46e5 !important;
//         }
//         .react-datepicker__input-container input {
//           color: #e2e8f0 !important;
//         }
//       `}</style>
//     </div>
//   );
// }



// src/components/DiscoverNavbar2.jsx
import { RefreshCw, Save, ChevronDown, Calendar } from "lucide-react";

const NAV_ACTIONS = ["New", "Open", "Share", "Alerts", "Inspect"];

export default function DiscoverNavbar2({ onRefresh }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2  border-b border-gray-700/60">
      {/* Left side: hamburger + Discover badge */}
      <button className="p-1.5 rounded hover:bg-gray-700/50 text-gray-400 hover:text-white">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect y="3" width="16" height="1.5" rx="0.75" />
          <rect y="7.25" width="16" height="1.5" rx="0.75" />
          <rect y="11.5" width="16" height="1.5" rx="0.75" />
        </svg>
      </button>
      <button className="px-3 py-1 text-xs text-gray-300 bg-gray-700/60 border border-gray-600/50 rounded hover:bg-gray-600/60">
        Discover
      </button>

      <div className="flex-1" />

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        {NAV_ACTIONS.map((action) => (
          <button
            key={action}
            className="px-3 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-700/50 rounded transition-colors"
          >
            {action}
          </button>
        ))}
        <button
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded border border-blue-500 transition-colors"
        >
          <Save size={12} />
          Save
        </button>
      </div>
    </div>
  );
}
