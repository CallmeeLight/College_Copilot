// =============================================
// College Copilot — Main Application Root
// =============================================

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppData } from './hooks/useLocalStorage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout & Components
import Sidebar from './components/layout/Sidebar';
import SearchModal from './components/shared/SearchModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AmbientBackground from './components/layout/AmbientBackground';

// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import Assignments from './pages/Assignments';
import Attendance from './pages/Attendance';
import Notes from './pages/Notes';
import Announcements from './pages/Announcements';
import Fees from './pages/Fees';
import Calendar from './pages/Calendar';
import Copilot from './pages/Copilot';
import Settings from './pages/Settings';

function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const {
    classes,
    assignments,
    notes,
    announcements,
  } = useAppData();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* Persistent Glass Navigation Sidebar */}
      <Sidebar onSearch={() => setIsSearchOpen(true)} />

      {/* Main Content Area with Smooth Page Transition */}
      <main className="main-content">
        <div key={location.pathname} className="page-transition">
          {children}
        </div>
      </main>

      {/* Global Cmd+K Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        classes={classes}
        assignments={assignments}
        notes={notes}
        announcements={announcements}
      />
    </div>
  );
}

// Redirects already authenticated users away from Login/SignUp to Dashboard
function PublicAuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const {
    classes, setClasses,
    assignments, setAssignments,
    attendance, setAttendance,
    notes, setNotes,
    announcements, setAnnouncements,
    fees, setFees,
    settings, setSettings,
  } = useAppData();

  // Smooth cursor tracking for interactive glass glow — RAF-throttled for 60fps
  React.useEffect(() => {
    let rafId: number;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const updatePosition = () => {
      document.documentElement.style.setProperty('--mouse-x', `${lastX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${lastY}px`);
      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <BrowserRouter>
      {/* Dynamic ambient moving background */}
      <AmbientBackground />

      <Routes>
        {/* Public Authentication Routes */}
        <Route
          path="/login"
          element={
            <PublicAuthRoute>
              <Login />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicAuthRoute>
              <SignUp />
            </PublicAuthRoute>
          }
        />

        {/* Protected Student Workspace Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Dashboard
                  classes={classes}
                  assignments={assignments}
                  attendance={attendance}
                  announcements={announcements}
                  settings={settings}
                />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/timetable"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Timetable classes={classes} setClasses={setClasses} />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Assignments assignments={assignments} setAssignments={setAssignments} />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Attendance
                  attendance={attendance}
                  setAttendance={setAttendance}
                  threshold={settings.attendanceThreshold}
                />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Notes notes={notes} setNotes={setNotes} />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Announcements
                  announcements={announcements}
                  setAnnouncements={setAnnouncements}
                />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fees"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Fees fees={fees} setFees={setFees} />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Calendar
                  classes={classes}
                  assignments={assignments}
                  announcements={announcements}
                  fees={fees}
                />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/copilot"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Copilot
                  classes={classes}
                  assignments={assignments}
                  attendance={attendance}
                  notes={notes}
                  announcements={announcements}
                  fees={fees}
                  settings={settings}
                />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Settings settings={settings} setSettings={setSettings} />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(6, 13, 28, 0.85)',
            color: '#f0f0f5',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            fontSize: '0.85rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
