import React, { useState, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Clock, CheckSquare, BookOpen, AlertCircle, Wallet, Tag
} from 'lucide-react';
import { ClassEntry, Assignment, Announcement, FeeEntry } from '../types';
import { formatDate, formatTime, getRelativeDeadline } from '../utils/helpers';

interface CalendarProps {
  classes: ClassEntry[];
  assignments: Assignment[];
  announcements: Announcement[];
  fees: FeeEntry[];
}

interface DayEvent {
  id: string;
  type: 'class' | 'assignment' | 'exam' | 'fee';
  title: string;
  timeOrStatus?: string;
  color: string;
  details?: string;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Calendar({ classes, assignments, announcements, fees }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Calendar grid calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Helper to get events for a specific ISO date string 'YYYY-MM-DD'
  const getEventsForDate = (dateObj: Date): DayEvent[] => {
    const isoString = dateObj.toISOString().split('T')[0];
    const dayOfWeek = FULL_DAYS[dateObj.getDay()];
    const events: DayEvent[] = [];

    // 1. Classes on this day of week
    classes
      .filter(c => c.day === dayOfWeek)
      .forEach(c => {
        events.push({
          id: `class-${c.id}`,
          type: 'class',
          title: c.subject,
          timeOrStatus: `${formatTime(c.startTime)} - ${c.room}`,
          color: c.color || '#3b82f6',
          details: `Prof: ${c.professor}`,
        });
      });

    // 2. Assignments due on this date
    assignments
      .filter(a => a.dueDate.startsWith(isoString))
      .forEach(a => {
        events.push({
          id: `assign-${a.id}`,
          type: 'assignment',
          title: a.title,
          timeOrStatus: `Due: ${a.priority.toUpperCase()}`,
          color: a.priority === 'urgent' ? '#ef4444' : a.priority === 'important' ? '#f59e0b' : '#10b981',
          details: `${a.subject} • Status: ${a.status}`,
        });
      });

    // 3. Exam announcements on this date
    announcements
      .filter(a => a.category === 'exam' && a.date.startsWith(isoString))
      .forEach(a => {
        events.push({
          id: `exam-${a.id}`,
          type: 'exam',
          title: a.title,
          timeOrStatus: 'Campus Examination',
          color: '#ec4899',
          details: a.description,
        });
      });

    // 4. Fees due on this date
    fees
      .filter(f => f.dueDate.startsWith(isoString))
      .forEach(f => {
        events.push({
          id: `fee-${f.id}`,
          type: 'fee',
          title: f.feeType,
          timeOrStatus: `₹${f.amount.toLocaleString('en-IN')}`,
          color: '#eab308',
          details: `Status: ${f.status}`,
        });
      });

    return events;
  };

  // Selected date events
  const selectedEvents = useMemo(() => {
    return getEventsForDate(selectedDate);
  }, [selectedDate, classes, assignments, announcements, fees]);

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const today = new Date();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">🗓️ Academic Calendar</h1>
          <p className="page-subtitle">Unified view of classes, deadlines, exams, and fee schedules</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={goToToday} className="glass-button glass-button-secondary text-xs">
            Today
          </button>
          <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-0.5">
            <button onClick={prevMonth} className="glass-button-ghost p-1.5 rounded-lg">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-semibold px-3 text-slate-200">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button onClick={nextMonth} className="glass-button-ghost p-1.5 rounded-lg">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4 px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Class Lecture
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Assignment Due
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Examination
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Fee Reminder
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar Grid - 2 Cols */}
        <div className="lg:col-span-2 glass-card p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center mb-2">
            {DAYS_OF_WEEK.map((d, i) => (
              <div key={d} className={`text-xs font-semibold py-1.5 ${i === 0 || i === 6 ? 'text-indigo-400/80' : 'text-slate-400'}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Previous month filler days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="calendar-cell opacity-30 pointer-events-none text-slate-600"
                >
                  <span className="text-xs">{dayNum}</span>
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(currentYear, currentMonth, dayNum);
              const events = getEventsForDate(dateObj);
              const isSelected = isSameDay(dateObj, selectedDate);
              const isCurrentToday = isSameDay(dateObj, today);

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDate(dateObj)}
                  className={`calendar-cell relative group ${
                    isSelected
                      ? 'selected !border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                      : isCurrentToday
                      ? 'today'
                      : ''
                  }`}
                >
                  <span className={`text-xs font-medium ${isCurrentToday ? 'text-indigo-400 font-bold' : 'text-slate-300'}`}>
                    {dayNum}
                  </span>

                  {/* Event indicator dots */}
                  {events.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-0.5 mt-1 max-w-[90%]">
                      {events.slice(0, 4).map(e => (
                        <span
                          key={e.id}
                          className="calendar-dot"
                          style={{ background: e.color }}
                          title={e.title}
                        />
                      ))}
                      {events.length > 4 && (
                        <span className="text-[0.55rem] text-slate-500 leading-none">
                          +{events.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Panel */}
        <div className="glass-card flex flex-col h-full">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <div>
              <p className="text-[0.7rem] text-indigo-400 font-semibold uppercase tracking-wider">
                {FULL_DAYS[selectedDate.getDay()]}
              </p>
              <h3 className="text-base font-bold text-white">
                {formatDate(selectedDate.toISOString())}
              </h3>
            </div>
            {isSameDay(selectedDate, today) && (
              <span className="badge badge-urgent text-[0.65rem]">TODAY</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5">
            {selectedEvents.length === 0 ? (
              <div className="empty-state py-10">
                <CalendarIcon size={32} className="text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">No events scheduled for this day</p>
              </div>
            ) : (
              selectedEvents.map(evt => {
                const getBadge = () => {
                  switch (evt.type) {
                    case 'class': return <span className="badge badge-info text-[0.6rem]">Class</span>;
                    case 'assignment': return <span className="badge badge-urgent text-[0.6rem]">Assignment</span>;
                    case 'exam': return <span className="badge badge-overdue text-[0.6rem]">Exam</span>;
                    case 'fee': return <span className="badge badge-important text-[0.6rem]">Fee Due</span>;
                  }
                };

                return (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: evt.color }} />
                        <p className="text-xs font-semibold text-white truncate">{evt.title}</p>
                      </div>
                      {getBadge()}
                    </div>

                    {evt.timeOrStatus && (
                      <p className="text-[0.7rem] text-slate-300 font-medium ml-3.5">
                        {evt.timeOrStatus}
                      </p>
                    )}

                    {evt.details && (
                      <p className="text-[0.65rem] text-slate-500 ml-3.5 mt-0.5 truncate">
                        {evt.details}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
