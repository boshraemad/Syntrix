import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Wrench, PlusCircle } from 'lucide-react';
import darkCyberMap from "../assets/dark_cyber_map.png";
import darkMLGraphic from "../assets/dark_ml_graphic_v2.png";
import darkDiscoverGraphic from "../assets/dark_discover_graphic.png";
import darkDashboardGraphic from "../assets/dark_dashboard_graphic.png";
import darkCanvasGraphic from "../assets/dark_canvas_graphic.png";

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

const DashboardMock = () => (
  <div className="w-full h-full p-0 relative overflow-hidden flex items-center justify-center rounded-xl bg-black">
     <img src={darkDashboardGraphic} alt="Dashboard" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-0" />
     {/* Animated Line overlay */}
     <svg className="w-full h-1/2 absolute top-0 left-0 z-10 opacity-50 group-hover:opacity-100 transition-opacity" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M0,80 L10,60 L20,70 L30,40 L40,50 L50,20 L60,30 L70,10 L80,30 L90,20 L100,5" fill="none" stroke="rgba(168,85,247,0.8)" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
        <circle cx="30" cy="40" r="2" fill="#38bdf8" className="group-hover:scale-150 transition-transform origin-center" style={{transformBox: 'fill-box'}} />
        <circle cx="50" cy="20" r="2" fill="#38bdf8" className="group-hover:scale-150 transition-transform origin-center delay-75" style={{transformBox: 'fill-box'}} />
        <circle cx="70" cy="10" r="2" fill="#a855f7" className="group-hover:scale-150 transition-transform origin-center delay-150" style={{transformBox: 'fill-box'}} />
     </svg>
  </div>
);

const DiscoverMock = () => (
  <div className="w-full h-full p-0 relative overflow-hidden flex items-end justify-center rounded-xl bg-black">
     <img src={darkDiscoverGraphic} alt="Discover Logs" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-500 z-0 grayscale" />
     <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay z-0 pointer-events-none transition-colors" />
     {/* Animated Histogram Overlay */}
     <div className="w-full h-1/3 absolute bottom-0 left-0 flex items-end justify-between gap-[2px] p-4 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
        {[40, 60, 30, 80, 50, 90, 70, 40, 60, 85, 45, 20, 65, 30, 75, 40, 80, 50, 95].map((h, i) => (
           <div key={i} className={`w-full rounded-t-sm transition-all duration-500 hover:scale-y-110 origin-bottom ${i%2===0 ? 'bg-cyan-400' : 'bg-purple-500'}`} style={{height: `${h}%`, opacity: (i%3===0 ? 0.6 : 0.2)}}></div>
        ))}
     </div>
  </div>
);

const CanvasMock = () => (
  <div className="w-full h-full p-0 relative overflow-hidden flex items-center justify-center rounded-xl bg-black">
     <img src={darkCanvasGraphic} alt="Canvas" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-0" />
  </div>
);

const MapsMock = () => (
  <div className="w-full h-full p-0 relative overflow-hidden flex items-center justify-center rounded-xl bg-black">
     <img src={darkCyberMap} alt="World Map" className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-500 relative z-0 grayscale" />
     <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay z-0 pointer-events-none transition-colors" />
     {/* Glowing nodes overlay */}
     <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-[30%] left-[30%] shadow-[0_0_10px_2px_rgba(56,189,248,0.6)] group-hover:scale-150 transition-transform"></div>
     <div className="absolute w-1.5 h-1.5 bg-purple-500 rounded-full top-[45%] left-[55%] shadow-[0_0_8px_1px_rgba(168,85,247,0.6)] group-hover:scale-150 transition-transform delay-75"></div>
     <div className="absolute w-2.5 h-2.5 bg-cyan-300 rounded-full top-[25%] left-[75%] shadow-[0_0_12px_2px_rgba(103,232,249,0.6)] group-hover:scale-150 transition-transform delay-150"></div>
     <div className="absolute w-1 h-1 bg-indigo-400 rounded-full top-[60%] left-[40%] shadow-[0_0_5px_1px_rgba(129,140,248,0.6)] group-hover:scale-150 transition-transform delay-200"></div>
     
     {/* Tooltip */}
     <div className="absolute top-[35%] left-[55%] bg-[#0a0a0a] border border-cyan-500/20 px-2.5 py-1 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.2)] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 z-20">
        <span className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase">Egypt</span>
     </div>
  </div>
);

