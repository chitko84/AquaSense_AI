/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Send, History, AlertTriangle, Info, Clock, CheckCircle2, MoreVertical } from 'lucide-react';
import { RiskLevel, Alert } from '../types';
import RiskBadge from '../components/RiskBadge';
import { ALERTS } from '../constants';

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
  const [formDone, setFormDone] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    severity: RiskLevel.MEDIUM,
    message: ''
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setFormDone(true);
    
    // Simulate adding to history
    const newAlert: Alert = {
      id: (alerts.length + 1).toString(),
      title: formData.title,
      message: formData.message,
      severity: formData.severity,
      timestamp: new Date().toISOString()
    };
    
    setTimeout(() => {
      setAlerts(prev => [newAlert, ...prev]);
      setFormDone(false);
      setFormData({
        title: '',
        location: '',
        severity: RiskLevel.MEDIUM,
        message: ''
      });
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Broadcast Command</h1>
          <p className="text-slate-500 text-sm font-medium italic">Issue critical field directives via <span className="text-cyan-600 font-bold">AquaSense Intel Pipeline</span>.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* alert Creation Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-cyan-400 rounded-lg border border-slate-800 w-fit">
            <Info className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Broadcast Channel</span>
          </div>

          <form onSubmit={handlePublish} className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden">
            {formDone && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-cyan-50 rounded-[2rem] flex items-center justify-center mb-6 border border-cyan-100 shadow-inner">
                  <CheckCircle2 className="w-12 h-12 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Satellite Uplink Success</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Propagating directive to district nodes...</p>
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">Internal Title / Operational Code</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., SECTOR-4_FLASH_FLOOD_INITIATED"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">Hazard Magnitude</label>
                    <select 
                      value={formData.severity}
                      onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as RiskLevel }))}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest leading-none focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all"
                    >
                       <option value={RiskLevel.MEDIUM}>Tier 2 - Operational Warning</option>
                       <option value={RiskLevel.HIGH}>Tier 3 - Immediate Hazard</option>
                       <option value={RiskLevel.CRITICAL}>Tier 4 - Massive Failure</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">Target Sector</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Kota Setar Central"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-bold"
                      required
                    />
                 </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-1">Public Directive Text</label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Draft tactical instructions. Ensure terminology is clear and locations are specific..."
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all"
                  required
                ></textarea>
                <div className="mt-4 flex items-start gap-4 p-4 bg-cyan-50/50 rounded-2xl border border-cyan-100/50">
                  <div className="w-1 h-8 bg-cyan-500 rounded-full shrink-0"></div>
                  <p className="text-[10px] text-cyan-800 font-bold uppercase tracking-tight leading-relaxed">Broadcast will trigger instant push notifications and overlay system dashboard for all target personnel and registered civilians in <span className="text-cyan-950 font-black">{formData.location || 'Selected Sectors'}</span>.</p>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 border border-white/10">
                     <Bell className="w-5 h-5" />
                   </div>
                   <div className="space-y-0.5">
                      <span className="text-[11px] font-black text-white uppercase tracking-widest block">Global Paging</span>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Priority Override Enabled</span>
                   </div>
                </div>
                <div className="w-12 h-6 bg-cyan-600 rounded-full relative shadow-inner">
                   <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={formDone}
              className="w-full py-6 bg-slate-950 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 h-20 disabled:opacity-50 active:scale-95 translate-y-2"
            >
              <Send className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              Execute Satellite Broadcast
            </button>
          </form>
        </div>

        {/* Alert History Side Panel */}
        <div className="lg:col-span-5 space-y-8">
           <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-4">
             <div className="p-3 bg-slate-100 rounded-2xl shadow-inner">
                <History className="w-5 h-5 text-slate-900" />
             </div>
             Transmission Log
           </h2>

           <div className="space-y-6">
              {alerts.map(alert => (
                 <div key={alert.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative group hover:border-cyan-200 transition-all hover:shadow-xl hover:translate-x-1">
                    <button className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 p-1.5 transition-colors">
                       <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="mb-6">
                       <RiskBadge level={alert.severity} className="scale-90 origin-left" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-3 leading-tight underline decoration-slate-100 underline-offset-4">{alert.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed mb-6 font-bold uppercase tracking-tight">{alert.message}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock className="w-4 h-4" />
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]"></div>
                         <span className="text-[10px] font-black text-cyan-800 uppercase tracking-widest">Sync Active</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
