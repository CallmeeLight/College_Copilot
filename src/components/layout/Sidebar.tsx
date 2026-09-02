import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, CalendarDays, CheckSquare, BarChart3, FileText,
  Megaphone, Wallet, Calendar, Bot, Settings, Menu, X, Search
} from 'lucide-react';

interface SidebarProps {
  onSearch: () => void;
}

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard', emoji: '🏠' },
  { path: '/timetable', icon: CalendarDays, label: 'Timetable', emoji: '📅' },
  { path: '/assignments', icon: CheckSquare, label: 'Assignments', emoji: '✅' },
  { path: '/attendance', icon: BarChart3, label: 'Attendance', emoji: '📊' },
  { path: '/notes', icon: FileText, label: 'Notes', emoji: '📝' },
  { path: '/announcements', icon: Megaphone, label: 'Announcements', emoji: '📢' },
  { path: '/fees', icon: Wallet, label: 'Fees', emoji: '💰' },
  { path: '/calendar', icon: Calendar, label: 'Calendar', emoji: '🗓️' },
  { path: '/copilot', icon: Bot, label: 'Copilot', emoji: '🤖' },
  { path: '/settings', icon: Settings, label: 'Settings', emoji: '⚙️' },
];

const mobileNavItems = navItems.slice(0, 5);

export default function Sidebar({ onSearch }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-[60] glass-button-ghost lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar glass-sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            CC
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">College Copilot</h1>
            <p className="text-[0.65rem] text-slate-500">Student Dashboard</p>
          </div>
          <button
            className="ml-auto glass-button-ghost lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search trigger */}
        <div className="px-4 py-3">
          <button
            onClick={() => { onSearch(); setMobileOpen(false); }}
            className="w-full flex items-center gap-2 glass-input text-left text-slate-500 cursor-pointer hover:border-indigo-500/30"
          >
            <Search size={15} />
            <span className="text-xs">Search anything...</span>
            <kbd className="ml-auto text-[0.6rem] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 hidden sm:inline">⌘K</kbd>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="glass-card !p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-300 truncate">Arjun Sharma</p>
              <p className="text-[0.65rem] text-slate-500 truncate">SRM University</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="mobile-nav">
        {mobileNavItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[0.65rem] transition-colors ${
                isActive ? 'text-indigo-400' : 'text-slate-500'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <NavLink
          to="/copilot"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[0.65rem] transition-colors ${
            location.pathname === '/copilot' ? 'text-indigo-400' : 'text-slate-500'
          }`}
        >
          <Bot size={20} />
          <span>Copilot</span>
        </NavLink>
      </div>
    </>
  );
}
