import { useState, useMemo } from "react";
import { BarChart2, Table, ArrowUpDown, Save, ChevronDown } from "lucide-react"; // تم إضافة ChevronDown هنا

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

export default function Discover() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Documents");
  const [columns] = useState(["@timestamp", "Document"]);

  // تصفية البيانات بناءً على نص البحث الكود يشبه الـ KQL بشكل مبسط
  const filteredDocs = useMemo(() => {
    if (!query.trim()) return MOCK_DOCUMENTS;
    const q = query.toLowerCase();
    return MOCK_DOCUMENTS.filter((doc) =>
      Object.values(doc).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query]);

  const handleRefresh = () => {
    // تحديث البيانات من السيرفر (في المشروع الفعلي)
  };

  const handleAddField = (fieldName) => {
    console.log("Add column:", fieldName);
  };

  return (
    <div className="flex flex-col h-screen text-white overflow-hidden">
      
      {/* 1. الشريط العلوي الرئيسي (Header) */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="bg-[#1F2029] text-white px-2.5 py-1 text-sm rounded">Discover</span>
        <div className="flex items-center gap-3">
          <ul className="flex items-center gap-5 text-xs text-gray-400">
            <li className="cursor-pointer hover:text-white transition-colors">New</li>
            <li className="cursor-pointer hover:text-white transition-colors">Open</li>
            <li className="cursor-pointer hover:text-white transition-colors">Share</li>
            <li className="cursor-pointer hover:text-white transition-colors">Alerts</li>
          </ul>
          <button className="flex items-center justify-center gap-2 bg-white text-black px-3 py-1 rounded-sm font-semibold cursor-pointer hover:bg-gray-200 transition-colors">
            <Save className="w-4 h-4" />
            <span className="text-xs">Save</span>
          </button>
        </div>
      </div>

      {/* 3. شريط البحث المتقدم KQL والوقت */}
      <KqlSearchBar
        query={query}
        onChange={setQuery}
        dateFrom={DATE_RANGE.from}
        dateTo={DATE_RANGE.to}
        onRefresh={handleRefresh}
      />

      {/* 4. مساحة العمل الرئيسية تقسيم السايدبار والمحتوى */}
      <div className="flex flex-1 overflow-hidden">
        {/* السايدبار الأيسر */}
        <DiscoverSideBar fields={MOCK_FIELDS} onAddField={handleAddField} />

        {/* مساحة العرض اليمنى */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* مخطط الهستوجرام */}
          <div className="px-4 pt-3 pb-1 border-b border-gray-700/40 bg-[#0d0f14]">
            
            {/* تم نقل أزرار الـ Interval و Breakdown هنا فوق التايم لاين */}
            <div className="flex items-center gap-2 mb-2">
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
            </div>

            <LogHistogram data={MOCK_HISTOGRAM} dateRange={DATE_RANGE} />
            <p className="text-[10px] text-gray-500 mt-1 text-center">
              {DATE_RANGE.from} → {DATE_RANGE.to}&nbsp;&nbsp;
              <span className="text-gray-600">(Interval: {DATE_RANGE.interval})</span>
            </p>
          </div>

          {/* التبديل بين التبويبات (Tabs) وأدوات العرض */}
          <div className="flex items-center justify-between px-4 border-b border-gray-700/60 flex-shrink-0">
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
              <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 border border-gray-600/50 rounded hover:text-white hover:border-gray-500 transition-all">
                <ArrowUpDown size={11} />
                Sort fields
                <span className="ml-0.5 bg-blue-600 text-white rounded text-[10px] px-1">1</span>
              </button>
              <button className="p-1.5 rounded border border-gray-600/50 text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                <BarChart2 size={14} />
              </button>
              <button className="p-1.5 rounded border border-gray-600/50 text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                <Table size={14} />
              </button>
            </div>
          </div>

          {/* محتوى جدول الوثائق بناءً على التبويب النشط */}
          <div className="flex-1 overflow-auto">
            {activeTab === "Documents" && (
              <DocumentTable documents={filteredDocs} columns={columns} />
            )}
            {activeTab === "Field statistics" && (
              <div className="flex h-full items-center justify-center text-gray-600 text-sm">
                Field statistics view — connect to backend to populate.
              </div>
            )}
          </div>
          
        </main>
      </div>
    </div>
  );
}