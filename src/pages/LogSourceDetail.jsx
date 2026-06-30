import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, Database, Activity, Server, HardDrive, ShieldAlert, Boxes, Pencil, FileText,
} from 'lucide-react';
import { getLogSourceById } from '@/utils/logsMockData';
import { getHostById } from '@/utils/hostsMockData';
import LogHistogram from '@/components/interval_controls/LogHistogram';
import DocumentTable from '@/components/interval_controls/DocumentTable';
import LogSourceModal from '@/components/LogSourceModal';
import { showSuccessToast } from '@/utils/toast';

const STATUS_COLORS = { active: '#22c55e', stale: '#eab308', error: '#ef4444' };
const statusColor = (s) => STATUS_COLORS[String(s || '').toLowerCase()] || '#6b7280';

const TABS = ['Overview', 'Volume', 'Hosts', 'Storage', 'Detection', 'Sample events', 'Raw'];

const formatDate = (iso) => {
  if (!iso) return 'n/a';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });
};

const formatNumber = (n) => (typeof n === 'number' ? n.toLocaleString() : n ?? 'n/a');

const formatBytes = (bytes) => {
  if (!bytes || bytes < 1) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

const formatLag = (seconds) => {
  if (!seconds || seconds < 60) return `${seconds || 0}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  return `${Math.round(seconds / 86400)}d`;
};

function Badge({ children, color }) {
  return (
    <span
      className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-sm"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}55` }}
    >
      {children}
    </span>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
        {Icon && <Icon size={15} className="text-cyan-400" />}
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-300">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, mono = true }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</span>
      <span className={`text-sm text-gray-200 break-words ${mono ? 'font-mono' : ''}`}>
        {value === null || value === undefined || value === '' ? 'n/a' : value}
      </span>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</span>
      <span className="text-2xl font-mono font-bold" style={color ? { color } : { color: '#fff' }}>
        {value}
      </span>
    </div>
  );
}

