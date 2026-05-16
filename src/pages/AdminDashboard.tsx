/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BarChart3, Users, Home, AlertCircle, TrendingUp, ShieldAlert, CheckCircle2, MoreVertical, Search, XCircle, ClipboardCheck } from 'lucide-react';
import { FLOOD_REPORTS, SHELTERS } from '../constants';
import RiskBadge from '../components/RiskBadge';
import { RiskLevel, ShelterStatus, ReportStatus } from '../types';

export default function AdminDashboard() {
  const totalShelters = SHELTERS.length;
  const totalCapacity = SHELTERS.reduce((acc, s) => acc + s.totalCapacity, 0);
  const currentOccupancy = SHELTERS.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const availableSpaces = SHELTERS.reduce((acc, s) => acc + s.availableSpace, 0);
  const availableSheltersCount = SHELTERS.filter(s => s.status === ShelterStatus.AVAILABLE).length;
  const almostFullSheltersCount = SHELTERS.filter(s => s.status === ShelterStatus.ALMOST_FULL).length;
  const fullSheltersCount = SHELTERS.filter(s => s.status === ShelterStatus.FULL).length;
  const pendingReports = FLOOD_REPORTS.filter(r => r.status === ReportStatus.PENDING).length;
  const verifiedReports = FLOOD_REPORTS.filter(r => r.status === ReportStatus.VERIFIED).length;
  const rejectedReports = FLOOD_REPORTS.filter(r => r.status === ReportStatus.REJECTED).length;
  const resolvedReports = FLOOD_REPORTS.filter(r => r.status === ReportStatus.RESOLVED).length;
  const highRiskZones = FLOOD_REPORTS.filter(r => r.severity === RiskLevel.HIGH).length;
  const criticalRiskZones = FLOOD_REPORTS.filter(r => r.severity === RiskLevel.CRITICAL).length;

  // Mock impact reports stats
  const totalImpactReports = 12;
  const pendingImpactReviews = 4;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
             <span className="px-3 py-1 bg-slate-900 text-cyan-400 text-[9px] font-black rounded-lg uppercase tracking-[0.2em] border border-slate-700 shadow-xl">
                Operational Clearance: Level 4
             </span>
             <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-[9px] font-black uppercase tracking-widest">Live Incident Stream</span>
             </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Unified Command Center</h1>
          <p className="text-slate-500 text-sm font-medium italic">Strategic coordination for the <span className="text-cyan-600 font-bold">Alor Setar Resilience Grid</span>.</p>
        </div>
      </header>

      {/* AI Situation Summary */}
      <div className="bg-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 -mr-48 -mt-48 rounded-full blur-3xl"></div>
         <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center border border-white/20 shrink-0 group-hover:rotate-6 transition-transform shadow-xl">
               <ShieldAlert className="w-10 h-10 text-cyan-400" />
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">AI Situation Intelligence</h4>
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-cyan-500 animate-[loading_3s_infinite]"></div>
                  </div>
               </div>
               <p className="text-xl font-black leading-relaxed tracking-tight underline decoration-indigo-500/50 underline-offset-8 decoration-2">
                 "Flood risk is increasing around Alor Setar due to verified reports near Jalan Kuala Kedah and Alor Setar City Centre. AIU Multipurpose Hall is currently the recommended shelter due to available capacity and low route risk."
               </p>
            </div>
         </div>
      </div>

      {/* Admin Summary Dashboard GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[
          { label: 'Pending Reports', value: pendingReports, icon: AlertCircle, color: 'text-orange-500', sub: 'Awaiting Action' },
          { label: 'Verified Intel', value: verifiedReports, icon: CheckCircle2, color: 'text-cyan-500', sub: 'Ground Truth' },
          { label: 'Resolved', value: resolvedReports, icon: CheckCircle2, color: 'text-emerald-500', sub: 'Cleared Zones' },
          { label: 'Rejected', value: rejectedReports, icon: XCircle, color: 'text-slate-400', sub: 'Invalid Data' },
          { label: 'High Risk Zones', value: highRiskZones, icon: ShieldAlert, color: 'text-red-500', sub: 'Priority Alpha' },
          { label: 'Critical Zones', value: criticalRiskZones, icon: ShieldAlert, color: 'text-red-700', sub: 'Immediate Evac' },
          { label: 'Net Vacancy', value: availableSpaces, icon: Home, color: 'text-cyan-600', sub: 'Reserve Nodes' },
          { label: 'Almost Full', value: almostFullSheltersCount, icon: TrendingUp, color: 'text-amber-500', sub: 'Capacity Warning' },
          { label: 'Full Capacity', value: fullSheltersCount, icon: AlertCircle, color: 'text-red-500', sub: 'Redirection' },
          { label: 'Occupancy Rate', value: `${Math.round((currentOccupancy / totalCapacity) * 100)}%`, icon: Users, color: 'text-blue-600', sub: 'System Saturation' },
          { label: 'Post-Flood Intel', value: totalImpactReports, icon: BarChart3, color: 'text-indigo-600', sub: 'Impact Matrix' },
          { label: 'Pending Reviews', value: pendingImpactReviews, icon: ClipboardCheck, color: 'text-violet-600', sub: 'Quality Audit' },
        ].map((stat, i) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={i} 
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-cyan-200 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                  {stat.icon && <stat.icon className="w-5 h-5" />}
               </div>
               <p className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
            </div>
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Verification Task List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Report Trend Visual */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-600" />
                Report Severity Matrix
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Critical', count: criticalRiskZones, color: 'bg-red-700', total: FLOOD_REPORTS.length },
                  { label: 'High', count: highRiskZones, color: 'bg-red-500', total: FLOOD_REPORTS.length },
                  { label: 'Medium', count: FLOOD_REPORTS.filter(r => r.severity === RiskLevel.MEDIUM).length, color: 'bg-amber-500', total: FLOOD_REPORTS.length },
                  { label: 'Low', count: FLOOD_REPORTS.filter(r => r.severity === RiskLevel.LOW).length, color: 'bg-emerald-500', total: FLOOD_REPORTS.length },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest overflow-hidden">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900">{item.count} Reports</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / item.total) * 100}%` }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Alerts Panel */}
            <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-red-900 uppercase tracking-[0.3em] flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Urgent Operations Alerts
              </h3>
              <div className="space-y-4">
                {[
                  { msg: "High flood risk near Jalan Kuala Kedah", time: "2m ago" },
                  { msg: "SK Titi Gajah shelter is full", time: "15m ago" },
                  { msg: "Safe route updated to AIU Multipurpose Hall", time: "1h ago" },
                ].map((alert, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-white/50 rounded-2xl border border-red-200/50">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0 animate-pulse"></div>
                    <div>
                      <p className="text-[11px] font-black text-red-900 leading-tight uppercase tracking-tight">{alert.msg}</p>
                      <p className="text-[9px] text-red-500 font-bold uppercase mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl text-cyan-400 shadow-lg">
                <ShieldAlert className="w-4 h-4" />
              </div>
              Incident Validation Queue
            </h2>
            <div className="flex items-center gap-4">
               <div className="px-3 py-1 bg-orange-50 rounded-lg border border-orange-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-black text-orange-700 uppercase tracking-widest">{pendingReports} Pending Verification</span>
               </div>
               <Link to="/admin/reports" className="text-[10px] font-black text-cyan-600 uppercase tracking-widest hover:text-cyan-700 transition-colors">View All</Link>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident Identifier</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Geo-Location</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vulnerability</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {FLOOD_REPORTS.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-950 text-cyan-400 flex items-center justify-center text-[10px] font-black uppercase shadow-inner group-hover:rotate-6 transition-transform">R{report.id}</div>
                          <div>
                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Citizen Report #{report.id}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: {report.id}821-KDH</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest italic">{report.location}</td>
                      <td className="px-8 py-6">
                        <RiskBadge level={report.severity} className="scale-90" />
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-3 px-1 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 bg-slate-900 text-cyan-400 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                               <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                               <MoreVertical className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-8 text-center bg-slate-50/50 border-t border-slate-100">
               <button className="px-10 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-cyan-600 uppercase tracking-[0.3em] hover:shadow-xl hover:border-cyan-200 transition-all active:scale-95">Execute Batch Verification Pipeline</button>
            </div>
          </div>
        </div>

        {/* Shelter Occupancy Chart/List */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
              <div className="p-2 bg-cyan-600 rounded-xl text-white shadow-lg">
                <Home className="w-4 h-4" />
              </div>
              Shelter Load Levels
            </h2>
            <Link to="/admin/shelters" className="text-[10px] font-black text-slate-400 hover:text-cyan-600 transition-colors uppercase tracking-widest">Manage All</Link>
          </div>

          <div className="space-y-6">
             {SHELTERS.map(shelter => (
                <motion.div 
                  whileHover={{ x: 5 }}
                  key={shelter.id} 
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 group hover:border-cyan-200 transition-all"
                >
                   <div className="flex justify-between items-start">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight max-w-[150px] leading-tight">{shelter.name}</h4>
                      <RiskBadge level={shelter.routeRisk} className="scale-75 origin-right" />
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-end justify-between">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Utilization Rate</span>
                         <span className={`text-sm font-black leading-none ${
                           (shelter.currentOccupancy / shelter.totalCapacity) >= 0.9 ? 'text-red-500' : 
                           (shelter.currentOccupancy / shelter.totalCapacity) >= 0.7 ? 'text-amber-500' : 'text-emerald-600'
                         }`}>{Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(shelter.currentOccupancy / shelter.totalCapacity) * 100}%` }}
                           transition={{ duration: 1 }}
                           className={`h-full transition-all duration-1000 ${
                             (shelter.currentOccupancy / shelter.totalCapacity) >= 1 ? 'bg-red-500' :
                             (shelter.currentOccupancy / shelter.totalCapacity) >= 0.7 ? 'bg-amber-500' :
                             'bg-cyan-600'
                           }`}
                         ></motion.div>
                      </div>
                   </div>
                   <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest pt-2">
                      <span className="text-slate-400">{shelter.currentOccupancy.toLocaleString()} / {shelter.totalCapacity.toLocaleString()} LOAD</span>
                      <div className="flex items-center gap-1 text-cyan-600 italic">
                         <div className="w-1 h-1 bg-cyan-600 rounded-full animate-ping"></div>
                         Live Sync
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
