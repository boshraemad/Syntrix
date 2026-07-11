import React, { useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft, Server, Monitor, Shield, ShieldAlert, Cpu, HardDrive,
  Globe, Network, Activity, Users, AlertTriangle, Boxes, Lock, Wifi, Cable, Power, Trash2
} from 'lucide-react';
import { useGetDeviceById } from '@/features/devices/hooks/getDeviceById'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteDevice } from '@/services/devices.services';

// 💡 كومبوننت الحذف مدمج ومنسق بنفس ألوان واستايل أزرار الصفحة بدون أي تعديل في الـ Design
function DeviceDeleteButton({ deviceId }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      // فور الحذف بنجاح يتم توجيه المستخدم لصفحة الـ hosts الرئيسية
      navigate('/observability/hosts');
    },
  });

  const handleDeleteClick = () => {
    toast.promise(
      deleteMutation.mutateAsync(),
      {
        loading: 'Deleting device from cluster...',
        success: 'Device permanently deleted successfully!',
        error: (err) => err.response?.data?.message || 'Failed to delete device. Access denied.',
      },
      {
        style: {
          minWidth: '250px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  };

  return (
    <button
      onClick={handleDeleteClick}
      disabled={deleteMutation.isPending}
      className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 size={14} />
      {deleteMutation.isPending ? 'Deleting...' : 'Delete asset'}
    </button>
  );
}

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
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
};

const formatUptime = (seconds) => {
  if (!seconds) return 'n/a';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}d ${hours}h`;
};

const TABS = ['Overview', 'Network', 'Services', 'Security', 'Alerts', 'Users', 'Raw'];

/* الكومبوننتس المساعدة (Badge, Section, Field, StatCard) تظل كما هي تماماً */
function Badge({ children, color, className = '' }) {
  return (
    <span
      className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-sm ${className}`}
      style={color ? { backgroundColor: `${color}22`, color, border: `1px solid ${color}55` } : undefined}
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

export default function HostDetail() {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { data: host, isLoading, isError } = useGetDeviceById(hostId, true, true);

  const requestedTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    TABS.includes(requestedTab) ? requestedTab : 'Overview',
  );
  const [isolated, setIsolated] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 h-full items-center justify-center text-cyan-400 bg-[#050505] gap-4 font-mono text-xs">
        <Activity size={32} className="animate-pulse" />
        <p>Fetching asset telemetry from cluster...</p>
      </div>
    );
  }

  if (isError || !host) {
    return (
      <div className="flex flex-col flex-1 h-full items-center justify-center text-gray-400 bg-[#050505] gap-4">
        <ShieldAlert size={48} className="opacity-20" />
        <p>Host "{hostId}" was not found or failed to load.</p>
        <Link to="/observability/hosts" className="text-cyan-400 hover:underline text-sm">
          Back to Hosts
        </Link>
      </div>
    );
  }

  const online = host.status === 'online';
  const openAlerts = host.alerts?.filter((a) => a.status === 'OPEN' || a.status === 'IN_PROGRESS').length || 0;
  const sevCounts = host.alerts?.reduce((acc, a) => {
    const k = a.severity.toLowerCase();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="flex flex-col flex-1 h-full text-white overflow-hidden bg-[#050505]">
      {/* Top bar */}
      <div className="px-6 pt-4 pb-3 border-b border-white/5 bg-background">
        <Link
          to="/observability/hosts"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-widest font-mono mb-4"
        >
          <ChevronLeft size={14} /> Hosts
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg border border-purple-500/30 flex items-center justify-center bg-purple-500/5">
              {host.host?.type === 'firewall' ? <Shield className="text-cyan-400" size={22} />
                : host.host?.type === 'workstation' ? <Monitor className="text-cyan-400" size={22} />
                : <Server className="text-cyan-400" size={22} />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{host.host?.name || host.hostName}</h1>
                <span className="flex items-center gap-1.5 text-xs">
                  <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                  <span className={online ? 'text-green-400' : 'text-gray-500'}>
                    {online ? 'Online' : 'Offline'}
                  </span>
                </span>
              </div>
              <p className="text-gray-500 text-sm font-mono mt-0.5">
                {host.host?.hostname} • {host.host?.type} • {host.host?.domain}
              </p>
            </div>
          </div>

          {/* 💡 أزرار التحكم والـ Actions بالأعلى */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Risk</div>
              <div className="text-2xl font-mono font-bold" style={{ color: sevColor(host.risk?.level) }}>
                {host.risk?.score || 0}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-start mr-1">
              <Badge color={sevColor(host.meta?.criticality)}>{host.meta?.criticality || 'medium'} asset</Badge>
              {host.risk?.iocMatches > 0 && (
                <Badge color="#ef4444">{host.risk.iocMatches} IOC match</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsolated((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer border ${
                  isolated
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : 'bg-transparent text-gray-300 border-purple-500/30 hover:border-cyan-400/50 hover:text-white'
                }`}
              >
                <Power size={14} />
                {isolated ? 'Isolated' : 'Isolate host'}
              </button>

              {/* 💡 إضافة زر الحذف هنا ليكون متاحاً بجانب الـ Isolate */}
              <DeviceDeleteButton deviceId={hostId} />
            </div>
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
              {tab === 'Alerts' && openAlerts > 0 ? (
                <span>Alerts <span className="text-red-400">({openAlerts})</span></span>
              ) : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* تظل تفاصيل الـ Tabs المتبقية (Overview, Network, Services, Security, Alerts, Users, Raw) كما هي بدون أي تغيير تماماً لضمان عدم المساس بالـ Data Rendering */}
        {activeTab === 'Overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Risk score" value={host.risk?.score || 0} color={sevColor(host.risk?.level)} />
              <StatCard label="Open alerts" value={openAlerts} color={openAlerts ? '#ef4444' : '#22c55e'} />
              <StatCard label="Services" value={host.services?.length || 0} color="#38bdf8" />
              <StatCard label="Vulnerabilities" value={host.posture?.vulnerabilities?.length || 0} color={host.posture?.vulnerabilities?.length ? '#f97316' : '#22c55e'} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="Identity & Inventory" icon={Boxes}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Hostname" value={host.host?.name || host.hostName} />
                  <Field label="FQDN" value={host.host?.hostname} />
                  <Field label="Domain" value={host.host?.domain} />
                  <Field label="Host ID" value={host.host?.id || host.id} />
                  <Field label="Type" value={host.host?.type} />
                  <Field label="Owner" value={host.meta?.owner} mono={false} />
                  <Field label="First seen" value={formatDate(host.meta?.firstSeen)} />
                  <Field label="Last seen" value={formatDate(host.meta?.lastSeen)} />
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {host.meta?.tags?.map((t) => (
                    <span key={t} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] px-2 py-0.5 rounded-sm font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="Operating System" icon={Monitor}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="OS" value={host.host?.os?.name} />
                  <Field label="Family" value={host.host?.os?.family} />
                  <Field label="Platform" value={host.host?.os?.platform} />
                  <Field label="Version" value={host.host?.os?.version} />
                  <Field label="Kernel" value={host.host?.os?.kernel} />
                  <Field label="Build" value={host.host?.os?.build} />
                  <Field label="Architecture" value={host.host?.architecture} />
                  <Field label="Uptime" value={formatUptime(host.host?.uptimeSeconds)} />
                </div>
              </Section>

              <Section title="Hardware" icon={Cpu}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Manufacturer" value={host.hardware?.manufacturer} />
                  <Field label="Model" value={host.hardware?.model} />
                  <Field label="Serial" value={host.hardware?.serial} />
                  <Field label="Virtual" value={host.hardware?.virtual ? `Yes (${host.hardware.hypervisor})` : 'No (physical)'} />
                  <Field label="CPU" value={host.hardware?.cpu} />
                  <Field label="Cores" value={host.hardware?.cores} />
                  <Field label="Memory" value={host.hardware?.memoryGb ? `${host.hardware.memoryGb} GB` : null} />
                  <Field label="Disk" value={host.hardware?.diskGb ? `${host.hardware.diskFreeGb || 0} GB free / ${host.hardware.diskGb} GB` : null} />
                </div>
              </Section>

              <Section title="Agent & Telemetry" icon={Activity}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Agent" value={host.agent?.name} />
                  <Field label="Type" value={host.agent?.type} />
                  <Field label="Version" value={host.agent?.version} />
                  <Field label="Status" value={host.agent?.status} />
                  <Field label="Last check-in" value={formatDate(host.agent?.lastCheckIn)} />
                  <Field label="Last event" value={formatDate(host.agent?.lastEventAt)} />
                  <Field label="Events / min" value={host.agent?.eventsPerMinute?.toLocaleString()} />
                  <Field label="Data streams" value={host.agent?.dataStreams?.join(', ')} />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Integrations</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {host.agent?.integrations?.map((i) => (
                      <span key={i} className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] px-2 py-0.5 rounded-sm font-mono">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              </Section>
            </div>
          </>
        )}

        {activeTab === 'Network' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="Network Summary" icon={Globe}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Exposure" value={host.network?.exposure} />
                  <Field label="Public IP" value={host.network?.publicIp} />
                  <Field label="Gateway" value={host.network?.gateway} />
                  <Field label="Subnet" value={host.network?.subnet} />
                  <Field label="VLAN" value={host.network?.vlan} />
                  <Field label="DHCP" value={host.network?.dhcp ? 'Yes' : 'Static'} />
                  <Field label="DNS" value={host.network?.dns?.join(', ')} />
                  <Field label="Geo / ASN" value={host.network?.geo ? `${host.network.geo.city}, ${host.network.geo.country} (${host.network.geo.asn})` : null} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Field label="IP addresses" value={host.host?.ip?.join(', ') || host.ip} />
                  <Field label="MAC addresses" value={host.host?.mac?.join(', ')} />
                </div>
              </Section>

              <Section title="Interfaces" icon={Network}>
                <div className="space-y-3">
                  {host.network?.interfaces?.map((nic) => (
                    <div key={nic.name} className="bg-[#111] border border-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          {nic.type === 'wireless' ? <Wifi size={14} className="text-cyan-400" /> : <Cable size={14} className="text-cyan-400" />}
                          {nic.name}
                        </span>
                        <Badge color={nic.status === 'up' ? '#22c55e' : '#6b7280'}>{nic.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs font-mono text-gray-400">
                        <span>type: {nic.type}</span>
                        <span>speed: {nic.speed}</span>
                        <span>ip: {nic.ip || 'n/a'}</span>
                        <span>mac: {nic.mac}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </>
        )}

        {activeTab === 'Services' && (
          <Section title="Listening Services & Ports" icon={Boxes}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                    <th className="py-3 px-3 font-semibold">Service</th>
                    <th className="py-3 px-3 font-semibold">Port</th>
                    <th className="py-3 px-3 font-semibold">Protocol</th>
                    <th className="py-3 px-3 font-semibold">Version</th>
                    <th className="py-3 px-3 font-semibold">State</th>
                  </tr>
                </thead>
                <tbody>
                  {host.services?.map((s, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-cyan-500/5 transition-colors">
                      <td className="py-3 px-3 font-medium text-cyan-400">{s.type}</td>
                      <td className="py-3 px-3 font-mono text-gray-300">{s.port}</td>
                      <td className="py-3 px-3 font-mono text-gray-500 uppercase">{s.protocol}</td>
                      <td className="py-3 px-3 text-gray-400">{s.version}</td>
                      <td className="py-3 px-3">
                        <Badge color={s.status === 'open' ? '#22c55e' : s.status === 'filtered' ? '#eab308' : '#6b7280'}>{s.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {activeTab === 'Security' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="Security Posture" icon={Shield}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="EDR" value={host.posture?.edr?.present ? `${host.posture.edr.product} (${host.posture.edr.status})` : 'Not present'} mono={false} />
                  <Field label="Antivirus" value={host.posture?.antivirus?.present ? `${host.posture.antivirus.product} (${host.posture.antivirus.status})` : 'Not present'} mono={false} />
                  <Field label="Firewall" value={host.posture?.firewall} mono={false} />
                  <Field label="Disk encryption" value={host.posture?.diskEncryption} mono={false} />
                  <Field label="Patch level" value={host.posture?.patchLevel} mono={false} />
                  <Field label="Missing patches" value={host.posture?.missingPatches} />
                  <Field label="Compliance" value={host.posture?.compliance?.benchmark} mono={false} />
                  <Field label="Compliance score" value={host.posture?.compliance?.score === null || host.posture?.compliance?.score === undefined ? 'n/a' : `${host.posture.compliance.score}%`} />
                </div>
              </Section>

              <Section title="Risk & ATT&CK" icon={ShieldAlert}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Field label="Risk score" value={host.risk?.score} />
                  <Field label="Risk level" value={host.risk?.level} />
                  <Field label="IOC matches" value={host.risk?.iocMatches} />
                  <Field label="Isolation" value={isolated ? 'isolated (manual)' : host.risk?.isolation} />
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">MITRE ATT&CK techniques</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {!host.risk?.mitre || host.risk.mitre.length === 0 ? (
                    <span className="text-xs text-gray-600 italic">None observed</span>
                  ) : host.risk.mitre.map((m) => (
                    <span key={m} className="bg-red-500/10 text-red-300 border border-red-500/20 text-[10px] px-2 py-0.5 rounded-sm font-mono">
                      {m}
                    </span>
                  ))}
                </div>
              </Section>
            </div>

            <Section title="Vulnerabilities" icon={Lock}>
              {!host.posture?.vulnerabilities || host.posture.vulnerabilities.length === 0 ? (
                <p className="text-xs text-gray-600 italic">No known open vulnerabilities.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                        <th className="py-3 px-3 font-semibold">CVE</th>
                        <th className="py-3 px-3 font-semibold">Title</th>
                        <th className="py-3 px-3 font-semibold">CVSS</th>
                        <th className="py-3 px-3 font-semibold">Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {host.posture.vulnerabilities.map((v) => (
                        <tr key={v.cve} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-3 font-mono text-cyan-400">{v.cve}</td>
                          <td className="py-3 px-3 text-gray-300">{v.title}</td>
                          <td className="py-3 px-3 font-mono" style={{ color: sevColor(v.severity) }}>{v.cvss}</td>
                          <td className="py-3 px-3"><Badge color={sevColor(v.severity)}>{v.severity}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          </>
        )}

        {activeTab === 'Alerts' && (
          <>
            <div className="flex flex-wrap gap-3">
              {['critical', 'high', 'medium', 'low'].map((s) => (
                <div key={s} className="bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sevColor(s) }} />
                  <span className="text-xs text-gray-400 capitalize">{s}</span>
                  <span className="text-sm font-mono font-bold" style={{ color: sevColor(s) }}>{sevCounts[s] || 0}</span>
                </div>
              ))}
            </div>

            <Section title="Detections" icon={AlertTriangle}>
              {!host.alerts || host.alerts.length === 0 ? (
                <p className="text-xs text-gray-600 italic">No alerts recorded for this host.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                        <th className="py-3 px-3 font-semibold">Alert</th>
                        <th className="py-3 px-3 font-semibold">Rule</th>
                        <th className="py-3 px-3 font-semibold">Severity</th>
                        <th className="py-3 px-3 font-semibold">Status</th>
                        <th className="py-3 px-3 font-semibold">Confidence</th>
                        <th className="py-3 px-3 font-semibold">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {host.alerts.map((a) => (
                        <tr
                          key={a.id}
                          onClick={() => navigate(`/security/alerts/${a.id}?from=host:${host.id}`)}
                          className="border-b border-white/5 hover:bg-cyan-500/5 transition-colors cursor-pointer group"
                        >
                          <td className="py-3 px-3 font-medium text-white group-hover:text-cyan-400 transition-colors">{a.name}</td>
                          <td className="py-3 px-3 text-gray-400 text-xs">{a.rule}</td>
                          <td className="py-3 px-3"><Badge color={sevColor(a.severity)}>{a.severity}</Badge></td>
                          <td className="py-3 px-3 font-mono text-xs text-gray-300">{a.status}</td>
                          <td className="py-3 px-3 font-mono text-gray-400">{Math.round(a.confidence * 100)}%</td>
                          <td className="py-3 px-3 font-mono text-xs text-gray-500">{formatDate(a.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          </>
        )}

        {activeTab === 'Users' && (
          <Section title="Users" icon={Users}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                    <th className="py-3 px-3 font-semibold">User</th>
                    <th className="py-3 px-3 font-semibold">Type</th>
                    <th className="py-3 px-3 font-semibold">Last logon</th>
                    <th className="py-3 px-3 font-semibold">Currently logged on</th>
                  </tr>
                </thead>
                <tbody>
                  {host.users?.map((u, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-mono text-cyan-400">{u.name}</td>
                      <td className="py-3 px-3 text-gray-400">{u.type}</td>
                      <td className="py-3 px-3 font-mono text-xs text-gray-500">{formatDate(u.lastLogon)}</td>
                      <td className="py-3 px-3">
                        <Badge color={u.loggedOn ? '#22c55e' : '#6b7280'}>{u.loggedOn ? 'Active' : 'No'}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {activeTab === 'Raw' && (
          <Section title="Raw host document (ECS)" icon={Boxes}>
            <pre className="text-xs font-mono text-gray-400 overflow-x-auto bg-[#111] border border-white/5 rounded-lg p-4 leading-relaxed">
              {JSON.stringify(host, null, 2)}
            </pre>
          </Section>
        )}
      </div>
    </div>
  );
}