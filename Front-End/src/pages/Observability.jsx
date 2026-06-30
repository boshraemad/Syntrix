import React from 'react';
import { useNavigate } from 'react-router-dom';

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
                boxShadow: boxShadow,
                animation: `slide ${duration}s linear infinite`,
                animationDelay: `${delay}s`
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

const LogsIcon = ({ className }) => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const HostsIcon = ({ className }) => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <path d="M12 16v.01" />
  </svg>
);

export default function Observability() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Logs",
      description: "Explore logs collected from various sources.",
      path: "/observability/logs",
      cardClassName: "relative group cursor-pointer bg-[hsl(0,0%,3%)] text-white rounded-2xl p-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 hover:scale-105 shadow-2xl shadow-black/50 border border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-cyan-400/10",
      numberClassName: "text-[12rem] font-black tracking-tighter text-white opacity-5",
      iconContainerClassName: "w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center mb-6 relative z-10 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all",
      icon: <LogsIcon className="text-cyan-400 w-8 h-8" />,
      titleClassName: "text-xl font-semibold mb-3 relative z-10 text-white",
      descClassName: "text-gray-400 text-xs leading-relaxed relative z-10"
    },
    {
      title: "Hosts",
      description: "Monitor and manage hosts sending data to the SIEM.",
      path: "/observability/hosts",
      cardClassName: "relative group cursor-pointer bg-[hsl(0,0%,3%)] text-white rounded-2xl p-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 hover:scale-105 shadow-2xl shadow-black/50 border border-purple-500/20 hover:border-purple-400/50 hover:shadow-purple-400/10",
      numberClassName: "text-[12rem] font-black tracking-tighter text-white opacity-5",
      iconContainerClassName: "w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center mb-6 relative z-10 group-hover:border-purple-400/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all",
      icon: <HostsIcon className="text-purple-400 w-8 h-8" />,
      titleClassName: "text-xl font-semibold mb-3 relative z-10 text-white",
      descClassName: "text-gray-400 text-xs leading-relaxed relative z-10"
    }
  ];

  return (
    <div className='w-full text-white h-[calc(100vh-56px)] flex flex-col justify-center px-4 overflow-hidden relative'>
      
      <LightBeamBackground />

      <div className="max-w-4xl w-full mb-12 mx-auto relative z-10 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Observability Hub</h1>
        <p className="text-gray-500 text-sm">Select a dimension to explore logs and monitor system hosts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto relative z-10">
        {features.map((feature, index) => (
          <div 
            key={index}
            onClick={() => navigate(feature.path)}
            className={feature.cardClassName}
          >
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
              <span className={feature.numberClassName}>
                0{index + 1}
              </span>
            </div>

            <div className={feature.iconContainerClassName}>
              {feature.icon}
            </div>

            <h3 className={feature.titleClassName}>
              {feature.title}
            </h3>

            <p className={feature.descClassName}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
