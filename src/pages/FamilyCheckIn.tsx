/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Plus, MapPin, Clock, ShieldCheck, AlertCircle, Share2 } from 'lucide-react';
import { FAMILY_MEMBERS } from '../constants';

export default function FamilyCheckIn() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">Human Asset Monitoring</h1>
          <p className="text-slate-500 text-sm font-medium italic">Synchronized safety telemetry for <span className="text-cyan-600 font-bold">Designated Kinship Nodes</span>.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-slate-800 transition-all group">
          <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform" />
          Authorize Node
        </button>
      </header>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50 -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
           <div className="bg-slate-50 p-3 rounded-xl w-fit text-cyan-600 mb-6 border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
              <ShieldCheck className="w-7 h-7" />
           </div>
           <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 leading-none">02 <span className="text-[10px] text-slate-300 uppercase tracking-widest">/ 03</span></h3>
           <p className="text-[10px] text-cyan-700 font-black uppercase tracking-widest underline decoration-cyan-500/30 underline-offset-4">Verified Status: Green</p>
        </div>
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
           <div className="bg-slate-50 p-3 rounded-xl w-fit text-orange-600 mb-6 border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
              <AlertCircle className="w-7 h-7" />
           </div>
           <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 leading-none">01 <span className="text-[10px] text-slate-300 uppercase tracking-widest">/ 03</span></h3>
           <p className="text-[10px] text-orange-700 font-black uppercase tracking-widest underline decoration-orange-500/30 underline-offset-4">Verified Status: Warning</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-2xl flex flex-col justify-center items-center text-center cursor-pointer hover:bg-slate-800 transition-all group overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <Share2 className="w-10 h-10 text-cyan-400 mb-4 group-hover:scale-110 transition-transform z-10" />
           <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1 z-10">Broadcast Status</p>
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight z-10">Sync to External HQ</p>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-xs font-black text-slate-900 flex items-center gap-3 uppercase tracking-[0.3em]">
          <div className="p-1.5 bg-slate-100 rounded text-slate-400">
            <Users className="w-4 h-4" />
          </div>
          Active Resilience Network
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FAMILY_MEMBERS.map((member) => (
            <div key={member.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-cyan-200 transition-all group relative">
               <div className="absolute left-0 top-0 w-1 shadow-inner h-full bg-slate-200 group-hover:bg-cyan-500 transition-colors"></div>
               <div className="p-8">
                  <div className="flex items-start justify-between mb-8">
                     <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-black text-2xl border shadow-inner transition-all group-hover:scale-105 ${
                           member.status === 'Safe' ? 'bg-cyan-50 text-cyan-700 border-cyan-100' : 
                           member.status === 'Warning' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                           'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                           {member.name.charAt(0)}
                        </div>
                        <div>
                           <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">{member.name}</h3>
                           <span className={`text-[9px] font-black px-3 py-1 rounded inline-block uppercase tracking-widest border ${
                              member.status === 'Safe' ? 'bg-white text-cyan-700 border-cyan-200' : 
                              member.status === 'Warning' ? 'bg-white text-orange-700 border-orange-200' : 
                              'bg-white text-slate-400 border-slate-200'
                           }`}>
                              {member.status}
                           </span>
                        </div>
                     </div>
                     <button className="text-[10px] text-cyan-600 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:text-cyan-700 underline underline-offset-4 decoration-cyan-500/20">Query GPS</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                           <MapPin className="w-3.5 h-3.5 text-cyan-500" /> Ground Intel
                        </p>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-tight leading-none">{member.location}</p>
                     </div>
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5 text-slate-300" /> Pulse Sync
                        </p>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-tight leading-none">{member.lastUpdated}</p>
                     </div>
                  </div>
               </div>
               
               <div className={`px-8 py-5 border-t transition-all flex items-center justify-center gap-3 ${
                  member.status === 'Safe' ? 'bg-slate-50 border-cyan-50 text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white' : 
                  member.status === 'Warning' ? 'bg-slate-50 border-orange-50 text-orange-700 group-hover:bg-orange-600 group-hover:text-white' : 
                  'bg-slate-50 border-slate-50 text-slate-400'
               }`}>
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Authentication: Verified</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
