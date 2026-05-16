/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Search, Filter, CheckCircle2, XCircle, Eye, MoreHorizontal, MapPin, Clock, CheckCircle } from 'lucide-react';
import { FLOOD_REPORTS as INITIAL_REPORTS } from '../constants';
import RiskBadge from '../components/RiskBadge';
import { ReportStatus, FloodReport } from '../types';

export default function AdminReports() {
  const [reports, setReports] = useState<FloodReport[]>(INITIAL_REPORTS);
  const [filter, setFilter] = useState('');

  const updateReportStatus = (id: string, status: ReportStatus) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const filteredReports = reports.filter(r => 
    r.location.toLowerCase().includes(filter.toLowerCase()) || 
    r.description.toLowerCase().includes(filter.toLowerCase())
  );

  const stats = {
    pending: reports.filter(r => r.status === ReportStatus.PENDING).length,
    verified: reports.filter(r => r.status === ReportStatus.VERIFIED).length,
    resolved: reports.filter(r => r.status === ReportStatus.RESOLVED).length,
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verification Command</h1>
          <p className="text-slate-500 text-sm font-medium">Coordinate ground-truth data validation via the <span className="text-cyan-600 font-bold">Resilience Network</span>.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter intel..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-cyan-500/10 focus:outline-none" 
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Stats row */}
      <div className="flex flex-wrap gap-6">
        {[
          { label: 'Unverified Intel', count: stats.pending.toString().padStart(2, '0'), color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
          { label: 'Operational Sync', count: stats.verified.toString().padStart(2, '0'), color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100' },
          { label: 'Resolved Reports', count: stats.resolved.toString().padStart(2, '0'), color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} px-8 py-5 rounded-xl border shadow-sm flex items-center gap-6 min-w-[200px]`}>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-3xl font-black tracking-tighter ${s.color}`}>{s.count}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px] md:min-w-0">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest sm:w-1/4">Incident Context</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Temporal/Spatial Intel</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ops Execution</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{report.location}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium capitalize">{report.description}</p>
                    <div className="flex items-center gap-2">
                       <RiskBadge level={report.severity} />
                       <div className="px-2 py-0.5 bg-slate-900 rounded text-[9px] font-black text-cyan-400 uppercase tracking-widest">Submersion: {report.waterLevel}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-cyan-600" />
                        <span className="text-[10px] font-black uppercase tracking-tight">Geo: 6.11°N, 100.37°E</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-tight">{new Date(report.timestamp).toLocaleString()}</span>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-6 text-center">
                   <div className="inline-block scale-90">
                     <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                       report.status === ReportStatus.VERIFIED ? 'bg-cyan-50 text-cyan-700 border-cyan-100 shadow-sm' :
                       report.status === ReportStatus.PENDING ? 'bg-orange-50 text-orange-700 border-orange-100 animate-pulse' :
                       report.status === ReportStatus.RESOLVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm' :
                       'bg-slate-100 text-slate-400 border-slate-200 line-through'
                     }`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${
                         report.status === ReportStatus.VERIFIED ? 'bg-cyan-600' :
                         report.status === ReportStatus.PENDING ? 'bg-orange-500' :
                         report.status === ReportStatus.RESOLVED ? 'bg-emerald-600' :
                         'bg-slate-400'
                       }`}></div>
                       {report.status}
                     </span>
                   </div>
                </td>
                <td className="px-6 py-6">
                   <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Link 
                        to={`/incident/${report.id}`}
                        className="p-2.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      {report.status === ReportStatus.PENDING && (
                        <>
                          <button 
                            onClick={() => updateReportStatus(report.id, ReportStatus.VERIFIED)}
                            title="Verify Report"
                            className="p-2.5 bg-slate-900 text-cyan-400 rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateReportStatus(report.id, ReportStatus.REJECTED)}
                            title="Reject Report"
                            className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border border-red-100"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {(report.status === ReportStatus.VERIFIED) && (
                        <button 
                          onClick={() => updateReportStatus(report.id, ReportStatus.RESOLVED)}
                          title="Mark Resolved"
                          className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all border border-emerald-100"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      {(report.status === ReportStatus.REJECTED || report.status === ReportStatus.RESOLVED) && (
                         <button className="p-2.5 bg-slate-50 text-slate-300 rounded-lg cursor-not-allowed">
                           <MoreHorizontal className="w-4 h-4" />
                         </button>
                      )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}
