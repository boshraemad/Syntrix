import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { MAPS_MOCK_DATA, getThreatColor, getThreatOpacity } from '../utils/mapsMockData';
import { IoCloseOutline, IoWarningOutline } from "react-icons/io5";
import { BiWorld } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";

// Use local topojson file
const geoUrl = "/world-110m.json";

export default function Maps() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [filter, setFilter] = useState('all'); // all, attacks, requests

  // Map our mock data to a dictionary by country code for O(1) lookups
  const dataByCountryCode = MAPS_MOCK_DATA.reduce((acc, curr) => {
    acc[curr.countryCode] = curr;
    return acc;
  }, {});

  const filteredData = MAPS_MOCK_DATA.filter(country => {
    if (filter === 'attacks') return country.stats.attacks > 0;
    if (filter === 'requests') return country.stats.totalRequests > 0;
    return true;
  });

  const getCountryStyle = (geo) => {
    // Topojson standard uses ISO_A2, but sometimes it varies. Let's assume standard 2-letter codes.
    // If your topojson doesn't have 2-letter codes easily accessible, we might need a mapping.
    // For this example, we'll try to match by name or ID if ISO_A2 isn't available.
    
    // We'll highlight countries that exist in our mock data.
    const countryData = MAPS_MOCK_DATA.find(d => 
      d.name === geo.properties.name || 
      geo.id === d.countryCode // ID is usually ISO_N3, so name is safer for this basic topology
    );

    if (countryData && (filter === 'all' || (filter === 'attacks' && countryData.stats.attacks > 0) || (filter === 'requests' && countryData.stats.totalRequests > 0))) {
      const isHovered = hoveredCountry?.name === countryData.name;
      const isSelected = selectedCountry?.name === countryData.name;
      const opacity = getThreatOpacity(countryData.threatLevel);
      const color = getThreatColor(countryData.threatLevel);

      return {
        default: {
          fill: color,
          fillOpacity: isSelected ? 0.9 : opacity,
          stroke: "rgba(56,189,248,0.5)",
          strokeWidth: 0.2,
          outline: "none"
        },
        hover: {
          fill: color,
          fillOpacity: 0.9,
          stroke: "#ffffff",
          strokeWidth: 0.5,
          outline: "none",
          cursor: "pointer"
        },
        pressed: {
          fill: color,
          fillOpacity: 1,
          outline: "none"
        }
      };
    }

    // Default style for countries with no data
    return {
      default: { fill: "#1f1f2e", stroke: "rgba(168,85,247,0.25)", strokeWidth: 0.5, outline: "none" },
      hover: { fill: "#2a2a3e", stroke: "rgba(56,189,248,0.6)", strokeWidth: 0.5, outline: "none", cursor: "pointer" },
      pressed: { fill: "#1f1f2e", outline: "none" }
    };
  };

  return (
    <div className="flex flex-col flex-1 h-full text-white overflow-hidden bg-[#050505]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/5 bg-background z-10">
        <div className="flex items-center gap-3">
          <BiWorld className="text-xl text-cyan-400" />
          <span className="text-white font-semibold tracking-wide">Threat Geolocation</span>
        </div>
        <div className="flex items-center gap-2 bg-[#111] p-1 rounded-md border border-white/5">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors border ${filter === 'all' ? 'bg-[#222] text-white shadow-sm border-[#222]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            All Activity
          </button>
          <button 
            onClick={() => setFilter('attacks')}
            className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 border ${filter === 'attacks' ? 'bg-[#ef4444]/20 text-[#ef4444] shadow-sm border-[#ef4444]/20' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            <IoWarningOutline /> Attacks
          </button>
          <button 
            onClick={() => setFilter('requests')}
            className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 border ${filter === 'requests' ? 'bg-[#3b82f6]/20 text-[#3b82f6] shadow-sm border-[#3b82f6]/20' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            <HiOutlineStatusOnline /> Requests
          </button>
        </div>
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 w-full h-full relative" onClick={() => setSelectedCountry(null)}>
          <ComposableMap 
            projection="geoMercator" 
            projectionConfig={{ scale: 150, center: [0, 30] }}
            className="w-full h-full outline-none"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies
                  .filter(geo => geo.properties.name !== "Antarctica")
                  .map((geo) => {
                  const countryData = MAPS_MOCK_DATA.find(d => d.name === geo.properties.name);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={getCountryStyle(geo)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCountry(countryData || {
                          name: geo.properties.name,
                          threatLevel: 'none',
                          stats: { totalRequests: 0, attacks: 0, uniqueIPs: 0, protocols: {} },
                          recentEvents: []
                        });
                      }}
                      onMouseEnter={() => {
                        setHoveredCountry(countryData || {
                          name: geo.properties.name,
                          threatLevel: 'none',
                          stats: { totalRequests: 0, attacks: 0 }
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredCountry(null);
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Render markers for critical threats to add a visual pulsing effect */}
            {filteredData.filter(d => d.threatLevel === 'critical' || d.threatLevel === 'high').map(({ name, coordinates, threatLevel }) => (
              <Marker key={name} coordinates={coordinates}>
                <circle r={4} fill={getThreatColor(threatLevel)} className="animate-ping opacity-75" />
                <circle r={2} fill="#ffffff" />
              </Marker>
            ))}
          </ComposableMap>

          {/* Hover Tooltip */}
          {hoveredCountry && !selectedCountry && (
            <div className="absolute top-6 left-6 bg-[#0a0a0a] border border-cyan-500/20 p-3 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.15)] pointer-events-none flex flex-col gap-1 min-w-[150px]">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">{hoveredCountry.name}</span>
                <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: getThreatColor(hoveredCountry.threatLevel) }}></span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {hoveredCountry.stats.totalRequests.toLocaleString()} reqs
              </div>
              {hoveredCountry.stats.attacks > 0 && (
                <div className="text-xs text-[#ef4444]">
                  {hoveredCountry.stats.attacks.toLocaleString()} attacks
                </div>
              )}
            </div>
          )}
        </div>

        {/* Side Detail Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-80 bg-[#0a0a0a] border-l border-purple-500/20 shadow-[-10px_0_30px_rgba(168,85,247,0.1)] transform transition-transform duration-300 ease-in-out flex flex-col z-20 ${selectedCountry ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {selectedCountry && (
            <>
              {/* Panel Header */}
              <div className="flex justify-between items-center p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <h2 className="font-bold text-lg">{selectedCountry.name}</h2>
                  <span 
                    className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-sm text-black"
                    style={{ backgroundColor: getThreatColor(selectedCountry.threatLevel) }}
                  >
                    {selectedCountry.threatLevel === 'none' ? 'SAFE' : selectedCountry.threatLevel}
                  </span>
                  {selectedCountry.name === 'Egypt' && (
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Your Location
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedCountry(null)}
                  className="text-gray-500 hover:text-white transition-colors p-1"
                >
                  <IoCloseOutline size={20} />
                </button>
              </div>

              {/* Panel Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#111] border border-white/5 p-3 rounded-lg flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Requests</span>
                    <span className="text-xl font-mono text-cyan-400">{selectedCountry.stats.totalRequests.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#111] border border-[#ef4444]/20 p-3 rounded-lg flex flex-col">
                    <span className="text-[10px] text-[#ef4444]/70 uppercase tracking-widest mb-1">Attacks</span>
                    <span className="text-xl font-mono text-[#ef4444]">{selectedCountry.stats.attacks.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#111] border border-white/5 p-3 rounded-lg flex flex-col col-span-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Unique IPs</span>
                    <span className="text-lg font-mono text-purple-400">{selectedCountry.stats.uniqueIPs.toLocaleString()}</span>
                  </div>
                </div>

                {/* Protocol Breakdown */}
                {Object.keys(selectedCountry.stats.protocols).length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 border-b border-white/5 pb-2">Protocols</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedCountry.stats.protocols).map(([protocol, count]) => (
                        <div key={protocol} className="flex items-center justify-between text-sm">
                          <span className="font-mono text-gray-500">{protocol}</span>
                          <div className="flex items-center gap-3 w-2/3">
                            <div className="flex-1 h-1.5 bg-[#222] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-500/50" 
                                style={{ width: `${(count / selectedCountry.stats.totalRequests) * 100}%` }}
                              ></div>
                            </div>
                            <span className="font-mono text-xs text-gray-300 w-12 text-right">{count.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Events */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 border-b border-white/5 pb-2">Recent Events</h3>
                  {selectedCountry.recentEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCountry.recentEvents.map((event, idx) => (
                        <div key={idx} className="bg-[#111] border border-white/5 p-3 rounded-md flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-medium text-white">{event.type}</span>
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${event.status === 'Blocked' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#eab308]/20 text-[#eab308]'}`}>
                              {event.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                            <span>{event.ip}</span>
                            <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600 italic">No recent notable events recorded.</p>
                  )}
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
