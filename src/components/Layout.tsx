/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return <Outlet />;
  }

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1080] lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-[1100] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-h-screen relative min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 relative overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pb-32">
            <Outlet />
          </div>

          {/* Prototype Demo Badges - Fixed Position */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none hidden sm:flex">
             {[
               { label: "Sample Data Mode", color: "bg-cyan-500/10 text-cyan-600 border-cyan-200" },
               { label: "External ML Simulation", color: "bg-indigo-500/10 text-indigo-600 border-indigo-200" },
               { label: "Gemini Explain Layer", color: "bg-violet-500/10 text-violet-600 border-violet-200" },
               { label: "Firebase Ready", color: "bg-orange-500/10 text-orange-600 border-orange-200" }
             ].map((badge, i) => (
               <div key={i} className={`px-4 py-2 rounded-lg ${badge.color} border backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200/50 flex items-center justify-between min-w-[220px]`}>
                  <span>{badge.label}</span>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${badge.label === "Firebase Ready" ? 'bg-orange-500' : 'bg-current'}`}></div>
               </div>
             ))}
          </div>
        </main>
      </div>
    </div>
  );
}