export default function LogSourceDetail() {
  const { sourceId } = useParams();
  const [refresh, setRefresh] = useState(0);
  const source = useMemo(() => getLogSourceById(sourceId), [sourceId, refresh]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showEdit, setShowEdit] = useState(false);

  if (!source) {
    return (
      <div className="flex flex-col flex-1 h-full items-center justify-center text-gray-400 bg-[#050505] gap-4">
        <ShieldAlert size={48} className="opacity-20" />
        <p>Log source "{sourceId}" was not found.</p>
        <Link to="/observability/logs" className="text-cyan-400 hover:underline text-sm">
          Back to Log Sources
        </Link>
      </div>
    );
  }

  const color = statusColor(source.status);
  const handleSaved = () => {
    setShowEdit(false);
    setRefresh((r) => r + 1);
    showSuccessToast('Log source updated');
  };

  return (
    <div className="flex flex-col flex-1 h-full text-white overflow-hidden bg-[#050505]">
      {/* Top bar */}
      <div className="px-6 pt-4 pb-3 border-b border-white/5 bg-background">
        <Link
          to="/observability/logs"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-widest font-mono mb-4"
        >
          <ChevronLeft size={14} /> Log Sources
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg border border-purple-500/30 flex items-center justify-center bg-purple-500/5">
              <Database className="text-cyan-400" size={22} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{source.source.name}</h1>
                <span className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span style={{ color }}>{source.status}</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm font-mono mt-0.5">
                {source.source.category} • {source.source.dataset} • {source.collector.agent}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge color={source.meta.enabled ? '#22c55e' : '#6b7280'}>
              {source.meta.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold border border-purple-500/30 text-gray-300 hover:border-cyan-400/50 hover:text-white transition-all cursor-pointer"
            >
              <Pencil size={13} /> Edit
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 mt-4 -mb-3 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest font-mono border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab ? 'border-cyan-400 text-white' : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {activeTab === 'Overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total events" value={formatNumber(source.ingestion.totalEvents)} color="#38bdf8" />
              <StatCard label="Events (24h)" value={formatNumber(source.ingestion.events24h)} color="#a855f7" />
              <StatCard label="Events / sec" value={source.ingestion.eventsPerSecond} color="#818cf8" />
              <StatCard label="Status" value={source.status} color={color} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="Source" icon={Boxes}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Name" value={source.source.name} />
                  <Field label="Category" value={source.source.category} />
                  <Field label="Vendor" value={source.source.vendor} mono={false} />
                  <Field label="Product" value={source.source.product} mono={false} />
                  <Field label="Dataset" value={source.source.dataset} />
                  <Field label="Stream type" value={source.source.type} />
                  <Field label="Index" value={source.source.index} />
                  <Field label="Owner" value={source.meta.owner} mono={false} />
                </div>
                <div className="mt-4">
                  <Field label="Description" value={source.source.description} mono={false} />
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {source.meta.tags.map((t) => (
                    <span key={t} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] px-2 py-0.5 rounded-sm font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="Collector & quality" icon={Activity}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Agent" value={source.collector.agent} />
                  <Field label="Version" value={source.collector.version} />
                  <Field label="Format" value={source.collector.format} />
                  <Field label="Pipeline" value={source.collector.pipeline} />
                  <Field label="Parse success" value={`${source.quality.parseSuccessRate}%`} />
                  <Field label="ECS coverage" value={`${source.quality.ecsCoverage}%`} />
                  <Field label="Field count" value={formatNumber(source.quality.fieldCount)} />
                  <Field label="Enabled" value={source.meta.enabled ? 'Yes' : 'No'} />
                </div>
              </Section>
            </div>
          </>
        )}

        {activeTab === 'Volume' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total events" value={formatNumber(source.ingestion.totalEvents)} color="#38bdf8" />
              <StatCard label="Events (24h)" value={formatNumber(source.ingestion.events24h)} color="#a855f7" />
              <StatCard label="Events / sec" value={source.ingestion.eventsPerSecond} color="#818cf8" />
              <StatCard label="Ingest lag" value={formatLag(source.ingestion.lagSeconds)} color={color} />
            </div>

            <Section title="Event volume" icon={Activity}>
              {source.histogram.length > 0 ? (
                <LogHistogram data={source.histogram} dateRange={{}} />
              ) : (
                <p className="text-xs text-gray-600 italic">No volume data available.</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
                <Field label="Last event" value={formatDate(source.ingestion.lastEventAt)} />
                <Field label="First seen" value={formatDate(source.ingestion.firstSeen)} />
                <Field label="Ingest lag" value={formatLag(source.ingestion.lagSeconds)} />
              </div>
            </Section>
          </>
        )}

        {activeTab === 'Hosts' && (
          <Section title="Hosts feeding this source" icon={Server}>
            {source.hosts.length === 0 ? (
              <p className="text-xs text-gray-600 italic">
                No specific hosts (account or service level source).
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                      <th className="py-3 px-3 font-semibold">Host</th>
                      <th className="py-3 px-3 font-semibold">Description</th>
                      <th className="py-3 px-3 font-semibold">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {source.hosts.map((hid) => {
                      const h = getHostById(hid);
                      return (
                        <tr key={hid} className="border-b border-white/5 hover:bg-cyan-500/5 transition-colors">
                          <td className="py-3 px-3 font-medium">
                            <Link to={`/observability/hosts/${hid}`} className="text-blue-400 hover:text-cyan-400 hover:underline transition-colors">
                              {h ? h.host.name : hid}
                            </Link>
                          </td>
                          <td className="py-3 px-3 text-gray-400">{h ? h.meta.description : 'n/a'}</td>
                          <td className="py-3 px-3 font-mono text-gray-400">{h ? h.host.ip.join(', ') : 'n/a'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        )}

        {activeTab === 'Storage' && (
          <Section title="Storage & retention" icon={HardDrive}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Index" value={source.source.index} />
              <Field label="Index size" value={formatBytes(source.storage.indexSizeBytes)} />
              <Field label="Document count" value={formatNumber(source.storage.docCount)} />
              <Field label="Retention" value={`${source.storage.retentionDays} days`} />
              <Field label="ILM policy" value={source.storage.ilmPolicy} />
              <Field label="Shards" value={source.storage.shards} />
            </div>
          </Section>
        )}

        {activeTab === 'Detection' && (
          <Section title="Detection coverage" icon={ShieldAlert}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <Field label="Rules using this source" value={source.detection.rulesUsing} />
              <Field label="Alerts generated" value={source.detection.alertsGenerated} />
              <Field label="Tactics covered" value={source.detection.mitreTactics.length} />
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">MITRE ATT&CK tactics</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {source.detection.mitreTactics.length === 0 ? (
                <span className="text-xs text-gray-600 italic">None mapped</span>
              ) : source.detection.mitreTactics.map((m) => (
                <span key={m} className="bg-red-500/10 text-red-300 border border-red-500/20 text-[10px] px-2 py-0.5 rounded-sm font-mono">
                  {m}
                </span>
              ))}
            </div>
          </Section>
        )}

        {activeTab === 'Sample events' && (
          <Section title="Recent sample events" icon={FileText}>
            {source.sampleEvents.length > 0 ? (
              <DocumentTable documents={source.sampleEvents} columns={['@timestamp', 'Document']} />
            ) : (
              <p className="text-xs text-gray-600 italic">No sample events available.</p>
            )}
            <p className="text-[11px] text-gray-600 mt-3">
              Full event search and field statistics will load from Elasticsearch once log search is wired.
            </p>
          </Section>
        )}

        {activeTab === 'Raw' && (
          <Section title="Raw log source document" icon={Boxes}>
            <pre className="text-xs font-mono text-gray-400 overflow-x-auto bg-[#111] border border-white/5 rounded-lg p-4 leading-relaxed">
              {JSON.stringify(source, null, 2)}
            </pre>
          </Section>
        )}

      </div>

      {showEdit && (
        <LogSourceModal mode="edit" source={source} onClose={() => setShowEdit(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}
