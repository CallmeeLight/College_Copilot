import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Megaphone, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { Announcement, AnnouncementCategory } from '../types';
import { generateId, formatDate, getCategoryColor } from '../utils/helpers';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

interface AnnouncementsProps {
  announcements: Announcement[];
  setAnnouncements: (val: Announcement[] | ((prev: Announcement[]) => Announcement[])) => void;
}

const CATEGORIES: { label: string; value: AnnouncementCategory | 'all' }[] = [
  { label: 'All Notices', value: 'all' },
  { label: 'Academic', value: 'academic' },
  { label: 'Exam', value: 'exam' },
  { label: 'Events', value: 'event' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'General', value: 'general' },
];

const emptyAnnouncement = {
  title: '',
  description: '',
  category: 'general' as AnnouncementCategory,
};

export default function Announcements({ announcements, setAnnouncements }: AnnouncementsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyAnnouncement);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | 'all'>('all');

  const unreadCount = useMemo(() => announcements.filter(a => !a.read).length, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
      .sort((a, b) => {
        // Unread first, then by date descending
        if (!a.read && b.read) return -1;
        if (a.read && !b.read) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [announcements, selectedCategory]);

  const toggleReadStatus = (id: string) => {
    setAnnouncements(prev =>
      prev.map(a => (a.id === id ? { ...a, read: !a.read } : a))
    );
  };

  const markAllAsRead = () => {
    setAnnouncements(prev => prev.map(a => ({ ...a, read: true })));
    toast.success('All announcements marked as read');
  };

  const handleCreate = () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Please provide both title and description');
      return;
    }

    const newEntry: Announcement = {
      id: generateId(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      date: new Date().toISOString().split('T')[0],
      read: false,
    };

    setAnnouncements(prev => [newEntry, ...prev]);
    toast.success('Announcement broadcasted');
    setForm(emptyAnnouncement);
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setAnnouncements(prev => prev.filter(a => a.id !== deleteId));
      toast.success('Announcement removed');
      setDeleteId(null);
    }
  };

  const getCategoryBadgeClass = (category: AnnouncementCategory) => {
    switch (category) {
      case 'urgent': return 'badge-urgent';
      case 'exam': return 'badge-overdue';
      case 'academic': return 'badge-info';
      case 'event': return 'badge-unread';
      default: return 'badge-normal';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="page-title">📢 Notice Board</h1>
            {unreadCount > 0 && (
              <span className="badge badge-urgent text-[0.7rem] px-2 py-0.5">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="page-subtitle">Official campus circulars, departmental updates & deadlines</p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="glass-button glass-button-secondary text-xs"
            >
              <CheckCircle2 size={14} /> Mark All Read
            </button>
          )}
          <button
            onClick={() => setModalOpen(true)}
            className="glass-button glass-button-primary text-xs"
          >
            <Plus size={14} /> Post Announcement
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              selectedCategory === cat.value
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="empty-state glass-card">
          <p className="empty-state-icon">📢</p>
          <p className="text-sm text-slate-400 mb-3">No notices in this category</p>
          <button onClick={() => setModalOpen(true)} className="glass-button glass-button-primary text-xs">
            <Plus size={14} /> Create Announcement
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnnouncements.map(notice => (
            <div
              key={notice.id}
              className={`glass-card transition-all relative overflow-hidden group ${
                !notice.read
                  ? 'border-indigo-500/30 bg-indigo-500/[0.04] shadow-[0_0_20px_rgba(99,102,241,0.06)]'
                  : 'opacity-85 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleReadStatus(notice.id)}
                    title={notice.read ? "Mark as unread" : "Mark as read"}
                    className="mt-0.5 text-slate-500 hover:text-indigo-400 transition-colors"
                  >
                    {!notice.read ? (
                      <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      </div>
                    ) : (
                      <CheckCircle2 size={16} className="text-slate-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`badge ${getCategoryBadgeClass(notice.category)} capitalize text-[0.65rem]`}>
                        {notice.category}
                      </span>
                      <span className="text-[0.7rem] text-slate-500 flex items-center gap-1">
                        <Calendar size={11} /> {formatDate(notice.date)}
                      </span>
                      {!notice.read && (
                        <span className="text-[0.65rem] font-bold text-indigo-400 uppercase tracking-wider">
                          NEW
                        </span>
                      )}
                    </div>

                    <h3 className={`text-sm font-semibold mb-1.5 ${!notice.read ? 'text-white' : 'text-slate-300'}`}>
                      {notice.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {notice.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => setDeleteId(notice.id)}
                    className="glass-button-ghost p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                    title="Delete Notice"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Broadcast Campus Notice">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Notice Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="glass-input"
              placeholder="e.g. Mid-term timetable revision"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as AnnouncementCategory }))}
              className="glass-input"
            >
              <option value="academic">Academic</option>
              <option value="exam">Exam</option>
              <option value="event">Event</option>
              <option value="urgent">Urgent</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Notice Details *</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="glass-input min-h-[120px] text-xs resize-y"
              placeholder="Type the full announcement content..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="glass-button glass-button-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="glass-button glass-button-primary flex-1"
            >
              Publish Notice
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Announcement"
        message="Remove this announcement from your notice board?"
      />
    </div>
  );
}
