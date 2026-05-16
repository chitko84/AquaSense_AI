import React, { useState } from 'react';
import { Activity, Beaker, ChevronRight, Info, Layers, RefreshCw, Zap, AlertCircle, ShieldCheck, Map, Home, AlertTriangle } from 'lucide-react';
import { RiskLevel } from '../types';
import RiskBadge from '../components/RiskBadge';
import { predictFloodRisk, PredictionInput, PredictionResult } from '../services/predictionService';
import { generateAISafetyAdvice, AIAdviceResult } from '../services/aiAdviceService';

export default function PredictionTest() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [aiAdvice, setAiAdvice] = useState<AIAdviceResult | null>(null);
  
  const [formData, setFormData] = useState<PredictionInput>({
    rainfall_mm: 155,
    water_level_m: 3.2,
    community_reports: 14,
    nearby_flood_reports: 8,
    weather_warning: 1,
    historical_flood_frequency: 0.75,
    route_risk_score: 82,
    shelter_occupancy_rate: 0.65
  });

  const handleInputChange = (field: keyof PredictionInput, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const prediction = await predictFloodRisk(formData);
      setResult(prediction);
      
      setAiLoading(true);
      const advice = await generateAISafetyAdvice(prediction, {
        locationName: "Alor Setar Central",
        nearestShelter: "AIU Multipurpose Hall",
        safestRouteRisk: "Low",
        availableShelterSpace: 390
      });
      setAiAdvice(advice);
    } catch (err) {
      setError("Model interface connection failure. Reverting to local fallback benchmarks.");
      console.error(err);
    } finally {
      setLoading(false);
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">Risk Prediction CLI</h1>
          <p className="text-slate-500 text-sm font-medium italic">Simulate environmental variables to evaluate <span className="text-cyan-600 font-bold">External ML Model fidelity</span>.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 text-amber-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-xl">
          <Beaker className="w-4 h-4" />
          Simulation Mode: ACTIVE
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                <Layers className="w-5 h-5" />
             </div>
             <div className="space-y-0.5">
                <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Variable Ingestion</h2>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Manual telemetry override</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Rainfall (mm)</label>
                  <input 
                    type="number" 
                    value={formData.rainfall_mm}
                    onChange={(e) => handleInputChange('rainfall_mm', Number(e.target.value))}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all outline-none" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Water Level (m)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={formData.water_level_m}
                    onChange={(e) => handleInputChange('water_level_m', Number(e.target.value))}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all outline-none" 
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Comm. Reports</label>
                  <input 
                    type="number" 
                    value={formData.community_reports}
                    onChange={(e) => handleInputChange('community_reports', Number(e.target.value))}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all outline-none" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Hazard Cluster</label>
                  <input 
                    type="number" 
                    value={formData.nearby_flood_reports}
                    onChange={(e) => handleInputChange('nearby_flood_reports', Number(e.target.value))}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all outline-none" 
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Weather Warning State</label>
               <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => handleInputChange('weather_warning', 1)}
                    className={`p-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                      formData.weather_warning === 1 ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    Active Warning
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleInputChange('weather_warning', 0)}
                    className={`p-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                      formData.weather_warning === 0 ? 'bg-slate-900 border-slate-900 text-cyan-400 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    No Warning
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Hist. Frequency</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.historical_flood_frequency}
                    onChange={(e) => handleInputChange('historical_flood_frequency', Number(e.target.value))}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all outline-none" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Route Risk Index</label>
                  <input 
                    type="number" 
                    value={formData.route_risk_score}
                    onChange={(e) => handleInputChange('route_risk_score', Number(e.target.value))}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all outline-none" 
                  />
               </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between ml-1 mb-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shelter Occupancy Rate</label>
                  <span className="text-[10px] font-black text-slate-900">{(formData.shelter_occupancy_rate * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={formData.shelter_occupancy_rate}
                onChange={(e) => handleInputChange('shelter_occupancy_rate', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-600" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 translate-y-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                  Processing ML Stream...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Predict Flood Risk
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5" />
             </div>
             <div className="space-y-0.5">
                <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Synthetic Forecast</h2>
                <p className="text-[9px] text-slate-400 font-bold uppercase italic">Real-time model integration</p>
             </div>
          </div>

          {error && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-700 animate-in fade-in zoom-in duration-300">
               <AlertCircle className="w-6 h-6 shrink-0" />
               <p className="text-[11px] font-black uppercase tracking-tight leading-relaxed">{error}</p>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="h-[600px] bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-20">
               <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 mb-8 animate-bounce">
                  <Info className="w-10 h-10 text-slate-200" />
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-3">Model Engine Idle</h3>
               <p className="text-[10px] text-slate-400 max-w-sm font-bold leading-relaxed uppercase tracking-widest">Hydrological telemetry must be synchronized before the classifier can generate synthetic risk scores.</p>
            </div>
          )}

          {loading && (
            <div className="h-[600px] bg-white rounded-[3rem] border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center space-y-10">
               <div className="relative">
                  <div className="w-32 h-32 rounded-full border-8 border-slate-50 border-t-cyan-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-[12px] text-slate-900">EXTRACTING</div>
               </div>
               <div className="space-y-3">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-[0.4em]">Propagating Weights</p>
                  <p className="text-[10px] text-slate-400 font-bold italic">Synchronizing with Hugging Face/Colab Backend...</p>
               </div>
               <div className="w-64 h-1.5 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-cyan-500 animate-[loading_2s_infinite]"></div>
               </div>
            </div>
          )}

          {result && !loading && (
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="bg-slate-950 p-12 text-white relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 -mr-32 -mt-32 rounded-full blur-3xl"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 relative z-10">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em] mb-4">Risk Magnitude Index</p>
                        <div className="flex items-baseline gap-4">
                           <h3 className="text-8xl font-black tracking-tighter leading-none">{result.risk_score.toFixed(0)}</h3>
                           <span className="text-2xl font-black text-slate-600">/ 100</span>
                        </div>
                     </div>
                     <div className="shrink-0">
                        <RiskBadge level={result.risk_level} className="scale-[2] origin-top-right translate-y-4" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-10 relative z-10">
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Prediction Source Label</p>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                           <p className="text-[11px] font-black text-white uppercase tracking-widest">{result.model_source}</p>
                        </div>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Generation Context</p>
                        <p className="text-[11px] font-black text-white uppercase tracking-widest opacity-60">ID: AIS-{Math.random().toString(36).substr(2, 6).toUpperCase()}-TEST</p>
                     </div>
                  </div>
               </div>

               <div className="p-12 space-y-12">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                       <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div> 
                       Dominant Risk Factors
                    </h4>
                    <div className="grid gap-4">
                       {result.main_factors.map((f: string, i: number) => (
                         <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-cyan-200 transition-all hover:translate-x-1">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                               <ChevronRight className="w-3.5 h-3.5 text-cyan-600 transition-transform group-hover:scale-125" />
                            </div>
                            <p className="text-xs font-black text-slate-700 leading-none uppercase tracking-tight">{f}</p>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="bg-cyan-50 p-8 rounded-[2rem] border border-cyan-100 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                       <Zap className="w-32 h-32 text-cyan-600" />
                    </div>
                    <div className="relative z-10">
                       <h4 className="text-[10px] font-black text-cyan-800 uppercase tracking-[0.4em] mb-4">Strategic Recommendation</h4>
                       <p className="text-lg text-cyan-950 font-black leading-snug italic tracking-tight">"{result.recommendation}"</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Timestamp: {new Date().toLocaleTimeString()}</p>
                     <button 
                       onClick={() => {
                         setResult(null);
                         setAiAdvice(null);
                       }} 
                       className="text-[9px] font-black text-cyan-600 uppercase tracking-widest hover:text-cyan-700 transition-colors"
                     >
                       Clear Forecast Cache
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* Gemini AI Explanation Section */}
          {(aiLoading || aiAdvice) && (
            <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 ${aiLoading ? 'opacity-50 grayscale' : ''}`}>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                     <Activity className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                     <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Explanation Layer</h2>
                     <p className="text-[9px] text-slate-400 font-bold uppercase italic">Gemini AI Assistant Simulation</p>
                  </div>
               </div>

               {aiLoading ? (
                  <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
                     <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 italic">
                        <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
                     </div>
                     <p className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Synthesizing Guidance...</p>
                  </div>
               ) : aiAdvice && (
                 <div className="grid grid-cols-1 gap-8">
                    {/* Summary Card */}
                    <div className="bg-indigo-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 -mr-32 -mt-32 rounded-full blur-3xl"></div>
                       <div className="relative z-10 flex flex-col md:flex-row gap-8">
                          <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center border border-white/20 shrink-0 group-hover:rotate-6 transition-transform">
                             <ShieldCheck className="w-8 h-8 text-indigo-400" />
                          </div>
                          <div className="space-y-3">
                             <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">AI Risk Explanation</h4>
                             <p className="text-lg font-black leading-relaxed tracking-tight underline decoration-indigo-500/50 underline-offset-8 decoration-2">
                               "{aiAdvice.summary}"
                             </p>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Emergency Action Plan */}
                       <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 space-y-8 flex flex-col">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-inner border border-red-100">
                                <AlertTriangle className="w-6 h-6" />
                             </div>
                             <div>
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Emergency Action Plan</h4>
                                <p className="text-[8px] text-slate-400 font-bold uppercase">Dynamic Response Protocol</p>
                             </div>
                          </div>
                          <ul className="space-y-4 flex-1">
                             {aiAdvice.safetyAdvice.map((step, i) => (
                               <li key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-red-200 transition-all hover:translate-x-1 group">
                                  <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-[10px] font-black flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all">{i + 1}</span>
                                  <p className="text-[11px] font-black text-slate-600 leading-tight uppercase group-hover:text-red-900 transition-colors uppercase tracking-tight">{step}</p>
                               </li>
                             ))}
                          </ul>
                       </div>

                       {/* Route & Shelter Advice */}
                       <div className="space-y-8">
                          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 space-y-6 flex flex-col hover:shadow-xl transition-all border-b-4 border-b-cyan-500">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center shadow-inner border border-cyan-100">
                                   <Map className="w-6 h-6" />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Strategic Route Advice</h4>
                             </div>
                             <p className="text-xs font-black text-slate-600 leading-relaxed uppercase italic">"{aiAdvice.routeAdvice}"</p>
                          </div>

                          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 space-y-6 flex flex-col hover:shadow-xl transition-all border-b-4 border-b-emerald-500">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100">
                                   <Home className="w-6 h-6" />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Optimal Shelter Guidance</h4>
                             </div>
                             <p className="text-xs font-black text-slate-600 leading-relaxed uppercase italic text-emerald-700">"{aiAdvice.shelterAdvice}"</p>
                          </div>
                       </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex items-start gap-4">
                       <Info className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                          <span className="text-slate-900 font-blue">DISCLAIMER:</span> {aiAdvice.disclaimer}
                       </p>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

