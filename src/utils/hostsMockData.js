// src/utils/hostsMockData.js
//
// ES/ECS-shaped mock host documents. The structure mirrors the Elastic Common
// Schema host.* and agent.* field sets plus SOC enrichment (risk, posture,
// alerts). When Elasticsearch is wired, getHostById can be replaced by a query
// that returns the same shape with no changes to the UI.

const iface = (name, type, mac, ip, speed, status = "up") => ({
  name,
  type,
  mac,
  ip,
  speed,
  status,
});
const svc = (type, port, protocol, version, status = "open") => ({
  type,
  port,
  protocol,
  version,
  status,
});
const alert = (name, rule, severity, status, confidence, timestamp) => ({
  name,
  rule,
  severity,
  status,
  confidence,
  timestamp,
});
const vuln = (cve, title, cvss, severity) => ({ cve, title, cvss, severity });
const usr = (name, type, lastLogon, loggedOn = false) => ({
  name,
  type,
  lastLogon,
  loggedOn,
});

export const HOSTS = [
  {
    id: "dc",
    status: "online",
    host: {
      name: "DC",
      hostname: "DC.syntrix.local",
      domain: "SYNTRIX",
      id: "8f4c1a90-1c2d-4e55-9b21-aa01dc000001",
      type: "server",
      architecture: "x86_64",
      uptimeSeconds: 4127400,
      os: {
        name: "Windows Server 2022",
        family: "windows",
        platform: "windows",
        version: "10.0.20348",
        kernel: "10.0.20348.2402",
        build: "20348.2402",
      },
      ip: ["10.0.0.10", "fe80::1c2d:aa01"],
      mac: ["00-15-5D-00-0A-10"],
    },
    hardware: {
      manufacturer: "Dell Inc.",
      model: "PowerEdge R650",
      serial: "DLR650-DC01",
      cpu: "Intel Xeon Silver 4314",
      cores: 16,
      memoryGb: 64,
      diskGb: 960,
      diskFreeGb: 412,
      virtual: false,
      hypervisor: null,
    },
    network: {
      gateway: "10.0.0.1",
      dns: ["127.0.0.1", "10.0.0.10"],
      subnet: "10.0.0.0/24",
      vlan: "VLAN10-CORE",
      dhcp: false,
      exposure: "internal",
      publicIp: null,
      geo: null,
      interfaces: [
        iface("Ethernet0", "wired", "00-15-5D-00-0A-10", "10.0.0.10", "10 Gbps"),
      ],
    },
    agent: {
      name: "winlogbeat-dc",
      type: "winlogbeat",
      version: "9.2.1",
      status: "online",
      lastCheckIn: "2026-06-30T11:58:40Z",
      integrations: ["Sysmon", "Winlogbeat", "Security Auditing"],
      eventsPerMinute: 1840,
      lastEventAt: "2026-06-30T11:59:51Z",
      dataStreams: ["logs-windows.sysmon", "logs-system.security"],
    },
    services: [
      svc("DNS", 53, "udp", "Microsoft DNS"),
      svc("Kerberos", 88, "tcp", "AD KDC"),
      svc("LDAP", 389, "tcp", "Active Directory"),
      svc("LDAPS", 636, "tcp", "Active Directory"),
      svc("SMB", 445, "tcp", "Windows File Sharing"),
    ],
    posture: {
      edr: { present: true, status: "healthy", product: "Microsoft Defender for Endpoint" },
      antivirus: { present: true, status: "up to date", product: "Microsoft Defender" },
      firewall: "enabled",
      diskEncryption: "BitLocker (enabled)",
      patchLevel: "Up to date (2026-06-25)",
      missingPatches: 0,
      compliance: { benchmark: "CIS Windows Server 2022", score: 88 },
      vulnerabilities: [
        vuln("CVE-2026-21401", "Kerberos elevation of privilege", 8.8, "high"),
      ],
    },
    risk: {
      score: 82,
      level: "high",
      mitre: ["T1558 Steal or Forge Kerberos Tickets", "T1003 OS Credential Dumping"],
      iocMatches: 1,
      isolation: "none",
    },
    alerts: [
      alert("Kerberoasting activity detected", "Suspicious Kerberos service ticket requests", "critical", "OPEN", 0.91, "2026-06-30T10:42:11Z"),
      alert("Anomalous LDAP enumeration", "High volume LDAP queries from single host", "high", "IN_PROGRESS", 0.76, "2026-06-30T09:15:03Z"),
    ],
    users: [
      usr("SYNTRIX\\administrator", "admin", "2026-06-30T08:01:22Z", true),
      usr("SYNTRIX\\svc-backup", "service", "2026-06-30T03:00:05Z", true),
    ],
    meta: {
      description: "Domain Controller",
      criticality: "critical",
      owner: "Infrastructure Team",
      tags: ["windows", "active-directory", "crown-jewel"],
      firstSeen: "2025-11-02T14:20:00Z",
      lastSeen: "2026-06-30T11:59:51Z",
    },
  },
  {
    id: "fs01",
    status: "online",
    host: {
      name: "FS01",
      hostname: "FS01.syntrix.local",
      domain: "SYNTRIX",
      id: "8f4c1a90-1c2d-4e55-9b21-aa01fs000002",
      type: "server",
      architecture: "x86_64",
      uptimeSeconds: 1894500,
      os: {
        name: "Windows Server 2019",
        family: "windows",
        platform: "windows",
        version: "10.0.17763",
        kernel: "10.0.17763.5576",
        build: "17763.5576",
      },
      ip: ["10.0.0.20"],
      mac: ["00-15-5D-00-0A-20"],
    },
    hardware: {
      manufacturer: "Dell Inc.",
      model: "PowerEdge R740",
      serial: "DLR740-FS01",
      cpu: "Intel Xeon Gold 5218",
      cores: 16,
      memoryGb: 128,
      diskGb: 8192,
      diskFreeGb: 1740,
      virtual: false,
      hypervisor: null,
    },
    network: {
      gateway: "10.0.0.1",
      dns: ["10.0.0.10"],
      subnet: "10.0.0.0/24",
      vlan: "VLAN10-CORE",
      dhcp: false,
      exposure: "internal",
      publicIp: null,
      geo: null,
      interfaces: [
        iface("Ethernet0", "wired", "00-15-5D-00-0A-20", "10.0.0.20", "10 Gbps"),
      ],
    },
    agent: {
      name: "winlogbeat-fs01",
      type: "winlogbeat",
      version: "9.2.1",
      status: "online",
      lastCheckIn: "2026-06-30T11:59:10Z",
      integrations: ["Sysmon", "Winlogbeat", "File Integrity Monitoring"],
      eventsPerMinute: 620,
      lastEventAt: "2026-06-30T11:59:48Z",
      dataStreams: ["logs-windows.sysmon", "logs-system.security"],
    },
    services: [
      svc("SMB", 445, "tcp", "Windows File Sharing"),
      svc("RPC", 135, "tcp", "Microsoft RPC"),
      svc("WinRM", 5985, "tcp", "Windows Remote Management"),
    ],
    posture: {
      edr: { present: true, status: "healthy", product: "Microsoft Defender for Endpoint" },
      antivirus: { present: true, status: "up to date", product: "Microsoft Defender" },
      firewall: "enabled",
      diskEncryption: "BitLocker (enabled)",
      patchLevel: "Up to date (2026-06-25)",
      missingPatches: 2,
      compliance: { benchmark: "CIS Windows Server 2019", score: 81 },
      vulnerabilities: [
        vuln("CVE-2026-0211", "SMB remote code execution", 9.1, "critical"),
      ],
    },
    risk: {
      score: 64,
      level: "medium",
      mitre: ["T1021.002 SMB/Windows Admin Shares", "T1486 Data Encrypted for Impact"],
      iocMatches: 0,
      isolation: "none",
    },
    alerts: [
      alert("Mass file access detected", "Unusual volume of file reads in short window", "high", "OPEN", 0.83, "2026-06-30T07:55:40Z"),
      alert("New admin share created", "Administrative share creation on file server", "medium", "RESOLVED", 0.6, "2026-06-29T22:11:09Z"),
    ],
    users: [
      usr("SYNTRIX\\kbriggs", "domain", "2026-06-30T09:32:00Z", false),
      usr("SYNTRIX\\svc-backup", "service", "2026-06-30T03:05:00Z", true),
    ],
    meta: {
      description: "File Server 01",
      criticality: "high",
      owner: "Infrastructure Team",
      tags: ["windows", "file-server"],
      firstSeen: "2025-11-02T14:25:00Z",
      lastSeen: "2026-06-30T11:59:48Z",
    },
  },
  {
    id: "ws-kbriggs",
    status: "online",
    host: {
      name: "WS-kbriggs",
      hostname: "WS-kbriggs.syntrix.local",
      domain: "SYNTRIX",
      id: "8f4c1a90-1c2d-4e55-9b21-aa01ws000003",
      type: "workstation",
      architecture: "x86_64",
      uptimeSeconds: 28800,
      os: {
        name: "Windows 11 Pro",
        family: "windows",
        platform: "windows",
        version: "10.0.26100",
        kernel: "10.0.26100.863",
        build: "26100.863",
      },
      ip: ["10.0.20.45"],
      mac: ["3C-52-82-1A-4B-7C"],
    },
    hardware: {
      manufacturer: "Lenovo",
      model: "ThinkPad T14 Gen 4",
      serial: "LNV-T14-KB044",
      cpu: "Intel Core i7-1355U",
      cores: 10,
      memoryGb: 32,
      diskGb: 512,
      diskFreeGb: 188,
      virtual: false,
      hypervisor: null,
    },
    network: {
      gateway: "10.0.20.1",
      dns: ["10.0.0.10"],
      subnet: "10.0.20.0/24",
      vlan: "VLAN20-USERS",
      dhcp: true,
      exposure: "internal",
      publicIp: null,
      geo: null,
      interfaces: [
        iface("Wi-Fi", "wireless", "3C-52-82-1A-4B-7C", "10.0.20.45", "866 Mbps"),
        iface("Ethernet", "wired", "3C-52-82-1A-4B-7D", null, "1 Gbps", "down"),
      ],
    },
    agent: {
      name: "elastic-agent-kbriggs",
      type: "elastic-agent",
      version: "9.2.1",
      status: "online",
      lastCheckIn: "2026-06-30T11:57:02Z",
      integrations: ["Sysmon", "Elastic Defend", "Winlogbeat"],
      eventsPerMinute: 95,
      lastEventAt: "2026-06-30T11:59:40Z",
      dataStreams: ["logs-windows.sysmon", "logs-endpoint.events.process"],
    },
    services: [
      svc("RPC", 135, "tcp", "Microsoft RPC"),
      svc("RDP", 3389, "tcp", "Remote Desktop", "filtered"),
    ],
    posture: {
      edr: { present: true, status: "healthy", product: "Elastic Defend" },
      antivirus: { present: true, status: "up to date", product: "Microsoft Defender" },
      firewall: "enabled",
      diskEncryption: "BitLocker (enabled)",
      patchLevel: "Up to date (2026-06-28)",
      missingPatches: 0,
      compliance: { benchmark: "CIS Windows 11", score: 76 },
      vulnerabilities: [],
    },
    risk: {
      score: 71,
      level: "high",
      mitre: ["T1566.001 Spearphishing Attachment", "T1204.002 Malicious File"],
      iocMatches: 2,
      isolation: "none",
    },
    alerts: [
      alert("Macro spawned PowerShell", "Office application spawned a scripting engine", "critical", "OPEN", 0.94, "2026-06-30T11:20:33Z"),
      alert("Connection to known-bad domain", "Outbound traffic to threat-intel match", "high", "OPEN", 0.88, "2026-06-30T11:22:10Z"),
    ],
    users: [usr("SYNTRIX\\kbriggs", "domain", "2026-06-30T08:00:12Z", true)],
    meta: {
      description: "Workstation for K. Briggs",
      criticality: "medium",
      owner: "K. Briggs",
      tags: ["windows", "workstation", "endpoint"],
      firstSeen: "2026-01-14T09:00:00Z",
      lastSeen: "2026-06-30T11:59:40Z",
    },
  },
  {
    id: "flask-webserver",
    status: "online",
    host: {
      name: "flask-webserver",
      hostname: "flask-web-01",
      domain: "dmz.syntrix.local",
      id: "8f4c1a90-1c2d-4e55-9b21-aa01wb000004",
      type: "server",
      architecture: "x86_64",
      uptimeSeconds: 6048000,
      os: {
        name: "Ubuntu 22.04.4 LTS",
        family: "debian",
        platform: "ubuntu",
        version: "22.04.4",
        kernel: "5.15.0-105-generic",
        build: "Jammy Jellyfish",
      },
      ip: ["172.16.5.30", "203.0.113.45"],
      mac: ["02-42-AC-10-05-1E"],
    },
    hardware: {
      manufacturer: "Amazon EC2",
      model: "t3.medium",
      serial: "i-0ab12cd34ef567890",
      cpu: "Intel Xeon Platinum 8259CL (vCPU)",
      cores: 2,
      memoryGb: 4,
      diskGb: 50,
      diskFreeGb: 21,
      virtual: true,
      hypervisor: "AWS Nitro",
    },
    network: {
      gateway: "172.16.5.1",
      dns: ["172.16.5.2"],
      subnet: "172.16.5.0/24",
      vlan: "DMZ",
      dhcp: true,
      exposure: "internet-facing",
      publicIp: "203.0.113.45",
      geo: { country: "United States", city: "Ashburn", asn: "AS14618 Amazon" },
      interfaces: [
        iface("eth0", "wired", "02-42-AC-10-05-1E", "172.16.5.30", "5 Gbps"),
      ],
    },
    agent: {
      name: "elastic-agent-flask",
      type: "elastic-agent",
      version: "9.2.1",
      status: "online",
      lastCheckIn: "2026-06-30T11:59:30Z",
      integrations: ["Auditbeat", "Filebeat (nginx)", "Filebeat (system)"],
      eventsPerMinute: 2300,
      lastEventAt: "2026-06-30T11:59:55Z",
      dataStreams: ["logs-nginx.access", "logs-system.auth", "logs-auditd.log"],
    },
    services: [
      svc("HTTP", 80, "tcp", "nginx 1.18.0"),
      svc("HTTPS", 443, "tcp", "nginx 1.18.0"),
      svc("SSH", 22, "tcp", "OpenSSH 8.9p1"),
      svc("Gunicorn", 8000, "tcp", "Flask app", "internal"),
    ],
    posture: {
      edr: { present: true, status: "healthy", product: "Elastic Defend" },
      antivirus: { present: false, status: "n/a", product: null },
      firewall: "ufw (enabled)",
      diskEncryption: "LUKS (enabled)",
      patchLevel: "Pending reboot (kernel update)",
      missingPatches: 5,
      compliance: { benchmark: "CIS Ubuntu 22.04", score: 69 },
      vulnerabilities: [
        vuln("CVE-2026-1099", "nginx HTTP/2 request smuggling", 7.5, "high"),
        vuln("CVE-2026-0921", "OpenSSH authentication bypass", 9.8, "critical"),
      ],
    },
    risk: {
      score: 90,
      level: "critical",
      mitre: ["T1190 Exploit Public-Facing Application", "T1505.003 Web Shell"],
      iocMatches: 4,
      isolation: "none",
    },
    alerts: [
      alert("Possible SQL injection", "Web request matching SQLi pattern", "critical", "OPEN", 0.89, "2026-06-30T11:40:55Z"),
      alert("Web scanning detected", "High rate of 404s from single source IP", "medium", "IN_PROGRESS", 0.7, "2026-06-30T11:05:18Z"),
      alert("Suspicious file written to webroot", "New file created in served directory", "high", "OPEN", 0.85, "2026-06-30T11:44:02Z"),
    ],
    users: [
      usr("ubuntu", "local", "2026-06-29T18:02:00Z", false),
      usr("www-data", "service", "2026-06-30T11:59:00Z", true),
    ],
    meta: {
      description: "Public Flask webserver",
      criticality: "critical",
      owner: "Application Team",
      tags: ["linux", "internet-facing", "web", "dmz"],
      firstSeen: "2025-12-01T10:00:00Z",
      lastSeen: "2026-06-30T11:59:55Z",
    },
  },
  {
    id: "ubuntu-db",
    status: "online",
    host: {
      name: "ubuntu-db",
      hostname: "ubuntu-db-01",
      domain: "syntrix.local",
      id: "8f4c1a90-1c2d-4e55-9b21-aa01db000005",
      type: "server",
      architecture: "x86_64",
      uptimeSeconds: 8294400,
      os: {
        name: "Ubuntu 22.04.4 LTS",
        family: "debian",
        platform: "ubuntu",
        version: "22.04.4",
        kernel: "5.15.0-105-generic",
        build: "Jammy Jellyfish",
      },
      ip: ["10.0.30.15"],
      mac: ["02-42-AC-10-1E-0F"],
    },
    hardware: {
      manufacturer: "VMware",
      model: "VMware Virtual Platform",
      serial: "VMW-DB-0005",
      cpu: "Intel Xeon Gold 6248 (vCPU)",
      cores: 8,
      memoryGb: 64,
      diskGb: 2048,
      diskFreeGb: 690,
      virtual: true,
      hypervisor: "VMware ESXi 8.0",
    },
    network: {
      gateway: "10.0.30.1",
      dns: ["10.0.0.10"],
      subnet: "10.0.30.0/24",
      vlan: "VLAN30-DATA",
      dhcp: false,
      exposure: "internal",
      publicIp: null,
      geo: null,
      interfaces: [
        iface("ens160", "wired", "02-42-AC-10-1E-0F", "10.0.30.15", "10 Gbps"),
      ],
    },
    agent: {
      name: "elastic-agent-db",
      type: "elastic-agent",
      version: "9.2.1",
      status: "online",
      lastCheckIn: "2026-06-30T11:58:55Z",
      integrations: ["Auditbeat", "Filebeat (postgresql)", "Filebeat (system)"],
      eventsPerMinute: 410,
      lastEventAt: "2026-06-30T11:59:33Z",
      dataStreams: ["logs-postgresql.log", "logs-system.auth"],
    },
    services: [
      svc("PostgreSQL", 5432, "tcp", "PostgreSQL 16.2"),
      svc("SSH", 22, "tcp", "OpenSSH 8.9p1"),
    ],
    posture: {
      edr: { present: true, status: "healthy", product: "Elastic Defend" },
      antivirus: { present: false, status: "n/a", product: null },
      firewall: "ufw (enabled)",
      diskEncryption: "LUKS (enabled)",
      patchLevel: "Up to date (2026-06-27)",
      missingPatches: 0,
      compliance: { benchmark: "CIS Ubuntu 22.04", score: 84 },
      vulnerabilities: [],
    },
    risk: {
      score: 58,
      level: "medium",
      mitre: ["T1110 Brute Force", "T1078 Valid Accounts"],
      iocMatches: 0,
      isolation: "none",
    },
    alerts: [
      alert("Repeated failed SSH logins", "Multiple authentication failures from single IP", "medium", "OPEN", 0.72, "2026-06-30T10:15:44Z"),
    ],
    users: [
      usr("postgres", "service", "2026-06-30T11:59:00Z", true),
      usr("dbadmin", "local", "2026-06-30T07:40:00Z", false),
    ],
    meta: {
      description: "Primary Database Server",
      criticality: "critical",
      owner: "Data Team",
      tags: ["linux", "database", "crown-jewel"],
      firstSeen: "2025-11-20T12:00:00Z",
      lastSeen: "2026-06-30T11:59:33Z",
    },
  },
  {
    id: "kali-pentest",
    status: "online",
    host: {
      name: "kali-pentest",
      hostname: "kali-pentest",
      domain: "syntrix.local",
      id: "8f4c1a90-1c2d-4e55-9b21-aa01kl000006",
      type: "workstation",
      architecture: "x86_64",
      uptimeSeconds: 115200,
      os: {
        name: "Kali GNU/Linux Rolling",
        family: "debian",
        platform: "kali",
        version: "2026.1",
        kernel: "6.6.15-amd64",
        build: "kali-rolling",
      },
      ip: ["10.0.20.99"],
      mac: ["08-00-27-AB-CD-EF"],
    },
    hardware: {
      manufacturer: "VMware",
      model: "VMware Virtual Platform",
      serial: "VMW-KALI-0006",
      cpu: "Intel Core i7 (vCPU)",
      cores: 4,
      memoryGb: 8,
      diskGb: 120,
      diskFreeGb: 55,
      virtual: true,
      hypervisor: "VMware Workstation",
    },
    network: {
      gateway: "10.0.20.1",
      dns: ["10.0.0.10"],
      subnet: "10.0.20.0/24",
      vlan: "VLAN20-USERS",
      dhcp: true,
      exposure: "internal",
      publicIp: null,
      geo: null,
      interfaces: [
        iface("eth0", "wired", "08-00-27-AB-CD-EF", "10.0.20.99", "1 Gbps"),
      ],
    },
    agent: {
      name: "elastic-agent-kali",
      type: "elastic-agent",
      version: "9.2.1",
      status: "online",
      lastCheckIn: "2026-06-30T11:55:12Z",
      integrations: ["Auditbeat", "Packetbeat"],
      eventsPerMinute: 1500,
      lastEventAt: "2026-06-30T11:59:20Z",
      dataStreams: ["logs-auditd.log", "logs-network.flows"],
    },
    services: [svc("SSH", 22, "tcp", "OpenSSH 9.6p1")],
    posture: {
      edr: { present: false, status: "n/a", product: null },
      antivirus: { present: false, status: "n/a", product: null },
      firewall: "disabled",
      diskEncryption: "LUKS (enabled)",
      patchLevel: "Rolling (current)",
      missingPatches: 0,
      compliance: { benchmark: "n/a (tooling host)", score: null },
      vulnerabilities: [],
    },
    risk: {
      score: 40,
      level: "low",
      mitre: ["T1046 Network Service Scanning"],
      iocMatches: 0,
      isolation: "none",
    },
    alerts: [
      alert("Port scanning from internal host", "Many connection attempts across ports", "medium", "FALSE_POSITIVE", 0.65, "2026-06-30T09:50:00Z"),
    ],
    users: [usr("root", "local", "2026-06-30T07:10:00Z", true)],
    meta: {
      description: "Internal Security Testing",
      criticality: "low",
      owner: "Security Team",
      tags: ["linux", "kali", "pentest", "whitelisted"],
      firstSeen: "2026-03-01T08:00:00Z",
      lastSeen: "2026-06-30T11:59:20Z",
    },
  },
  {
    id: "ws-msmith",
    status: "offline",
    host: {
      name: "WS-msmith",
      hostname: "WS-msmith.syntrix.local",
      domain: "SYNTRIX",
      id: "8f4c1a90-1c2d-4e55-9b21-aa01ws000007",
      type: "workstation",
      architecture: "x86_64",
      uptimeSeconds: 0,
      os: {
        name: "Windows 11 Pro",
        family: "windows",
        platform: "windows",
        version: "10.0.26100",
        kernel: "10.0.26100.863",
        build: "26100.863",
      },
      ip: ["10.0.20.51"],
      mac: ["3C-52-82-9F-2A-11"],
    },
    hardware: {
      manufacturer: "HP",
      model: "EliteBook 840 G10",
      serial: "HP-840-MS051",
      cpu: "Intel Core i5-1335U",
      cores: 10,
      memoryGb: 16,
      diskGb: 512,
      diskFreeGb: 301,
      virtual: false,
      hypervisor: null,
    },
    network: {
      gateway: "10.0.20.1",
      dns: ["10.0.0.10"],
      subnet: "10.0.20.0/24",
      vlan: "VLAN20-USERS",
      dhcp: true,
      exposure: "internal",
      publicIp: null,
      geo: null,
      interfaces: [
        iface("Wi-Fi", "wireless", "3C-52-82-9F-2A-11", "10.0.20.51", "866 Mbps", "down"),
      ],
    },
    agent: {
      name: "elastic-agent-msmith",
      type: "elastic-agent",
      version: "9.2.0",
      status: "offline",
      lastCheckIn: "2026-06-29T17:42:00Z",
      integrations: ["Sysmon", "Elastic Defend"],
      eventsPerMinute: 0,
      lastEventAt: "2026-06-29T17:41:55Z",
      dataStreams: ["logs-windows.sysmon"],
    },
    services: [svc("RPC", 135, "tcp", "Microsoft RPC")],
    posture: {
      edr: { present: true, status: "stale", product: "Elastic Defend" },
      antivirus: { present: true, status: "out of date", product: "Microsoft Defender" },
      firewall: "enabled",
      diskEncryption: "BitLocker (enabled)",
      patchLevel: "Behind (2 updates pending)",
      missingPatches: 2,
      compliance: { benchmark: "CIS Windows 11", score: 73 },
      vulnerabilities: [
        vuln("CVE-2026-21401", "Kerberos elevation of privilege", 8.8, "high"),
      ],
    },
    risk: {
      score: 35,
      level: "low",
      mitre: [],
      iocMatches: 0,
      isolation: "none",
    },
    alerts: [],
    users: [usr("SYNTRIX\\msmith", "domain", "2026-06-29T16:30:00Z", false)],
    meta: {
      description: "Workstation for M. Smith",
      criticality: "medium",
      owner: "M. Smith",
      tags: ["windows", "workstation", "endpoint"],
      firstSeen: "2026-01-14T09:00:00Z",
      lastSeen: "2026-06-29T17:41:55Z",
    },
  },
  {
    id: "proxy-fw-01",
    status: "online",
    host: {
      name: "proxy-fw-01",
      hostname: "proxy-fw-01",
      domain: "syntrix.local",
      id: "8f4c1a90-1c2d-4e55-9b21-aa01fw000008",
      type: "firewall",
      architecture: "x86_64",
      uptimeSeconds: 15724800,
      os: {
        name: "pfSense",
        family: "freebsd",
        platform: "pfsense",
        version: "2.7.2",
        kernel: "FreeBSD 14.0-RELEASE",
        build: "2.7.2-RELEASE",
      },
      ip: ["10.0.0.1", "203.0.113.1"],
      mac: ["00-08-A2-0D-1F-01", "00-08-A2-0D-1F-02"],
    },
    hardware: {
      manufacturer: "Netgate",
      model: "Netgate 6100",
      serial: "NG6100-FW01",
      cpu: "Intel Atom C3758",
      cores: 8,
      memoryGb: 16,
      diskGb: 128,
      diskFreeGb: 96,
      virtual: false,
      hypervisor: null,
    },
    network: {
      gateway: "203.0.113.1",
      dns: ["1.1.1.1", "8.8.8.8"],
      subnet: "10.0.0.0/8",
      vlan: "ALL (trunk)",
      dhcp: false,
      exposure: "internet-facing",
      publicIp: "203.0.113.1",
      geo: { country: "United States", city: "Ashburn", asn: "AS14618 Amazon" },
      interfaces: [
        iface("WAN (igb0)", "wired", "00-08-A2-0D-1F-01", "203.0.113.1", "10 Gbps"),
        iface("LAN (igb1)", "wired", "00-08-A2-0D-1F-02", "10.0.0.1", "10 Gbps"),
      ],
    },
    agent: {
      name: "filebeat-fw01",
      type: "filebeat",
      version: "9.2.1",
      status: "online",
      lastCheckIn: "2026-06-30T11:59:50Z",
      integrations: ["Filebeat (pfSense)", "Syslog"],
      eventsPerMinute: 5200,
      lastEventAt: "2026-06-30T11:59:58Z",
      dataStreams: ["logs-pfsense.firewall", "logs-system.syslog"],
    },
    services: [
      svc("HTTPS (admin)", 443, "tcp", "pfSense WebGUI", "filtered"),
      svc("Syslog", 514, "udp", "rsyslog"),
    ],
    posture: {
      edr: { present: false, status: "n/a", product: null },
      antivirus: { present: false, status: "n/a", product: null },
      firewall: "self (active)",
      diskEncryption: "n/a",
      patchLevel: "Up to date (2026-06-20)",
      missingPatches: 0,
      compliance: { benchmark: "Firewall hardening baseline", score: 91 },
      vulnerabilities: [],
    },
    risk: {
      score: 68,
      level: "medium",
      mitre: ["T1190 Exploit Public-Facing Application"],
      iocMatches: 3,
      isolation: "none",
    },
    alerts: [
      alert("Blocked inbound exploit attempt", "IPS signature match on WAN interface", "high", "RESOLVED", 0.8, "2026-06-30T11:01:00Z"),
      alert("Port scan from external IP", "Sustained scan against WAN address", "medium", "OPEN", 0.74, "2026-06-30T11:35:22Z"),
    ],
    users: [usr("admin", "local", "2026-06-30T06:00:00Z", false)],
    meta: {
      description: "Main Gateway Firewall",
      criticality: "critical",
      owner: "Network Team",
      tags: ["network-device", "firewall", "internet-facing", "perimeter"],
      firstSeen: "2025-10-15T09:00:00Z",
      lastSeen: "2026-06-30T11:59:58Z",
    },
  },
];

