// src/pages/Discover.jsx
import { useState, useMemo } from "react";
import { BarChart2, Table, ArrowUpDown } from "lucide-react";

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

import DiscoverSideBar from '@/component/DiscoverSideBar'


export default function Discover() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Documents");
  const [columns] = useState(["@timestamp", "Document"]);

  // Filter documents by KQL-like query (simple substring match for mock)
  const filteredDocs = useMemo(() => {
    if (!query.trim()) return MOCK_DOCUMENTS;
    const q = query.toLowerCase();
    return MOCK_DOCUMENTS.filter((doc) =>
      Object.values(doc).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query]);

  const handleRefresh = () => {
    // In a real app this would re-fetch; here it's a no-op
  };

  const handleAddField = (fieldName) => {
    // In a real app, add fieldName to the columns array
    console.log("Add column:", fieldName);
  };

  return (
    <>
    <div className='flex items-center justify-between'>
      <span className='bg-[#1F2029] text-font px-2.5 py-1'>Discover</span>
      <div className='flex items-center gap-3'>
      <ul className='flex items-center gap-5'>
        <li>New</li>
        <li>Open</li>
        <li>Share</li>
        <li>Alerts</li>
      </ul>
      <button className='flex items-center justify-center gap-2 bg-font text-third w-24.5 px-2.5 py-1 rounded-sm font-semibold cursor-pointer'><Save className='w-4 h-4'/><span className='text-xs'>Save</span></button>
      </div>
    </div>
    <div className='text-font'><DiscoverBottom/></div>
    <div className='grid grid-cols-12 gap-3 border-t border-white/10 mt-2 h-screen'>
      <DiscoverSideBar/>
      <main className='col-span-10 '>

      </main>
    </div>
    </>

  )

    <div className="flex flex-col h-screen bg-[#0d0f14] text-white overflow-hidden">
      {/* Secondary nav bar */}
      <DiscoverNavbar2 onRefresh={handleRefresh} />

      {/* KQL search + date bar */}
      <KqlSearchBar
        query={query}
        onChange={setQuery}
        dateFrom={DATE_RANGE.from}
        dateTo={DATE_RANGE.to}
        onRefresh={handleRefresh}
      />

      {/* Main layout: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <DiscoverSideBar fields={MOCK_FIELDS} onAddField={handleAddField} />

        {/* Right panel */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Histogram */}
          <div className="px-4 pt-3 pb-1 border-b border-gray-700/40 bg-[#0d0f14]">
            <LogHistogram data={MOCK_HISTOGRAM} dateRange={DATE_RANGE} />
            <p className="text-[10px] text-gray-500 mt-1 text-center">
              {DATE_RANGE.from} → {DATE_RANGE.to}&nbsp;&nbsp;
              <span className="text-gray-600">(Interval: {DATE_RANGE.interval})</span>
            </p>
          </div>

          {/* Tab bar + table header */}
          <div className="flex items-center justify-between px-4 py-0 border-b border-gray-700/60 bg-[#111216] flex-shrink-0">
            <div className="flex items-center gap-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab === "Documents" ? (
                    <span>
                      Documents{" "}
                      <span className="text-gray-500">({filteredDocs.length})</span>
                    </span>
                  ) : (
                    tab
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 py-1.5">
              <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 border border-gray-600/50 rounded hover:text-white hover:border-gray-500">
                <ArrowUpDown size={11} />
                Sort fields
                <span className="ml-0.5 bg-blue-600 text-white rounded text-[10px] px-1">1</span>
              </button>
              {/* View toggles */}
              <button className="p-1.5 rounded border border-gray-600/50 text-gray-400 hover:text-white hover:border-gray-500">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="1" y="1" width="12" height="2.5" rx="0.5" />
                  <rect x="1" y="5.75" width="12" height="2.5" rx="0.5" />
                  <rect x="1" y="10.5" width="12" height="2.5" rx="0.5" />
                </svg>
              </button>
              <button className="p-1.5 rounded border border-gray-600/50 text-gray-400 hover:text-white hover:border-gray-500">
                <BarChart2 size={14} />
              </button>
              <button className="p-1.5 rounded border border-gray-600/50 text-gray-400 hover:text-white hover:border-gray-500">
                <Table size={14} />
              </button>
            </div>
          </div>

          {/* Document table */}
          {activeTab === "Documents" && (
            <DocumentTable documents={filteredDocs} columns={columns} />
          )}
          {activeTab === "Field statistics" && (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
              Field statistics view — connect to backend to populate.
            </div>
          )}
        </main>
      </div>
    </div>
  );

}
