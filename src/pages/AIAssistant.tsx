/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Sparkles, User, ShieldAlert, BookOpen, PhoneCall, ChevronRight, Droplets } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { RiskLevel } from '../types';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I am your AquaSense AI assistant. Based on your current location in Alor Setar and the rainfall level of 120mm, I have prepared a safety protocol for you. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I've analyzed your query. Given the current critical water levels at Sungai Kedah, you should prioritize moving to higher ground immediately. The nearest safe shelter is AIU Multipurpose Hall, which currently has 390 available spaces. Would you like me to show you the safest route there?" 
      }]);
    }, 1000);
  };

  return (
    <div className="h-full min-h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)] max-w-5xl mx-auto flex flex-col gap-6 p-4 md:p-0">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
             <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-none mb-1">AI Risk Assistant</h1>
             <p className="text-gray-400 md:text-gray-500 text-[10px] md:text-sm">Powered by AquaSense & Gemini AI</p>
          </div>
        </div>
        <div className="flex bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">AI Engine Ready</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${m.role === 'user' ? 'bg-white border border-slate-200 text-slate-500' : 'bg-cyan-600 text-white'}`}>
                    {m.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div className={`p-4 rounded-xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Talk to AquaSense AI..."
                className="w-full pl-4 pr-14 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* AI Knowledge Side Panel */}
        <div className="w-full lg:w-80 space-y-6 overflow-y-auto pr-2">
          {/* Gemini AI Risk Assistant */}
          <div className="bg-gradient-to-br from-cyan-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase">AI Risk Engine</span>
            </div>
            <div className="text-sm leading-relaxed mb-6 font-medium">
              "Based on rising river levels in <strong className="text-cyan-200">Anak Bukit</strong>, I recommend evacuating to <strong className="text-cyan-200">AIU Multipurpose Hall</strong> via the Northern Route." 
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="text-[10px] font-bold text-cyan-200/60 mb-2 uppercase tracking-wider">Recommended Action</div>
              <div className="text-xs font-bold leading-snug text-white">Prepare emergency kit & avoid Alor Setar Clock Tower junction.</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Risk Profile
              </h3>
              <div className="space-y-4">
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Location Hazard</p>
                    <RiskBadge level={RiskLevel.HIGH} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-tight">River Level (Sungai Kedah)</p>
                    <div className="flex items-end gap-2">
                       <span className="text-2xl font-black text-red-600">9.45m</span>
                       <span className="text-[10px] bg-red-100 text-red-700 font-black px-2 py-0.5 rounded-full mb-1">DANGER</span>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Resources
               </h3>
               <ul className="space-y-3 font-bold text-xs text-slate-700">
                  <li className="flex items-center justify-between group cursor-pointer hover:text-cyan-600 transition-colors">
                     <span>Emergency Kit List</span>
                     <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-400" />
                  </li>
                  <li className="flex items-center justify-between group cursor-pointer hover:text-cyan-600 transition-colors">
                     <span>Contact Authorities</span>
                     <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-400" />
                  </li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
