/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Home, 
  Car, 
  Settings as SettingIcon, 
  Droplets,
  Zap,
  Info,
  Calendar,
  Layers,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createPostFloodImpactReport, getFloodReportById } from '../services/firebaseService';
import { FloodReport, DamageCategory, ImpactReportStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

const DAMAGE_CATEGORIES = [
  { value: DamageCategory.LOW, label: 'LOW - Minimal impact, aesthetic damage' },
  { value: DamageCategory.MEDIUM, label: 'MEDIUM - Structural repairs needed' },
  { value: DamageCategory.HIGH, label: 'HIGH - Major structural damage / asset loss' },
  { value: DamageCategory.SEVERE, label: 'SEVERE - Total loss / Uninhabitable' }
];

const RECOVERY_NEEDS = [
  'Cleaning assistance',
  'Food supply',
  'Medical support',
  'Temporary housing',
  'Road repair',
  'Financial aid',
  'Electricity restoration',
  'Water supply restoration'
];

export default function PostFloodImpact() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [incident, setIncident] = useState<FloodReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    floodDate: new Date().toISOString().split('T')[0],
    affectedHouseholds: 0,
    affectedPeople: 0,
    injuriesReported: 0,
    evacuationNeeded: false,
    peopleMovedToShelter: 0,
    housesAffected: 0,
    vehiclesAffected: 0,
    businessPremisesAffected: 0,
    agricultureAffected: 0,
    publicInfrastructureAffected: '',
    estimatedDamageCategory: DamageCategory.LOW,
    roadsBlocked: false,
    affectedRoadNames: '',
    bridgeDamage: false,
    publicTransportDisruption: false,
    shelterUsed: '',
    shelterOccupancyDuringFlood: 0,
    foodWaterSupplyIssue: false,
    medicalAssistanceNeeded: false,
    recoveryNeeds: [] as string[],
    impactSummary: '',
  });

  useEffect(() => {
    async function loadIncident() {
      if (!reportId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getFloodReportById(reportId);
        setIncident(data);
      } catch (error) {
        console.error("Failed to load incident:", error);
      } finally {
        setLoading(false);
      }
    }
    loadIncident();
  }, [reportId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                type === 'number' ? parseInt(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const toggleRecoveryNeed = (need: string) => {
    setFormData(prev => ({
      ...prev,
      recoveryNeeds: prev.recoveryNeeds.includes(need) 
        ? prev.recoveryNeeds.filter(n => n !== need)
        : [...prev.recoveryNeeds, need]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const impactReport = {
      ...formData,
      userId: user?.uid,
      relatedIncidentId: reportId || 'manual-entry',
      locationName: incident?.location || 'Manual Entry Site',
      state: incident?.state || 'National',
      reportedBy: user?.displayName || user?.email || 'Anonymous Sentinel',
      status: ImpactReportStatus.SUBMITTED,
    };

    try {
      await createPostFloodImpactReport(impactReport);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Failed to submit impact report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Preparing your report...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-10 space-y-10"
      >
        <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
           <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
           </div>
           <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Impact Matrix Recorded</h2>
           <p className="text-slate-500 mb-10 text-sm font-medium italic">Post-flood impact data has been archived for agency review.</p>

           <div className="bg-slate-50 rounded-2xl p-8 text-left space-y-6 border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Impact Summary Card</h3>
                 <span className="text-[9px] font-black p-1.5 px-3 rounded bg-emerald-100 text-emerald-700 uppercase tracking-widest">SUBMITTED</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Human Impact</p>
                       <p className="text-xs font-bold text-slate-700">{formData.affectedPeople} People Affected / {formData.affectedHouseholds} Households</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Damage Magnitude</p>
                       <div className="inline-block px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                          {formData.estimatedDamageCategory}
                       </div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Associated Node</p>
                       <p className="text-xs font-bold text-slate-700">Incident {reportId || 'MANUAL'}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Critical Needs</p>
                       <p className="text-xs font-bold text-slate-700">{formData.recoveryNeeds.length > 0 ? formData.recoveryNeeds.join(', ') : 'None Specified'}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-4 mt-10">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
              >
                Back to Dashboard
              </button>
              <button 
                onClick={() => setSubmitted(false)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
              >
                File Another Report
              </button>
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header className="space-y-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all group"
        >
          <div className="p-2 bg-white border border-slate-200 rounded-xl group-hover:bg-slate-50">
             <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Cancel</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase relative inline-block">
                Flood Damage Report
                <div className="absolute -top-1 -right-4 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              </h1>
              <p className="text-slate-500 text-sm font-medium italic">Tell us about the damage from the flood for <span className="text-cyan-600 font-bold">Incident {reportId || 'MANUAL'}</span>.</p>
           </div>
           
           {incident && (
              <div className="flex items-center gap-4 bg-slate-50 p-4 px-6 rounded-2xl border border-slate-100">
                 <div className="w-10 h-10 bg-slate-900 text-cyan-400 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{incident.location}</h4>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{incident.state} Area</p>
                 </div>
              </div>
           )}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section: Incident Reference & Human Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <section className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                 <div className="p-2 bg-slate-900 text-cyan-400 rounded-lg"><Users className="w-4 h-4" /></div>
                 People and Families Affected
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flood Date</label>
                    <input 
                      type="date"
                      name="floodDate"
                      value={formData.floodDate}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-500/50 transition-all font-mono"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">People Injured</label>
                    <input 
                      type="number"
                      name="injuriesReported"
                      value={formData.injuriesReported}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-500/50 transition-all font-mono"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Families Affected</label>
                    <input 
                      type="number"
                      name="affectedHouseholds"
                      value={formData.affectedHouseholds}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-500/50 transition-all font-mono"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total People Affected</label>
                    <input 
                      type="number"
                      name="affectedPeople"
                      value={formData.affectedPeople}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-500/50 transition-all font-mono"
                    />
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                 <label className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-white hover:border-cyan-100 transition-all transition-all">
                    <input 
                      type="checkbox"
                      name="evacuationNeeded"
                      checked={formData.evacuationNeeded}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded-md border-slate-300 text-cyan-600 focus:ring-cyan-500 transition-all"
                    />
                    <div>
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Did people have to leave their homes?</p>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight italic">Select this if people were asked to evacuate.</p>
                    </div>
                 </label>
                 
                 {formData.evacuationNeeded && (
                   <div className="space-y-2 animate-in zoom-in-95 duration-300">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">People in Shelters</label>
                      <input 
                        type="number"
                        name="peopleMovedToShelter"
                        value={formData.peopleMovedToShelter}
                        onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:bg-white font-mono"
                      />
                   </div>
                 )}
              </div>
           </section>

           <section className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                 <div className="p-2 bg-slate-900 text-cyan-400 rounded-lg"><Home className="w-4 h-4" /></div>
                 Buildings and Property
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Homes Damaged</label>
                    <div className="relative">
                       <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                       <input 
                         type="number"
                         name="housesAffected"
                         value={formData.housesAffected}
                         onChange={handleInputChange}
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:outline-none focus:bg-white transition-all font-mono"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicles Damaged</label>
                    <div className="relative">
                       <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                       <input 
                         type="number"
                         name="vehiclesAffected"
                         value={formData.vehiclesAffected}
                         onChange={handleInputChange}
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:outline-none focus:bg-white transition-all font-mono"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Businesses Affected</label>
                    <input 
                      type="number"
                      name="businessPremisesAffected"
                      value={formData.businessPremisesAffected}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:outline-none focus:bg-white transition-all font-mono"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Farms or Agriculture Damaged</label>
                    <input 
                      type="number"
                      name="agricultureAffected"
                      value={formData.agricultureAffected}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:outline-none focus:bg-white transition-all font-mono"
                    />
                 </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">General Damage Level</label>
                 <select 
                   name="estimatedDamageCategory"
                   value={formData.estimatedDamageCategory}
                   onChange={handleInputChange}
                   className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
                 >
                    {DAMAGE_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                 </select>
              </div>
           </section>
        </div>

        {/* Accessibility & Logistics */}
        <section className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-10">
           <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <div className="p-2 bg-slate-900 text-cyan-400 rounded-lg"><ClipboardList className="w-4 h-4" /></div>
              Roads and Basic Services
           </h3>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'roadsBlocked', label: 'Roads Blocked', icon: MapPin },
                { name: 'bridgeDamage', label: 'Bridge or Structure Damage', icon: SettingIcon },
                { name: 'foodWaterSupplyIssue', label: 'Lack of Food or Water', icon: Droplets },
                { name: 'medicalAssistanceNeeded', label: 'Medical Help Needed', icon: CheckCircle2 },
              ].map(item => (
                <label key={item.name} className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-white hover:border-cyan-100 hover:shadow-lg hover:shadow-cyan-500/5 transition-all transition-all group">
                   <div className="flex items-center justify-between">
                      <div className="p-1.5 bg-white rounded-lg text-slate-300 group-hover:text-cyan-600 transition-colors">
                         <item.icon className="w-4 h-4" />
                      </div>
                      <input 
                        type="checkbox"
                        name={item.name}
                        checked={(formData as any)[item.name]}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded-md border-slate-300 text-cyan-600 focus:ring-cyan-500 transition-all"
                      />
                   </div>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{item.label}</p>
                </label>
              ))}
           </div>

           <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What is needed most right now?</p>
                 <div className="flex flex-wrap gap-2">
                    {RECOVERY_NEEDS.map(need => (
                      <button 
                         key={need}
                         type="button"
                         onClick={() => toggleRecoveryNeed(need)}
                         className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                           formData.recoveryNeeds.includes(need)
                           ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                           : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200'
                         }`}
                      >
                         {need}
                      </button>
                    ))}
                 </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Additional Details</label>
                 <textarea 
                   name="impactSummary"
                   rows={4}
                   value={formData.impactSummary}
                   onChange={handleInputChange}
                   placeholder="Describe any other problems or help needed..."
                   className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium focus:outline-none focus:bg-white focus:border-cyan-500/50 transition-all resize-none italic"
                 ></textarea>
              </div>
           </div>
        </section>

        {/* AI Insight Placeholder */}
        <section className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-10 opacity-5">
              <Zap className="w-32 h-32 text-cyan-400" />
           </div>
           <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="w-full md:w-48 h-48 border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center p-6 text-center hover:border-cyan-500 hover:bg-white/5 transition-all cursor-pointer group">
                 <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 text-slate-500 group-hover:text-cyan-400 transition-all">
                    <ClipboardList className="w-6 h-6" />
                 </div>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300">Upload Photos</p>
              </div>
              <div className="flex-1 space-y-6 text-center md:text-left">
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center justify-center md:justify-start gap-3 mb-2">
                       <Zap className="w-6 h-6 text-cyan-400" /> AI Damage Review
                    </h3>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed italic opacity-80">
                       Our AI will review this information to help prioritize help and resources for those who need it most.
                    </p>
                 </div>
                 <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase italic leading-none mb-4 flex items-center justify-center md:justify-start gap-2">
                       <Info className="w-4 h-4" /> Estimated Recovery Time
                    </p>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                       <div className="h-full w-2/3 bg-cyan-600 rounded-full"></div>
                    </div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Likelihood of area recovery: 65% (48h Window)</p>
                 </div>
              </div>
           </div>
        </section>

        <div className="flex flex-col gap-6">
           <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 group active:scale-[0.98] disabled:opacity-50"
           >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  Submit Damage Report
                </>
              )}
           </button>
           <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest text-center italic">
              This information helps local agencies coordinate help. Please ensure all details are as accurate as possible.
           </p>
        </div>
      </form>
    </div>
  );
}
