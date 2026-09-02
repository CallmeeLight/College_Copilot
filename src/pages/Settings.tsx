import React, { useState } from 'react';
import { Settings as SettingsType } from '../types';
import { clearAllData, markInitialized, setData, KEYS } from '../services/storage';
import {
  sampleClasses, sampleAssignments, sampleAttendance,
  sampleNotes, sampleAnnouncements, sampleFees, sampleSettings
} from '../data/sampleData';
import { Save, RotateCcw, User, School, Bell, Sliders, ShieldAlert, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsProps {
  settings: SettingsType;
  setSettings: (val: SettingsType | ((prev: SettingsType) => SettingsType)) => void;
}

export default function Settings({ settings, setSettings }: SettingsProps) {
  const [form, setForm] = useState<SettingsType>(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName.trim() || !form.collegeName.trim()) {
      toast.error('Student and College names are required');
      return;
    }

    setSettings(form);
    toast.success('Preferences saved successfully! ✨');
  };

  const handleResetToDemo = () => {
    if (window.confirm('Reset all application data back to default demo state? Custom edits will be overwritten.')) {
      clearAllData();
      setData(KEYS.CLASSES, sampleClasses);
      setData(KEYS.ASSIGNMENTS, sampleAssignments);
      setData(KEYS.ATTENDANCE, sampleAttendance);
      setData(KEYS.NOTES, sampleNotes);
      setData(KEYS.ANNOUNCEMENTS, sampleAnnouncements);
      setData(KEYS.FEES, sampleFees);
      setData(KEYS.SETTINGS, sampleSettings);
      markInitialized();
      toast.success('Reset to Arjun Sharma (Demo Mode)');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">⚙️ Profile & System Settings</h1>
        <p className="page-subtitle">Configure student info, attendance thresholds, and system preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Student Profile */}
        <div className="glass-card">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
            <User size={16} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Student Identification</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={form.studentName}
                onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}
                className="glass-input"
                placeholder="e.g. Arjun Sharma"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Current Semester</label>
              <input
                type="text"
                value={form.semester}
                onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}
                className="glass-input"
                placeholder="e.g. 1st Semester / Fall 2026"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 mb-1.5 block">Institution / University Name</label>
              <input
                type="text"
                value={form.collegeName}
                onChange={e => setForm(f => ({ ...f, collegeName: e.target.value }))}
                className="glass-input"
                placeholder="e.g. SRM Institute of Science and Technology"
              />
            </div>
          </div>
        </div>

        {/* Academic Rules & Thresholds */}
        <div className="glass-card">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
            <Sliders size={16} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Academic Thresholds & Alerts</h3>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="text-xs font-medium text-slate-300 block">
                  Attendance Warning Threshold
                </label>
                <p className="text-[0.65rem] text-slate-500">
                  Subjects below this percentage will trigger warnings and Copilot priority study tips.
                </p>
              </div>
              <span className="text-base font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                {form.attendanceThreshold}%
              </span>
            </div>

            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={form.attendanceThreshold}
              onChange={e => setForm(f => ({ ...f, attendanceThreshold: Number(e.target.value) }))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[0.65rem] text-slate-500 mt-1">
              <span>50% (Lenient)</span>
              <span>75% (Standard University Requirement)</span>
              <span>90% (Strict)</span>
            </div>
          </div>
        </div>

        {/* Notification & Display */}
        <div className="glass-card">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
            <Bell size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Notifications & Appearance</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-300">Daily Morning Briefings</p>
                <p className="text-[0.65rem] text-slate-500">
                  Highlight daily class roster, urgent deadlines, and low attendance subjects
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.notifications}
                  onChange={e => setForm(f => ({ ...f, notifications: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <p className="text-xs font-medium text-slate-300">Interface Theme</p>
                <p className="text-[0.65rem] text-slate-500">
                  Futuristic Dark Liquid Glass (Apple style)
                </p>
              </div>
              <span className="badge badge-info text-xs">Dark Liquid Glass</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetToDemo}
            className="glass-button glass-button-secondary text-xs text-red-400 hover:text-red-300 border-red-500/20"
          >
            <RotateCcw size={14} /> Reset Demo Dataset
          </button>

          <button
            type="submit"
            className="glass-button glass-button-primary text-xs"
          >
            <Save size={14} /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
