import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, ChevronDown, Pencil } from 'lucide-react';
import { LOG_SOURCES, getLogSourceById } from '@/utils/logsMockData';
import LogSourceModal from '@/components/LogSourceModal';
import { showSuccessToast } from '@/utils/toast';

const STATUS_COLORS = { active: '#22c55e', stale: '#eab308', error: '#ef4444' };
const statusColor = (s) => STATUS_COLORS[String(s || '').toLowerCase()] || '#6b7280';

export default function Logs() {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // { mode, source }
  const [refresh, setRefresh] = useState(0);

  const rows = useMemo(
    () =>
      LOG_SOURCES.map((s) => ({
        id: s.id,
        title: s.source.name,
        desc: s.source.description,
        events: s.ingestion.totalEvents,
        status: s.status,
        tags: s.meta.tags,
      })),
    [refresh],
  );

  const filteredLogs = rows.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.desc.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSaved = (saved) => {
    const wasEdit = modal?.mode === 'edit';
    setModal(null);
    setRefresh((r) => r + 1);
    showSuccessToast(wasEdit ? 'Log source updated' : `Log source "${saved.source.name}" added`);
  };

  return (
    <div className="pt-6 pb-8 px-4 text-white flex-1 h-full font-sans w-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 gap-4 border-b border-white/5">
        <h1 className="text-3xl font-bold tracking-tight text-white">Log Sources</h1>
        <button
          onClick={() => setModal({ mode: 'add', source: null })}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-sm text-sm font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer"
        >
          <Plus size={16} strokeWidth={3} />
          Add log source
        </button>
      </div>

      {/* Controls: Search and Tags */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center bg-[#0a0a0a] border border-cyan-500/20 rounded-md px-3 py-2.5 focus-within:border-cyan-400/50 transition-colors shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search log sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-gray-600"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#0a0a0a] border border-cyan-500/20 px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-colors cursor-pointer shadow-lg">
          Tags <ChevronDown size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Data Table */}
      <div className="flex-1 bg-transparent mt-2 overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="py-4 px-2 w-12 text-center">
                <input type="checkbox" className="accent-cyan-500 cursor-pointer w-3.5 h-3.5" />
              </th>
              <th className="py-4 px-4 font-semibold">Source Name</th>
              <th className="py-4 px-4 font-semibold">Description</th>
              <th className="py-4 px-4 font-semibold text-right">Events</th>
              <th className="py-4 px-4 font-semibold">Status</th>
              <th className="py-4 px-4 font-semibold">Tags</th>
              <th className="py-4 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((doc) => (
              <tr
                key={doc.id}
                className="border-b border-white/5 hover:bg-cyan-500/5 hover:border-cyan-500/20 transition-colors group"
              >
                <td className="py-3 px-2 text-center align-middle">
                  <input type="checkbox" className="accent-cyan-500 cursor-pointer w-3.5 h-3.5" />
                </td>
                <td className="py-3 px-4 font-medium">
                  <Link
                    to={`/observability/logs/${doc.id}`}
                    className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                  >
                    {doc.title}
                  </Link>
                </td>
                <td className="py-3 px-4 text-gray-400">{doc.desc}</td>
                <td className="py-3 px-4 text-right font-mono text-gray-300">
                  {doc.events.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor(doc.status) }} />
                    <span className="text-xs capitalize" style={{ color: statusColor(doc.status) }}>
                      {doc.status}
                    </span>
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1.5">
                    {doc.tags?.map((t) => (
                      <span
                        key={t}
                        className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] px-2 py-0.5 rounded-sm font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-right align-middle">
                  <button
                    onClick={() => setModal({ mode: 'edit', source: getLogSourceById(doc.id) })}
                    className="text-gray-500 hover:text-cyan-400 transition-colors p-1 rounded-sm opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Edit log source"
                  >
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No log sources found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <LogSourceModal
          mode={modal.mode}
          source={modal.source}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
