import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, TrendingUp, Check, X } from 'lucide-react';
import { AttendanceRecord } from '../types';
import { getAttendancePercentage, calculateProjection, generateId } from '../utils/helpers';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

interface AttendanceProps {
  attendance: AttendanceRecord[];
  setAttendance: (val: AttendanceRecord[] | ((prev: AttendanceRecord[]) => AttendanceRecord[])) => void;
  threshold: number;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#f97316'];

export default function Attendance({ attendance, setAttendance, threshold }: AttendanceProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const markAttendance = (id: string, present: boolean) => {
    setAttendance(prev => prev.map(a => a.id === id ? {
      ...a,
      totalClasses: a.totalClasses + 1,
      attendedClasses: present ? a.attendedClasses + 1 : a.attendedClasses,
    } : a));
    toast.success(present ? 'Marked Present ✅' : 'Marked Absent ❌');
  };

  const addSubject = () => {
    if (!newSubject.trim()) { toast.error('Enter subject name'); return; }
    setAttendance(prev => [...prev, { id: generateId(), subject: newSubject, totalClasses: 0, attendedClasses: 0, color: newColor }]);
    toast.success('Subject added');
    setNewSubject('');
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) { setAttendance(prev => prev.filter(a => a.id !== deleteId)); toast.success('Subject removed'); setDeleteId(null); }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">📊 Attendance</h1>
          <p className="page-subtitle">Track your class attendance • Threshold: {threshold}%</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="glass-button glass-button-primary text-xs">
          <Plus size={14} /> Add Subject
        </button>
      </div>

      {attendance.length === 0 ? (
        <div className="empty-state glass-card">
          <p className="empty-state-icon">📊</p>
          <p className="text-sm text-slate-400 mb-3">No subjects added yet</p>
          <button onClick={() => setModalOpen(true)} className="glass-button glass-button-primary text-xs"><Plus size={14} /> Add Subject</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {attendance.map(a => {
            const pct = getAttendancePercentage(a.attendedClasses, a.totalClasses);
            const isLow = pct < threshold;
            const missed = a.totalClasses - a.attendedClasses;
            const proj4 = calculateProjection(a.attendedClasses, a.totalClasses, 4);

            return (
              <div key={a.id} className={`glass-card ${isLow ? 'border-red-500/20' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: a.color }} />
                    <h3 className="text-sm font-semibold text-white">{a.subject}</h3>
                    {isLow && <AlertTriangle size={14} className="text-red-400" />}
                  </div>
                  <button onClick={() => setDeleteId(a.id)} className="glass-button-ghost p-1 rounded-lg text-slate-500 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-slate-400">{a.attendedClasses} / {a.totalClasses} classes</span>
                    <span className={`text-lg font-bold ${isLow ? 'text-red-400' : 'text-green-400'}`}>{pct}%</span>
                  </div>
                  <div className="progress-bar-track !h-3 !rounded-lg">
                    <div className={`progress-bar-fill !rounded-lg ${isLow ? (pct < 60 ? 'danger' : 'warning') : 'success'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white/3 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">Total</p>
                    <p className="text-sm font-semibold text-white">{a.totalClasses}</p>
                  </div>
                  <div className="bg-green-500/8 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">Present</p>
                    <p className="text-sm font-semibold text-green-400">{a.attendedClasses}</p>
                  </div>
                  <div className="bg-red-500/8 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">Missed</p>
                    <p className="text-sm font-semibold text-red-400">{missed}</p>
                  </div>
                </div>

                {/* Projection */}
                {isLow && (
                  <div className="bg-amber-500/8 border border-amber-500/15 rounded-lg p-2.5 mb-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp size={12} className="text-amber-400" />
                      <span className="text-xs font-medium text-amber-400">Projection</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      If you attend the next 4 classes, your attendance will become approximately <strong className="text-amber-400">{proj4}%</strong>
                    </p>
                  </div>
                )}

                {/* Record Buttons */}
                <div className="flex gap-2">
                  <button onClick={() => markAttendance(a.id, true)} className="flex-1 glass-button glass-button-secondary text-xs !bg-green-500/10 !border-green-500/20 hover:!bg-green-500/20">
                    <Check size={14} className="text-green-400" /> Present
                  </button>
                  <button onClick={() => markAttendance(a.id, false)} className="flex-1 glass-button glass-button-secondary text-xs !bg-red-500/10 !border-red-500/20 hover:!bg-red-500/20">
                    <X size={14} className="text-red-400" /> Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Subject">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Subject Name *</label>
            <input value={newSubject} onChange={e => setNewSubject(e.target.value)} className="glass-input" placeholder="e.g. Data Structures" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Color</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} onClick={() => setNewColor(c)} className={`w-7 h-7 rounded-full transition-all ${newColor === c ? 'ring-2 ring-white/30 scale-110' : ''}`} style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="glass-button glass-button-secondary flex-1">Cancel</button>
            <button onClick={addSubject} className="glass-button glass-button-primary flex-1">Add Subject</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} title="Remove Subject" message="Remove this subject and its attendance data?" />
    </div>
  );
}
