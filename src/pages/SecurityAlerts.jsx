import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Activity, ShieldAlert } from 'lucide-react';
import { useGetAlerts } from '@/features/alerts/hooks/getAlerts';

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#8b5cf6',
};
const sevColor = (s) => SEVERITY_COLORS[String(s || '').toLowerCase()] || '#38bdf8';

const formatDate = (iso) => {
  if (!iso) return 'n/a';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });
};

export default function SecurityAlerts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');

  // استدعاء الـ Hook المخصص
  const { data, isLoading, isError } = useGetAlerts({ severity, status, search });

  const alerts = Array.isArray(data) ? data : data?.data || [];

  // حساب الإحصائيات
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  alerts.forEach((a) => {
    const k = a.severity?.toLowerCase();
    if (counts[k] !== undefined) counts[k] += 1;
  });

  const openCount = alerts.filter((a) => a.status === 'OPEN' || a.status === 'IN_PROGRESS').length;

  const selectClass =
    'bg-[#0a0a0a] border border-purple-500/20 rounded-md px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-cyan-400/50 cursor-pointer';

  return (
    <div className="pt-6 pb-8 px-4 text-white flex-1 h-full font-sans w-full flex flex-col bg-[#050505]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 gap-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Bell className="text-purple-400" size={24} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Alerts</h1>
        </div>
        <span className="text-sm text-gray-500 font-mono">
          {openCount} open / {alerts.length} total
        </span>
      </div>

      {/* Severity summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {['critical', 'high', 'medium', 'low'].map((s) => (
          <button
            key={s}
            onClick={() => setSeverity(severity === s ? 'all' : s)}
            className={`bg-[#0a0a0a] border rounded-xl p-4 flex flex-col gap-1 text-left transition-all cursor-pointer ${
              severity === s ? 'border-cyan-400/50' : 'border-white/5 hover:border-white/15'
            }`}
          >
            <span className="text-[10px] text-gray-500 uppercase tracking-widest capitalize">{s}</span>
            <span className="text-2xl font-mono font-bold" style={{ color: sevColor(s) }}>{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center bg-[#0a0a0a] border border-purple-500/20 rounded-md px-3 py-2.5 focus-within:border-cyan-400/50 transition-colors">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-gray-600"
          />
        </div>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={selectClass}>
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          <option value="all">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="FALSE_POSITIVE">False positive</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 bg-transparent mt-2 overflow-x-auto">
        {isLoading && !data ? (
          <div className="flex flex-col items-center justify-center py-12 text-cyan-400 gap-2 font-mono text-xs">
            <Activity size={24} className="animate-pulse" />
            <p>Syncing alert dashboard with cluster...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400 gap-2 font-mono text-xs">
            <ShieldAlert size={24} />
            <p>Error loading alerts from the server.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                <th className="py-4 px-4 font-semibold">Alert</th>
                <th className="py-4 px-4 font-semibold">Severity</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold">Rule</th>
                <th className="py-4 px-4 font-semibold">Scope</th>
                <th className="py-4 px-4 font-semibold text-right">Confidence</th>
                <th className="py-4 px-4 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => navigate(`/security/alerts/${a.id}?from=alerts`)}
                  className="border-b border-white/5 hover:bg-purple-500/5 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-medium text-white group-hover:text-cyan-400 transition-colors">{a.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-sm" style={{ backgroundColor: `${sevColor(a.severity)}22`, color: sevColor(a.severity), border: `1px solid ${sevColor(a.severity)}55` }}>
                      {a.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-300">{a.status}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{a.rule}</td>
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">{a.scope || a.source}</td>
                  <td className="py-3 px-4 text-right font-mono text-gray-400">
                    {a.confidence ? `${Math.round(a.confidence * 100)}%` : 'n/a'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs text-gray-500">{formatDate(a.timestamp || a.createdAt)}</td>
                </tr>
              ))}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No alerts match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}