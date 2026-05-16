/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft,
  Navigation,
  Home,
  Zap,
  Info,
  Calendar,
  User,
  Share2,
  FileText,
  Map as MapIcon,
  CircleDot
} from 'lucide-react';
import { motion } from 'motion/react';
import { getFloodReportById, updateReportStatus } from '../services/firebaseService';
import { FloodReport, ReportStatus, RiskLevel } from '../types';
import RiskBadge from '../components/RiskBadge';
import { useAuth } from '../contexts/AuthContext';

export default function IncidentDetails() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [report, setReport] = useState<FloodReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      if (!reportId) return;
      setLoading(true);
      try {
        const data = await getFloodReportById(reportId);
        setReport(data);
      } catch (error) {
        console.error("Failed to load report:", error);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [reportId]);

  const handleStatusUpdate = async (status: ReportStatus) => {
    if (!reportId || !report) return;
    try {
      await updateReportStatus(reportId, status);
      setReport({ ...report, status });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading flood report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
           <AlertTriangle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase">Report Not Found</h2>
        <p className="text-slate-500 text-sm italic">We couldn't find the information for this incident.</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const timelineSteps = [
    { label: 'Report Submitted', status: 'completed', date: report.timestamp },
    { label: 'Admin Verification', status: report.status !== ReportStatus.PENDING ? 'completed' : 'pending', date: report.verifiedAt },
    { label: 'Report Verified', status: (report.status === ReportStatus.VERIFIED || report.status === ReportStatus.RESOLVED) ? 'completed' : report.status === ReportStatus.REJECTED ? 'rejected' : 'upcoming' },
    { label: 'Task Resolved', status: report.status === ReportStatus.RESOLVED ? 'completed' : 'upcoming', date: report.resolvedAt }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header Navigation */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all group w-fit"
        >
          <div className="p-2 bg-white border border-slate-200 rounded-xl group-hover:bg-slate-50">
             <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Go Back</span>
        </button>

        <div className="flex items-center gap-3">
          <Link 
            to={`/incident/${reportId}/impact`}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 sm:py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            Report Damage
          </Link>
          <button className="p-3 sm:p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
             <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
            <div className={`h-2 w-full ${
              report.severity === RiskLevel.CRITICAL ? 'bg-red-500' :
              report.severity === RiskLevel.HIGH ? 'bg-orange-500' :
              report.severity === RiskLevel.MEDIUM ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
            
            <div className="p-8 md:p-10 space-y-10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                 <div>
                    <p className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                       <CircleDot className="w-3 h-3 animate-pulse" /> Incident ID {report.id}
                    </p>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">{report.location}</h1>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">{report.state || 'National'} Area</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <RiskBadge level={report.severity} />
                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      report.status === ReportStatus.VERIFIED ? 'bg-cyan-50 text-cyan-700 border-cyan-100' :
                      report.status === ReportStatus.PENDING ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      report.status === ReportStatus.RESOLVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {report.status}
                    </span>
                 </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Water Level</p>
                   <p className="text-xs font-black text-slate-900 uppercase">{report.waterLevel}</p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Report Type</p>
                   <p className="text-xs font-black text-slate-900 uppercase">{report.reportType || 'Standard'}</p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Location Coords</p>
                   <p className="text-xs font-black text-slate-900 uppercase">{report.lat.toFixed(4)}°N, {report.lng.toFixed(4)}°E</p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Emergency Help</p>
                   <p className={`text-xs font-black uppercase ${report.emergencyHelpNeeded ? 'text-red-600' : 'text-emerald-600'}`}>
                      {report.emergencyHelpNeeded ? 'REQUIRED' : 'NORMAL'}
                   </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-400" /> Report Description
                 </h3>
                 <p className="text-slate-600 font-medium leading-relaxed italic text-sm border-l-2 border-slate-200 pl-4 py-1">
                    "{report.description}"
                 </p>
              </div>

              {/* Photo Area */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-violet-500" /> Incident Photos
                 </h3>
                 <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1547683908-21aa53841cd1?auto=format&fit=crop&q=80&w=1200" 
                      alt="Flood Evidence"
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-8">
                       <p className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-1">Photo taken on {new Date(report.timestamp).toLocaleDateString()}</p>
                       <p className="text-white font-black uppercase tracking-tight text-lg">Location: {report.location}</p>
                    </div>
                 </div>
                 
                 {/* AI Analysis Result */}
                 <div className="bg-violet-900/5 border border-violet-100 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <Zap className="w-12 h-12 text-violet-600" />
                    </div>
                    <h5 className="text-[9px] font-black text-violet-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <Zap className="w-3.5 h-3.5" /> AI Analysis
                    </h5>
                    <p className="text-xs text-slate-700 font-bold leading-relaxed italic">
                      AquaSense AI summarizes this report as a <span className="text-red-600">{report.severity.toLowerCase()}</span> flooded {report.reportType?.toLowerCase() || 'site'} based on water level and user telemetry. 
                      Evidence imagery matches high-risk pattern. Safety protocol recommended: Avoid the area and prioritize safe evacuation routes.
                    </p>
                 </div>
              </div>
            </div>
          </section>

          {/* Admin Controls */}
          {isAdmin && (
            <section className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Shield className="w-32 h-32 text-cyan-400" />
               </div>
               <div className="relative z-10">
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-2">
                     <Shield className="w-6 h-6 text-cyan-400" /> Review Report
                  </h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Change status for incident {report.id}.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  <button 
                    onClick={() => handleStatusUpdate(ReportStatus.VERIFIED)}
                    disabled={report.status === ReportStatus.VERIFIED}
                    className="flex items-center justify-center gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-cyan-600 hover:border-cyan-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:text-white" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Verify Report</span>
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(ReportStatus.REJECTED)}
                    disabled={report.status === ReportStatus.REJECTED}
                    className="flex items-center justify-center gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-600 hover:border-red-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <XCircle className="w-5 h-5 text-red-400 group-hover:text-white" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Reject Report</span>
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(ReportStatus.RESOLVED)}
                    disabled={report.status === ReportStatus.RESOLVED}
                    className="flex items-center justify-center gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-600 hover:border-emerald-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:text-white" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Mark Resolved</span>
                  </button>
               </div>
            </section>
          )}
        </div>

        {/* Sidebar Status Column */}
        <div className="space-y-10">
          {/* Status Timeline */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
             <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Incident Status History
             </h3>
             
             <div className="space-y-8">
                {timelineSteps.map((step, i) => (
                  <div key={i} className="flex gap-4 relative">
                     {i < timelineSteps.length - 1 && (
                       <div className={`absolute left-4 top-8 bottom-0 w-0.5 -mb-8 ${step.status === 'completed' ? 'bg-cyan-500' : 'bg-slate-100'}`}></div>
                     )}
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                       step.status === 'completed' ? 'bg-cyan-50 text-cyan-600 border-cyan-500' :
                       step.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-500' :
                       step.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-500 animate-pulse' :
                       'bg-white text-slate-200 border-slate-100'
                     }`}>
                        {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : 
                         step.status === 'rejected' ? <XCircle className="w-4 h-4" /> : <CircleDot className="w-4 h-4" />}
                     </div>
                     <div>
                        <h4 className={`text-[10px] font-black uppercase tracking-widest ${
                          step.status === 'completed' ? 'text-slate-900' : 'text-slate-400'
                        }`}>{step.label}</h4>
                        {step.date && (
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{new Date(step.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Submitter Info */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
             <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> Submitted By
             </h3>
             <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-slate-900 text-cyan-400 rounded-xl flex items-center justify-center font-black text-lg">
                   {report.submittedBy ? report.submittedBy.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{report.submittedBy || 'Anonymous User'}</p>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Trust Score: 95/100</p>
                </div>
             </div>
          </section>

          {/* Quick Actions */}
          <section className="space-y-4">
             <Link to="/map" className="flex items-center justify-between w-full p-6 bg-white border border-slate-200 rounded-3xl hover:border-slate-900 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <MapIcon className="w-5 h-5" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">View on Map</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
             </Link>
             <Link to="/routes" className="flex items-center justify-between w-full p-6 bg-white border border-slate-200 rounded-3xl hover:border-slate-900 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <Navigation className="w-5 h-5" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">View Safe Routes</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
             </Link>
             <Link to="/shelters" className="flex items-center justify-between w-full p-6 bg-white border border-slate-200 rounded-3xl hover:border-slate-900 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <Home className="w-5 h-5" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Find Shelter</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
             </Link>
          </section>

          {/* Safety Disclaimer */}
          <div className="p-6 bg-slate-900/5 rounded-2xl border border-dashed border-slate-200">
             <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed italic">
                AquaSense AI provides decision-support information and does not replace official emergency authorities. In life-threatening situations, contact 999 immediately.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
