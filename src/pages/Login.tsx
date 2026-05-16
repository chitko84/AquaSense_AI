/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { loginUser, signInWithGoogle } from '../services/firebaseService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginUser(email, password);
      // Auth state listener handles redirection in App.tsx generally, 
      // but let's force a home go here.
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please make sure you have registered your account first.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is disabled. Please enable it in Firebase Console > Authentication > Sign-in method.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <header className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-800">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Sign In</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 italic">Access your account</p>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[11px] font-black uppercase tracking-tight"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@aqua-sense.ai"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 mt-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> : <LogIn className="w-5 h-5 text-cyan-400" />}
            Sign In
          </button>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center px-4">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-black text-slate-400 tracking-widest">
              <span className="bg-white px-4">Or use Secure Link</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 border border-slate-200 text-slate-700 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign In with Google
          </button>
        </form>

        <footer className="mt-10 text-center relative z-10 pt-6 border-t border-slate-50">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Don't have an account? <Link to="/register" className="text-cyan-600 hover:underline">Register here</Link>
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
