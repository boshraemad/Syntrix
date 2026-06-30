// src/utils/securityData.js
//
// Security domain data: the consolidated alert queue (host alerts + standalone
// correlation/cloud alerts) and the advanced-hunting query runner. The runner is
// a client-side approximation of ES|QL and KQL over a mock event corpus; it is
// swappable for a real Elasticsearch query with no UI change.

import { HOSTS, getHostById, getAlertById } from './hostsMockData';
import { LOG_SOURCES } from './logsMockData';
import { MOCK_DOCUMENTS } from './discoverMockData';

// Alerts not tied to a single host: cloud/account-level and cross-host correlations.
export const STANDALONE_ALERTS = [
  {
    id: 'sa-001',
    name: 'AWS root account used',
    rule: 'Root account activity in CloudTrail',
    severity: 'high',
    status: 'OPEN',
    confidence: 0.9,
    timestamp: '2026-06-30T11:30:00Z',
    scope: 'AWS account 111122223333',
    source: 'AWS CloudTrail',
    mitre: ['T1078 Valid Accounts'],
    hostId: null,
  },
  {
    id: 'sa-002',
    name: 'Impossible travel sign-in',
    rule: 'Geo-velocity anomaly for identity',
    severity: 'medium',
    status: 'IN_PROGRESS',
    confidence: 0.71,
    timestamp: '2026-06-30T10:05:00Z',
    scope: 'Azure AD user admin@contoso',
    source: 'Azure Activity',
    mitre: ['T1078.004 Cloud Accounts'],
    hostId: null,
  },
  {
    id: 'sa-003',
    name: 'Lateral movement across multiple hosts',
    rule: 'Correlated SMB admin-share access chain',
    severity: 'critical',
    status: 'OPEN',
    confidence: 0.86,
    timestamp: '2026-06-30T11:48:00Z',
    scope: 'DC to FS01 to WS-kbriggs',
    source: 'Correlation engine',
    mitre: ['T1021.002 SMB/Windows Admin Shares', 'T1570 Lateral Tool Transfer'],
    hostId: 'dc',
  },
  {
    id: 'sa-004',
    name: 'Beaconing to external C2 (multiple hosts)',
    rule: 'Periodic outbound connections to rare destination',
    severity: 'high',
    status: 'OPEN',
    confidence: 0.79,
    timestamp: '2026-06-30T11:36:00Z',
    scope: '3 internal hosts',
    source: 'Zeek correlation',
    mitre: ['T1071 Application Layer Protocol', 'T1008 Fallback Channels'],
    hostId: 'proxy-fw-01',
  },
];

// Flattened alert queue across all hosts plus standalone alerts, each normalized
// with a hostId / display label so the list and detail view can render uniformly.
export const getAllAlerts = () => {
  const hostAlerts = HOSTS.flatMap((h) =>
    h.alerts.map((a) => ({
      ...a,
      hostId: h.id,
      hostName: h.host.name,
      scope: h.host.name,
      source: 'Host detection',
    })),
  );

  const standalone = STANDALONE_ALERTS.map((a) => {
    const host = a.hostId ? getHostById(a.hostId) : null;
    return {
      ...a,
      hostId: a.hostId || null,
      hostName: host ? host.host.name : a.scope || 'n/a',
      scope: a.scope || (host ? host.host.name : 'n/a'),
    };
  });

  return [...hostAlerts, ...standalone];
};

// Resolves an alert by id from either host alerts or standalone alerts.
export const getSecurityAlertById = (id) => {
  const fromHost = getAlertById(id);
  if (fromHost) return fromHost;

  const sa = STANDALONE_ALERTS.find((a) => a.id === id);
  if (sa) return { alert: sa, host: sa.hostId ? getHostById(sa.hostId) : null };

  return null;
};

// --- Advanced hunting -------------------------------------------------------

let _corpus = null;
const getCorpus = () => {
  if (_corpus) return _corpus;
  const logEvents = LOG_SOURCES.flatMap((s) =>
    s.sampleEvents.map((e) => ({
      ...e,
      'event.dataset': e['event.dataset'] || s.source.dataset,
      'agent.type': s.collector.agent,
    })),
  );
  _corpus = [...MOCK_DOCUMENTS, ...logEvents];
  return _corpus;
};

