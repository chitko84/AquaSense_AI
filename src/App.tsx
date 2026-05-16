/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import FloodMap from './pages/FloodMap';
import ReportFlood from './pages/ReportFlood';
import SafeRoutes from './pages/SafeRoutes';
import ShelterFinder from './pages/ShelterFinder';
import AIAssistant from './pages/AIAssistant';
import FamilyCheckIn from './pages/FamilyCheckIn';
import IncidentDetails from './pages/IncidentDetails';
import PostFloodImpact from './pages/PostFloodImpact';
import AdminDashboard from './pages/AdminDashboard';
import AdminReports from './pages/AdminReports';
import AdminShelters from './pages/AdminShelters';
import AdminAlerts from './pages/AdminAlerts';
import Architecture from './pages/Architecture';
import PredictionTest from './pages/PredictionTest';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="dashboard" element={
          <ProtectedRoute>
            {isAdmin ? <Navigate to="/admin" replace /> : <Dashboard />}
          </ProtectedRoute>
        } />
        <Route path="map" element={<FloodMap />} />
        <Route path="report" element={<ProtectedRoute><ReportFlood /></ProtectedRoute>} />
        <Route path="routes" element={<SafeRoutes />} />
        <Route path="shelters" element={<ShelterFinder />} />
        <Route path="assistant" element={<AIAssistant />} />
        <Route path="family" element={<ProtectedRoute><FamilyCheckIn /></ProtectedRoute>} />
        <Route path="incident/:reportId" element={<IncidentDetails />} />
        <Route path="incident/:reportId/impact" element={<ProtectedRoute><PostFloodImpact /></ProtectedRoute>} />
        <Route path="post-flood-impact" element={<ProtectedRoute><PostFloodImpact /></ProtectedRoute>} />
        <Route path="architecture" element={<Architecture />} />
        
        {/* Admin Routes */}
        <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/reports" element={<ProtectedRoute adminOnly><AdminReports /></ProtectedRoute>} />
        <Route path="admin/shelters" element={<ProtectedRoute adminOnly><AdminShelters /></ProtectedRoute>} />
        <Route path="admin/alerts" element={<ProtectedRoute adminOnly><AdminAlerts /></ProtectedRoute>} />
        <Route path="admin/test" element={<ProtectedRoute adminOnly><PredictionTest /></ProtectedRoute>} />
        
        {/* Catch-all redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
