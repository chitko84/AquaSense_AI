/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Map, 
  AlertTriangle, 
  ShieldCheck, 
  Navigation, 
  Home, 
  Users, 
  MessageSquare,
  LayoutDashboard,
  ClipboardCheck,
  Bell,
  Layers,
  Beaker,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/firebaseService';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const userNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Flood Map', href: '/map', icon: Map },
    { name: 'Report a Flood', href: '/report', icon: AlertTriangle },
    { name: 'Get Directions', href: '/routes', icon: Navigation },
    { name: 'Find Shelters', href: '/shelters', icon: Home },
    { name: 'Chat with AI', href: '/assistant', icon: MessageSquare },
    { name: 'Family Safety', href: '/family', icon: Users },
    { name: 'Record Flood Damage', href: '/post-flood-impact', icon: ClipboardCheck },
    { name: 'App Information', href: '/architecture', icon: Layers },
  ];

  const adminNav = [
    { name: 'Admin Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Confirm Flood Reports', href: '/admin/reports', icon: ClipboardCheck },
    { name: 'Update Shelters', href: '/admin/shelters', icon: ShieldCheck },
    { name: 'Send Alerts', href: '/admin/alerts', icon: Bell },
    { name: 'Test System', href: '/admin/test', icon: Beaker },
  ];

  const activeNav = isAdmin ? adminNav : userNav;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.3)]">
      <div className="p-8 pb-10 flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center gap-3 group relative">
          <div className="absolute -inset-2 bg-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-cyan-900/50 border border-cyan-500 relative z-10">
            <div className="w-5 h-5 bg-white rounded-sm rotate-45 flex items-center justify-center overflow-hidden relative">
              <div className="w-full h-1/2 bg-cyan-600 absolute top-0"></div>
            </div>
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase relative z-10">
            AquaSense<span className="text-cyan-400">AI</span>
          </span>
        </Link>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition-colors">
          <LogOut className="w-5 h-5 rotate-180" />
        </button>
      </div>

      <nav className="flex-1 px-5 space-y-10 overflow-y-auto pb-10">
        <div>
          <h3 className="px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">
            {isAdmin ? 'Admin Menu' : 'Menu'}
          </h3>
          <div className="space-y-1.5">
            {activeNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    isActive 
                      ? 'bg-slate-800 text-white shadow-xl ring-1 ring-slate-700/50 text-cyan-400' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {isAdmin && !location.pathname.startsWith('/dashboard') && (
           <div className="px-4 pt-10">
              <Link to="/dashboard" className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-cyan-400 transition-colors">
                 Switch to User View
              </Link>
           </div>
        )}
      </nav>

      <div className="p-6 border-t border-slate-800/50 bg-slate-900/80 space-y-4 shrink-0">
        {profile && (
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-800 mb-2">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-cyan-400 border border-slate-800">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black text-white uppercase tracking-tighter truncate">{profile.name}</p>
              <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{profile.role}</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[9px] font-black text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>

        <div className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] flex items-center gap-2 pt-2">
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
          App is Active
        </div>
      </div>
    </aside>
  );
}
