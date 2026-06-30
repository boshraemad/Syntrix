
// src/pages/Discover.jsx

import { useState, useMemo } from "react";
import { BarChart2, Table, ArrowUpDown, Save, ChevronDown } from "lucide-react";

import DiscoverNavbar2 from "@/components/DiscoverNavbar2";
import DiscoverSideBar from "@/components/DiscoverSideBar";
import KqlSearchBar from "@/components/sections/KqlSearchBar";
import LogHistogram from "@/components/interval_controls/LogHistogram";
import DocumentTable from "@/components/interval_controls/DocumentTable";

import {
  MOCK_DOCUMENTS,
  MOCK_FIELDS,
  MOCK_HISTOGRAM,
  DATE_RANGE,
} from "@/utils/discoverMockData";

const TABS = ["Documents", "Field statistics"];

const DEFAULT_STAT_FIELDS = ["event.action", "event.outcome", "log.level", "agent.type"];

function FieldStatistics({ documents, fields }) {
  const statFields = fields.length ? fields : DEFAULT_STAT_FIELDS;

  if (documents.length === 0) {
    return <div className="p-4 text-gray-600 text-sm">No documents to summarize.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {statFields.map((field) => {
        const counts = {};
        let present = 0;
        documents.forEach((d) => {
          const v = d[field];
          if (v === undefined || v === null || v === "") return;
          present += 1;
          const key = String(v);
          counts[key] = (counts[key] || 0) + 1;
        });
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        return (
          <div key={field} className="bg-[#111] border border-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-mono text-cyan-400">{field}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                {present} / {documents.length} docs
              </span>
            </div>
            {top.length === 0 ? (
              <p className="text-xs text-gray-600 italic">No values in current results.</p>
            ) : (
              <div className="space-y-2">
                {top.map(([val, count]) => {
                  const pct = present ? Math.round((count / present) * 100) : 0;
                  return (
                    <div key={val} className="flex items-center gap-3 text-xs">
                      <span className="text-gray-300 font-mono truncate w-1/3" title={val}>{val}</span>
                      <div className="flex-1 h-1.5 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500/50" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-gray-500 font-mono w-20 text-right">{pct}% ({count})</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      {fields.length === 0 && (
        <p className="text-[11px] text-gray-600">
          Showing default fields. Add fields from the sidebar to analyze them here.
        </p>
      )}
    </div>
  );
}

export default function Discover() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Documents");
  const [selectedFields, setSelectedFields] = useState([]);

  // Filter the documents by the search text (simplified KQL-like matching)
  const filteredDocs = useMemo(() => {
    if (!query.trim()) return MOCK_DOCUMENTS;
    const q = query.toLowerCase();
    return MOCK_DOCUMENTS.filter((doc) =>
      Object.values(doc).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query]);

  const handleRefresh = () => {
    // Refresh data from the server (in the real project)
  };

  const handleAddField = (fieldName) => {
    setSelectedFields((prev) => (prev.includes(fieldName) ? prev : [...prev, fieldName]));
  };

  const handleRemoveField = (fieldName) => {
    setSelectedFields((prev) => prev.filter((f) => f !== fieldName));
  };

  return (
    <div className="flex flex-col flex-1 h-full text-white overflow-hidden">
      
      {/* 1. Main top header bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/5 bg-background">
        <span className="bg-white/10 text-white px-2.5 py-1 text-sm rounded-sm">Discover</span>
        <div className="flex items-center gap-3">
          <ul className="flex items-center gap-5 text-xs text-gray-500 font-mono tracking-widest uppercase">
            <li className="cursor-pointer hover:text-white transition-colors">New</li>
            <li className="cursor-pointer hover:text-white transition-colors">Open</li>
            <li className="cursor-pointer hover:text-white transition-colors">Share</li>
            <li className="cursor-pointer hover:text-white transition-colors">Alerts</li>
          </ul>
          <button className="flex items-center justify-center gap-2 bg-transparent text-white px-3 py-1 border border-white/10 rounded-sm font-semibold cursor-pointer hover:bg-white hover:text-black transition-colors">
            <Save className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest font-mono">Save</span>
          </button>
        </div>
      </div>

      {/* 3. Advanced KQL search bar and time range */}
      <KqlSearchBar
        query={query}
        onChange={setQuery}
        dateFrom={DATE_RANGE.from}
        dateTo={DATE_RANGE.to}
        onRefresh={handleRefresh}
      />

      {/* 4. Main workspace: split between sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <DiscoverSideBar fields={MOCK_FIELDS} onAddField={handleAddField} />

        {/* Right display area */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Histogram chart */}
          <div className="px-4 pt-3 pb-1 border-b border-white/5 bg-background">

            {/* Interval and Breakdown controls moved here above the timeline */}
            <div className="flex items-center gap-2 mb-2">
              <button className="p-1.5 rounded-sm border border-white/10 bg-transparent text-gray-500 hover:text-white flex-shrink-0 cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="1" width="5" height="5" rx="0.5" />
                  <rect x="8" y="1" width="5" height="5" rx="0.5" />
                  <rect x="1" y="8" width="5" height="5" rx="0.5" />
                  <rect x="8" y="8" width="5" height="5" rx="0.5" />
                </svg>
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-white/10 bg-transparent text-xs text-gray-500 hover:border-white/20 hover:text-white cursor-pointer font-mono tracking-widest uppercase">
                Auto interval <ChevronDown size={11} className="text-gray-500" />
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-white/10 bg-transparent text-xs text-gray-500 hover:border-white/20 hover:text-white cursor-pointer font-mono tracking-widest uppercase">
                No breakdown <ChevronDown size={11} className="text-gray-500" />
              </button>
            </div>

            <LogHistogram data={MOCK_HISTOGRAM} dateRange={DATE_RANGE} />
            <p className="text-[10px] text-gray-500 mt-1 text-center">
              {DATE_RANGE.from} → {DATE_RANGE.to}&nbsp;&nbsp;
              <span className="text-gray-600">(Interval: {DATE_RANGE.interval})</span>
            </p>
          </div>

          {/* Tab switching and view tools */}
          <div className="flex items-center justify-between px-4 border-b border-white/5 flex-shrink-0 bg-background">
            <div className="flex items-center gap-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest font-mono border-b-2 transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "border-white text-white"
                      : "border-transparent text-gray-500 hover:text-white"
                  }`}
                >
                  {tab === "Documents" ? (
                    <span>
                      Documents{" "}
                      <span className="text-gray-600">({filteredDocs.length})</span>
                    </span>
                  ) : (
                    tab
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 py-1.5">
              <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 border border-white/10 rounded-sm hover:text-white hover:border-white/20 transition-all cursor-pointer font-mono uppercase tracking-widest">
                <ArrowUpDown size={11} />
                Sort fields
                <span className="ml-0.5 bg-white text-black rounded-sm text-[10px] px-1 font-bold">1</span>
              </button>
              <button className="p-1.5 rounded-sm border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                <BarChart2 size={14} />
              </button>
              <button className="p-1.5 rounded-sm border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                <Table size={14} />
              </button>
            </div>
          </div>

          {/* Document table content based on the active tab */}
          <div className="flex-1 overflow-auto bg-[#0a0a0a]">
            {activeTab === "Documents" && (
              <DocumentTable
                documents={filteredDocs}
                selectedFields={selectedFields}
                onRemoveField={handleRemoveField}
              />
            )}
            {activeTab === "Field statistics" && (
              <FieldStatistics documents={filteredDocs} fields={selectedFields} />
            )}
          </div>
          
        </main>
      </div>
    </div>
  );
}
