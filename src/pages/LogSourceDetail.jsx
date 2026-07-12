import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, Database, Activity, Server, HardDrive, ShieldAlert, Boxes, Pencil, FileText, Loader2,
} from 'lucide-react';

import useLogSourceDetail from '@/features/logsources/hooks/useLogSourceDetail';
import LogSourceModal from '@/components/LogSourceModal';
import { showSuccessToast } from '@/utils/toast';

const STATUS_COLORS = { active: '#22c55e', stale: '#eab308', error: '#ef4444' };
const statusColor = (s) => STATUS_COLORS[String(s || '').toLowerCase()] || '#6b7280';

export default function LogSourceDetail() {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  // استدعاء الهوك بـ React Query (تم إزالة الـ refreshTrigger)
  const { source, loading, error } = useLogSourceDetail(id);

  // تحديث الداتا بيتم أوتوماتيك من الـ Mutation كاش، فقط بنقفل الـ Modal وبنظهر الـ Toast
  const handleSaved = (updatedSource) => {
    setModalOpen(false);
    showSuccessToast(`Log source "${updatedSource?.name || 'source'}" updated successfully`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] h-full w-full">
        <Loader2 className="animate-spin text-cyan-400" size={32} />
      </div>
    );
  }

  if (error || !source) {
    return (
      <div className="p-6 text-center text-red-400 font-mono text-sm w-full">
        {error ? `Error: ${error}` : 'Log source not found.'}
        <div className="mt-4">
          <Link to="/observability/logs" className="text-cyan-400 hover:underline">
            Back to Log Sources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-8 px-4 text-white flex-1 h-full font-sans w-full flex flex-col">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/observability/logs"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <ChevronLeft size={16} />
          LOG SOURCES
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 gap-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500/10 p-3 rounded-md border border-cyan-500/20">
            <Database className="text-cyan-400" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-white">{source.source?.name}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/40 border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor(source.status) }} />
                <span style={{ color: statusColor(source.status) }}>{source.status}</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              {source.source?.category} • {source.source?.vendor} • {source.source?.product}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs px-2.5 py-1 rounded-sm font-semibold tracking-wider uppercase ${source.meta?.enabled ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {source.meta?.enabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-white px-4 py-2 rounded-sm text-sm font-semibold transition-colors cursor-pointer"
          >
            <Pencil size={14} />
            EDIT
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-white/5 mb-6 text-sm">
        <button className="pb-3 border-b-2 border-cyan-400 text-cyan-400 font-semibold uppercase tracking-wider text-xs">Overview</button>
        <button className="pb-3 text-gray-400 hover:text-gray-200 uppercase tracking-wider text-xs cursor-pointer">Volume</button>
        <button className="pb-3 text-gray-400 hover:text-gray-200 uppercase tracking-wider text-xs cursor-pointer">Hosts</button>
        <button className="pb-3 text-gray-400 hover:text-gray-200 uppercase tracking-wider text-xs cursor-pointer">Storage</button>
        <button className="pb-3 text-gray-400 hover:text-gray-200 uppercase tracking-wider text-xs cursor-pointer">Detection</button>
        <button className="pb-3 text-gray-400 hover:text-gray-200 uppercase tracking-wider text-xs cursor-pointer">Sample Events</button>
        <button className="pb-3 text-gray-400 hover:text-gray-200 uppercase tracking-wider text-xs cursor-pointer">Raw</button>
      </div>

      {/* Main Grid Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#050505] border border-white/5 p-5 rounded-md">
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Total Events</p>
          <p className="text-2xl font-bold mt-2 text-cyan-400 font-mono">{source.ingestion?.totalEvents?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-[#050505] border border-white/5 p-5 rounded-md">
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Events (24h)</p>
          <p className="text-2xl font-bold mt-2 text-purple-400 font-mono">0</p>
        </div>
        <div className="bg-[#050505] border border-white/5 p-5 rounded-md">
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Events / Sec</p>
          <p className="text-2xl font-bold mt-2 text-cyan-500 font-mono">0</p>
        </div>
        <div className="bg-[#050505] border border-white/5 p-5 rounded-md">
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Status</p>
          <p className="text-2xl font-bold mt-2 font-mono capitalize" style={{ color: statusColor(source.status) }}>{source.status}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#050505] border border-white/5 rounded-lg p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-6 flex items-center gap-2">
            <Boxes size={16} /> Source
          </h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Name</p>
              <p className="text-white mt-1">{source.source?.name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Category</p>
              <p className="text-white mt-1">{source.source?.category}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Vendor</p>
              <p className="text-white mt-1">{source.source?.vendor}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Product</p>
              <p className="text-white mt-1">{source.source?.product}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Dataset</p>
              <p className="text-white mt-1">{source.source?.dataset}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Stream Type</p>
              <p className="text-white mt-1">logs</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Index</p>
              <p className="text-white mt-1 font-mono text-xs">{source.source?.index}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Owner</p>
              <p className="text-white mt-1">SOC Team</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Description</p>
            <p className="text-gray-300 mt-1.5 text-xs leading-relaxed">{source.source?.description || '---'}</p>
          </div>
          {source.meta?.tags && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {source.meta.tags.map((t) => (
                <span key={t} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] px-2 py-0.5 rounded-sm font-mono">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#050505] border border-white/5 rounded-lg p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-6 flex items-center gap-2">
            <Activity size={16} /> Collector & Quality
          </h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Agent</p>
              <p className="text-white mt-1 font-mono text-xs">{source.collector?.agent || '---'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Version</p>
              <p className="text-white mt-1 font-mono text-xs">9.2.1</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Format</p>
              <p className="text-white mt-1">ECS</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Pipeline</p>
              <p className="text-white mt-1 font-mono text-xs">{source.collector?.pipeline || '---'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Parse Success</p>
              <p className="text-green-400 mt-1 font-mono">0%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">ECS Coverage</p>
              <p className="text-green-400 mt-1 font-mono">0%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Field Count</p>
              <p className="text-white mt-1 font-mono">0</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Enabled</p>
              <p className="text-white mt-1">{source.meta?.enabled ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <LogSourceModal
          mode="edit"
          source={source}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}