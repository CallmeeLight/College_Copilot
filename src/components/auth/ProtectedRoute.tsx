// =============================================
// College Copilot — Protected Route Guard
// =============================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#020810]">
        <div className="glass-card !p-8 flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-sky-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-lg shadow-[0_0_25px_rgba(16,185,129,0.2)]">
            CC
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 size={16} className="animate-spin text-emerald-400" />
            <span>Loading workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to /login preserving intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
