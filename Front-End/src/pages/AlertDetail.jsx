import React from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft, AlertTriangle, Server, ShieldCheck, ShieldAlert, Clock, Crosshair, Globe,
} from 'lucide-react';
import { getSecurityAlertById } from '@/utils/securityData';

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#8b5cf6',
};

const sevColor = (level) => SEVERITY_COLORS[String(level || '').toLowerCase()] || '#38bdf8';

const formatDate = (iso) => {
  if (!iso) return 'n/a';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });
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

export default function AlertDetail() {
  const { alertId } = useParams();
  const [searchParams] = useSearchParams();
  const found = getSecurityAlertById(alertId);

  if (!found) {
    return (
      <div className="flex flex-col flex-1 h-full items-center justify-center text-gray-400 bg-[#050505] gap-4">
        <ShieldAlert size={48} className="opacity-20" />
        <p>Alert "{alertId}" was not found.</p>
        <Link to="/security/alerts" className="text-cyan-400 hover:underline text-sm">
          Back to Alerts
        </Link>
      </div>
    );
  }

  const { alert, host } = found;
  const color = sevColor(alert.severity);
  const mitre = alert.mitre && alert.mitre.length ? alert.mitre : host?.risk?.mitre || [];

  const from = searchParams.get('from') || '';
  const cameFromHost = from.startsWith('host:');
  const backTo = cameFromHost ? `/observability/hosts/${from.slice(5)}?tab=Alerts` : '/security/alerts';
  const backLabel = cameFromHost ? `${host?.host?.name || 'host'} alerts` : 'Alerts';

  return (
    <div className="flex flex-col flex-1 h-full text-white overflow-hidden bg-[#050505]">
      {/* Top bar */}
      <div className="px-6 pt-4 pb-4 border-b border-white/5 bg-background">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-widest font-mono mb-4"
        >
          <ChevronLeft size={14} /> {backLabel}
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}15`, border: `1px solid ${color}55` }}
            >
              <AlertTriangle size={22} style={{ color }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{alert.name}</h1>
              <p className="text-gray-500 text-sm font-mono mt-0.5">
                {alert.id} •{' '}
                {host ? (
                  <>
                    on{' '}
                    <Link to={`/observability/hosts/${host.id}`} className="text-cyan-400 hover:underline">
                      {host.host.name}
                    </Link>
                  </>
                ) : (
                  <span>{alert.scope || alert.source || 'cloud / account scope'}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge color={color}>{alert.severity}</Badge>
            <Badge color="#9ca3af">{alert.status}</Badge>
            <div className="text-center pl-2">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Confidence</div>
              <div className="text-xl font-mono font-bold" style={{ color }}>
                {Math.round(alert.confidence * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Triage actions (UI only for now) */}
        <div className="flex items-center gap-2 mt-4">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold border border-purple-500/30 text-gray-300 hover:border-cyan-400/50 hover:text-white transition-all cursor-pointer">
            <ShieldCheck size={13} /> Acknowledge
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold border border-purple-500/30 text-gray-300 hover:border-cyan-400/50 hover:text-white transition-all cursor-pointer">
            Close
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
            Escalate
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title="Detection details" icon={AlertTriangle}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Alert ID" value={alert.id} />
              <Field label="Severity" value={alert.severity} />
              <Field label="Status" value={alert.status} />
              <Field label="Confidence" value={`${Math.round(alert.confidence * 100)}%`} />
              <Field label="Detected at" value={formatDate(alert.timestamp)} />
              <Field label="Source" value={alert.source} mono={false} />
            </div>
            <div className="mt-4">
              <Field label="Triggering rule" value={alert.rule} mono={false} />
            </div>
          </Section>

          {host ? (
            <Section title="Affected host" icon={Server}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Hostname" value={
                  <Link to={`/observability/hosts/${host.id}`} className="text-cyan-400 hover:underline">
                    {host.host.name}
                  </Link>
                } />
                <Field label="IP" value={host.host.ip.join(', ')} />
                <Field label="OS" value={host.host.os.name} />
                <Field label="Type" value={host.host.type} />
                <Field label="Criticality" value={host.meta.criticality} />
                <Field label="Owner" value={host.meta.owner} mono={false} />
              </div>
            </Section>
          ) : (
            <Section title="Scope / entity" icon={Globe}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Scope" value={alert.scope} mono={false} />
                <Field label="Source" value={alert.source} mono={false} />
              </div>
              <p className="text-xs text-gray-600 mt-3 italic">
                This alert is not tied to a single host (cloud or cross-host correlation).
              </p>
            </Section>
          )}
        </div>

        <Section title="MITRE ATT&CK context" icon={Crosshair}>
          {mitre.length === 0 ? (
            <p className="text-xs text-gray-600 italic">No techniques associated with this alert.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {mitre.map((m) => (
                <span key={m} className="bg-red-500/10 text-red-300 border border-red-500/20 text-[10px] px-2 py-0.5 rounded-sm font-mono">
                  {m}
                </span>
              ))}
            </div>
          )}
        </Section>

        <Section title="Investigation" icon={Clock}>
          <p className="text-sm text-gray-500 leading-relaxed">
            The raw event timeline, correlated logs, and the full ECS document for this detection
            will be loaded here from Elasticsearch once log search is wired. This view currently
            shows the detection metadata stored alongside the alert.
          </p>
        </Section>
      </div>
    </div>
  );
}
