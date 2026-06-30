// src/components/DiscoverNavbar2.jsx
import { Save } from "lucide-react";

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