// Assign deterministic ids to the seeded alerts so they can be addressed by route.
HOSTS.forEach((h) => {
  h.alerts.forEach((a, i) => {
    if (!a.id) a.id = `${h.id}-${String(i + 1).padStart(3, '0')}`;
  });
});

export const getHostById = (id) => HOSTS.find((h) => h.id === id) || null;

export const getAlertById = (alertId) => {
  for (const host of HOSTS) {
    const alert = host.alerts.find((a) => a.id === alertId);
    if (alert) return { alert, host };
  }
  return null;
};

const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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

// ECS-shaped skeleton used when a field is not supplied by the uploaded document.
const defaultHostSkeleton = (ip) => ({
  status: 'online',
  host: {
    name: '', hostname: '', domain: 'syntrix.local', id: '', type: 'server',
    architecture: 'unknown', uptimeSeconds: 0,
    os: { name: 'Unknown', family: 'unknown', platform: 'unknown', version: 'n/a', kernel: 'n/a', build: 'n/a' },
    ip: ip ? [ip] : [], mac: [],
  },
  hardware: {
    manufacturer: null, model: null, serial: null, cpu: null,
    cores: null, memoryGb: null, diskGb: null, diskFreeGb: null,
    virtual: false, hypervisor: null,
  },
  network: {
    gateway: null, dns: [], subnet: null, vlan: null, dhcp: true,
    exposure: 'internal', publicIp: null, geo: null,
    interfaces: ip ? [iface('primary', 'wired', 'n/a', ip, 'n/a', 'up')] : [],
  },
  agent: {
    name: 'pending-enrollment', type: 'n/a', version: 'n/a', status: 'pending',
    lastCheckIn: null, integrations: [], eventsPerMinute: 0, lastEventAt: null, dataStreams: [],
  },
  services: [],
  posture: {
    edr: { present: false, status: 'n/a', product: null },
    antivirus: { present: false, status: 'n/a', product: null },
    firewall: 'unknown', diskEncryption: 'unknown', patchLevel: 'unknown',
    missingPatches: 0, compliance: { benchmark: 'n/a', score: null }, vulnerabilities: [],
  },
  risk: { score: 0, level: 'low', mitre: [], iocMatches: 0, isolation: 'none' },
  alerts: [],
  users: [],
  meta: { description: '', criticality: 'medium', owner: 'Unassigned', tags: [], firstSeen: null, lastSeen: null },
});