const MLMock = () => (
  <div className="w-full h-full p-0 relative overflow-hidden flex items-center justify-center rounded-xl bg-black">
     <img src={darkMLGraphic} alt="Machine Learning" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-500 relative z-0" />
     {/* Anomaly nodes overlay */}
     <div className="absolute w-4 h-4 bg-purple-500 top-[30%] left-[40%] rounded-sm shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform"></div>
     <div className="absolute w-3 h-3 bg-cyan-400 top-[60%] left-[55%] rounded-sm opacity-80 shadow-[0_0_10px_rgba(56,189,248,0.5)] group-hover:scale-110 transition-transform delay-75"></div>
     <div className="absolute w-2 h-2 bg-indigo-400 top-[45%] left-[80%] rounded-sm opacity-60 shadow-[0_0_5px_rgba(129,140,248,0.5)] group-hover:scale-110 transition-transform delay-100"></div>
     <div className="absolute w-2.5 h-2.5 bg-purple-400 top-[70%] left-[20%] rounded-sm opacity-70 shadow-[0_0_8px_rgba(192,132,252,0.5)] group-hover:scale-110 transition-transform delay-150"></div>
  </div>
);

export default function Analytics() {
  const navigate = useNavigate();

  return (
    <div className="relative flex-1 h-full w-full bg-black">
      <LightBeamBackground />
      <div className="pt-6 pb-8 px-4 relative z-10 text-white font-sans max-w-[1250px] mx-auto">
        {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6 mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Analytics</h1>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 bg-transparent px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer">
            <Wrench size={14} /> <span>Dev tools</span>
          </button>
          <button className="flex items-center gap-2 bg-transparent px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer">
            <Settings size={14} /> <span>Manage</span>
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all border border-transparent hover:scale-105 cursor-pointer">
            <PlusCircle size={14} /> <span>Add integrations</span>
          </button>
        </div>
      </div>

      {/* 2. Top Large Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Card 1: Dashboard */}
        <div 
          onClick={() => navigate('/dashboards')}
          className="group bg-[hsl(0,0%,3%)] border border-white/5 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] shadow-2xl shadow-black/50 hover:shadow-purple-500/10 cursor-pointer flex flex-col"
        >
          <div className="h-[190px] w-full bg-transparent relative">
            <DashboardMock />
          </div>
          <div className="p-5 border-t border-white/5 bg-[#0a0a0a]">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">Dashboard</h3>
            <p className="text-gray-500 text-sm mt-1">Analyze data in dashboards.</p>
          </div>
        </div>

        {/* Card 2: Discover */}
        <div 
          onClick={() => navigate('/discover')}
          className="group bg-[hsl(0,0%,3%)] border border-white/5 rounded-xl overflow-hidden hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] shadow-2xl shadow-black/50 hover:shadow-cyan-400/10 cursor-pointer flex flex-col"
        >
          <div className="h-[190px] w-full bg-transparent relative">
            <DiscoverMock />
          </div>
          <div className="p-5 border-t border-white/5 bg-[#0a0a0a]">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">Discover</h3>
            <p className="text-gray-500 text-sm mt-1">Search and find insights.</p>
          </div>
        </div>

      </div>

      {/* 3. Bottom Cards Section (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Canvas */}
        <div 
          onClick={() => navigate('/canvas')}
          className="group bg-[hsl(0,0%,3%)] border border-white/5 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] shadow-2xl shadow-black/50 hover:shadow-purple-500/10 cursor-pointer flex flex-col"
        >
          <div className="h-[130px] w-full bg-transparent relative">
            <CanvasMock />
          </div>
          <div className="p-4 border-t border-white/5 bg-[#0a0a0a] text-center">
            <h4 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">Canvas</h4>
            <p className="text-xs text-gray-500 mt-1">Design pixel-perfect presentations.</p>
          </div>
        </div>

        {/* Maps */}
        <div 
          onClick={() => navigate('/maps')}
          className="group bg-[hsl(0,0%,3%)] border border-white/5 rounded-xl overflow-hidden hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] shadow-2xl shadow-black/50 hover:shadow-cyan-400/10 cursor-pointer flex flex-col"
        >
          <div className="h-[130px] w-full bg-transparent relative">
            <MapsMock />
          </div>
          <div className="p-4 border-t border-white/5 bg-[#0a0a0a] text-center">
            <h4 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors">Maps</h4>
            <p className="text-xs text-gray-500 mt-1">Plot geographic data.</p>
          </div>
        </div>

        {/* Machine Learning */}
        <div 
          onClick={() => navigate('/machine-learning')}
          className="group bg-[hsl(0,0%,3%)] border border-white/5 rounded-xl overflow-hidden hover:border-indigo-400/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] shadow-2xl shadow-black/50 hover:shadow-indigo-400/10 cursor-pointer flex flex-col"
        >
          <div className="h-[130px] w-full bg-transparent relative">
             <MLMock />
          </div>
          <div className="p-4 border-t border-white/5 bg-[#0a0a0a] text-center">
            <h4 className="font-bold text-white text-lg group-hover:text-indigo-400 transition-colors">Machine Learning</h4>
            <p className="text-xs text-gray-500 mt-1">Model, predict, and detect.</p>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}