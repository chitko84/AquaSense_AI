/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Map, Zap, Bell, Users, BarChart3, ArrowRight, Navigation, ShieldCheck, AlertTriangle, MessageSquare, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import AIUMap from '../components/AIUMap';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-100 backdrop-blur-md sticky top-0 z-50 bg-white/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center transition-transform hover:scale-105">
              <div className="w-5 h-5 bg-cyan-400 rounded-sm rotate-12"></div>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">AquaSense <span className="text-cyan-600">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#technology" className="hover:text-slate-900 transition-colors">Technology</a>
            <a href="#about" className="hover:text-slate-900 transition-colors">How it Works</a>
            <Link to="/dashboard" className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Go to App</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-20 lg:py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-50 rounded-full -translate-y-1/2 translate-x-1/3 blur-[120px] -z-10"></div>
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-900 rounded-full text-[10px] font-black mb-8 tracking-[0.2em] uppercase border border-slate-200">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div> AI-Powered Flood Safety Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.05] tracking-tighter">
              Predict. Report. <br />
              <span className="text-cyan-600">Navigate. Stay Safe.</span>
            </h1>
            <p className="max-w-2xl text-lg text-slate-500 mb-12 leading-relaxed font-medium capitalize">
              AquaSense AI helps flood-prone communities predict risk earlier, report local flood conditions, find safer routes, and locate shelters with available capacity.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 shadow-2xl shadow-slate-300 transition-all flex items-center justify-center gap-3">
                Open App <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
              <Link to="/map" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                View Live Map
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="container mx-auto px-6 font-bold">
          <div className="mb-20">
            <h2 className="text-xs font-black text-cyan-600 uppercase tracking-[0.3em] mb-4">Key Features</h2>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter max-w-xl">Smart Tools for Flood Safety.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Risk Prediction", desc: "Uses smart models to predict flood risks before they happen." },
              { icon: Navigation, title: "Safe Navigation", desc: "Gives you directions that avoid flooded areas and roadblocks." },
              { icon: ShieldCheck, title: "Find Shelters", desc: "See which shelters have space and what help they offer." },
              { icon: AlertTriangle, title: "Community Reports", desc: "Real reports from people on the ground to help everyone stay updated." },
              { icon: Users, title: "Family Safety", desc: "Keep track of your family and let them know you're safe during floods." },
              { icon: MessageSquare, title: "AI Assistant", desc: "Ask our AI assistant for safety advice and quick answers during emergencies." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-100/20 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-900 text-cyan-400 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hybrid Architecture */}
      <section id="technology" className="py-24 bg-slate-900 text-white overflow-hidden relative border-b border-slate-800">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-cyan-950/20 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
               <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-6 block">How it Works</span>
              <h2 className="text-4xl md:text-5xl font-black mb-10 leading-[1.1] tracking-tighter">Built to help in <br /><span className="text-cyan-500">any situation.</span></h2>
              <ul className="space-y-6">
                {[
                  "Flood Risk Prediction Model",
                  "Gemini AI Safety Assistant",
                  "Real-time Data Sync",
                  "Verified Community Reports",
                  "Shelter Management System"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-tight text-slate-300">
                    <div className="w-5 h-5 rounded bg-cyan-600/20 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-600/30">
                      <Shield className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl relative">
              <div className="absolute top-4 right-6 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
              <pre className="text-xs font-mono text-cyan-100/70 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {`// APP TECHNOLOGY
module.exports = {
  platform: "AquaSense AI",
  engine: "Smart Response System",
  
  stack: {
    frontend: "React + Vite + Tailwind CSS",
    database: "Firebase Cloud",
    ai_logic: "Google Gemini AI",
    ml_model: "Flood Risk Model",
    ingestion: ["Satellite", "IoT", "Community"]
  },
  
  metrics: {
    confidence: "94%",
    sync_latency: "Real-time",
    availability: "99.9%"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
            <div className="md:w-1/2">
               <span className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.4em] mb-4 block underline decoration-cyan-600 decoration-2 underline-offset-8">Our Location</span>
               <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6">Where We <span className="text-cyan-600">Operate.</span></h2>
               <p className="text-slate-500 font-medium leading-relaxed mb-8">
                 Based in Alor Setar, Kedah – one of Malaysia's flood-prone areas – we coordinate all data and help from our headquarters at AIU.
               </p>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase">AIU Campus</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Jalan Tun Abdul Razak, 05200 Alor Setar</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <AIUMap />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-slate-400 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-b border-slate-100 pb-12 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 bg-cyan-400 rounded-sm rotate-12"></div>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">AquaSense <span className="text-cyan-600">AI</span></span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-widest">
            <span>© 2026 Albukhary International University. All rights reserved.</span>
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-slate-900 transition-colors">Security</a>
              <a href="#" className="hover:text-slate-900 transition-colors">API Docs</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Ops Centre</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
