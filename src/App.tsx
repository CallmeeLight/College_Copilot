import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppData } from './hooks/useLocalStorage';

// Layout & Components
import Sidebar from './components/layout/Sidebar';
import SearchModal from './components/shared/SearchModal';

// Pages
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

export default function App() {
  const {
    classes, setClasses,
    assignments, setAssignments,
    attendance, setAttendance,
    notes, setNotes,
    announcements, setAnnouncements,
    fees, setFees,
    settings, setSettings,
  } = useAppData();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Persistent Glass Navigation Sidebar */}
        <Sidebar onSearch={() => setIsSearchOpen(true)} />

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  classes={classes}
                  assignments={assignments}
                  attendance={attendance}
                  announcements={announcements}
                  settings={settings}
                />
              }
            />
            <Route
              path="/timetable"
              element={<Timetable classes={classes} setClasses={setClasses} />}
            />
            <Route
              path="/assignments"
              element={<Assignments assignments={assignments} setAssignments={setAssignments} />}
            />
            <Route
              path="/attendance"
              element={
                <Attendance
                  attendance={attendance}
                  setAttendance={setAttendance}
                  threshold={settings.attendanceThreshold}
                />
              }
            />
            <Route
              path="/notes"
              element={<Notes notes={notes} setNotes={setNotes} />}
            />
            <Route
              path="/announcements"
              element={
                <Announcements
                  announcements={announcements}
                  setAnnouncements={setAnnouncements}
                />
              }
            />
            <Route
              path="/fees"
              element={<Fees fees={fees} setFees={setFees} />}
            />
            <Route
              path="/calendar"
              element={
                <Calendar
                  classes={classes}
                  assignments={assignments}
                  announcements={announcements}
                  fees={fees}
                />
              }
            />
            <Route
              path="/copilot"
              element={
                <Copilot
                  classes={classes}
                  assignments={assignments}
                  attendance={attendance}
                  notes={notes}
                  announcements={announcements}
                  fees={fees}
                  settings={settings}
                />
              }
            />
            <Route
              path="/settings"
              element={<Settings settings={settings} setSettings={setSettings} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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

        {/* Toast notifications container */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(15, 15, 42, 0.95)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              fontSize: '0.85rem',
              borderRadius: '12px',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