const asString = (v) => (v === null || v === undefined ? '' : String(v));
const recordValues = (rec) => Object.values(rec).map(asString);

// KQL subset: OR groups of AND clauses; each clause is field:value (substring /
// wildcard) or a bare keyword, with an optional NOT prefix.
const fieldMatch = (rec, field, val) => {
  const recVal = asString(rec[field]).toLowerCase();
  const needle = val.toLowerCase();
  if (needle.includes('*')) return recVal.includes(needle.replace(/\*/g, ''));
  return recVal === needle || recVal.includes(needle);
};

const matchKqlClause = (rec, clause) => {
  let negate = false;
  let c = clause.trim();
  if (/^not\s+/i.test(c)) {
    negate = true;
    c = c.replace(/^not\s+/i, '');
  }
  let result;
  const colon = c.indexOf(':');
  if (colon > -1) {
    const field = c.slice(0, colon).trim();
    const val = c.slice(colon + 1).trim().replace(/^"|"$/g, '');
    result = fieldMatch(rec, field, val);
  } else {
    const term = c.replace(/^"|"$/g, '').toLowerCase();
    result = term === '' || recordValues(rec).some((v) => v.toLowerCase().includes(term));
  }
  return negate ? !result : result;
};

const matchKql = (rec, query) => {
  const q = query.trim();
  if (!q) return true;
  return q.split(/\s+or\s+/i).some((group) =>
    group
      .split(/\s+and\s+/i)
      .map((s) => s.trim())
      .filter(Boolean)
      .every((clause) => matchKqlClause(rec, clause)),
  );
};

