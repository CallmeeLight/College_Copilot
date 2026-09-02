import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { ClassEntry, DayOfWeek } from '../types';
import { formatTime, generateId, getDayOfWeek } from '../utils/helpers';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

interface TimetableProps {
  classes: ClassEntry[];
  setClasses: (val: ClassEntry[] | ((prev: ClassEntry[]) => ClassEntry[])) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#f97316'];

const emptyClass: Omit<ClassEntry, 'id'> = {
  subject: '', professor: '', room: '', day: 'Monday', startTime: '09:00', endTime: '10:00', color: '#3b82f6'
};

export default function Timetable({ classes, setClasses }: TimetableProps) {
  const [view, setView] = useState<'daily' | 'weekly'>('daily');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getDayOfWeek() as DayOfWeek);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassEntry | null>(null);
  const [form, setForm] = useState(emptyClass);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const todayName = getDayOfWeek();

  const dailyClasses = useMemo(() =>
    classes.filter(c => c.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [classes, selectedDay]
  );

  const openAdd = () => {
    setEditingClass(null);
    setForm({ ...emptyClass, day: selectedDay });
    setModalOpen(true);
  };

  const openEdit = (cls: ClassEntry) => {
    setEditingClass(cls);
    setForm({ subject: cls.subject, professor: cls.professor, room: cls.room, day: cls.day, startTime: cls.startTime, endTime: cls.endTime, color: cls.color });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.subject.trim() || !form.professor.trim()) {
      toast.error('Subject and Professor are required');
      return;
    }
    if (editingClass) {
      setClasses(prev => prev.map(c => c.id === editingClass.id ? { ...c, ...form } : c));
      toast.success('Class updated');
    } else {
      setClasses(prev => [...prev, { id: generateId(), ...form }]);
      toast.success('Class added');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setClasses(prev => prev.filter(c => c.id !== deleteId));
      toast.success('Class deleted');
      setDeleteId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">📅 Timetable</h1>
          <p className="page-subtitle">Manage your class schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 rounded-xl p-0.5">
            <button onClick={() => setView('daily')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'daily' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white'}`}>Daily</button>
            <button onClick={() => setView('weekly')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'weekly' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white'}`}>Weekly</button>
          </div>
          <button onClick={openAdd} className="glass-button glass-button-primary text-xs">
            <Plus size={14} /> Add Class
          </button>
        </div>
      </div>

      {/* Day Tabs */}
      {view === 'daily' && (
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-2">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/25'
                  : day === todayName
                  ? 'bg-white/5 text-white border border-white/10'
                  : 'text-slate-400 hover:bg-white/5 border border-transparent'
              }`}
            >
              {day} {day === todayName && '•'}
            </button>
          ))}
        </div>
      )}

      {/* Daily View */}
      {view === 'daily' && (
        <div className="space-y-3">
          {dailyClasses.length === 0 ? (
            <div className="empty-state glass-card">
              <p className="empty-state-icon">📚</p>
              <p className="text-sm text-slate-400 mb-3">No classes on {selectedDay}</p>
              <button onClick={openAdd} className="glass-button glass-button-primary text-xs">
                <Plus size={14} /> Add Class
              </button>
            </div>
          ) : (
            dailyClasses.map(cls => (
              <div key={cls.id} className="glass-card flex items-center gap-4 group">
                <div className="w-1.5 h-14 rounded-full flex-shrink-0" style={{ background: cls.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{cls.subject}</p>
                  <p className="text-xs text-slate-400">{cls.professor} • {cls.room}</p>
                </div>
                <div className="text-right mr-2">
                  <p className="text-sm font-medium text-slate-300 flex items-center gap-1"><Clock size={12} /> {formatTime(cls.startTime)}</p>
                  <p className="text-xs text-slate-500">{formatTime(cls.endTime)}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cls)} className="glass-button-ghost p-1.5 rounded-lg"><Edit2 size={14} /></button>
                  <button onClick={() => setDeleteId(cls.id)} className="glass-button-ghost p-1.5 rounded-lg text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Weekly View */}
      {view === 'weekly' && (
        <div className="space-y-5">
          {DAYS.map(day => {
            const dayClasses = classes.filter(c => c.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
            return (
              <div key={day}>
                <h3 className={`text-sm font-semibold mb-2 ${day === todayName ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {day} {day === todayName && '(Today)'}
                </h3>
                {dayClasses.length === 0 ? (
                  <p className="text-xs text-slate-600 pl-3 mb-2">No classes</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {dayClasses.map(cls => (
                      <div key={cls.id} className={`glass-card !p-3 flex items-center gap-3 ${day === todayName ? 'border-indigo-500/15' : ''}`}>
                        <div className="w-1 h-8 rounded-full" style={{ background: cls.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{cls.subject}</p>
                          <p className="text-[0.6rem] text-slate-500">{formatTime(cls.startTime)} - {formatTime(cls.endTime)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingClass ? 'Edit Class' : 'Add Class'}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Subject *</label>
            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="glass-input" placeholder="e.g. Mathematics" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Professor *</label>
            <input value={form.professor} onChange={e => setForm(f => ({ ...f, professor: e.target.value }))} className="glass-input" placeholder="e.g. Dr. Ramesh Gupta" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Room</label>
            <input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} className="glass-input" placeholder="e.g. Room 301" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Day</label>
            <select value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value as DayOfWeek }))} className="glass-input">
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Start Time</label>
              <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className="glass-input" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">End Time</label>
              <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className="glass-input" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Color</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-white/30 scale-110' : ''}`} style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="glass-button glass-button-secondary flex-1">Cancel</button>
            <button onClick={handleSave} className="glass-button glass-button-primary flex-1">
              {editingClass ? 'Update' : 'Add'} Class
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} title="Delete Class" message="Remove this class from your timetable?" />
    </div>
  );
}
