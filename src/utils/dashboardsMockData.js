// src/utils/dashboardsMockData.js
//
// Mock dashboards. Panels for the detail view are generated deterministically per
// dashboard id so each looks distinct but stable. Swap getDashboardById / addDashboard
// for real endpoints later with no UI change.

const RAW = [
  { title: "[Auditbeat Auditd] Executions ECS", desc: "Overview of kernel executions" },
  { title: "[Auditbeat Auditd] Overview ECS", desc: "Summary of Linux kernel audit events." },
  { title: "[Auditbeat Auditd] Sockets ECS", desc: "Summary of socket related syscall events." },
  { title: "[Auditbeat File Integrity] Overview ECS", desc: "Monitor file integrity events." },
  { title: "[Auditbeat System] Host Dashboard ECS", desc: "System Hosts" },
  { title: "[Auditbeat System] Login Dashboard ECS", desc: "System Logins" },
  { title: "[Auditbeat System] Package Dashboard ECS", desc: "System Packages" },
  { title: "[Auditbeat System] Process Dashboard ECS", desc: "System Processes" },
  { title: "[Auditbeat System] Socket Dashboard ECS", desc: "System Sockets" },
  { title: "[Auditbeat System] System Overview ECS", desc: "Overview of System Information." },
  { title: "[Auditbeat System] User Dashboard ECS", desc: "System Users" },
  { title: "[Elastic Agent] Agent metrics", desc: "Elastic Agent metrics dashboard" },
  { title: "[Filebeat AWS] CloudTrail", desc: "Summary of events from AWS CloudTrail." },
  { title: "[Filebeat AWS] ELB Access Log Overview", desc: "Filebeat AWS ELB Access Log Overview Dashboard" },
  { title: "[Filebeat AWS] S3 Server Access Log Overview", desc: "Filebeat AWS S3 Server Access Log Overview Dashboard" },
  { title: "[Filebeat AWS] VPC Flow Log Overview", desc: "Filebeat AWS VPC Flow Log Overview Dashboard" },
  { title: "[Filebeat ActiveMQ] Application Events", desc: "This dashboard shows application logs collected by the ActiveMQ filebeat module." },
  { title: "[Filebeat ActiveMQ] Audit Events", desc: "This dashboard shows audit logs collected by the ActiveMQ filebeat module." },
  { title: "[Filebeat Apache] Access and error logs ECS", desc: "Filebeat Apache module dashboard" },
  { title: "[Filebeat Auditd] Audit Events ECS", desc: "Dashboard for the Auditd Filebeat module" },
  { title: "[Filebeat Azure] Alerts Overview", desc: "This dashboard provides expanded alerts overview for Azure cloud" },
  { title: "[Filebeat Azure] Cloud Overview", desc: "This dashboard provides an overview of user activity, alerts and resource in Azure cloud." },
  { title: "[Filebeat Azure] User Activity", desc: "This dashboard shows expanded user activity in Azure cloud." },
  { title: "[Filebeat CEF] Endpoint OS Activity Dashboard", desc: "Operating system activity from endpoints." },
  { title: "[Filebeat CEF] Endpoint Overview Dashboard", desc: "Summary of endpoint event data." },
  { title: "[Filebeat CEF] Microsoft DNS Overview", desc: "Overview of Microsoft DNS activity." },
  { title: "[Filebeat CEF] Network Overview Dashboard", desc: "Network data overview." },
  { title: "[Filebeat CEF] Network Suspicious Activity Dashboard", desc: "Suspicious network activity overview" },
  { title: "[Filebeat Cisco] ASA Firewall", desc: "Sample dashboard for Cisco ASA Firewall devices" },
  { title: "[Filebeat CoreDNS] Overview", desc: "Overview of CoreDNS" },
  { title: "[Filebeat CyberArk PAS] Overview", desc: "Dashboard for CyberArk Privileged Access Security events." },
  { title: "[Filebeat Envoyproxy] Overview", desc: "Filebeat Envoyproxy Overview Dashboard" },
  { title: "[Filebeat GCP] Audit", desc: "Overview of audit events from Google Cloud." },
  { title: "[Filebeat HAProxy] Overview ECS", desc: "Filebeat HAProxy module dashboard" },
  { title: "[Filebeat IBM MQ] Overview of error log overview", desc: "Overview of IBM MQ" },
  { title: "[Filebeat IIS] Access and error logs ECS", desc: "Dashboard for the Filebeat IIS module" },
  { title: "[Filebeat Icinga] Debug Log ECS", desc: "Filebeat Icinga module dashboard for the debug logs" },
  { title: "[Filebeat Icinga] Main Log ECS", desc: "Filebeat Icinga module dashboard for the main log files" },
  { title: "[Filebeat Icinga] Startup Errors ECS", desc: "Filebeat Icinga module dashboard for startup errors" },
  { title: "[Filebeat Iptables] Overview ECS", desc: "Overview of the iptables events dashboard." },
  { title: "[Filebeat Iptables] Ubiquiti Firewall Overview ECS", desc: "Overview of the Ubiquiti Firewall iptables events dashboard." },
  { title: "[Filebeat Kafka] Overview ECS", desc: "Filebeat Kafka module dashboard" },
  { title: "[Filebeat Logstash] Logstash Logs ECS", desc: "Overview of Logstash logs" },
  { title: "[Filebeat Logstash] Slowlogs ECS", desc: "Overview of Logstash Slowlogs" },
  { title: "[Filebeat MISP] Overview", desc: "Overview dashboard for Filebeat MISP module." },
  { title: "[Filebeat Microsoft] ATP Overview", desc: "Microsoft Defender ATP Alert Overview" },
  { title: "[Filebeat MongoDB] Overview ECS", desc: "Filebeat MongoDB module overview" },
  { title: "[Filebeat MySQL] Overview ECS", desc: "Overview dashboard for the Filebeat MySQL module" },
  { title: "[Filebeat NATS] Overview ECS", desc: "Overview of NATS server statistics" },
  { title: "[Filebeat Netflow] Autonomous Systems", desc: "Autonomous systems Netflow" },
];