// ES|QL subset: FROM ... | WHERE ... | SORT ... | LIMIT n | STATS count() BY field
const matchEsqlCond = (rec, c) => {
  let m;
  if ((m = c.match(/^([\w.]+)\s*==\s*"?([^"]*)"?$/)))
    return asString(rec[m[1]]).toLowerCase() === m[2].toLowerCase();
  if ((m = c.match(/^([\w.]+)\s*!=\s*"?([^"]*)"?$/)))
    return asString(rec[m[1]]).toLowerCase() !== m[2].toLowerCase();
  if ((m = c.match(/^([\w.]+)\s+like\s+"?([^"]*)"?$/i)))
    return asString(rec[m[1]]).toLowerCase().includes(m[2].toLowerCase().replace(/\*/g, ''));
  if ((m = c.match(/^([\w.]+)\s*>\s*([\d.]+)$/))) return parseFloat(rec[m[1]]) > parseFloat(m[2]);
  if ((m = c.match(/^([\w.]+)\s*<\s*([\d.]+)$/))) return parseFloat(rec[m[1]]) < parseFloat(m[2]);
  const term = c.replace(/^"|"$/g, '').toLowerCase();
  return recordValues(rec).some((v) => v.toLowerCase().includes(term));
};

const matchEsqlWhere = (rec, cond) =>
  cond.split(/\s+or\s+/i).some((g) =>
    g
      .split(/\s+and\s+/i)
      .map((s) => s.trim())
      .filter(Boolean)
      .every((c) => matchEsqlCond(rec, c)),
  );

const runEsql = (corpus, query) => {
  const stages = query.split('|').map((s) => s.trim()).filter(Boolean);
  let rows = corpus.slice();
  let mode = 'events';
  let statsField = null;

  for (const stage of stages) {
    if (/^from\s+/i.test(stage)) {
      const src = stage.replace(/^from\s+/i, '').trim();
      if (src && src !== '*' && src !== 'logs-*' && src.includes('*')) {
        const core = src.replace(/^logs-/, '').replace(/\*$/, '').replace(/\.$/, '');
        if (core) {
          rows = rows.filter(
            (r) =>
              asString(r['event.dataset']).includes(core) ||
              asString(r['data_stream.dataset']).includes(core) ||
              asString(r['agent.type']).toLowerCase().includes(core.toLowerCase()),
          );
        }
      }
    } else if (/^where\s+/i.test(stage)) {
      const cond = stage.replace(/^where\s+/i, '');
      rows = rows.filter((r) => matchEsqlWhere(r, cond));
    } else if (/^limit\s+/i.test(stage)) {
      const n = parseInt(stage.replace(/^limit\s+/i, ''), 10);
      if (!isNaN(n)) rows = rows.slice(0, n);
    } else if (/^sort\s+/i.test(stage)) {
      const [f, dir] = stage.replace(/^sort\s+/i, '').trim().split(/\s+/);
      rows = [...rows].sort(
        (a, b) => asString(a[f]).localeCompare(asString(b[f])) * (/desc/i.test(dir || '') ? -1 : 1),
      );
    } else if (/^stats\s+/i.test(stage)) {
      const byMatch = stage.match(/by\s+([\w.]+)/i);
      statsField = byMatch ? byMatch[1] : null;
      mode = 'stats';
    }
  }

  if (mode === 'stats' && statsField) {
    const counts = {};
    for (const r of rows) {
      const key = asString(r[statsField]) || '(empty)';
      counts[key] = (counts[key] || 0) + 1;
    }
    const agg = Object.entries(counts)
      .map(([k, c]) => ({ [statsField]: k, count: c }))
      .sort((a, b) => b.count - a.count);
    return { mode: 'stats', columns: [statsField, 'count'], rows: agg };
  }

  return { mode: 'events', columns: ['@timestamp', 'Document'], rows };
};

export const runHuntingQuery = (query, lang) => {
  const start = typeof performance !== 'undefined' && performance.now ? performance.now() : 0;
  try {
    if (!query || !query.trim()) {
      return { mode: 'events', columns: [], rows: [], took: 0, total: 0, error: 'Enter a query to run.' };
    }
    const corpus = getCorpus();
    let res;
    if (lang === 'esql') {
      res = runEsql(corpus, query);
    } else {
      res = { mode: 'events', columns: ['@timestamp', 'Document'], rows: corpus.filter((r) => matchKql(r, query)) };
    }
    const elapsed = (typeof performance !== 'undefined' && performance.now ? performance.now() : 0) - start;
    const took = Math.max(1, Math.round(elapsed)) + (res.rows.length % 5);
    return { ...res, took, total: res.rows.length, error: null };
  } catch (e) {
    return { mode: 'events', columns: [], rows: [], took: 0, total: 0, error: e?.message || 'Query failed' };
  }
};

// Saved / example hunting queries. ES|QL for all; KQL where there is an equivalent
// (stats-style analytics are ES|QL only).
export const HUNTING_QUERIES = [
  { id: 'hq-1', category: 'Authentication', name: 'Failed Windows logons (4625)', esql: 'FROM logs-* | WHERE event.code == "4625" | LIMIT 100', kql: 'event.code:4625' },
  { id: 'hq-2', category: 'Authentication', name: 'Kerberos service ticket requests (4769)', esql: 'FROM logs-* | WHERE event.code == "4769"', kql: 'event.code:4769' },
  { id: 'hq-3', category: 'Process', name: 'Office app spawned PowerShell', esql: 'FROM logs-windows.* | WHERE process.name == "powershell.exe" AND process.parent.name == "winword.exe"', kql: 'process.name:powershell.exe and process.parent.name:winword.exe' },
  { id: 'hq-4', category: 'Process', name: 'Files created in Public folder', esql: 'FROM logs-* | WHERE file.path LIKE "*Public*"', kql: 'file.path:*Public*' },
  { id: 'hq-5', category: 'Network', name: 'Connections to SMB (445)', esql: 'FROM logs-* | WHERE destination.port == 445', kql: 'destination.port:445' },
  { id: 'hq-6', category: 'Network', name: 'Suspicious DNS lookups', esql: 'FROM logs-* | WHERE dns.question.name LIKE "*malicious*"', kql: 'dns.question.name:*malicious*' },
  { id: 'hq-7', category: 'Cloud', name: 'New IAM access keys', esql: 'FROM logs-aws.* | WHERE event.action == "CreateAccessKey"', kql: 'event.action:CreateAccessKey' },
  { id: 'hq-8', category: 'Cloud', name: 'Console / portal logins', esql: 'FROM logs-* | WHERE event.action == "ConsoleLogin"', kql: 'event.action:ConsoleLogin' },
  { id: 'hq-9', category: 'Analytics', name: 'Event volume by host', esql: 'FROM logs-* | STATS count() BY host.name' },
  { id: 'hq-10', category: 'Analytics', name: 'Top event actions', esql: 'FROM logs-* | STATS count() BY event.action' },
];
