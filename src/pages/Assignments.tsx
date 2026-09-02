import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Check, Filter } from 'lucide-react';
import { Assignment, Priority, AssignmentStatus } from '../types';
import { generateId, formatDate, getRelativeDeadline, getPriorityEmoji, daysUntil, getDateOffset } from '../utils/helpers';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

interface AssignmentsProps {
  assignments: Assignment[];
  setAssignments: (val: Assignment[] | ((prev: Assignment[]) => Assignment[])) => void;
}

const emptyAssignment = {
  title: '', subject: '', description: '', dueDate: getDateOffset(7), priority: 'normal' as Priority, status: 'pending' as AssignmentStatus,
};

const SUBJECTS = ['All', 'Mathematics', 'Physics', 'Programming in C', 'Chemistry', 'English', 'Electronics'];
const STATUSES: (AssignmentStatus | 'all')[] = ['all', 'pending', 'in-progress', 'completed'];

export default function Assignments({ assignments, setAssignments }: AssignmentsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [form, setForm] = useState(emptyAssignment);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterStatus, setFilterStatus] = useState<AssignmentStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority'>('deadline');

  const filtered = useMemo(() => {
    let result = [...assignments];
    if (filterSubject !== 'All') result = result.filter(a => a.subject === filterSubject);
    if (filterStatus !== 'all') result = result.filter(a => a.status === filterStatus);

    result.sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      const p = { urgent: 0, important: 1, normal: 2 };
      return p[a.priority] - p[b.priority];
    });
    return result;
  }, [assignments, filterSubject, filterStatus, sortBy]);

  const openAdd = () => { setEditing(null); setForm(emptyAssignment); setModalOpen(true); };

  const openEdit = (a: Assignment) => {
    setEditing(a);
    setForm({ title: a.title, subject: a.subject, description: a.description, dueDate: a.dueDate, priority: a.priority, status: a.status });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.subject.trim()) { toast.error('Title and Subject are required'); return; }
    if (editing) {
      setAssignments(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a));
      toast.success('Assignment updated');
    } else {
      setAssignments(prev => [...prev, { id: generateId(), ...form, createdAt: new Date().toISOString() }]);
      toast.success('Assignment added');
    }
    setModalOpen(false);
  };

  const toggleComplete = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'completed' ? 'pending' : 'completed' } : a));
    toast.success('Status updated');
  };

  const handleDelete = () => {
    if (deleteId) { setAssignments(prev => prev.filter(a => a.id !== deleteId)); toast.success('Deleted'); setDeleteId(null); }
  };

  const isOverdue = (a: Assignment) => a.status !== 'completed' && daysUntil(a.dueDate) < 0;

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">✅ Assignments</h1>
          <p className="page-subtitle">{assignments.filter(a => a.status !== 'completed').length} pending assignments</p>
        </div>
        <button onClick={openAdd} className="glass-button glass-button-primary text-xs">
          <Plus size={14} /> Add Assignment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="glass-input !w-auto !py-1.5 text-xs">
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex bg-white/5 rounded-xl p-0.5">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterStatus === s ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white'}`}>
              {s === 'all' ? 'All' : s.replace('-', ' ')}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as 'deadline' | 'priority')} className="glass-input !w-auto !py-1.5 text-xs">
          <option value="deadline">Sort by Deadline</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      {/* Assignment Cards */}
      {filtered.length === 0 ? (
        <div className="empty-state glass-card">
          <p className="empty-state-icon">📋</p>
          <p className="text-sm text-slate-400 mb-3">No assignments found</p>
          <button onClick={openAdd} className="glass-button glass-button-primary text-xs"><Plus size={14} /> Add Assignment</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(a => (
            <div key={a.id} className={`glass-card group ${isOverdue(a) ? 'border-red-500/25 bg-red-500/5' : ''} ${a.status === 'completed' ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getPriorityEmoji(a.priority)}</span>
                  <h3 className={`text-sm font-semibold ${a.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>{a.title}</h3>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleComplete(a.id)} className="glass-button-ghost p-1 rounded-lg"><Check size={14} className={a.status === 'completed' ? 'text-green-400' : ''} /></button>
                  <button onClick={() => openEdit(a)} className="glass-button-ghost p-1 rounded-lg"><Edit2 size={14} /></button>
                  <button onClick={() => setDeleteId(a.id)} className="glass-button-ghost p-1 rounded-lg text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-2">{a.subject}</p>
              {a.description && <p className="text-xs text-slate-400 mb-3 truncate-2">{a.description}</p>}
              <div className="flex items-center justify-between">
                <span className={`badge badge-${a.status}`}>{a.status.replace('-', ' ')}</span>
                <span className={`text-xs ${isOverdue(a) ? 'text-red-400 font-medium' : 'text-slate-500'}`}>{getRelativeDeadline(a.dueDate)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Assignment' : 'Add Assignment'}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="glass-input" placeholder="Assignment title" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Subject *</label>
            <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="glass-input">
              <option value="">Select subject</option>
              {SUBJECTS.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="glass-input min-h-[80px] resize-y" placeholder="Details..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="glass-input" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))} className="glass-input">
                <option value="urgent">🔴 Urgent</option>
                <option value="important">🟡 Important</option>
                <option value="normal">🟢 Normal</option>
              </select>
            </div>
          </div>
          {editing && (
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as AssignmentStatus }))} className="glass-input">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="glass-button glass-button-secondary flex-1">Cancel</button>
            <button onClick={handleSave} className="glass-button glass-button-primary flex-1">{editing ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
