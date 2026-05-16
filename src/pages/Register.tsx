/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User, Phone, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { registerUser, signInWithGoogle } from '../services/firebaseService';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Google linking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await registerUser(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        role: 'user'
      });
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password registration is disabled. Please enable it in Firebase Console > Authentication > Sign-in method.');
      } else {
        setError('Registration failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-50 rounded-full blur-3xl -mr-32 -mb-32"></div>
        
        <header className="text-center mb-12 relative z-10">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl border border-slate-800">
            <UserPlus className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Create Account</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 italic">Join the AquaSense community</p>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-700 text-[11px] font-black uppercase tracking-tight"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+60..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Confirm Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:bg-white transition-all shadow-inner"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 mt-6 h-20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-cyan-400" /> : <UserPlus className="w-6 h-6 text-cyan-400" />}
            Create Account
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center px-4">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-black text-slate-400 tracking-widest">
              <span className="bg-white px-4">Or Quick Link</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full py-5 border border-slate-200 text-slate-700 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign Up with Google
          </button>
        </form>

        <footer className="mt-12 text-center relative z-10 pt-8 border-t border-slate-50">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            Already have an account? <Link to="/login" className="text-cyan-600 hover:underline">Sign In here</Link>
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
