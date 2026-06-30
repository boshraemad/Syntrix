import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ObservabilityIcon = ({ className }) => (
  <svg width="100%" height="100%" viewBox="1 4.5 22 15" className={className}>
    {/* Professional Material Design Eye */}
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor" />
  </svg>
);

const SecurityIcon = ({ className }) => (
  <svg width="100%" height="100%" viewBox="3 1 18 22" className={className}>
    {/* Professional Material Design Shield with Checkmark */}
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="currentColor"/>
  </svg>
);

const AnalyticsIcon = ({ className }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" className={className}>
    {/* Subtle full-circle background */}
    <circle cx="50" cy="50" r="50" fill="currentColor" fillOpacity="0.05" />
    {/* Exploded Solid Pie Chart */}
    <path d="M53 47 L 53 7 A 40 40 0 0 1 93 47 Z" fill="currentColor" fillOpacity="1" />
    <path d="M51 53 L 91 53 A 40 40 0 0 1 22.7 81.3 Z" fill="currentColor" fillOpacity="0.7" />
    <path d="M47 50 L 18.7 78.3 A 40 40 0 0 1 47 10 Z" fill="currentColor" fillOpacity="0.4" />
  </svg>
);

const LightBeamBackground = () => {
  const numBeams = 25;
  const animationTime = 45;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <style>{`
        @keyframes slide {
          from { right: -25vw; }
          to { right: 125vw; }
        }
      `}</style>
      
      <div className="absolute inset-0 opacity-60">
        {Array.from({ length: numBeams }).map((_, i) => {
          const duration = animationTime - (animationTime / numBeams / 2) * (i + 1);
          const delay = -((i + 1) / numBeams) * animationTime;
          
          // Deep Tech Cyberpunk color combinations (Neon Cyan, Amethyst Purple, Indigo)
          const colorCombos = [
            ['#38bdf8', '#818cf8', '#a855f7'], // Cyan -> Indigo -> Purple
            ['#a855f7', '#c084fc', '#e879f9'], // Purple -> Light Purple -> Pink
            ['#38bdf8', '#22d3ee', '#818cf8'], // Cyan -> Light Cyan -> Indigo
            ['#818cf8', '#a855f7', '#38bdf8'], // Indigo -> Purple -> Cyan
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

      {/* Deep black vignette to fade the beams smoothly at the edges */}
      <div className="absolute bottom-0 left-0 w-full h-0 shadow-[0_0_30vh_20vh_#000]" />
      <div className="absolute top-0 left-0 w-full h-0 shadow-[0_0_30vh_20vh_#000]" />
      <div className="absolute top-0 left-0 w-0 h-full shadow-[0_0_20vw_15vw_#000]" />
      <div className="absolute top-0 right-0 w-0 h-full shadow-[0_0_20vw_15vw_#000]" />
    </div>
  );
};

export default function HomePage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: "Observability",
      description: "Consolidate logs, metrics, and application traces.",
      path: "/observability",
      cardClassName: "relative group cursor-pointer bg-[hsl(0,0%,3%)] text-white rounded-2xl p-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 hover:scale-105 shadow-2xl shadow-black/50 border border-purple-500/20 hover:border-cyan-400/50 hover:shadow-cyan-400/10",
      numberClassName: "text-[12rem] font-black tracking-tighter text-white",
      iconContainerClassName: "w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center mb-6 relative z-10 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all",
      icon: <ObservabilityIcon className="text-cyan-400" />,
      titleClassName: "text-xl font-semibold mb-3 relative z-10 text-white",
      descClassName: "text-gray-400 text-xs leading-relaxed relative z-10"
    },
    {
      title: "Security",
      description: "Prevent, detect, and respond to threats.",
      path: "/security",
      cardClassName: "relative group cursor-pointer bg-[hsl(0,0%,3%)] text-white rounded-2xl p-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 hover:scale-105 shadow-2xl shadow-black/50 border border-purple-500/20 hover:border-cyan-400/50 hover:shadow-cyan-400/10",
      numberClassName: "text-[12rem] font-black tracking-tighter text-white",
      iconContainerClassName: "w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center mb-6 relative z-10 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all",
      icon: <SecurityIcon className="text-purple-400" />,
      titleClassName: "text-xl font-semibold mb-3 relative z-10 text-white",
      descClassName: "text-gray-400 text-xs leading-relaxed relative z-10"
    },
    {
      title: "Analytics",
      description: "Explore, visualize, and analyze your data.",
      path: "/analytics",
      cardClassName: "relative group cursor-pointer bg-[hsl(0,0%,3%)] text-white rounded-2xl p-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 hover:scale-105 shadow-2xl shadow-black/50 border border-purple-500/20 hover:border-cyan-400/50 hover:shadow-cyan-400/10",
      numberClassName: "text-[12rem] font-black tracking-tighter text-white",
      iconContainerClassName: "w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center mb-6 relative z-10 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all",
      icon: <AnalyticsIcon className="text-indigo-400" />,
      titleClassName: "text-xl font-semibold mb-3 relative z-10 text-white",
      descClassName: "text-gray-400 text-xs leading-relaxed relative z-10"
    }
  ];

  return (
    <div className='w-full text-white h-[calc(100vh-56px)] flex flex-col justify-center px-4 overflow-hidden relative'>
      
      <LightBeamBackground />

      <div className="max-w-6xl w-full mb-12 mx-auto relative z-10">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Welcome home</h1>
        <p className="text-gray-500 text-sm">Choose a dashboard to access the SOC terminal.</p>
      </div>

      {/* User's Custom Design Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mx-auto relative z-10">
        {features.map((feature, index) => (
          <div 
            key={index}
            onClick={() => navigate(feature.path)}
            className={feature.cardClassName}
          >
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-5">
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

      <div className="mt-12 max-w-6xl w-full mx-auto relative z-10">
        <h2 className="text-xl font-light mb-2">Get started by adding integrations</h2>
        <p className="text-gray-500 max-w-xl mb-6 leading-relaxed text-xs">
          To start working with your data, use one of our many ingest options. 
          Collect data from an app or service, or upload a file.
        </p>

        <div className="flex flex-wrap gap-8 items-center">
          <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-5 py-2.5 rounded-sm font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add integration
          </button>
          
          <button className="flex items-center cursor-pointer gap-2 text-xs text-gray-500 font-mono uppercase tracking-widest hover:text-cyan-400 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Try sample data
          </button>
          
          <button className="flex items-center cursor-pointer gap-2 text-xs text-gray-500 font-mono uppercase tracking-widest hover:text-purple-400 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload a file
          </button>
        </div>
      </div>
    </div>
  );
}