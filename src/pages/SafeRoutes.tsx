/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Navigation, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  MapPin, 
  Activity, 
  Zap, 
  ArrowRight,
  Car,
  Footprints,
  Bike,
  AlertTriangle,
  Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RiskBadge from '../components/RiskBadge';
import { RiskLevel } from '../types';

interface RouteResult {
  id: string;
  name: string;
  duration: string;
  distance: string;
  riskScore: number;
  riskLevel: RiskLevel;
  nearbyFloodReports: number;
  verifiedReports: number;
  roadClosureCount: number;
  isSafest: boolean;
  warning?: string;
  reason?: string;
  factors: {
    rainfall: string;
    waterLevel: string;
    zoneProximity: string;
    shelter: string;
  };
}

export default function SafeRoutes() {
  const [fromLocation, setFromLocation] = useState('Current Location');
  const [toLocation, setToLocation] = useState('');
  const [travelMode, setTravelMode] = useState<'car' | 'walking' | 'motorcycle'>('car');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ fastest: RouteResult; safest: RouteResult } | null>(null);

  const locations = [
    'Current Location',
    'Albukhary International University',
    'Alor Setar City Centre',
    'AIU Multipurpose Hall',
    'Dewan Komuniti Alor Setar',
    'Masjid Al-Bukhary',
    'SK Titi Gajah',
    'Alor Setar Hospital'
  ];

  const calculateRouteRisk = (routeData: {
    routeName: string;
    nearbyFloodReports: number;
    verifiedReports: number;
    rainfallRisk: 'Low' | 'Medium' | 'High';
    waterLevelRisk: 'Low' | 'Medium' | 'High' | 'Critical';
    roadClosureCount: number;
    highRiskZoneDistance: number; // in km
    shelterNearby: boolean;
  }) => {
    let score = 0;
    
    // logic
    score += routeData.verifiedReports * 30;
    score += routeData.roadClosureCount * 40;
    
    if (routeData.rainfallRisk === 'High') score += 20;
    else if (routeData.rainfallRisk === 'Medium') score += 10;
    
    if (routeData.waterLevelRisk === 'Critical') score += 50;
    else if (routeData.waterLevelRisk === 'High') score += 30;
    
    if (routeData.highRiskZoneDistance < 1) score += 25;
    else if (routeData.highRiskZoneDistance < 3) score += 10;
    
    if (routeData.shelterNearby) score -= 10;
    
    // Normalize
    score = Math.min(100, Math.max(0, score));
    
    let level = RiskLevel.LOW;
    if (score > 75) level = RiskLevel.CRITICAL;
    else if (score > 50) level = RiskLevel.HIGH;
    else if (score > 25) level = RiskLevel.MEDIUM;
    
    return {
      riskScore: score,
      riskLevel: level,
      factors: {
        rainfall: routeData.rainfallRisk,
        waterLevel: routeData.waterLevelRisk,
        zoneProximity: `${routeData.highRiskZoneDistance}km`,
        shelter: routeData.shelterNearby ? 'Available' : 'None'
      }
    };
  };

  const calculateRouteSafety = () => {
    if (!toLocation) return;
    
    setIsAnalyzing(true);
    setResults(null);

    // Simulate analysis delay
    setTimeout(() => {
      const fastestRisk = calculateRouteRisk({
        routeName: 'Fastest Route',
        nearbyFloodReports: 3,
        verifiedReports: 2,
        rainfallRisk: 'High',
        waterLevelRisk: 'High',
        roadClosureCount: 1,
        highRiskZoneDistance: 0.4,
        shelterNearby: false
      });

      const safestRisk = calculateRouteRisk({
        routeName: 'Safest Route',
        nearbyFloodReports: 0,
        verifiedReports: 0,
        rainfallRisk: 'Low',
        waterLevelRisk: 'Low',
        roadClosureCount: 0,
        highRiskZoneDistance: 4.2,
        shelterNearby: true
      });

      const fastest: RouteResult = {
        id: 'fastest',
        name: 'Fastest Route',
        duration: '18 Min',
        distance: '8.4 km',
        ...fastestRisk,
        nearbyFloodReports: 3,
        verifiedReports: 2,
        roadClosureCount: 1,
        isSafest: false,
        warning: 'Passes near Jalan Kuala Kedah flood zone. Critical runoff detected.',
        reason: 'This route intersects with sectors showing active water level rise.'
      };

      const safest: RouteResult = {
        id: 'safest',
        name: 'Safest Route',
        duration: '24 Min',
        distance: '10.1 km',
        ...safestRisk,
        nearbyFloodReports: 0,
        verifiedReports: 0,
        roadClosureCount: 0,
        isSafest: true,
        reason: 'Avoids all flood-prone corridors and verified hazard zones.',
        warning: 'Standard conditions apply. High-ground route utilized.'
      };

      setResults({ fastest, safest });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Safe Directions</h1>
          <p className="text-slate-500 text-sm font-medium italic">Find the safest path to avoid flood zones.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 text-cyan-400 rounded-2xl border border-slate-700 shadow-xl">
           <Zap className="w-4 h-4 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Safety Data On</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Search Panel */}
        <div className="lg:col-span-4 space-y-8">
           <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-4">
                 <div className="relative">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Origin Node</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                       <select 
                         value={fromLocation}
                         onChange={(e) => setFromLocation(e.target.value)}
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 uppercase tracking-tight appearance-none focus:bg-white focus:ring-2 focus:ring-cyan-500/10 transition-all outline-none"
                       >
                         {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="relative">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Target Destination</label>
                    <div className="relative">
                       <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                       <select 
                         value={toLocation}
                         onChange={(e) => setToLocation(e.target.value)}
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 uppercase tracking-tight appearance-none focus:bg-white focus:ring-2 focus:ring-cyan-500/10 transition-all outline-none"
                       >
                         <option value="">Select Destination...</option>
                         {locations.filter(l => l !== fromLocation).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                       </select>
                    </div>
                 </div>
              </div>

              <div className="pt-4 space-y-3">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Traversal Mode</label>
                 <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'car', icon: Car },
                      { id: 'walking', icon: Footprints },
                      { id: 'motorcycle', icon: Bike },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setTravelMode(mode.id as any)}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${
                          travelMode === mode.id 
                          ? 'bg-slate-900 border-slate-900 text-cyan-400 shadow-xl' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                        }`}
                      >
                         <mode.icon className={`w-5 h-5 transition-transform group-hover:scale-110`} />
                         <span className="text-[8px] font-black uppercase tracking-widest">{mode.id}</span>
                      </button>
                    ))}
                 </div>
              </div>

              <button 
                onClick={calculateRouteSafety}
                disabled={!toLocation || isAnalyzing}
                className="w-full py-5 bg-cyan-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] overflow-hidden relative group shadow-xl shadow-cyan-900/20 active:scale-95 transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
              >
                 <span className="relative z-10 flex items-center justify-center gap-3">
                    {isAnalyzing ? (
                      <>
                        <Activity className="w-5 h-5 animate-spin" />
                        Analyzing Risk...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Analyze Safety
                      </>
                    )}
                 </span>
                 <div className="absolute inset-0 bg-cyan-500 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
              </button>
           </section>

           {/* Route Visualization Map Simulation */}
           {results && (
              <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-[300px]">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  <div className="relative z-10 h-full flex flex-col">
                    <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-8">Path Preview</p>
                    <div className="flex-1 relative">
                       {/* SVG Lines for routes */}
                       <svg className="w-full h-full overflow-visible">
                          {/* Fastest Route - Unsafe */}
                          <motion.path 
                            d="M 50,50 C 100,50 150,150 250,150"
                            stroke="#ef4444" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                            strokeDasharray="8 8"
                            fill="none" 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                          />
                          {/* Safest Route - Safe */}
                          <motion.path 
                            d="M 50,50 C 50,150 150,220 250,220"
                            stroke="#06b6d4" 
                            strokeWidth="6" 
                            strokeLinecap="round"
                            fill="none" 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                          />
                          {/* Markers */}
                          <circle cx="50" cy="50" r="8" fill="#fff" stroke="#000" strokeWidth="2" />
                          <circle cx="250" cy="220" r="10" fill="#06b6d4" />
                          <circle cx="250" cy="150" r="8" fill="#ef4444" />
                          
                          {/* Flood markers */}
                          <circle cx="150" cy="150" r="15" fill="#ef4444" fillOpacity="0.2" className="animate-pulse" />
                          <circle cx="150" cy="150" r="4" fill="#ef4444" />
                       </svg>
                       
                       <div className="absolute top-2 left-6 text-[8px] font-black uppercase text-white bg-slate-800 px-2 py-1 rounded">Start</div>
                       <div className="absolute bottom-16 right-6 text-[8px] font-black uppercase text-cyan-400 bg-slate-800 px-2 py-1 rounded">Shelter</div>
                       <div className="absolute top-28 right-6 text-[8px] font-black uppercase text-red-500 bg-slate-800 px-2 py-1 rounded">Flood Area</div>
                    </div>
                 </div>
              </section>
           )}
        </div>

        {/* Results Display */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
              {isAnalyzing ? (
                 <motion.div 
                   key="analyzing"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="h-full flex flex-col items-center justify-center p-20 text-center space-y-8"
                 >
                    <div className="relative">
                       <div className="w-32 h-32 border-4 border-cyan-500/10 rounded-full animate-pulse"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Activity className="w-12 h-12 text-cyan-600 animate-spin" />
                       </div>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Synchronizing GIS Buffers</h3>
                       <p className="text-slate-400 text-sm font-medium italic mt-2">Aggregating ground reports and rainfall gradients...</p>
                    </div>
                 </motion.div>
              ) : results ? (
                 <motion.div 
                   key="results"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-10"
                 >
                    {/* Recommendation Highlight */}
                    <div className="bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 -mr-48 -mt-48 rounded-full blur-3xl"></div>
                       <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                          <div className="w-16 h-16 md:w-24 md:h-24 bg-cyan-600/10 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center border border-cyan-500/20 shadow-inner group-hover:rotate-6 transition-transform">
                             <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12 text-cyan-400" />
                          </div>
                          <div className="flex-1 space-y-4 text-center md:text-left">
                             <div>
                                <h3 className="text-[10px] md:text-xs font-black text-cyan-400 uppercase tracking-[0.4em] mb-2 flex items-center justify-center md:justify-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div> Sentinel Recommends
                                </h3>
                                <h4 className="text-2xl md:text-4xl font-black tracking-tighter uppercase">Safest Extraction Corridor</h4>
                             </div>
                             <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl italic">
                                "The {results.fastest.name} offers a 6-minute saving, but intersects with active runoff zones near the {fromLocation} sector. {results.safest.name} avoids {results.fastest.verifiedReports} verified hazard zones."
                             </p>
                          </div>
                          <button className="w-full md:w-auto px-10 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-cyan-900/40 transition-all active:scale-95 flex items-center justify-center gap-3">
                             <Navigation className="w-4 h-4" /> Commence
                          </button>
                       </div>
                    </div>

                    {/* Comparison Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                       {[results.fastest, results.safest].map((route) => (
                          <div 
                            key={route.id}
                            className={`bg-white rounded-[2rem] md:rounded-[2.5rem] border overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col ${
                              route.isSafest ? 'border-cyan-500 ring-4 ring-cyan-500/5' : 'border-slate-200'
                            }`}
                          >
                             <div className={`p-6 md:p-8 border-b ${route.isSafest ? 'bg-cyan-50/50 border-cyan-100' : 'bg-slate-50 border-slate-100'} flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                   <div className={`p-2 rounded-xl ${route.isSafest ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-white shadow-lg'}`}>
                                      {route.isSafest ? <ShieldAlert className="w-4 h-4 md:w-5 md:h-5" /> : <Clock className="w-4 h-4 md:w-5 md:h-5" />}
                                   </div>
                                   <span className={`text-[10px] font-black uppercase tracking-widest ${route.isSafest ? 'text-cyan-700' : 'text-slate-900'}`}>{route.name}</span>
                                </div>
                                <RiskBadge level={route.riskLevel} />
                             </div>
                             
                             <div className="p-6 md:p-8 space-y-6 md:space-y-8 flex-1">
                                <div className="flex justify-between items-end">
                                   <div className="space-y-1">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Travel Duration</p>
                                      <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{route.duration}</p>
                                   </div>
                                   <div className="text-right space-y-1">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Distance</p>
                                      <p className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{route.distance}</p>
                                   </div>
                                </div>

                                {/* Factor Breakdown */}
                                <div className="space-y-4 pt-6 border-t border-slate-50">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hazard Vector Matrix</p>
                                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                                      {[
                                        { label: 'Ground Intel', val: route.nearbyFloodReports, sub: 'Reports' },
                                        { label: 'Verified', val: route.verifiedReports, sub: 'Sites' },
                                        { label: 'Rainfall', val: route.factors.rainfall, sub: 'Risk' },
                                        { label: 'Water Level', val: route.factors.waterLevel, sub: 'Status' },
                                        { label: 'Crit Zone', val: route.factors.zoneProximity, sub: 'Distance' },
                                        { label: 'Shelter', val: route.factors.shelter, sub: 'Access' },
                                      ].map((f, i) => (
                                        <div key={i} className="bg-slate-50 p-2.5 md:p-3 rounded-xl flex flex-col justify-between border border-slate-100">
                                           <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{f.label}</p>
                                           <div className="flex items-baseline gap-1">
                                              <p className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase">{f.val}</p>
                                              <p className="text-[5px] md:text-[6px] font-black text-slate-400 uppercase">{f.sub}</p>
                                           </div>
                                        </div>
                                      ))}
                                   </div>
                                </div>

                                <div className={`p-4 md:p-5 rounded-2xl border italic text-[10px] md:text-[11px] font-black ${
                                  route.isSafest ? 'bg-cyan-50 border-cyan-100 text-cyan-800' : 'bg-red-50 border-red-100 text-red-700'
                                }`}>
                                   "{route.warning || route.reason}"
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>

                    {/* AI Logic Explanation */}
                    <section className="bg-white border border-slate-200 rounded-[3rem] p-12 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-12 opacity-5">
                          <Activity className="w-48 h-48" />
                       </div>
                       <div className="relative z-10 space-y-8">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-slate-900 text-cyan-400 rounded-2xl shadow-xl">
                                <Zap className="w-6 h-6" />
                             </div>
                             <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">AquaSense Sentinel Log</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Explanation Matrix v4.2</p>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                             {[
                               { label: 'Topographical Risk', desc: 'Analyzes road elevation and proximity to drainage arteries.', value: 'Nominal' },
                               { label: 'Community Intel', desc: 'Cross-references verified flood reports from active citizens.', value: 'Real-Time' },
                               { label: 'Rainfall Gradient', desc: 'Simulates runoff accumulation based on ground saturation.', value: 'Predictive' },
                             ].map((factor, idx) => (
                               <div key={idx} className="space-y-3">
                                  <div className="flex items-center justify-between">
                                     <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{factor.label}</h5>
                                     <span className="text-[8px] font-black text-cyan-600 uppercase tracking-widest bg-cyan-50 px-2 py-0.5 rounded-full">{factor.value}</span>
                                  </div>
                                  <p className="text-xs text-slate-400 font-medium italic leading-relaxed">{factor.desc}</p>
                               </div>
                             ))}
                          </div>

                          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                             <div className="flex items-center gap-3">
                                <Info className="w-5 h-5 text-slate-300" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">Gemini AI Conclusion: Based on the route risk score, users should avoid the fastest route.</span>
                             </div>
                             <div className="flex gap-2">
                                <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-slate-100">OSRM Ready</span>
                                <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-slate-100">Turf.js Integrated</span>
                             </div>
                          </div>
                       </div>
                    </section>
                 </motion.div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-8 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
                    <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-inner group">
                       <MapPin className="w-10 h-10 text-slate-200 group-hover:text-cyan-500 transition-colors" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Spatial Analysis Pending</h3>
                       <p className="text-slate-400 text-sm font-medium italic mt-2 max-w-sm mx-auto">Select a target node and traversal mode to initiate safety extraction calculations.</p>
                       <div className="flex justify-center gap-2 mt-8">
                          <ArrowRight className="w-5 h-5 text-slate-200 animate-bounce" />
                       </div>
                    </div>
                 </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

