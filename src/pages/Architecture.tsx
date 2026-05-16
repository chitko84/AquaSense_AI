import React from 'react';
import { 
  Database, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Cloud, 
  Layout, 
  Zap, 
  MessageSquare,
  ArrowRight,
  Server
} from 'lucide-react';

export default function Architecture() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">System Blueprint</h1>
          <p className="text-slate-500 text-sm font-medium italic">Deconstructing the <span className="text-cyan-600 font-bold">AquaSense Intelligence Stack</span>.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
          <Server className="w-4 h-4 text-cyan-400" />
          Version 4.2.1 Stable
        </div>
      </header>

      {/* Main Flow Visual */}
      <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
        
        <div className="relative z-10 space-y-16">
          {/* Layer 1: Access */}
          <div className="flex flex-col items-center">
            <div className="p-1.5 bg-slate-50 rounded-lg mb-6 border border-slate-100 flex items-center gap-2 px-4 shadow-sm animate-bounce">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Node</span>
            </div>
            <div className="w-64 p-6 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 text-center group hover:scale-105 transition-transform">
               <Layout className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
               <h3 className="text-xs font-black uppercase tracking-widest mb-1">User Web Interface</h3>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">React 18 + Vite | Tailwind CSS</p>
            </div>
            <div className="h-12 w-px bg-slate-200 my-4"></div>
          </div>

          {/* Layer 2: Core Processing */}
          <div className="grid md:grid-cols-2 gap-12 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-slate-100 hidden md:block"></div>
             
             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl relative group hover:border-cyan-400 transition-colors">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg ring-4 ring-white">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">External ML Intelligence</h3>
                <ul className="space-y-3">
                   <li className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      <Zap className="w-3.5 h-3.5 text-yellow-500" />
                      Synthetic Rainfall Prediction API
                   </li>
                   <li className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      <Zap className="w-3.5 h-3.5 text-yellow-500" />
                      Hydraulic Volumetric Mapping Engine
                   </li>
                </ul>
             </div>

             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl relative group hover:border-violet-400 transition-colors">
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg ring-4 ring-white">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Gemini AI Synthesis</h3>
                <ul className="space-y-3">
                   <li className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      <Zap className="w-3.5 h-3.5 text-violet-500" />
                      Natural Language Safety Protocols
                   </li>
                   <li className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      <Zap className="w-3.5 h-3.5 text-violet-500" />
                      Multimodal Document Processing
                   </li>
                </ul>
             </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-12 w-px bg-slate-200 my-4"></div>
            <div className="w-80 p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center shadow-inner group hover:bg-white transition-all">
               <Database className="w-10 h-10 text-orange-500 mx-auto mb-4" />
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Firebase Data Matrix</h3>
               <div className="flex flex-wrap justify-center gap-2">
                 <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[8px] font-black rounded border border-orange-200 uppercase tracking-tighter">Real-time DB</span>
                 <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[8px] font-black rounded border border-orange-200 uppercase tracking-tighter">Auth Layer</span>
                 <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[8px] font-black rounded border border-orange-200 uppercase tracking-tighter">Cloud Storage</span>
               </div>
            </div>
          </div>

          {/* Layer 3: End Points */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { label: "Admin Hub", icon: ShieldCheck, color: "text-red-500" },
               { label: "Field App", icon: Globe, color: "text-cyan-500" },
               { label: "IoT Sensors", icon: Zap, color: "text-amber-500" },
               { label: "Public Dashboard", icon: Layout, color: "text-slate-400" }
             ].map((node, i) => (
                <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl text-center shadow-sm">
                   <node.icon className={`w-5 h-5 mx-auto mb-3 ${node.color}`} />
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">{node.label}</p>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Mode Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
         {[
           { label: "Sample Data Mode", desc: "Using high-fidelity synthetic telemetry", color: "bg-cyan-500" },
           { label: "External ML Simulation", desc: "Engine processing via recurrent LSTM", color: "bg-indigo-500" },
           { label: "Gemini AI Synth", desc: "Live contextual protocol generation", color: "bg-violet-500" },
           { label: "Firebase Ready", desc: "Synchronized persistence layer active", color: "bg-orange-500" }
         ].map((badge, i) => (
            <div key={i} className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm relative overflow-hidden group">
               <div className={`absolute top-0 right-0 w-12 h-12 ${badge.color} opacity-10 group-hover:scale-150 transition-transform -mr-6 -mt-6 rounded-full`}></div>
               <div className="flex items-center gap-3 mb-4">
                  <div className={`w-2 h-2 rounded-full ${badge.color} animate-pulse`}></div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{badge.label}</h4>
               </div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{badge.desc}</p>
            </div>
         ))}
      </div>
    </div>
  );
}
