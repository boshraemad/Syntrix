import React from 'react';
import { useNavigate } from 'react-router-dom';

const MODELS = [
  { name: 'User & Entity Behavior Analytics', kind: 'Anomaly detection', status: 'training', progress: 42.7 },
  { name: 'Beaconing / C2 detection', kind: 'Time-series', status: 'active', progress: 100 },
  { name: 'DGA domain classifier', kind: 'Classification', status: 'active', progress: 100 },
  { name: 'Rare process detection', kind: 'Population', status: 'preview', progress: 100 },
];

const ANOMALIES = [
  { host: 'WS-kbriggs', type: 'Unusual process ancestry', score: 92, time: '11:21' },
  { host: 'flask-webserver', type: 'Spike in outbound bytes', score: 87, time: '11:40' },
  { host: 'DC', type: 'Rare logon time for account', score: 78, time: '10:42' },
  { host: 'ubuntu-db', type: 'Atypical query volume', score: 64, time: '10:15' },
];

const STATUS_COLORS = { training: '#eab308', active: '#22c55e', preview: '#38bdf8' };

const scoreColor = (s) => (s >= 85 ? '#ef4444' : s >= 70 ? '#f97316' : '#eab308');

export default function MachineLearning() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full h-full bg-[#050505] overflow-y-auto relative font-sans">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden py-20 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="z-10 text-center mb-16 relative">
          <h1
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 via-purple-400 to-cyan-300 tracking-tight leading-tight mb-4"
            style={{ textShadow: '0 0 60px rgba(168,85,247,0.4)' }}
          >
            Advanced Machine Learning Model<br />is still under training
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-gray-400 font-mono text-sm uppercase tracking-[0.3em]">
              Neural Pathways Optimizing [ 42.7% ]
            </p>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-75" />
          </div>
        </div>

        <div className="z-10 relative flex items-center justify-center w-full max-w-lg">
          <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" style={{ borderTopColor: 'rgba(56,189,248,0.5)', borderRightColor: 'rgba(168,85,247,0.5)' }} />
          <svg viewBox="0 0 200 200" className="w-full h-full max-w-[300px] overflow-visible animate-[spin_20s_linear_infinite]">
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="1.5" strokeDasharray="15 15" className="animate-spin-reverse" style={{ animationDuration: '8s', transformOrigin: 'center' }} />
            {[
              { x: 100, y: 10, c: '#a855f7', d: '0s' },
              { x: 190, y: 100, c: '#38bdf8', d: '0.5s' },
              { x: 100, y: 190, c: '#a855f7', d: '1s' },
              { x: 10, y: 100, c: '#38bdf8', d: '1.5s' },
              { x: 160, y: 40, c: '#fff', d: '0.2s' },
              { x: 40, y: 160, c: '#fff', d: '0.7s' },
            ].map((node, i) => (
              <g key={i}>
                <line x1="100" y1="100" x2={node.x} y2={node.y} stroke="url(#lineGradient)" strokeWidth="1" className="opacity-50" />
                <circle cx={node.x} cy={node.y} r="3" fill={node.c} className="animate-ping" style={{ animationDuration: '3s', animationDelay: node.d }} />
                <circle cx={node.x} cy={node.y} r="3" fill={node.c} />
              </g>
            ))}
            <polygon points="100,10 160,40 190,100 100,190 40,160 10,100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <circle cx="100" cy="100" r="15" fill="url(#coreGlow)" className="animate-pulse" style={{ animationDuration: '2s' }} />
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="40%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(168,85,247,0.5)" />
                <stop offset="100%" stopColor="rgba(56,189,248,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Models and anomalies (preview content) */}
      <div className="max-w-6xl mx-auto px-6 pb-16 space-y-8 relative z-10">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODELS.map((m) => (
              <div key={m.name} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold rounded-sm px-2 py-0.5" style={{ backgroundColor: `${STATUS_COLORS[m.status]}22`, color: STATUS_COLORS[m.status], border: `1px solid ${STATUS_COLORS[m.status]}55` }}>
                    {m.status}
                  </span>
                  <span className="text-[10px] text-gray-500">{m.kind}</span>
                </div>
                <span className="text-sm font-semibold text-white leading-snug">{m.name}</span>
                <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: `${m.progress}%` }} />
                </div>
                <span className="text-[10px] text-gray-500 font-mono">
                  {m.status === 'training' ? `Training ${m.progress}%` : 'Ready'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-300">Recent anomalies (preview)</h2>
            <button onClick={() => navigate('/security/alerts')} className="text-xs text-cyan-400 hover:underline cursor-pointer">
              View in Alerts
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                  <th className="py-2 px-3 font-semibold">Host</th>
                  <th className="py-2 px-3 font-semibold">Anomaly</th>
                  <th className="py-2 px-3 font-semibold text-right">Score</th>
                  <th className="py-2 px-3 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {ANOMALIES.map((a, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-cyan-500/5 transition-colors">
                    <td className="py-2 px-3 font-mono text-cyan-400">{a.host}</td>
                    <td className="py-2 px-3 text-gray-300">{a.type}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold" style={{ color: scoreColor(a.score) }}>{a.score}</td>
                    <td className="py-2 px-3 text-right font-mono text-xs text-gray-500">{a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-gray-600 mt-3">
            Preview data. Live anomaly scores will populate from the ML jobs once the model finishes training and is wired to Elasticsearch.
          </p>
        </div>
      </div>

      <style>{`
        .animate-spin-reverse { animation: spin-reverse linear infinite; }
        @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  );
}
