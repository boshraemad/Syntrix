import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, LayoutDashboard, RefreshCw, Pencil, ShieldAlert } from 'lucide-react';
import { getDashboardById, getDashboardPanels } from '@/utils/dashboardsMockData';
import LogHistogram from '@/components/interval_controls/LogHistogram';

export default function DashboardDetail() {
  const { dashboardId } = useParams();
  const dashboard = getDashboardById(dashboardId);

  if (!dashboard) {
    return (
      <div className="flex flex-col flex-1 h-full items-center justify-center text-gray-400 bg-[#050505] gap-4">
        <ShieldAlert size={48} className="opacity-20" />
        <p>Dashboard "{dashboardId}" was not found.</p>
        <Link to="/dashboards" className="text-cyan-400 hover:underline text-sm">
          Back to Dashboards
        </Link>
      </div>
    );
  }

  const panels = getDashboardPanels(dashboard);
  const maxBreakdown = Math.max(...panels.breakdown.map((b) => b.value), 1);

  return (
    <div className="flex flex-col flex-1 h-full text-white overflow-y-auto bg-[#050505]">
      {/* Top bar */}
      <div className="px-6 pt-4 pb-4 border-b border-white/5 bg-background">
        <Link
          to="/dashboards"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-widest font-mono mb-4"
        >
          <ChevronLeft size={14} /> Dashboards
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg border border-purple-500/30 flex items-center justify-center bg-purple-500/5">
              <LayoutDashboard className="text-cyan-400" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{dashboard.title}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{dashboard.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold border border-purple-500/30 text-gray-300 hover:border-cyan-400/50 hover:text-white transition-all cursor-pointer">
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold border border-purple-500/30 text-gray-300 hover:border-cyan-400/50 hover:text-white transition-all cursor-pointer">
              <Pencil size={13} /> Edit
            </button>
          </div>
        </div>

        {dashboard.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {dashboard.tags.map((t) => (
              <span key={t} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] px-2 py-0.5 rounded-sm font-mono">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Panels */}
      <div className="p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {panels.stats.map((s) => (
            <div key={s.label} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">{s.label}</span>
              <span className="text-2xl font-mono font-bold" style={{ color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Volume over time */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-4 pb-3 border-b border-white/5">
              Event volume
            </h3>
            <LogHistogram data={panels.histogram} dateRange={{}} />
          </div>

          {/* Breakdown */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-4 pb-3 border-b border-white/5">
              By outcome
            </h3>
            <div className="space-y-3">
              {panels.breakdown.map((b) => {
                const pct = Math.round((b.value / maxBreakdown) * 100);
                return (
                  <div key={b.label} className="flex items-center gap-3 text-xs">
                    <span className="text-gray-400 font-mono w-16 capitalize">{b.label}</span>
                    <div className="flex-1 h-2 bg-[#222] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-gray-500 font-mono w-10 text-right">{b.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray-600">
          Panels show representative data. They will render live visualizations from Elasticsearch once dashboards are wired to the backend.
        </p>
      </div>
    </div>
  );
}