const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const tagsFor = (title) => {
  const m = title.match(/^\[([^\]]+)\]/);
  if (!m) return [];
  return [m[1].split(/\s+/)[0].toLowerCase()];
};

export const DASHBOARDS = (() => {
  const seen = new Set();
  return RAW.map((d, i) => {
    let id = slugify(d.title) || `dashboard-${i}`;
    let unique = id;
    let n = 1;
    while (seen.has(unique)) unique = `${id}-${n++}`;
    seen.add(unique);
    return { id: unique, title: d.title, desc: d.desc, tags: tagsFor(d.title), createdAt: '2026-01-15T00:00:00Z' };
  });
})();

export const getDashboardById = (id) => DASHBOARDS.find((d) => d.id === id) || null;

export const addDashboard = ({ title, description = '', tags = [] }) => {
  let base = slugify(title) || `dashboard-${DASHBOARDS.length + 1}`;
  let id = base;
  let n = 1;
  while (DASHBOARDS.some((d) => d.id === id)) id = `${base}-${n++}`;

  const dashboard = {
    id,
    title,
    desc: description,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString(),
  };
  DASHBOARDS.unshift(dashboard);
  return dashboard;
};

// Deterministic pseudo-data so each dashboard's panels are distinct but stable.
const hash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
};

export const getDashboardPanels = (dashboard) => {
  const seed = hash(dashboard.id);
  const events = 50_000 + (seed % 950_000);
  const hosts = 3 + (seed % 30);
  const alerts = seed % 40;
  const errorRate = ((seed % 50) / 10).toFixed(1);

  const histogram = Array.from({ length: 20 }, (_, i) => {
    const v = Math.abs(Math.sin((seed % 100) + i * 0.6)) * 100;
    return { time: `${String(11 + Math.floor(i / 12)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`, count: Math.round(v) };
  });

  const breakdownLabels = ['success', 'failure', 'unknown', 'error', 'info'];
  const breakdown = breakdownLabels.map((label, i) => ({
    label,
    value: 10 + ((seed >> (i + 1)) % 80),
  }));

  return {
    stats: [
      { label: 'Total events', value: events.toLocaleString(), color: '#38bdf8' },
      { label: 'Unique hosts', value: hosts, color: '#a855f7' },
      { label: 'Alerts', value: alerts, color: alerts ? '#ef4444' : '#22c55e' },
      { label: 'Error rate', value: `${errorRate}%`, color: '#f97316' },
    ],
    histogram,
    breakdown,
  };
};
