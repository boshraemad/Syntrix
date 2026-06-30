import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crosshair, Bell } from 'lucide-react';

const LightBeamBackground = () => {
  const numBeams = 25;
  const animationTime = 90;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <style>{`
        @keyframes slide {
          from { right: -25vw; }
          to { right: 125vw; }
        }
      `}</style>

      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: numBeams }).map((_, i) => {
          const duration = animationTime - (animationTime / numBeams / 2) * (i + 1);
          const delay = -((i + 1) / numBeams) * animationTime;
          const colorCombos = [
            ['#38bdf8', '#818cf8', '#a855f7'],
            ['#a855f7', '#c084fc', '#e879f9'],
            ['#38bdf8', '#22d3ee', '#818cf8'],
            ['#818cf8', '#a855f7', '#38bdf8'],
          ];
          const colors = colorCombos[i % colorCombos.length];
          const boxShadow = `
            -130px 0 80px 40px #000,
            -50px 0 50px 25px ${colors[0]},
            0 0 50px 25px ${colors[1]},
            50px 0 50px 25px ${colors[2]},
            130px 0 80px 40px #000
          `;
          return (
            <div
              key={i}
              className="absolute top-0 w-0 h-[100vh] origin-top-right"
              style={{
                transform: 'rotate(10deg)',
                boxShadow,
                animation: `slide ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-0 shadow-[0_0_30vh_20vh_#000]" />
      <div className="absolute top-0 left-0 w-full h-0 shadow-[0_0_30vh_20vh_#000]" />
      <div className="absolute top-0 left-0 w-0 h-full shadow-[0_0_20vw_15vw_#000]" />
      <div className="absolute top-0 right-0 w-0 h-full shadow-[0_0_20vw_15vw_#000]" />
    </div>
  );
};

export default function SecurityHub() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Detection',
      description: 'Write and execute advanced hunting queries across your data.',
      path: '/security/detection',
      icon: <Crosshair className="text-cyan-400 w-8 h-8" />,
      border: 'border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-cyan-400/10',
      iconBorder: 'border-cyan-500/30 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]',
    },
    {
      title: 'Alerts',
      description: 'Triage every security alert raised across hosts and the cloud.',
      path: '/security/alerts',
      icon: <Bell className="text-purple-400 w-8 h-8" />,
      border: 'border-purple-500/20 hover:border-purple-400/50 hover:shadow-purple-400/10',
      iconBorder: 'border-purple-500/30 group-hover:border-purple-400/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    },
  ];

  return (
    <div className="w-full text-white h-[calc(100vh-56px)] flex flex-col justify-center px-4 overflow-hidden relative">
      <LightBeamBackground />

      <div className="max-w-4xl w-full mb-12 mx-auto relative z-10 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Security</h1>
        <p className="text-gray-500 text-sm">Hunt for threats and respond to alerts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto relative z-10">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            onClick={() => navigate(feature.path)}
            className={`relative group cursor-pointer bg-[hsl(0,0%,3%)] text-white rounded-2xl p-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 hover:scale-105 shadow-2xl shadow-black/50 border ${feature.border}`}
          >
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
              <span className="text-[12rem] font-black tracking-tighter text-white opacity-5">
                0{index + 1}
              </span>
            </div>
            <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-6 relative z-10 transition-all ${feature.iconBorder}`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 relative z-10 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed relative z-10">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
