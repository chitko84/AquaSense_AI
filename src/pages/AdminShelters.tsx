/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Plus, 
  Settings2, 
  Trash2, 
  Edit3, 
  Users, 
  MapPin, 
  Package, 
  Download, 
  ChevronRight, 
  Save, 
  X,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SHELTERS as INITIAL_SHELTERS } from '../constants';
import RiskBadge from '../components/RiskBadge';
import { ShelterStatus, Shelter } from '../types';

export default function AdminShelters() {
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const stats = useMemo(() => {
    const total = shelters.length;
    const totalCapacity = shelters.reduce((acc, s) => acc + s.totalCapacity, 0);
    const currentOccupancy = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
    const availableSpaces = shelters.reduce((acc, s) => acc + s.availableSpace, 0);
    const availableSheltersNum = shelters.filter(s => s.status === ShelterStatus.AVAILABLE).length;
    const fullSheltersNum = shelters.filter(s => s.status === ShelterStatus.FULL).length;

    return {
      total,
      totalCapacity,
      currentOccupancy,
      availableSpaces,
      availableSheltersNum,
      fullSheltersNum,
      loadFactor: Math.round((currentOccupancy / totalCapacity) * 100) || 0
    };
  }, [shelters]);

  const handleUpdateOccupancy = (id: string) => {
    setShelters(prev => prev.map(s => {
      if (s.id !== id) return s;

      const newOccupancy = Math.min(editValue, s.totalCapacity);
      const newAvailable = s.totalCapacity - newOccupancy;
      const occupancyRate = (newOccupancy / s.totalCapacity);
      
      let newStatus: ShelterStatus = s.status;
      if (s.status !== ShelterStatus.CLOSED) {
        if (occupancyRate >= 1) newStatus = ShelterStatus.FULL;
        else if (occupancyRate >= 0.7) newStatus = ShelterStatus.ALMOST_FULL;
        else newStatus = ShelterStatus.AVAILABLE;
      }

      return {
        ...s,
        currentOccupancy: newOccupancy,
        availableSpace: newAvailable,
        status: newStatus
      };
    }));
    setEditingId(null);
  };

  const startEditing = (shelter: Shelter) => {
    setEditingId(shelter.id);
    setEditValue(shelter.currentOccupancy);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Logistics Command</h1>
          <p className="text-slate-500 text-sm font-medium italic">Strategic asset allocation & shelter load monitoring for <span className="text-cyan-600 font-bold">Resilience Nodes</span>.</p>
        </div>
        <div className="flex flex-wrap gap-4">
           {/* Summary Cards */}
           <div className="hidden xl:flex items-center gap-6 border-r border-slate-200 pr-8 mr-4">
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Saturation</p>
                 <p className="text-sm font-black text-slate-900">{stats.loadFactor}%</p>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Net Vacancy</p>
                 <p className="text-sm font-black text-cyan-600 font-mono tracking-tighter">{stats.availableSpaces.toString().padStart(4, '0')}</p>
              </div>
           </div>

           <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
                <Download className="w-3.5 h-3.5 text-cyan-600" /> Registry Export
              </button>
              <button className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-300 hover:bg-slate-800 transition-all">
                <Plus className="w-3.5 h-3.5 text-cyan-400" /> Provision Node
              </button>
           </div>
        </div>
      </header>

      {/* Dashboard Summary GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Shelters', value: stats.total, sub: 'Active Monitoring', icon: Home, color: 'text-slate-900' },
           { label: 'Current Load', value: stats.currentOccupancy, sub: `Of ${stats.totalCapacity} Total`, icon: Users, color: 'text-slate-900' },
           { label: 'Available Nodes', value: stats.availableSheltersNum, sub: 'System Ready', icon: Package, color: 'text-emerald-600' },
           { label: 'Full Capacity', value: stats.fullSheltersNum, sub: 'Reroute Needed', icon: AlertCircle, color: 'text-red-600' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-cyan-200 transition-colors">
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                 <p className={`text-3xl font-black tracking-tighter leading-none ${stat.color}`}>{stat.value}</p>
                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest pt-2">{stat.sub}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-all">
                 <stat.icon className="w-6 h-6" />
              </div>
           </div>
         ))}
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Facility Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Occupancy Load</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Metric Data</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ops Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              <AnimatePresence mode="popLayout">
                {shelters.map((shelter) => (
                  <motion.tr 
                    layout
                    key={shelter.id} 
                    className="hover:bg-slate-50/50 transition-colors group/row"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${
                           shelter.status === ShelterStatus.AVAILABLE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                           shelter.status === ShelterStatus.ALMOST_FULL ? 'bg-amber-50 text-amber-600 border-amber-100' :
                           'bg-red-50 text-red-600 border-red-100'
                         }`}>
                            <Home className="w-6 h-6" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none flex items-center gap-2">
                               {shelter.name}
                               {shelter.status === ShelterStatus.FULL && <AlertCircle className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-tight italic">
                               <MapPin className="w-3 h-3 text-cyan-600" /> {shelter.address}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                               {shelter.facilities.slice(0, 3).map((f, i) => (
                                 <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 rounded uppercase tracking-tighter">{f}</span>
                               ))}
                               {shelter.facilities.length > 3 && <span className="text-[8px] font-bold text-slate-400">+{shelter.facilities.length - 3} more</span>}
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="max-w-[160px] mx-auto space-y-3">
                          {editingId === shelter.id ? (
                             <div className="flex items-center gap-2">
                                <input 
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                                  className="w-full px-3 py-2 bg-white border border-cyan-500 rounded-lg text-xs font-bold focus:outline-none"
                                  autoFocus
                                />
                                <button 
                                  onClick={() => handleUpdateOccupancy(shelter.id)}
                                  className="p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                                >
                                   <Save className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setEditingId(null)}
                                  className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:text-slate-600 transition-colors"
                                >
                                   <X className="w-4 h-4" />
                                </button>
                             </div>
                          ) : (
                             <div 
                               onClick={() => startEditing(shelter)}
                               className="cursor-pointer group/matrix"
                             >
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                                  <span className="text-slate-900">{shelter.currentOccupancy} / {shelter.totalCapacity}</span>
                                  <span className="text-cyan-600 group-hover/matrix:translate-x-1 transition-transform">{Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner group-hover/matrix:h-2 transition-all">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-700 ${
                                      (shelter.currentOccupancy / shelter.totalCapacity) >= 1 ? 'bg-red-500' :
                                      (shelter.currentOccupancy / shelter.totalCapacity) >= 0.7 ? 'bg-amber-500' :
                                      'bg-emerald-500'
                                    }`} 
                                    style={{ width: `${(shelter.currentOccupancy / shelter.totalCapacity) * 100}%` }}
                                  ></div>
                                </div>
                             </div>
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col items-center gap-2">
                          <RiskBadge level={shelter.routeRisk} className="scale-75" />
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Updated: 2m ago</span>
                          <span className="text-[8px] font-black text-cyan-600 uppercase tracking-widest">VACANCY: {shelter.availableSpace}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center justify-end gap-2 px-1">
                          <button className="p-3 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all border border-transparent hover:border-cyan-100">
                            <Settings2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => startEditing(shelter)}
                            className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Tactical Footer */}
        <div className="bg-slate-950 p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-800">
           <div className="flex items-center gap-5">
              <div className="w-3 w-3 bg-cyan-500 rounded-full animate-ping shadow-[0_0_15px_rgba(6,182,212,0.6)]"></div>
              <div>
                 <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-1">Tactical Logistics Sync</p>
                 <p className="text-xs text-slate-400 font-medium italic max-w-xl">
                   Operational status synchronized with ground teams. Saturation alerts will trigger automatic rerouting protocols for the next <span className="text-white font-bold">2,400 incoming evacuees</span>.
                 </p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Transmission</p>
                 <p className="text-[10px] font-black text-slate-200 tracking-widest">SEC PREVIOUS: 14:02:44</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-700" />
           </div>
        </div>
      </div>
    </div>
  );
}
