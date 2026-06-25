// src/components/KqlSearchBar.jsx
import { useState } from "react";
import { Search, Filter, Plus, Calendar, ChevronDown, RefreshCw } from "lucide-react";

export default function KqlSearchBar({ query, onChange, dateFrom, dateTo, onRefresh }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="px-3 py-2  border-b border-gray-700/60 space-y-2">
      {/* Row 1: filter icons + KQL input + date + refresh */}
      <div className="flex items-center gap-2">
        {/* Filter controls */}
        <button className="p-1.5 rounded border border-gray-600/50 bg-gray-800 text-gray-400 hover:text-white hover:border-gray-500 flex-shrink-0">
          <Filter size={14} />
        </button>
        <button className="p-1.5 rounded border border-gray-600/50 bg-gray-800 text-gray-400 hover:text-white hover:border-gray-500 flex-shrink-0">
          <Plus size={14} />
        </button>

        {/* KQL input */}
        <div
          className={`flex-1 flex items-center gap-2 rounded border px-3 py-1.5 bg-gray-800 transition-colors ${
            focused ? "border-blue-500/70" : "border-gray-600/50"
          }`}
        >
          <Search size={14} className="text-gray-500 flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Filter your data using KQL syntax"
            className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none font-mono"
          />
        </div>

        {/* Date range */}
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-gray-600/50 bg-gray-800 text-xs text-gray-300 hover:border-gray-500 hover:text-white flex-shrink-0">
          <Calendar size={13} className="text-gray-400" />
          <ChevronDown size={11} className="text-gray-500" />
        </button>
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-gray-600/50 bg-gray-800 text-xs text-gray-300 whitespace-nowrap">
          <span>{dateFrom}</span>
          <span className="text-gray-500">→</span>
          <span>{dateTo}</span>
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-blue-600/60 bg-blue-600/20 text-xs text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 flex-shrink-0"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Row 2: interval + breakdown controls */}
      {/* <div className="flex items-center gap-2">
        <button className="p-1.5 rounded border border-gray-600/50 bg-gray-800 text-gray-400 hover:text-white flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="5" height="5" rx="0.5" />
            <rect x="8" y="1" width="5" height="5" rx="0.5" />
            <rect x="1" y="8" width="5" height="5" rx="0.5" />
            <rect x="8" y="8" width="5" height="5" rx="0.5" />
          </svg>
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-gray-600/50 bg-gray-800 text-xs text-gray-300 hover:border-gray-500 hover:text-white">
          Auto interval <ChevronDown size={11} className="text-gray-500" />
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-gray-600/50 bg-gray-800 text-xs text-gray-300 hover:border-gray-500 hover:text-white">
          No breakdown <ChevronDown size={11} className="text-gray-500" />
        </button>
      </div> */}
    </div>
  );
}
