import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, CalendarDays, CheckSquare, BarChart3, FileText,
  Megaphone, Wallet, Calendar, Bot, Settings, Menu, X, Search, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

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
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const studentName = profile?.full_name || user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Arjun Sharma');
  const collegeName = profile?.college_name || user?.user_metadata?.college_name || 'SRM University';
  const initials = studentName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AS';

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/login');
  };

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
          <div className="space-y-2">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `sidebar-nav-link flex items-center gap-4 px-4 py-3.5 rounded-xl text-[16px] font-medium group ${
                    isActive
                      ? 'sidebar-nav-active border'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <item.icon size={22} className="sidebar-nav-icon flex-shrink-0 group-hover:text-emerald-300" />
                <span className="transition-colors duration-200">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer with Student Profile & Logout */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="glass-card !p-3 flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{studentName}</p>
                <p className="text-[0.65rem] text-slate-500 truncate">{collegeName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out"
              className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <LogOut size={16} />
            </button>
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
                isActive ? 'text-emerald-400' : 'text-slate-500'
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
            location.pathname === '/copilot' ? 'text-emerald-400' : 'text-slate-500'
          }`}
        >
          <Bot size={20} />
          <span>Copilot</span>
        </NavLink>
      </div>
    </>
  );
}