// Adds a manually-registered host to the in-memory dataset and returns it.
// The five form fields are authoritative; an optional uploaded JSON document
// (ECS-shaped) fills in everything else (OS, hardware, network, agent, tags, ...).
export const addHost = ({
  name,
  description = '',
  ip = '',
  type = 'server',
  criticality = 'medium',
  details = null,
}) => {
  let base = slugify(name) || `host-${HOSTS.length + 1}`;
  let id = base;
  let n = 1;
  while (HOSTS.some((h) => h.id === id)) id = `${base}-${n++}`;

  const nowIso = new Date().toISOString();
  const skeleton = defaultHostSkeleton(ip);
  const merged = isPlainObject(details) ? deepMerge(skeleton, details) : skeleton;

  // Form fields win over anything in the uploaded document.
  merged.id = id;
  merged.host = isPlainObject(merged.host) ? merged.host : {};
  merged.host.name = name;
  merged.host.hostname = merged.host.hostname || name;
  merged.host.type = type;
  merged.host.id = merged.host.id || `manual-${id}`;
  if (ip) {
    const ips = ensureArray(merged.host.ip);
    merged.host.ip = ips.includes(ip) ? ips : [ip, ...ips];
  }
  merged.meta = isPlainObject(merged.meta) ? merged.meta : {};
  merged.meta.description = description || merged.meta.description || '';
  merged.meta.criticality = criticality;
  merged.meta.owner = merged.meta.owner || 'Unassigned';
  merged.meta.firstSeen = merged.meta.firstSeen || nowIso;
  merged.meta.lastSeen = merged.meta.lastSeen || nowIso;

  // Coerce the structures the UI iterates over so a malformed upload cannot crash a view.
  merged.host.ip = ensureArray(merged.host.ip);
  merged.host.mac = ensureArray(merged.host.mac);
  merged.network = isPlainObject(merged.network) ? merged.network : {};
  merged.network.dns = ensureArray(merged.network.dns);
  merged.network.interfaces = ensureArray(merged.network.interfaces);
  merged.agent = isPlainObject(merged.agent) ? merged.agent : {};
  merged.agent.integrations = ensureArray(merged.agent.integrations);
  merged.agent.dataStreams = ensureArray(merged.agent.dataStreams);
  merged.agent.eventsPerMinute = Number.isFinite(merged.agent.eventsPerMinute) ? merged.agent.eventsPerMinute : 0;
  merged.services = ensureArray(merged.services);
  merged.posture = isPlainObject(merged.posture) ? merged.posture : {};
  merged.posture.vulnerabilities = ensureArray(merged.posture.vulnerabilities);
  merged.risk = isPlainObject(merged.risk) ? merged.risk : {};
  merged.risk.mitre = ensureArray(merged.risk.mitre);
  merged.alerts = ensureArray(merged.alerts);
  merged.users = ensureArray(merged.users);
  merged.meta.tags = ensureArray(merged.meta.tags);

  // Give any uploaded alerts addressable ids.
  merged.alerts.forEach((a, i) => {
    if (a && !a.id) a.id = `${id}-${String(i + 1).padStart(3, '0')}`;
  });

  HOSTS.push(merged);
  return merged;
};
