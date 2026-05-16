/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Camera, 
  MapPin, 
  Send, 
  Info, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Shield, 
  Upload, 
  Zap, 
  Layers, 
  Navigation,
  X,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RiskLevel, ReportStatus } from '../types';
import RiskBadge from '../components/RiskBadge';

const REPORT_TYPES = [
  'Flooded road',
  'Rising water',
  'Blocked drain',
  'Road closed',
  'Unsafe bridge',
  'Landslide risk',
  'Need help',
  'Other'
];

const WATER_LEVELS = [
  'Ankle level',
  'Knee level',
  'Waist level',
  'Chest level',
  'Unknown'
];

export default function ReportFlood() {
  const navigate = useNavigate();
  const [submittedReport, setSubmittedReport] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    locationName: '',
    reportType: '',
    severity: RiskLevel.LOW,
    waterLevelEstimate: '',
    description: '',
    emergencyHelpNeeded: false,
    contactVisible: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePhotoAnalysis = () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setAiAnalysis({
        estimatedSeverity: RiskLevel.HIGH,
        waterDepth: 'Knee level',
        sceneType: 'Flooded road',
        safetyRisk: 'Dangerous for small vehicles',
        suggestedAction: 'Avoid this road and use safe route guidance'
      });
      setIsAnalyzing(false);
      setFormData(prev => ({
        ...prev,
        severity: RiskLevel.HIGH,
        waterLevelEstimate: 'Knee level',
        reportType: 'Flooded road'
      }));
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReportId = `rep-${Math.random().toString(36).substr(2, 9)}`;
    const newReport = {
      id: newReportId,
      userId: 'user-001', // Mock user
      ...formData,
      latitude: 6.1248, // Mock GPS
      longitude: 100.3678,
      status: ReportStatus.PENDING,
      createdAt: new Date().toISOString(),
      verifiedBy: null,
      aiPhotoAnalysis: aiAnalysis
    };
    
    // In real app, we'd call createFloodReport
    // For this prototype, we'll redirect to the details page using the new ID
    navigate(`/incident/${newReportId}`);
  };

  if (submittedReport) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-10 pb-20"
      >
        <div className="bg-white rounded-3xl p-10 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
           <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
           </div>
           <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Report Submitted</h2>
           <p className="text-slate-500 mb-10 text-sm font-medium">Your flood report has been submitted and is <span className="text-amber-600 font-bold">waiting to be checked by our team</span>.</p>

           <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-left space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Report Details</h3>
                 <span className="text-[10px] font-black p-1 px-2 rounded bg-amber-100 text-amber-700 uppercase tracking-widest border border-amber-200">
                    {submittedReport.status}
                 </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Location</p>
                       <p className="text-sm font-black text-slate-900 uppercase">{submittedReport.locationName}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Danger Level</p>
                       <RiskBadge level={submittedReport.severity} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Water Level</p>
                       <p className="text-xs font-bold text-slate-700">{submittedReport.waterLevelEstimate}</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Report Type</p>
                       <p className="text-xs font-bold text-slate-700">{submittedReport.reportType}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Timestamp</p>
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(submittedReport.createdAt).toLocaleString()}
                       </div>
                    </div>
                    {submittedReport.emergencyHelpNeeded && (
                      <div className="p-2 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                         <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                         <span className="text-[9px] font-black text-red-700 uppercase tracking-widest">Help Requested</span>
                      </div>
                    )}
                 </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Field Notes</p>
                 <p className="text-xs text-slate-600 italic leading-relaxed">"{submittedReport.description}"</p>
              </div>

              {submittedReport.aiPhotoAnalysis && (
                <div className="mt-4 p-4 bg-violet-50 border border-violet-100 rounded-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 text-violet-200 opacity-20">
                      <Zap className="w-12 h-12" />
                   </div>
                   <h5 className="text-[9px] font-black text-violet-700 uppercase tracking-widest mb-2">AI Analysis</h5>
                   <p className="text-[10px] text-violet-600 font-bold uppercase italic leading-none">{submittedReport.aiPhotoAnalysis.suggestedAction}</p>
                </div>
              )}
           </div>

           <button 
             onClick={() => setSubmittedReport(null)}
             className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
           >
             Submit Another Report
           </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
      <div className="lg:col-span-2 space-y-10">
        <header className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Report a Flood</h1>
          <p className="text-slate-500 text-sm font-medium italic">Share live flood information to help others stay safe.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Form Section */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-10 relative">
             <div className="space-y-8">
                {/* Location & Type */}
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location</label>
                      <div className="relative group">
                         <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                         <input 
                           name="locationName"
                           type="text" 
                           placeholder="Landmark or Address"
                           value={formData.locationName}
                           onChange={handleInputChange}
                           className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-500/50 transition-all cursor-text"
                           required
                         />
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase italic tracking-tight flex items-center gap-1">
                         <Navigation className="w-3 h-3" /> GPS: 6.1248, 100.3678 (Auto-detected)
                      </p>
                   </div>

                   <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">What happened?</label>
                      <select 
                        name="reportType"
                        value={formData.reportType}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black uppercase tracking-tight focus:outline-none focus:ring-4 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                        required
                      >
                         <option value="" disabled>Select Type</option>
                         {REPORT_TYPES.map(type => (
                           <option key={type} value={type}>{type.toUpperCase()}</option>
                         ))}
                      </select>
                   </div>
                </div>

                {/* Severity & Water Level */}
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hazard Magnitude</label>
                      <div className="grid grid-cols-2 gap-2">
                         {[RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL].map(level => (
                           <button
                             key={level}
                             type="button"
                             onClick={() => setFormData(prev => ({ ...prev, severity: level }))}
                             className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                               formData.severity === level 
                               ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                               : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'
                             }`}
                           >
                              {level}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Water Level</label>
                      <select 
                        name="waterLevelEstimate"
                        value={formData.waterLevelEstimate}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black uppercase tracking-tight focus:outline-none focus:ring-4 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>Select Depth</option>
                        {WATER_LEVELS.map(level => (
                           <option key={level} value={level}>{level.toUpperCase()}</option>
                        ))}
                      </select>
                   </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">What you see</label>
                   <textarea 
                     name="description"
                     rows={4}
                     value={formData.description}
                     onChange={handleInputChange}
                     placeholder="Describe the situation, blocked roads, or people who need help..."
                     className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-500/50 font-medium transition-all resize-none"
                     required
                   ></textarea>
                </div>

                {/* Additional Toggles */}
                <div className="grid md:grid-cols-1 gap-4 pt-4 border-t border-slate-100">
                   <label className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-white hover:border-cyan-100 transition-all group">
                      <div className="relative">
                         <input 
                           type="checkbox" 
                           name="emergencyHelpNeeded"
                           checked={formData.emergencyHelpNeeded}
                           onChange={handleInputChange}
                           className="sr-only peer"
                         />
                         <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-red-500 transition-colors"></div>
                         <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                      </div>
                      <div className="flex-1">
                         <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                           Immediate SAR Support Needed
                           <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                         </span>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight italic">Check if life-threatening emergencies are present.</p>
                      </div>
                   </label>
                </div>
             </div>
          </div>

          {/* AI Photo Analyzer Section */}
          <section className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
             
             <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full md:w-64 h-64 border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center p-6 text-center hover:border-cyan-500 hover:bg-white/5 transition-all cursor-pointer group/upload"
                >
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                   <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-500 group-hover/upload:text-cyan-400 group-hover/upload:rotate-6 transition-all">
                      <Camera className="w-8 h-8" />
                   </div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover/upload:text-slate-300">Sync evidence imagery</p>
                   <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest mt-2 italic">JPEG, PNG Max 10MB</p>
                </div>

                <div className="flex-1 space-y-6">
                   <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-cyan-400" />
                        AI Flood Diagnostic
                      </h3>
                      <p className="text-slate-400 text-xs font-bold leading-relaxed italic opacity-80 decoration-slate-600 underline-offset-4">
                        Leverage Gemini v1.5 Vision to automatically extract severity, depth, and safety recommendations from field photos.
                      </p>
                   </div>

                   {aiAnalysis ? (
                     <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-1">AI Danger Level</p>
                              <RiskBadge level={aiAnalysis.estimatedSeverity} className="scale-75 origin-left" />
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-1">Water Depth</p>
                              <span className="text-[10px] font-black uppercase text-white tracking-widest">{aiAnalysis.waterDepth}</span>
                           </div>
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-1">Safety Tip</p>
                           <p className="text-[10px] text-slate-300 font-bold uppercase italic leading-tight">{aiAnalysis.suggestedAction}</p>
                        </div>
                     </div>
                   ) : (
                     <button 
                       type="button"
                       onClick={handlePhotoAnalysis}
                       disabled={isAnalyzing}
                       className="px-8 py-4 bg-cyan-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-cyan-900/40 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3"
                     >
                        {isAnalyzing ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Analyzing image...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            Check photo with AI
                          </>
                        )}
                     </button>
                   )}
                   
                   <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">
                     * AI photo analysis is an estimated assessment and should not replace official authority verification.
                   </p>
                </div>
             </div>
          </section>

          <button 
            type="submit"
            className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 group active:scale-[0.98]"
          >
            <Send className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Submit Flood Report
          </button>
        </form>
      </div>

      {/* Side Help Panel */}
      <div className="space-y-8">
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-8">
           <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
              <div className="p-2 bg-slate-50 text-slate-900 rounded-xl">
                 <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">How to report</h3>
           </div>

           <div className="space-y-8">
              {[
                { 
                  title: 'Be Precise', 
                  text: 'Use accurate location pinpointing. Avoid generic area names if a landmark is visible.',
                  icon: MapPin 
                },
                { 
                  title: 'Check Water Depth', 
                  text: 'Choose the correct water level estimate relative to a standard adult height.',
                  icon: Layers 
                },
                { 
                  title: 'Take Clear Photos', 
                  text: 'Upload clear, non-blurred photos. AI analysis requires high contrast and sharp focus.',
                  icon: Camera 
                },
                { 
                  title: 'Keep it Simple', 
                  text: 'Keep descriptions factual and concise. Prioritize life-safety information over property details.',
                  icon: FileText 
                },
                { 
                  title: 'Don\'t Send Fakes', 
                  text: 'Do not submit fake reports. All reports are checked to ensure help goes where it is needed.',
                  icon: Shield 
                }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4 group">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-cyan-600 transition-colors shrink-0 border border-slate-100 shadow-sm">
                      <tip.icon className="w-4 h-4" />
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{tip.title}</h4>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">{tip.text}</p>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="bg-cyan-50 p-6 rounded-2xl border border-cyan-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-2 text-cyan-200 opacity-20">
                    <CheckCircle2 className="w-8 h-8" />
                 </div>
                 <p className="text-[10px] font-black text-cyan-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                   Verified Source
                 </p>
                 <p className="text-[9px] text-cyan-700 font-bold leading-relaxed italic font-medium">Verified reporting increases your Resilience Score and ensures faster mobilization of emergency units.</p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

