/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AlertTriangle, 
  Map as MapIcon, 
  Home, 
  ShieldCheck, 
  ArrowRight,
  Droplets,
  CloudRain,
  Activity,
  Clock,
  MessageSquare,
  Users,
  Bell,
  Navigation,
  CheckCircle2,
  Zap,
  Layers,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import RiskBadge from '../components/RiskBadge';
import { RiskLevel, ShelterStatus } from '../types';
import { SHELTERS, FLOOD_REPORTS, ALERTS } from '../constants';

export default function Dashboard() {
  const verifiedReports = FLOOD_REPORTS.filter(r => r.status === 'Verified').length;
  const highRiskZones = 3; // Synthetic
  const totalShelters = SHELTERS.length;
  const availableSpaces = SHELTERS.reduce((acc, s) => acc + s.availableSpace, 0);
  const availableSheltersNum = SHELTERS.filter(s => s.status === ShelterStatus.AVAILABLE).length;
  const activeAlerts = ALERTS.length;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* 1. HERO EMERGENCY ALERT BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-600 text-white rounded-[2rem] p-8 shadow-2xl shadow-red-200 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 -mr-48 -mt-48 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 animate-pulse shrink-0">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div className="text-center md:text-left flex-1 space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">High Alert</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-red-100 italic opacity-80">Last updated: Just Now</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">High Flood Risk Detected Near Jalan Kuala Kedah</h2>
            <p className="text-red-100 text-sm font-bold opacity-90 max-w-2xl">2 verified reports and rising water indicators detected nearby. Avoid low-lying roads and follow safe route guidance immediately.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            <Link to="/routes" className="px-8 py-4 bg-white text-red-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-slate-50 transition-all text-center flex items-center justify-center gap-2 active:scale-95">
              <Navigation className="w-4 h-4" /> View Safe Route
            </Link>
            <Link to="/shelters" className="px-8 py-4 bg-red-700 text-white border border-red-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-red-800 transition-all text-center active:scale-95">
              Find Shelter
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 2. CURRENT RISK SUMMARY CARD */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group h-full flex flex-col"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 -mr-16 -mt-16 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
           <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-2.5 bg-slate-900 text-cyan-400 rounded-xl shadow-lg">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Your Area</span>
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">Alor Setar, Kedah</h3>
              </div>
           </div>
           
           <div className="flex-1 space-y-8 relative z-10">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Flood Risk Level</p>
                <div className="flex items-center gap-3">
                   <RiskBadge level={RiskLevel.HIGH} className="scale-110 origin-left" />
                   <span className="text-4xl font-black text-slate-900 tracking-tighter">78<sub className="text-sm font-bold text-slate-300 ml-1">/100</sub></span>
                </div>
              </div>

              <div className="space-y-4">
                 {[
                   { label: 'Rainfall Intensity', val: 'Extreme', color: 'text-blue-500' },
                   { label: 'Ground Saturation', val: 'Critical', color: 'text-amber-600' },
                   { label: 'Evacuation Path', val: 'Obstructed', color: 'text-red-500' },
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.val}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="mt-8 pt-6 border-t border-slate-50">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center shadow-inner">
                 <p className="text-[11px] font-black text-red-700 uppercase tracking-[0.2em] animate-pulse">Status: Monitor Closely</p>
              </div>
           </div>
        </motion.div>

        {/* 4. KPI CARDS */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
           {[
             { label: 'Nearby Reports', value: 8, icon: AlertTriangle, color: 'text-orange-500', sub: 'In 5km Radius' },
             { label: 'Verified Intel', value: 5, icon: CheckCircle2, color: 'text-cyan-600', sub: 'Ground Truth' },
             { label: 'High-Risk Zones', value: 3, icon: MapIcon, color: 'text-red-500', sub: 'Red Sectors' },
             { label: 'Available Shelters', value: 2, icon: Home, color: 'text-slate-900', sub: 'Open Nodes' },
             { label: 'Spaces Avail.', value: 600, icon: Users, color: 'text-blue-600', sub: 'Current Net' },
             { label: 'Active Alerts', value: 4, icon: Bell, color: 'text-amber-500', sub: 'Live Broadcasts' },
           ].map((kpi, i) => (
             <motion.div 
               whileHover={{ y: -5 }}
               key={i} 
               className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm group hover:border-cyan-200 transition-all flex flex-col justify-between"
             >
                <div className="flex items-center justify-between mb-4">
                   <div className={`p-3 rounded-2xl bg-slate-50 ${kpi.color} group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner`}>
                      <kpi.icon className="w-5 h-5" />
                   </div>
                   <p className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{kpi.label}</p>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-60 italic">{kpi.sub}</p>
                </div>
             </motion.div>
           ))}
        </div>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[
          { label: 'Report a Flood', icon: Droplets, href: '/report', color: 'bg-white text-slate-900 border-slate-200 hover:border-cyan-200' },
          { label: 'Find a Route', icon: Navigation, href: '/routes', color: 'bg-white text-slate-900 border-slate-200 hover:border-cyan-200' },
          { label: 'Find a Shelter', icon: Home, href: '/shelters', color: 'bg-white text-slate-900 border-slate-200 hover:border-cyan-200' },
          { label: 'Family Safety', icon: Users, href: '/family', color: 'bg-white text-slate-900 border-slate-200 hover:border-cyan-200' },
          { label: 'View Live Map', icon: MapIcon, href: '/map', color: 'bg-white text-slate-900 border-slate-200 hover:border-cyan-200' },
          { label: 'Ask AI Assistant', icon: MessageSquare, href: '/assistant', color: 'bg-slate-900 text-white border-transparent hover:bg-slate-800' },
        ].map((action, i) => (
          <Link 
            key={i} 
            to={action.href}
            className={`flex flex-col items-center justify-center p-8 rounded-3xl border shadow-sm transition-all hover:shadow-xl active:scale-95 group ${action.color}`}
          >
            <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform">
               <action.icon className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center leading-tight">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {/* 5. Nearby Flood Reports Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xs font-black text-slate-900 flex items-center gap-3 uppercase tracking-[0.3em]">
                <div className="p-1.5 bg-red-50 rounded text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                Nearby Field Intel
              </h2>
              <Link to="/report" className="text-[10px] text-cyan-600 font-black uppercase tracking-widest hover:text-cyan-700 flex items-center gap-2 group">
                Full Archive <ArrowRight className="w-3.5 h-3.5 group-translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {FLOOD_REPORTS.map((report) => (
                  <div key={report.id} className="p-6 hover:bg-slate-50 transition-all group relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-slate-200 group-hover:bg-cyan-500 transition-colors"></div>
                    <div className="flex items-start justify-between gap-6">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{report.location}</h4>
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">• 2.4km Away</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-lg mb-3">{report.description}</p>
                        <div className="flex items-center gap-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <div className="flex items-center gap-1.5">
                            <Droplets className="w-3 h-3 text-cyan-500" />
                            Depth: <span className="text-slate-900">{report.waterLevel}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-cyan-600">
                            <CheckCircle2 className="w-3 h-3" />
                            {report.status}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <RiskBadge level={report.severity} className="scale-90" />
                        <Link 
                          to={`/incident/${report.id}`} 
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white rounded-lg text-[8px] font-black uppercase tracking-widest transition-all"
                        >
                          View Intel
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6 & 8. Route Guidance Sections */}
          <section className="space-y-6">
             <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xs font-black text-slate-900 flex items-center gap-3 uppercase tracking-[0.3em]">
                <div className="p-1.5 bg-blue-50 rounded text-blue-600">
                  <Navigation className="w-4 h-4" />
                </div>
                Tactical Navigation
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               {/* 6. Recommended Safe Action Card */}
               <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                     <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                     </div>
                     <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">AI Deployment Plan</span>
                  </div>
                  <p className="text-sm font-bold text-slate-300 leading-relaxed mb-8 italic">"Use the safest route to AIU Multipurpose Hall. The fastest route passes near two verified flood reports."</p>
                  <Link to="/routes" className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-white transition-colors">
                     Open Navigation Map <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
               </div>

               {/* 8. Mini Route Safety Preview */}
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl relative group">
                        <div className="absolute left-0 top-0 w-1 h-full bg-red-500 rounded-l-xl"></div>
                        <div>
                           <p className="text-[10px] font-black text-slate-900 uppercase">Fastest Route</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">ETA: 18 Min</p>
                        </div>
                        <div className="text-right">
                           <span className="text-[9px] font-black text-red-600 uppercase border border-red-200 px-2 py-0.5 rounded">High Risk</span>
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-cyan-50 border border-cyan-100 rounded-xl relative group ring-2 ring-cyan-500/20">
                        <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500 rounded-l-xl"></div>
                        <div className="flex items-center gap-2">
                           <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                           <div>
                              <p className="text-[10px] font-black text-slate-900 uppercase">Safest Route</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">ETA: 24 Min</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className="text-[9px] font-black text-cyan-600 uppercase border border-cyan-200 px-2 py-0.5 rounded">Low Risk</span>
                        </div>
                     </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight text-center">Recommendation: <span className="text-slate-900 font-black">Use Safest Route</span></p>
                  </div>
               </div>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* 7. Shelter Availability Preview */}
          <section className="space-y-6">
             <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xs font-black text-slate-900 flex items-center gap-3 uppercase tracking-[0.3em]">
                <div className="p-1.5 bg-cyan-50 rounded text-cyan-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                Sanctuary Status
              </h2>
              <Link to="/shelters" className="text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-slate-900 transition-colors">
                Scan All
              </Link>
            </div>

            <div className="space-y-4">
              {SHELTERS.slice(0, 3).map((shelter) => (
                <div key={shelter.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group overflow-hidden transition-all hover:border-cyan-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{shelter.name}</h4>
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
                        Risk Level: <span className={
                          shelter.routeRisk === RiskLevel.LOW ? 'text-cyan-600' : 
                          shelter.routeRisk === RiskLevel.MEDIUM ? 'text-orange-500' : 'text-red-500'
                        }>{shelter.routeRisk}</span>
                      </p>
                    </div>
                    <div className="scale-75 origin-top-right">
                       <span className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-widest ${
                          shelter.status === ShelterStatus.AVAILABLE ? 'bg-cyan-50 text-cyan-700 border-cyan-100' : 
                          shelter.status === ShelterStatus.ALMOST_FULL ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                          'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {shelter.status}
                       </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Available Slots</span>
                      <span className="text-slate-900">{shelter.totalCapacity - shelter.currentOccupancy} Units</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          (shelter.currentOccupancy / shelter.totalCapacity) > 0.9 ? 'bg-red-500' :
                          (shelter.currentOccupancy / shelter.totalCapacity) > 0.7 ? 'bg-orange-500' :
                          'bg-cyan-500'
                        }`}
                        style={{ width: `${(shelter.currentOccupancy / shelter.totalCapacity) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight italic">Facilities: {shelter.facilities.slice(0, 3).join(', ')}...</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 9. AI Safety Advice Card (Gemini Advice) */}
          <div className="p-8 bg-violet-600 rounded-2xl text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <MessageSquare className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sentinel Safety Protocol</span>
            </div>
            <h5 className="text-sm font-black text-white italic leading-relaxed mb-6">
              "Because flood risk is high near your area, avoid driving through flooded roads, prepare important documents, and monitor shelter capacity."
            </h5>
            <div className="flex items-center gap-2 text-[9px] font-black text-violet-100 uppercase tracking-widest opacity-60">
               <Zap className="w-3 h-3" />
               Generated via Gemini v1.5 API
            </div>
          </div>

          {/* 10. System Confidence / Data Source Card */}
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Layers className="w-4 h-4" /> System Health
             </h4>
             <div className="space-y-4">
                {[
                  { label: 'Community Reports', status: 'ACTIVE', color: 'text-green-500', icon: Users },
                  { label: 'Weather Telemetry', status: 'SIMULATED', color: 'text-amber-500', icon: CloudRain },
                  { label: 'Hydrology Monitoring', status: 'SIMULATED', color: 'text-amber-500', icon: Droplets },
                  { label: 'ML Prediction Engine', status: 'SIMULATION MODE', color: 'text-cyan-500', icon: Activity },
                  { label: 'Gemini Safety Layer', status: 'SYNTHETIC', color: 'text-violet-500', icon: MessageSquare },
                  { label: 'Firebase Sync', status: 'STABLE', color: 'text-green-500', icon: Database },
                ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                         <item.icon className="w-3.5 h-3.5 text-slate-300" />
                         <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{item.label}</span>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

