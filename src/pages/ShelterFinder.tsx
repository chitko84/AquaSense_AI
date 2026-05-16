/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Users, 
  MapPin, 
  Package, 
  Check, 
  ChevronRight, 
  Info, 
  Navigation, 
  Phone, 
  Zap, 
  LayoutGrid, 
  List,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SHELTERS } from '../constants';
import { ShelterStatus, RiskLevel, Shelter } from '../types';
import RiskBadge from '../components/RiskBadge';

export default function ShelterFinder() {
  const [filter, setFilter] = useState<ShelterStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShelters = useMemo(() => {
    return SHELTERS.filter(s => {
      const matchesFilter = filter === 'All' ? true : s.status === filter;
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  const recommendedShelter = useMemo(() => {
    const calculateScore = (shelter: Shelter) => {
      if (shelter.status === ShelterStatus.FULL || shelter.status === ShelterStatus.CLOSED) return -1000;
      
      // 1. Capacity Score (Weight: 50)
      const capacityScore = (shelter.availableSpace / shelter.totalCapacity) * 50;
      
      // 2. Distance Score (Weight: 30) - Scale of 10 points max
      let rawDistanceScore = 0;
      const dist = parseFloat(shelter.distance);
      if (dist < 2) rawDistanceScore = 10;
      else if (dist < 5) rawDistanceScore = 7;
      else if (dist < 10) rawDistanceScore = 4;
      else rawDistanceScore = 2;
      const distanceScore = rawDistanceScore * 3; // Scale 10 to 30

      // 3. Route Risk Score (Weight: 20) - Scale of 10 points max
      let rawRiskScore = 0;
      if (shelter.routeRisk === RiskLevel.LOW) rawRiskScore = 10;
      else if (shelter.routeRisk === RiskLevel.MEDIUM) rawRiskScore = 5;
      else rawRiskScore = 0;
      const riskScore = rawRiskScore * 2; // Scale 10 to 20
      
      return capacityScore + distanceScore + riskScore;
    };

    const scored = SHELTERS
      .map(s => ({ shelter: s, score: calculateScore(s) }))
      .filter(s => s.score > -500)
      .sort((a, b) => b.score - a.score);

    return scored[0]?.shelter || null;
  }, []);

  const getStatusColor = (status: ShelterStatus) => {
    switch (status) {
      case ShelterStatus.AVAILABLE: return 'bg-emerald-500';
      case ShelterStatus.ALMOST_FULL: return 'bg-amber-500';
      case ShelterStatus.FULL: return 'bg-red-500';
      case ShelterStatus.CLOSED: return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Shelter Network</h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium italic">Live synchronization of <span className="text-cyan-600 font-bold">Sanctuary Nodes</span> and Ground Logistics.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {/* Search & Filter UI */}
           <div className="relative group w-full sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Scan sector..." 
                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition-all w-full md:w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>

           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm ml-auto sm:ml-0">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
             >
               <LayoutGrid className="w-4 h-4" />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
             >
               <List className="w-4 h-4" />
             </button>
           </div>
        </div>
      </header>

      {/* Smart Recommendation Card */}
      {recommendedShelter && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -mr-48 -mt-48 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-cyan-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center border border-cyan-500/20 shadow-inner group-hover:rotate-6 transition-transform">
                <Zap className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
             </div>
             <div className="flex-1 space-y-4">
                <div>
                   <h3 className="text-[10px] md:text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div> Smart Sanctuary Match
                   </h3>
                   <h4 className="text-xl md:text-2xl font-black tracking-tight uppercase">{recommendedShelter.name}</h4>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                   <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600" /> {recommendedShelter.distance} From GPS
                   </div>
                   <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Users className="w-3.5 h-3.5 text-emerald-500" /> {recommendedShelter.availableSpace} Vacant
                   </div>
                   <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Navigation className="w-3.5 h-3.5 text-blue-500" /> Low Risk
                   </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                   <p className="text-[10px] md:text-[11px] text-slate-400 font-medium italic leading-relaxed">
                     Recommended: {recommendedShelter.availableSpace} spaces, low route risk. Facilities: {recommendedShelter.facilities.join(', ').toLowerCase()}.
                   </p>
                </div>
             </div>
             <div className="shrink-0 w-full md:w-auto">
                <button className="w-full md:w-auto px-10 py-5 bg-cyan-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-cyan-500 transition-all shadow-xl shadow-cyan-900/20 flex items-center justify-center gap-3 active:scale-95">
                   <Navigation className="w-4 h-4" /> Execute Route
                </button>
             </div>
          </div>
        </motion.section>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-4">
        {['All', ShelterStatus.AVAILABLE, ShelterStatus.ALMOST_FULL, ShelterStatus.FULL].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-6 py-2.5 text-[9px] uppercase font-black rounded-xl transition-all border tracking-widest ${
              filter === s 
              ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
              : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Cards Display */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
        {filteredShelters.map((shelter) => (
          <motion.div 
            layout
            key={shelter.id} 
            className={`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
          >
            <div className={`p-8 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-3 ${
                    shelter.status === ShelterStatus.AVAILABLE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    shelter.status === ShelterStatus.ALMOST_FULL ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    <Home className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">{shelter.name}</h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest italic group-hover:text-cyan-600 transition-colors">
                      <MapPin className="w-3.5 h-3.5" />
                      {shelter.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacity Matrix */}
              <div className="space-y-4 mb-8">
                <div className="flex items-end justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live Load Factor</p>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-black text-slate-900">{shelter.currentOccupancy}</span>
                       <span className="text-xs font-black text-slate-300">/</span>
                       <span className="text-sm font-bold text-slate-400">{shelter.totalCapacity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Availability</p>
                    <span className="text-sm font-black text-cyan-600 uppercase tracking-tight">{shelter.availableSpace} <span className="text-[10px] text-slate-300">VACANT</span></span>
                  </div>
                </div>
                {/* Visual Progress */}
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-100 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(shelter.currentOccupancy / shelter.totalCapacity) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getStatusColor(shelter.status)}`}
                    ></motion.div>
                  </div>
                  <div className="absolute top-0 right-0 -mt-5">
                     <span className={`text-[8px] font-black italic uppercase tracking-tighter ${
                       (shelter.currentOccupancy / shelter.totalCapacity) > 0.8 ? 'text-red-500' : 'text-slate-400'
                     }`}>
                        {Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100)}% Saturation
                     </span>
                  </div>
                </div>
              </div>

              {/* Facilities Grid */}
              <div className="pt-6 border-t border-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-cyan-500" /> Logistic Arsenal
                   </h4>
                   <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-slate-300" />
                      <span className="text-[9px] font-bold text-slate-400 tracking-widest">{shelter.contact}</span>
                   </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {shelter.facilities.map((f, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-700 rounded-lg text-[9px] font-black border border-slate-100 uppercase tracking-widest flex items-center gap-2 group-hover:bg-cyan-50 group-hover:border-cyan-100 transition-colors">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={`px-8 py-5 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all ${viewMode === 'list' ? 'sm:w-80 border-t-0 border-l border-slate-100' : ''}`}>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                 <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-cyan-500/50">Route Risk</p>
                    <RiskBadge level={shelter.routeRisk} className="scale-75 origin-left" />
                 </div>
                 <div className="space-y-1 pl-4 border-l border-slate-200 group-hover:border-slate-800">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-500">Proximity</p>
                    <p className="text-[10px] font-black tracking-widest">{shelter.distance}</p>
                 </div>
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm hover:shadow-lg transition-all group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-500 active:scale-95">
                <Navigation className="w-3.5 h-3.5" /> Navigate
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredShelters.length === 0 && (
         <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Matching Nodes</h3>
            <p className="text-slate-400 text-sm font-medium italic mt-2">Try adjusting your spectral filters or spatial query.</p>
         </div>
      )}
    </div>
  );
}
