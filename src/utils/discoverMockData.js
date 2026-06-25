// src/utils/discoverMockData.js

export const MOCK_FIELDS = {
  popular: [
    { name: "agent.hostname", type: "keyword", count: 176 },
    { name: "agent.version", type: "keyword", count: 176 },
  ],
  available: [
    { name: "@timestamp", type: "date" },
    { name: "agent.ephemeral_id", type: "keyword" },
    { name: "agent.hostname", type: "keyword" },
    { name: "agent.id", type: "keyword" },
    { name: "agent.name", type: "keyword" },
    { name: "agent.type", type: "keyword" },
    { name: "agent.version", type: "keyword" },
    { name: "data_stream.dataset", type: "keyword" },
    { name: "data_stream.namespace", type: "keyword" },
    { name: "data_stream.type", type: "keyword" },
    { name: "ecs.version", type: "keyword" },
    { name: "error.message", type: "text" },
    { name: "event.action", type: "keyword" },
    { name: "event.code", type: "keyword" },
    { name: "event.created", type: "date" },
    { name: "event.kind", type: "keyword" },
    { name: "event.outcome", type: "keyword" },
    { name: "event.provider", type: "keyword" },
    { name: "host.name", type: "keyword" },
    { name: "log.level", type: "keyword" },
    { name: "message", type: "text" },
  ],
  empty: [
    { name: "cloud.account.id", type: "keyword" },
    { name: "cloud.availability_zone", type: "keyword" },
    { name: "cloud.instance.id", type: "keyword" },
    { name: "container.id", type: "keyword" },
    { name: "destination.ip", type: "ip" },
    { name: "destination.port", type: "long" },
    { name: "dns.question.name", type: "keyword" },
    { name: "file.hash.md5", type: "keyword" },
    { name: "file.name", type: "keyword" },
    { name: "file.path", type: "keyword" },
    { name: "geo.city_name", type: "keyword" },
    { name: "network.protocol", type: "keyword" },
    { name: "process.name", type: "keyword" },
    { name: "process.pid", type: "long" },
    { name: "source.ip", type: "ip" },
    { name: "source.port", type: "long" },
    { name: "tags", type: "keyword" },
    { name: "threat.indicator.type", type: "keyword" },
    { name: "url.domain", type: "keyword" },
    { name: "user.name", type: "keyword" },
    { name: "winlog.channel", type: "keyword" },
    { name: "winlog.event_id", type: "keyword" },
    { name: "winlog.provider_name", type: "keyword" },
  ],
  meta: [
    { name: "_id", type: "_id" },
    { name: "_index", type: "_index" },
    { name: "_score", type: "_score" },
    { name: "_source", type: "_source" },
    { name: "_type", type: "_type" },
    { name: "_version", type: "_version" },
    { name: "_seq_no", type: "_seq_no" },
    { name: "_primary_term", type: "_primary_term" },
    { name: "_routing", type: "_routing" },
  ],
};

function generateLog(index) {
  const base = new Date("2026-01-27T23:43:35.352Z").getTime();
  const offset = index * 342;
  const ts = new Date(base + offset).toISOString();
  const ephemeralId = "b7e867d5-32d0-44b0-9a50-9a7f11705aaa";
  const agentId = "5e1095a2-2fab-42f3-99f7-ab70813996a";
  const hostname = "DESKTOP-KK064LC";
  const version = "9.2.1";
  const actions = [
    "User Account Management",
    "Security Group Management",
    "Process Creation",
    "Network Connection",
    "File Write",
    "Registry Modification",
  ];
  const outcomes = ["success", "failure", "unknown"];
  const logLevels = ["info", "warn", "error"];
  return {
    id: `doc-${index}`,
    "@timestamp": ts,
    "agent.ephemeral_id": ephemeralId,
    "agent.hostname": hostname,
    "agent.id": agentId,
    "agent.name": hostname,
    "agent.type": "winlogbeat",
    "agent.version": version,
    "data_stream.dataset": "system.security",
    "data_stream.namespace": "default",
    "data_stream.type": "logs",
    "ecs.version": "8.0.0",
    "event.action": actions[index % actions.length],
    "event.code": String(4624 + (index % 20)),
    "event.created": ts,
    "event.kind": "event",
    "event.outcome": outcomes[index % outcomes.length],
    "event.provider": "Microsoft-Windows-Security-Auditing",
    "host.name": hostname,
    "log.level": logLevels[index % logLevels.length],
    message: `Security audit event from ${hostname}: ${actions[index % actions.length]} detected at ${ts}`,
  };
}

export const MOCK_DOCUMENTS = Array.from({ length: 176 }, (_, i) =>
  generateLog(i)
);

function generateHistogramBin(timeStr, count) {
  return { time: timeStr, count };
}

export const MOCK_HISTOGRAM = [
  generateHistogramBin("01:44:20", 0),
  generateHistogramBin("01:44:22", 2),
  generateHistogramBin("01:44:24", 5),
  generateHistogramBin("01:44:26", 12),
  generateHistogramBin("01:44:28", 8),
  generateHistogramBin("01:44:30", 18),
  generateHistogramBin("01:44:32", 35),
  generateHistogramBin("01:44:34", 58),
  generateHistogramBin("01:44:36", 72),
  generateHistogramBin("01:44:38", 45),
  generateHistogramBin("01:44:40", 68),
  generateHistogramBin("01:44:42", 55),
  generateHistogramBin("01:44:44", 40),
  generateHistogramBin("01:44:46", 22),
  generateHistogramBin("01:44:48", 15),
  generateHistogramBin("01:44:50", 28),
  generateHistogramBin("01:44:52", 10),
  generateHistogramBin("01:44:54", 5),
  generateHistogramBin("01:44:56", 8),
  generateHistogramBin("01:44:58", 2),
  generateHistogramBin("01:45:00", 0),
];

export const DATE_RANGE = {
  from: "Dec 10, 2026 @ 01:44:20.233",
  to: "Dec 10, 2026 @ 01:44:21.466",
  interval: "Auto - second",
};
