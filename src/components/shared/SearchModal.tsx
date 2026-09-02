import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, CheckSquare, Megaphone, CalendarDays, BookOpen } from 'lucide-react';
import { ClassEntry, Assignment, Note, Announcement } from '../../types';
import { truncate } from '../../utils/helpers';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassEntry[];
  assignments: Assignment[];
  notes: Note[];
  announcements: Announcement[];
}

type SearchResult = {
  type: 'class' | 'assignment' | 'note' | 'announcement';
  title: string;
  subtitle: string;
  path: string;
};

export default function SearchModal({ isOpen, onClose, classes, assignments, notes, announcements }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const classResults: SearchResult[] = classes
      .filter(c => c.subject.toLowerCase().includes(q) || c.professor.toLowerCase().includes(q) || c.room.toLowerCase().includes(q))
      .map(c => ({ type: 'class', title: c.subject, subtitle: `${c.day} • ${c.professor} • ${c.room}`, path: '/timetable' }));

    const assignmentResults: SearchResult[] = assignments
      .filter(a => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
      .map(a => ({ type: 'assignment', title: a.title, subtitle: `${a.subject} • ${a.status}`, path: '/assignments' }));

    const noteResults: SearchResult[] = notes
      .filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.subject.toLowerCase().includes(q))
      .map(n => ({ type: 'note', title: n.title, subtitle: truncate(n.content, 60), path: '/notes' }));

    const announcementResults: SearchResult[] = announcements
      .filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
      .map(a => ({ type: 'announcement', title: a.title, subtitle: truncate(a.description, 60), path: '/announcements' }));

    return [...classResults, ...assignmentResults, ...noteResults, ...announcementResults].slice(0, 12);
  }, [query, classes, assignments, notes, announcements]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'class': return <CalendarDays size={16} className="text-blue-400" />;
      case 'assignment': return <CheckSquare size={16} className="text-amber-400" />;
      case 'note': return <FileText size={16} className="text-green-400" />;
      case 'announcement': return <Megaphone size={16} className="text-purple-400" />;
      default: return <BookOpen size={16} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay !items-start !pt-[15vh]" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content !max-w-lg !p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <Search size={18} className="text-slate-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classes, assignments, notes, announcements..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button onClick={onClose} className="glass-button-ghost p-1">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="empty-state py-8">
              <p className="text-sm text-slate-500">No results for "{query}"</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2">
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => { navigate(r.path); onClose(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-colors"
                >
                  {getIcon(r.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{r.title}</p>
                    <p className="text-xs text-slate-500 truncate">{r.subtitle}</p>
                  </div>
                  <span className="text-[0.6rem] uppercase text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">{r.type}</span>
                </button>
              ))}
            </div>
          )}

          {!query.trim() && (
            <div className="p-4 text-center">
              <p className="text-xs text-slate-600 mb-3">Try searching for</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Mathematics', 'Physics Lab', 'Assignment', 'Exam'].map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="text-xs glass-button glass-button-secondary !py-1 !px-3 !rounded-full">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
