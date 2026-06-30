// src/utils/mapsMockData.js

export const MAPS_MOCK_DATA = [
  {
    countryCode: "US",
    name: "United States of America",
    coordinates: [-100, 40],
    threatLevel: "critical",
    stats: {
      totalRequests: 14502,
      attacks: 1243,
      uniqueIPs: 450,
      protocols: {
        DNS: 4502,
        TCP: 8200,
        UDP: 1200,
        HTTP: 600
      }
    },
    recentEvents: [
      { timestamp: "2026-06-28T18:15:02Z", ip: "192.168.1.45", type: "Brute Force", status: "Blocked" },
      { timestamp: "2026-06-28T18:14:45Z", ip: "10.0.0.23", type: "SQL Injection", status: "Blocked" },
      { timestamp: "2026-06-28T18:10:12Z", ip: "172.16.0.4", type: "Malware Download", status: "Alert" }
    ]
  },
  {
    countryCode: "RU",
    name: "Russia",
    coordinates: [100, 60],
    threatLevel: "high",
    stats: {
      totalRequests: 8400,
      attacks: 950,
      uniqueIPs: 310,
      protocols: {
        DNS: 2100,
        TCP: 4000,
        UDP: 1500,
        HTTP: 800
      }
    },
    recentEvents: [
      { timestamp: "2026-06-28T18:12:05Z", ip: "45.33.22.11", type: "Port Scan", status: "Blocked" },
      { timestamp: "2026-06-28T18:09:33Z", ip: "88.44.22.10", type: "DDoS Attempt", status: "Alert" }
    ]
  },
  {
    countryCode: "CN",
    name: "China",
    coordinates: [104, 35],
    threatLevel: "high",
    stats: {
      totalRequests: 9200,
      attacks: 820,
      uniqueIPs: 280,
      protocols: {
        DNS: 3000,
        TCP: 5000,
        UDP: 800,
        HTTP: 400
      }
    },
    recentEvents: [
      { timestamp: "2026-06-28T18:18:22Z", ip: "110.55.44.33", type: "Ransomware Activity", status: "Alert" },
      { timestamp: "2026-06-28T18:05:11Z", ip: "220.11.22.33", type: "Unauthorized Login", status: "Blocked" }
    ]
  },
  {
    countryCode: "GB",
    name: "United Kingdom",
    coordinates: [-3, 55],
    threatLevel: "medium",
    stats: {
      totalRequests: 5400,
      attacks: 120,
      uniqueIPs: 150,
      protocols: {
        DNS: 1500,
        TCP: 3000,
        UDP: 400,
        HTTP: 500
      }
    },
    recentEvents: [
      { timestamp: "2026-06-28T17:45:00Z", ip: "8.8.8.8", type: "Suspicious Query", status: "Alert" }
    ]
  },
  {
    countryCode: "EG",
    name: "Egypt",
    coordinates: [30, 26],
    threatLevel: "info",
    stats: {
      totalRequests: 1200,
      attacks: 0,
      uniqueIPs: 45,
      protocols: {
        DNS: 400,
        TCP: 600,
        UDP: 100,
        HTTP: 100
      }
    },
    recentEvents: [
      { timestamp: "2026-06-28T15:30:00Z", ip: "41.33.22.11", type: "Failed Login", status: "Alert" }
    ]
  },
  {
    countryCode: "BR",
    name: "Brazil",
    coordinates: [-51, -14],
    threatLevel: "medium",
    stats: {
      totalRequests: 3200,
      attacks: 210,
      uniqueIPs: 180,
      protocols: {
        DNS: 800,
        TCP: 1500,
        UDP: 500,
        HTTP: 400
      }
    },
    recentEvents: [
      { timestamp: "2026-06-28T16:20:00Z", ip: "200.15.45.60", type: "Botnet Activity", status: "Blocked" }
    ]
  },
  {
    countryCode: "IN",
    name: "India",
    coordinates: [78, 20],
    threatLevel: "medium",
    stats: {
      totalRequests: 4500,
      attacks: 180,
      uniqueIPs: 210,
      protocols: {
        DNS: 1200,
        TCP: 2500,
        UDP: 600,
        HTTP: 200
      }
    },
    recentEvents: [
      { timestamp: "2026-06-28T17:10:00Z", ip: "115.11.22.33", type: "Spam Source", status: "Alert" }
    ]
  },
  {
    countryCode: "DE",
    name: "Germany",
    coordinates: [10, 51],
    threatLevel: "low",
    stats: {
      totalRequests: 2800,
      attacks: 0,
      uniqueIPs: 90,
      protocols: {
        DNS: 900,
        TCP: 1500,
        UDP: 200,
        HTTP: 200
      }
    },
    recentEvents: []
  },
  {
    countryCode: "JP",
    name: "Japan",
    coordinates: [138, 36],
    threatLevel: "low",
    stats: {
      totalRequests: 3100,
      attacks: 0,
      uniqueIPs: 110,
      protocols: {
        DNS: 1000,
        TCP: 1800,
        UDP: 150,
        HTTP: 150
      }
    },
    recentEvents: []
  },
  {
    countryCode: "ZA",
    name: "South Africa",
    coordinates: [22, -30],
    threatLevel: "info",
    stats: {
      totalRequests: 800,
      attacks: 0,
      uniqueIPs: 30,
      protocols: {
        DNS: 200,
        TCP: 500,
        UDP: 50,
        HTTP: 50
      }
    },
    recentEvents: []
  }
];

export const getThreatColor = (level) => {
  switch (level) {
    case 'critical': return '#ef4444'; // red-500
    case 'high': return '#f97316'; // orange-500
    case 'medium': return '#eab308'; // yellow-500
    case 'low': return '#3b82f6'; // blue-500
    case 'info': return '#8b5cf6'; // violet-500
    default: return '#38bdf8';
  }
};

export const getThreatOpacity = (level) => {
  switch (level) {
    case 'critical': return 0.8;
    case 'high': return 0.6;
    case 'medium': return 0.4;
    case 'low': return 0.2;
    case 'info': return 0.1;
    default: return 0;
  }
};
