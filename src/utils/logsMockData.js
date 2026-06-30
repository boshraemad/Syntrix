// src/utils/logsMockData.js
//
// ES/integration-shaped mock log sources. The structure mirrors an Elastic
// integration / data stream (data_stream.dataset, index, ingest stats) plus SOC
// context. getLogSourceById / addLogSource / updateLogSource are the only data
// touch-points, so they can later be backed by real Elasticsearch index stats
// without changing the UI.

const HIST_TIMES = [
  '11:40', '11:41', '11:42', '11:43', '11:44', '11:45', '11:46', '11:47', '11:48', '11:49',
  '11:50', '11:51', '11:52', '11:53', '11:54', '11:55', '11:56', '11:57', '11:58', '11:59',
];
const BASE_SHAPE = [2, 5, 12, 8, 18, 35, 58, 72, 45, 68, 55, 40, 22, 15, 28, 10, 5, 8, 2, 1];
const genHistogram = (scale) =>
  HIST_TIMES.map((time, i) => ({ time, count: Math.max(0, Math.round(BASE_SHAPE[i] * scale)) }));

const ev = (id, ts, fields) => ({ id, '@timestamp': ts, ...fields });

export const LOG_SOURCES = [
  {
    id: 'auditbeat-auditd',
    status: 'active',
    source: {
      name: '[Auditbeat] Auditd ECS',
      category: 'endpoint',
      vendor: 'Elastic',
      product: 'Auditbeat',
      description: 'Linux kernel audit framework events',
      dataset: 'auditd.log',
      type: 'logs',
      index: 'logs-auditd.log-default',
    },
    collector: { agent: 'Auditbeat', version: '9.2.1', pipeline: 'logs-auditd.log-1.0.0', format: 'ECS' },
    ingestion: {
      totalEvents: 4820153, events24h: 92110, eventsPerSecond: 1.1,
      lastEventAt: '2026-06-30T11:59:48Z', firstSeen: '2025-12-01T10:00:00Z', lagSeconds: 3,
    },
    storage: { indexSizeBytes: 6_120_000_000, docCount: 4820153, retentionDays: 90, ilmPolicy: 'logs-90d', shards: 2 },
    quality: { parseSuccessRate: 99.6, ecsCoverage: 98, fieldCount: 142 },
    detection: { rulesUsing: 6, alertsGenerated: 11, mitreTactics: ['Privilege Escalation', 'Persistence'] },
    hosts: ['flask-webserver', 'ubuntu-db', 'kali-pentest'],
    histogram: genHistogram(1),
    sampleEvents: [
      ev('au-1', '2026-06-30T11:59:48Z', { 'event.action': 'executed', 'event.category': 'process', 'process.name': 'sudo', 'user.name': 'www-data', 'host.name': 'flask-webserver' }),
      ev('au-2', '2026-06-30T11:58:30Z', { 'event.action': 'opened-file', 'event.category': 'file', 'file.path': '/etc/passwd', 'user.name': 'root', 'host.name': 'ubuntu-db' }),
      ev('au-3', '2026-06-30T11:57:02Z', { 'event.action': 'connected-to', 'event.category': 'network', 'destination.port': 443, 'user.name': 'root', 'host.name': 'kali-pentest' }),
    ],
    meta: { tags: ['linux', 'endpoint', 'audit'], owner: 'SOC Team', enabled: true, createdAt: '2025-12-01T10:00:00Z', updatedAt: '2026-06-30T11:59:48Z' },
  },
  {
    id: 'windows-sysmon',
    status: 'active',
    source: {
      name: '[Windows] Sysmon',
      category: 'windows',
      vendor: 'Microsoft / Sysinternals',
      product: 'Sysmon',
      description: 'System Monitor process, network, and file telemetry',
      dataset: 'windows.sysmon_operational',
      type: 'logs',
      index: 'logs-windows.sysmon_operational-default',
    },
    collector: { agent: 'Winlogbeat', version: '9.2.1', pipeline: 'logs-windows.sysmon-2.3.0', format: 'ECS' },
    ingestion: {
      totalEvents: 12940887, events24h: 248330, eventsPerSecond: 3.4,
      lastEventAt: '2026-06-30T11:59:55Z', firstSeen: '2025-11-02T14:25:00Z', lagSeconds: 2,
    },
    storage: { indexSizeBytes: 18_400_000_000, docCount: 12940887, retentionDays: 90, ilmPolicy: 'logs-90d', shards: 3 },
    quality: { parseSuccessRate: 99.9, ecsCoverage: 99, fieldCount: 210 },
    detection: { rulesUsing: 18, alertsGenerated: 34, mitreTactics: ['Execution', 'Defense Evasion', 'Command and Control'] },
    hosts: ['dc', 'fs01', 'ws-kbriggs', 'ws-msmith'],
    histogram: genHistogram(2.4),
    sampleEvents: [
      ev('sm-1', '2026-06-30T11:59:55Z', { 'event.code': '1', 'event.action': 'Process Create', 'process.name': 'powershell.exe', 'process.parent.name': 'winword.exe', 'host.name': 'WS-kbriggs' }),
      ev('sm-2', '2026-06-30T11:59:10Z', { 'event.code': '3', 'event.action': 'Network connection', 'destination.ip': '203.0.113.45', 'destination.port': 443, 'host.name': 'WS-kbriggs' }),
      ev('sm-3', '2026-06-30T11:58:40Z', { 'event.code': '11', 'event.action': 'File created', 'file.path': 'C:\\\\Users\\\\Public\\\\a.tmp', 'host.name': 'DC' }),
    ],
    meta: { tags: ['windows', 'endpoint', 'sysmon'], owner: 'SOC Team', enabled: true, createdAt: '2025-11-02T14:25:00Z', updatedAt: '2026-06-30T11:59:55Z' },
  },
  {
    id: 'windows-xmlwineventlog',
    status: 'active',
    source: {
      name: '[Windows] XmlWinEventLog',
      category: 'windows',
      vendor: 'Microsoft',
      product: 'Windows Event Log',
      description: 'Windows Security, System, and Application channels',
      dataset: 'system.security',
      type: 'logs',
      index: 'logs-system.security-default',
    },
    collector: { agent: 'Winlogbeat', version: '9.2.1', pipeline: 'logs-system.security-1.30.0', format: 'ECS' },
    ingestion: {
      totalEvents: 9120441, events24h: 175600, eventsPerSecond: 2.2,
      lastEventAt: '2026-06-30T11:59:51Z', firstSeen: '2025-11-02T14:25:00Z', lagSeconds: 4,
    },
    storage: { indexSizeBytes: 14_200_000_000, docCount: 9120441, retentionDays: 180, ilmPolicy: 'logs-180d', shards: 3 },
    quality: { parseSuccessRate: 99.7, ecsCoverage: 97, fieldCount: 188 },
    detection: { rulesUsing: 22, alertsGenerated: 41, mitreTactics: ['Credential Access', 'Lateral Movement'] },
    hosts: ['dc', 'fs01', 'ws-kbriggs', 'ws-msmith'],
    histogram: genHistogram(1.8),
    sampleEvents: [
      ev('we-1', '2026-06-30T11:59:51Z', { 'event.code': '4624', 'event.action': 'Logon', 'winlog.event_data.LogonType': '3', 'user.name': 'administrator', 'host.name': 'DC' }),
      ev('we-2', '2026-06-30T11:55:12Z', { 'event.code': '4769', 'event.action': 'Kerberos service ticket requested', 'user.name': 'svc-sql', 'host.name': 'DC' }),
      ev('we-3', '2026-06-30T11:50:03Z', { 'event.code': '4625', 'event.action': 'Failed logon', 'winlog.event_data.LogonType': '10', 'host.name': 'FS01' }),
    ],
    meta: { tags: ['windows', 'security', 'eventlog'], owner: 'SOC Team', enabled: true, createdAt: '2025-11-02T14:25:00Z', updatedAt: '2026-06-30T11:59:51Z' },
  },
  {
    id: 'filebeat-iis-access',
    status: 'active',
    source: {
      name: '[Filebeat] IIS Access Logs',
      category: 'application',
      vendor: 'Microsoft',
      product: 'Internet Information Services',
      description: 'IIS web server access logs',
      dataset: 'iis.access',
      type: 'logs',
      index: 'logs-iis.access-default',
    },
    collector: { agent: 'Filebeat', version: '9.2.1', pipeline: 'logs-iis.access-1.16.0', format: 'ECS' },
    ingestion: {
      totalEvents: 2310765, events24h: 61200, eventsPerSecond: 0.7,
      lastEventAt: '2026-06-30T11:59:30Z', firstSeen: '2026-01-10T08:00:00Z', lagSeconds: 6,
    },
    storage: { indexSizeBytes: 3_050_000_000, docCount: 2310765, retentionDays: 60, ilmPolicy: 'logs-60d', shards: 1 },
    quality: { parseSuccessRate: 98.9, ecsCoverage: 95, fieldCount: 96 },
    detection: { rulesUsing: 4, alertsGenerated: 7, mitreTactics: ['Initial Access'] },
    hosts: ['fs01'],
    histogram: genHistogram(0.6),
    sampleEvents: [
      ev('iis-1', '2026-06-30T11:59:30Z', { 'http.request.method': 'GET', 'url.path': '/login', 'http.response.status_code': 200, 'source.ip': '10.0.20.45', 'host.name': 'FS01' }),
      ev('iis-2', '2026-06-30T11:58:01Z', { 'http.request.method': 'POST', 'url.path': '/admin', 'http.response.status_code': 403, 'source.ip': '203.0.113.9', 'host.name': 'FS01' }),
    ],
    meta: { tags: ['windows', 'web', 'iis'], owner: 'Application Team', enabled: true, createdAt: '2026-01-10T08:00:00Z', updatedAt: '2026-06-30T11:59:30Z' },
  },
  {
    id: 'filebeat-haproxy',
    status: 'stale',
    source: {
      name: '[Filebeat] HAProxy',
      category: 'network',
      vendor: 'HAProxy',
      product: 'HAProxy',
      description: 'Load balancer access and health logs',
      dataset: 'haproxy.log',
      type: 'logs',
      index: 'logs-haproxy.log-default',
    },
    collector: { agent: 'Filebeat', version: '9.2.0', pipeline: 'logs-haproxy.log-1.7.0', format: 'ECS' },
    ingestion: {
      totalEvents: 1540220, events24h: 0, eventsPerSecond: 0,
      lastEventAt: '2026-06-29T22:14:00Z', firstSeen: '2026-02-01T09:00:00Z', lagSeconds: 49680,
    },
    storage: { indexSizeBytes: 1_980_000_000, docCount: 1540220, retentionDays: 60, ilmPolicy: 'logs-60d', shards: 1 },
    quality: { parseSuccessRate: 99.1, ecsCoverage: 94, fieldCount: 88 },
    detection: { rulesUsing: 2, alertsGenerated: 1, mitreTactics: [] },
    hosts: ['proxy-fw-01'],
    histogram: genHistogram(0),
    sampleEvents: [
      ev('hap-1', '2026-06-29T22:14:00Z', { 'haproxy.frontend_name': 'https-in', 'http.response.status_code': 200, 'source.ip': '203.0.113.20', 'host.name': 'proxy-fw-01' }),
    ],
    meta: { tags: ['network', 'load-balancer', 'haproxy'], owner: 'Network Team', enabled: true, createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-06-29T22:14:00Z' },
  },
  {
    id: 'network-zeek',
    status: 'active',
    source: {
      name: '[Network] Zeek',
      category: 'network',
      vendor: 'Zeek',
      product: 'Zeek Network Security Monitor',
      description: 'Network connection, DNS, and protocol metadata',
      dataset: 'zeek.connection',
      type: 'logs',
      index: 'logs-zeek.connection-default',
    },
    collector: { agent: 'Elastic Agent', version: '9.2.1', pipeline: 'logs-zeek.connection-2.10.0', format: 'ECS' },
    ingestion: {
      totalEvents: 22045901, events24h: 410500, eventsPerSecond: 5.9,
      lastEventAt: '2026-06-30T11:59:58Z', firstSeen: '2025-10-15T09:00:00Z', lagSeconds: 1,
    },
    storage: { indexSizeBytes: 31_700_000_000, docCount: 22045901, retentionDays: 30, ilmPolicy: 'logs-30d', shards: 4 },
    quality: { parseSuccessRate: 99.8, ecsCoverage: 99, fieldCount: 176 },
    detection: { rulesUsing: 14, alertsGenerated: 19, mitreTactics: ['Command and Control', 'Exfiltration', 'Discovery'] },
    hosts: ['proxy-fw-01'],
    histogram: genHistogram(4.2),
    sampleEvents: [
      ev('zk-1', '2026-06-30T11:59:58Z', { 'event.dataset': 'zeek.connection', 'source.ip': '10.0.20.99', 'destination.ip': '10.0.0.10', 'destination.port': 445, 'network.transport': 'tcp' }),
      ev('zk-2', '2026-06-30T11:59:20Z', { 'event.dataset': 'zeek.dns', 'dns.question.name': 'malicious.example', 'source.ip': '10.0.20.45' }),
    ],
    meta: { tags: ['network', 'zeek', 'perimeter'], owner: 'Network Team', enabled: true, createdAt: '2025-10-15T09:00:00Z', updatedAt: '2026-06-30T11:59:58Z' },
  },
  {
    id: 'cloud-aws-cloudtrail',
    status: 'active',
    source: {
      name: '[Cloud] AWS CloudTrail',
      category: 'cloud',
      vendor: 'Amazon Web Services',
      product: 'CloudTrail',
      description: 'AWS account API activity and management events',
      dataset: 'aws.cloudtrail',
      type: 'logs',
      index: 'logs-aws.cloudtrail-default',
    },
    collector: { agent: 'Elastic Agent', version: '9.2.1', pipeline: 'logs-aws.cloudtrail-2.30.0', format: 'ECS' },
    ingestion: {
      totalEvents: 845200, events24h: 18900, eventsPerSecond: 0.2,
      lastEventAt: '2026-06-30T11:57:40Z', firstSeen: '2026-01-05T00:00:00Z', lagSeconds: 140,
    },
    storage: { indexSizeBytes: 1_410_000_000, docCount: 845200, retentionDays: 365, ilmPolicy: 'logs-365d', shards: 1 },
    quality: { parseSuccessRate: 99.9, ecsCoverage: 98, fieldCount: 134 },
    detection: { rulesUsing: 9, alertsGenerated: 5, mitreTactics: ['Persistence', 'Privilege Escalation', 'Impact'] },
    hosts: [],
    histogram: genHistogram(0.3),
    sampleEvents: [
      ev('ct-1', '2026-06-30T11:57:40Z', { 'event.action': 'ConsoleLogin', 'event.outcome': 'success', 'cloud.account.id': '111122223333', 'user.name': 'iam-admin' }),
      ev('ct-2', '2026-06-30T11:40:11Z', { 'event.action': 'CreateAccessKey', 'event.outcome': 'success', 'cloud.account.id': '111122223333', 'user.name': 'ci-deploy' }),
    ],
    meta: { tags: ['cloud', 'aws', 'audit'], owner: 'Cloud Team', enabled: true, createdAt: '2026-01-05T00:00:00Z', updatedAt: '2026-06-30T11:57:40Z' },
  },
  {
    id: 'cloud-azure-activity',
    status: 'error',
    source: {
      name: '[Cloud] Azure Activity',
      category: 'cloud',
      vendor: 'Microsoft Azure',
      product: 'Azure Monitor',
      description: 'Azure subscription-level activity logs',
      dataset: 'azure.activitylogs',
      type: 'logs',
      index: 'logs-azure.activitylogs-default',
    },
    collector: { agent: 'Elastic Agent', version: '9.2.1', pipeline: 'logs-azure.activitylogs-1.12.0', format: 'ECS' },
    ingestion: {
      totalEvents: 312880, events24h: 0, eventsPerSecond: 0,
      lastEventAt: '2026-06-30T03:12:00Z', firstSeen: '2026-02-20T00:00:00Z', lagSeconds: 31680,
    },
    storage: { indexSizeBytes: 560_000_000, docCount: 312880, retentionDays: 365, ilmPolicy: 'logs-365d', shards: 1 },
    quality: { parseSuccessRate: 97.4, ecsCoverage: 93, fieldCount: 118 },
    detection: { rulesUsing: 5, alertsGenerated: 2, mitreTactics: ['Persistence'] },
    hosts: [],
    histogram: genHistogram(0),
    sampleEvents: [
      ev('az-1', '2026-06-30T03:12:00Z', { 'event.action': 'Microsoft.Authorization/roleAssignments/write', 'event.outcome': 'success', 'cloud.account.id': 'sub-9f2a', 'user.name': 'admin@contoso' }),
    ],
    meta: { tags: ['cloud', 'azure', 'audit'], owner: 'Cloud Team', enabled: true, createdAt: '2026-02-20T00:00:00Z', updatedAt: '2026-06-30T03:12:00Z' },
  },
];

// Shared helpers (kept local so this module owns its own normalization).
const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const ensureArray = (v) => (Array.isArray(v) ? v : []);
const deepMerge = (base, override) => {
  if (!isPlainObject(base) || !isPlainObject(override)) return override;
  const out = { ...base };
  for (const key of Object.keys(override)) {
    out[key] =
      isPlainObject(base[key]) && isPlainObject(override[key])
        ? deepMerge(base[key], override[key])
        : override[key];
  }
  return out;
};
const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const defaultSourceSkeleton = () => ({
  status: 'active',
  source: {
    name: '', category: 'application', vendor: 'Unknown', product: 'Unknown',
    description: '', dataset: 'custom.log', type: 'logs', index: 'logs-custom.log-default',
  },
  collector: { agent: 'Filebeat', version: 'n/a', pipeline: 'n/a', format: 'ECS' },
  ingestion: {
    totalEvents: 0, events24h: 0, eventsPerSecond: 0,
    lastEventAt: null, firstSeen: null, lagSeconds: 0,
  },
  storage: { indexSizeBytes: 0, docCount: 0, retentionDays: 90, ilmPolicy: 'logs-90d', shards: 1 },
  quality: { parseSuccessRate: 0, ecsCoverage: 0, fieldCount: 0 },
  detection: { rulesUsing: 0, alertsGenerated: 0, mitreTactics: [] },
  hosts: [],
  histogram: [],
  sampleEvents: [],
  meta: { tags: [], owner: 'Unassigned', enabled: true, createdAt: null, updatedAt: null },
});

// Applies the modal's form fields onto a log-source object (mutates and returns it).
const applyForm = (target, form) => {
  if (form.name !== undefined) target.source.name = form.name;
  if (form.description !== undefined) target.source.description = form.description;
  if (form.category) target.source.category = form.category;
  if (form.dataset) target.source.dataset = form.dataset;
  if (form.index) target.source.index = form.index;
  if (form.agent) target.collector.agent = form.agent;
  if (form.format) target.collector.format = form.format;
  if (form.tags !== undefined) target.meta.tags = ensureArray(form.tags);
  if (form.enabled !== undefined) target.meta.enabled = !!form.enabled;
  return target;
};

const normalize = (s) => {
  s.source = isPlainObject(s.source) ? s.source : {};
  s.collector = isPlainObject(s.collector) ? s.collector : {};
  s.ingestion = isPlainObject(s.ingestion) ? s.ingestion : {};
  s.storage = isPlainObject(s.storage) ? s.storage : {};
  s.quality = isPlainObject(s.quality) ? s.quality : {};
  s.detection = isPlainObject(s.detection) ? s.detection : {};
  s.detection.mitreTactics = ensureArray(s.detection.mitreTactics);
  s.hosts = ensureArray(s.hosts);
  s.histogram = ensureArray(s.histogram);
  s.sampleEvents = ensureArray(s.sampleEvents);
  s.meta = isPlainObject(s.meta) ? s.meta : {};
  s.meta.tags = ensureArray(s.meta.tags);
  return s;
};

export const getLogSourceById = (id) => LOG_SOURCES.find((s) => s.id === id) || null;

export const addLogSource = ({ details = null, ...form }) => {
  let base = slugify(form.name) || `source-${LOG_SOURCES.length + 1}`;
  let id = base;
  let n = 1;
  while (LOG_SOURCES.some((s) => s.id === id)) id = `${base}-${n++}`;

  const nowIso = new Date().toISOString();
  const skeleton = defaultSourceSkeleton();
  const merged = isPlainObject(details) ? deepMerge(skeleton, details) : skeleton;

  normalize(merged);
  applyForm(merged, form);

  merged.id = id;
  merged.meta.createdAt = merged.meta.createdAt || nowIso;
  merged.meta.updatedAt = nowIso;

  LOG_SOURCES.push(merged);
  return merged;
};

export const updateLogSource = (id, { details = null, ...form }) => {
  const source = LOG_SOURCES.find((s) => s.id === id);
  if (!source) return null;

  if (isPlainObject(details)) {
    Object.assign(source, deepMerge(source, details));
  }
  normalize(source);
  applyForm(source, form);
  source.meta.updatedAt = new Date().toISOString();
  return source;
};
