import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Pin, PinOff, Search, BookOpen, Clock, Tag } from 'lucide-react';
import { Note } from '../types';
import { generateId, formatDate, truncate } from '../utils/helpers';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

interface NotesProps {
  notes: Note[];
  setNotes: (val: Note[] | ((prev: Note[]) => Note[])) => void;
}

const SUBJECTS = ['All', 'Mathematics', 'Physics', 'Programming in C', 'Chemistry', 'English', 'Electronics', 'General'];

const emptyNote = {
  title: '',
  subject: 'General',
  content: '',
  pinned: false,
};

export default function Notes({ notes, setNotes }: NotesProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [viewNoteModal, setViewNoteModal] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [form, setForm] = useState(emptyNote);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const filteredNotes = useMemo(() => {
    return notes
      .filter(n => {
        const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject;
        const matchesSearch =
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSubject && matchesSearch;
      })
      .sort((a, b) => {
        // Pinned first, then by updatedAt
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, searchQuery, selectedSubject]);

  const openAdd = () => {
    setEditingNote(null);
    setForm(emptyNote);
    setModalOpen(true);
  };

  const openEdit = (n: Note, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingNote(n);
    setForm({
      title: n.title,
      subject: n.subject,
      content: n.content,
      pinned: n.pinned,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and Content cannot be empty');
      return;
    }

    const now = new Date().toISOString();
    if (editingNote) {
      setNotes(prev =>
        prev.map(n =>
          n.id === editingNote.id
            ? { ...n, ...form, updatedAt: now }
            : n
        )
      );
      toast.success('Note updated');
    } else {
      const newNoteItem: Note = {
        id: generateId(),
        ...form,
        createdAt: now,
        updatedAt: now,
      };
      setNotes(prev => [newNoteItem, ...prev]);
      toast.success('Note created');
    }
    setModalOpen(false);
  };

  const togglePin = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotes(prev =>
      prev.map(n => {
        if (n.id === id) {
          const nextPinned = !n.pinned;
          toast.success(nextPinned ? 'Pinned to top 📌' : 'Unpinned');
          return { ...n, pinned: nextPinned };
        }
        return n;
      })
    );
  };

  const handleDelete = () => {
    if (deleteId) {
      setNotes(prev => prev.filter(n => n.id !== deleteId));
      toast.success('Note deleted');
      setDeleteId(null);
      if (viewNoteModal?.id === deleteId) {
        setViewNoteModal(null);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">📝 Study Notes</h1>
          <p className="page-subtitle">Organize, review, and pin your lecture & study notes</p>
        </div>
        <button onClick={openAdd} className="glass-button glass-button-primary text-xs">
          <Plus size={14} /> Create Note
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes by keyword or formula..."
            className="glass-input !pl-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Tag size={14} className="text-slate-500 flex-shrink-0" />
          {SUBJECTS.map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                selectedSubject === subj
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="empty-state glass-card">
          <p className="empty-state-icon">📝</p>
          <p className="text-sm text-slate-400 mb-3">
            {searchQuery ? `No notes found matching "${searchQuery}"` : 'No notes in this subject yet'}
          </p>
          <button onClick={openAdd} className="glass-button glass-button-primary text-xs">
            <Plus size={14} /> Create Your First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setViewNoteModal(note)}
              className={`glass-card cursor-pointer group relative flex flex-col justify-between hover:border-indigo-500/30 ${
                note.pinned ? 'border-amber-500/30 bg-amber-500/[0.03]' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {note.pinned && <Pin size={13} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                    <h3 className="text-sm font-semibold text-white truncate">{note.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => togglePin(note.id, e)}
                      title={note.pinned ? "Unpin" : "Pin"}
                      className="glass-button-ghost p-1 rounded-lg hover:text-amber-400"
                    >
                      {note.pinned ? <PinOff size={13} /> : <Pin size={13} />}
                    </button>
                    <button
                      onClick={(e) => openEdit(note, e)}
                      title="Edit"
                      className="glass-button-ghost p-1 rounded-lg"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(note.id); }}
                      title="Delete"
                      className="glass-button-ghost p-1 rounded-lg text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="inline-block text-[0.65rem] font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md mb-2">
                  {note.subject}
                </div>

                <p className="text-xs text-slate-300 whitespace-pre-line line-clamp-4 leading-relaxed font-mono text-[0.75rem]">
                  {truncate(note.content, 180)}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[0.65rem] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {formatDate(note.updatedAt)}
                </span>
                <span className="text-indigo-400 font-medium group-hover:underline">Click to view</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Note Modal */}
      <Modal
        isOpen={!!viewNoteModal}
        onClose={() => setViewNoteModal(null)}
        title={viewNoteModal?.title || 'Note'}
        maxWidth="680px"
      >
        {viewNoteModal && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="badge badge-info">{viewNoteModal.subject}</span>
                {viewNoteModal.pinned && (
                  <span className="badge badge-important flex items-center gap-1">
                    <Pin size={10} className="fill-amber-400" /> Pinned
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} /> Last updated: {formatDate(viewNoteModal.updatedAt)}
              </span>
            </div>

            <div className="glass-card !bg-white/[0.02] p-4 max-h-[55vh] overflow-y-auto font-sans leading-relaxed text-slate-200 text-sm whitespace-pre-wrap">
              {viewNoteModal.content}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  const n = viewNoteModal;
                  setViewNoteModal(null);
                  openEdit(n);
                }}
                className="glass-button glass-button-secondary text-xs"
              >
                <Edit2 size={13} /> Edit Note
              </button>
              <button
                onClick={() => setViewNoteModal(null)}
                className="glass-button glass-button-primary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingNote ? 'Edit Note' : 'Create New Note'}
        maxWidth="600px"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="glass-input"
              placeholder="e.g. Eigenvalues & Formulas"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Subject</label>
              <select
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="glass-input"
              >
                {SUBJECTS.filter(s => s !== 'All').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={form.pinned}
                  onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))}
                  className="rounded bg-white/10 border-white/20 text-indigo-500 focus:ring-0"
                />
                Pin note to top 📌
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Note Content *</label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="glass-input min-h-[220px] font-mono text-xs leading-relaxed resize-y"
              placeholder="Type your notes, equations, summaries, or checklists here..."
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
              onClick={handleSave}
              className="glass-button glass-button-primary flex-1"
            >
              {editingNote ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
    </div>
  );
}
