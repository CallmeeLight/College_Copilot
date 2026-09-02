import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Clock, AlertTriangle, CheckSquare, CalendarDays,
  TrendingUp, Bot, ChevronRight, Megaphone, Sparkles
} from 'lucide-react';
import { ClassEntry, Assignment, AttendanceRecord, Announcement, Settings } from '../types';
import {
  getTodayClasses, getPendingAssignments, getUpcomingDeadlines,
  getOverdueAssignments, getAttendanceWarnings, getUrgentTasks,
  getImportantTasks, getNormalTasks, generateDailyBrief, generateAIRecommendation
} from '../services/analytics';
import {
  getGreeting, formatTime, getAttendancePercentage, getRelativeDeadline,
  getPriorityEmoji, daysUntil
} from '../utils/helpers';

interface DashboardProps {
  classes: ClassEntry[];
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  announcements: Announcement[];
  settings: Settings;
}

export default function Dashboard({ classes, assignments, attendance, announcements, settings }: DashboardProps) {
  const navigate = useNavigate();
  const todayClasses = getTodayClasses(classes);
  const pending = getPendingAssignments(assignments);
  const overdue = getOverdueAssignments(assignments);
  const deadlines = getUpcomingDeadlines(assignments, 5);
  const warnings = getAttendanceWarnings(attendance, settings.attendanceThreshold);
  const unreadAnnouncements = announcements.filter(a => !a.read);
  const urgent = getUrgentTasks(assignments);
  const important = getImportantTasks(assignments);
  const normal = getNormalTasks(assignments);
  const brief = generateDailyBrief(classes, assignments, attendance, settings);
  const recommendation = generateAIRecommendation(classes, assignments, attendance, settings);

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const getClassStatus = (startTime: string, endTime: string) => {
    if (currentTime < startTime) return 'upcoming';
    if (currentTime >= startTime && currentTime <= endTime) return 'ongoing';
    return 'completed';
  };

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="page-header">
        <h1 className="page-title">{getGreeting()}, {settings.studentName.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">{settings.collegeName} • {settings.semester}</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Classes Today', value: todayClasses.length, icon: BookOpen, color: 'from-blue-500/20 to-blue-600/10', textColor: 'text-blue-400', borderColor: 'border-blue-500/20' },
          { label: 'Pending Tasks', value: pending.length, icon: CheckSquare, color: 'from-amber-500/20 to-amber-600/10', textColor: 'text-amber-400', borderColor: 'border-amber-500/20' },
          { label: 'Upcoming Deadlines', value: deadlines.length, icon: Clock, color: 'from-purple-500/20 to-purple-600/10', textColor: 'text-purple-400', borderColor: 'border-purple-500/20' },
          { label: 'Attendance Warnings', value: warnings.length, icon: AlertTriangle, color: warnings.length > 0 ? 'from-red-500/20 to-red-600/10' : 'from-green-500/20 to-green-600/10', textColor: warnings.length > 0 ? 'text-red-400' : 'text-green-400', borderColor: warnings.length > 0 ? 'border-red-500/20' : 'border-green-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`glass-card animate-slide-up stagger-${i + 1} bg-gradient-to-br ${stat.color} border ${stat.borderColor}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={18} className={stat.textColor} />
              <span className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</span>
            </div>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">

          {/* AI Daily Brief */}
          <div className="ai-glow-card animate-slide-up stagger-1">
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">AI Daily Brief</h3>
                <p className="text-[0.65rem] text-slate-500">Your personalized summary</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3 relative z-10">{brief}</p>
            <div className="glass-card !bg-white/3 !p-3 mb-3 relative z-10">
              <p className="text-xs text-slate-400 mb-1 font-medium">💡 Recommendation</p>
              <p className="text-sm text-slate-300">{recommendation}</p>
            </div>
            <button
              onClick={() => navigate('/copilot')}
              className="glass-button glass-button-primary text-xs relative z-10"
            >
              <Bot size={14} /> Ask Copilot
            </button>
          </div>

          {/* Today's Schedule */}
          <div className="glass-card animate-slide-up stagger-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <CalendarDays size={16} className="text-blue-400" /> Today's Schedule
              </h3>
              <button onClick={() => navigate('/timetable')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View All <ChevronRight size={14} />
              </button>
            </div>
            {todayClasses.length === 0 ? (
              <div className="empty-state !py-6">
                <p className="text-sm text-slate-500">🎉 No classes today!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayClasses.map((cls, i) => {
                  const status = getClassStatus(cls.startTime, cls.endTime);
                  return (
                    <div
                      key={cls.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        status === 'ongoing' ? 'bg-indigo-500/10 border border-indigo-500/20' :
                        status === 'completed' ? 'opacity-50' : 'bg-white/3'
                      }`}
                    >
                      <div className="w-1 h-10 rounded-full" style={{ background: cls.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{cls.subject}</p>
                        <p className="text-xs text-slate-500">{cls.professor} • {cls.room}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-medium text-slate-300">{formatTime(cls.startTime)}</p>
                        <p className="text-[0.65rem] text-slate-600">{formatTime(cls.endTime)}</p>
                      </div>
                      <span className={`text-[0.6rem] px-2 py-0.5 rounded-full font-medium ${
                        status === 'ongoing' ? 'bg-green-500/15 text-green-400' :
                        status === 'completed' ? 'bg-slate-500/15 text-slate-500' :
                        'bg-blue-500/15 text-blue-400'
                      }`}>
                        {status === 'ongoing' ? 'NOW' : status === 'completed' ? 'DONE' : 'UPCOMING'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Priority Tasks */}
          <div className="glass-card animate-slide-up stagger-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-amber-400" /> Priority Tasks
              </h3>
              <button onClick={() => navigate('/assignments')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View All <ChevronRight size={14} />
              </button>
            </div>
            {pending.length === 0 ? (
              <div className="empty-state !py-6">
                <p className="text-sm text-slate-500">✅ All tasks completed!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {overdue.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-red-400 mb-2">🔴 Overdue</p>
                    {overdue.slice(0, 2).map(a => (
                      <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-red-500/8 border border-red-500/15 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{a.title}</p>
                          <p className="text-xs text-slate-500">{a.subject}</p>
                        </div>
                        <span className="badge badge-overdue">{getRelativeDeadline(a.dueDate)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {urgent.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-red-400 mb-2">{getPriorityEmoji('urgent')} Urgent</p>
                    {urgent.filter(a => !overdue.includes(a)).slice(0, 2).map(a => (
                      <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{a.title}</p>
                          <p className="text-xs text-slate-500">{a.subject} • {getRelativeDeadline(a.dueDate)}</p>
                        </div>
                        <span className="badge badge-urgent">Urgent</span>
                      </div>
                    ))}
                  </div>
                )}
                {important.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-amber-400 mb-2">{getPriorityEmoji('important')} Important</p>
                    {important.slice(0, 2).map(a => (
                      <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{a.title}</p>
                          <p className="text-xs text-slate-500">{a.subject} • {getRelativeDeadline(a.dueDate)}</p>
                        </div>
                        <span className="badge badge-important">Important</span>
                      </div>
                    ))}
                  </div>
                )}
                {normal.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-green-400 mb-2">{getPriorityEmoji('normal')} Normal</p>
                    {normal.slice(0, 2).map(a => (
                      <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{a.title}</p>
                          <p className="text-xs text-slate-500">{a.subject} • {getRelativeDeadline(a.dueDate)}</p>
                        </div>
                        <span className="badge badge-normal">Normal</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Attendance Snapshot */}
          <div className="glass-card animate-slide-up stagger-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                📊 Attendance
              </h3>
              <button onClick={() => navigate('/attendance')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Details <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {attendance.map(a => {
                const pct = getAttendancePercentage(a.attendedClasses, a.totalClasses);
                const isLow = pct < settings.attendanceThreshold;
                return (
                  <div key={a.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                        {a.subject}
                      </span>
                      <span className={`text-xs font-semibold ${isLow ? 'text-red-400' : 'text-green-400'}`}>
                        {pct}%
                        {isLow && <AlertTriangle size={10} className="inline ml-1" />}
                      </span>
                    </div>
                    <div className="progress-bar-track">
                      <div
                        className={`progress-bar-fill ${isLow ? (pct < 60 ? 'danger' : 'warning') : 'success'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="glass-card animate-slide-up stagger-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Clock size={16} className="text-purple-400" /> Upcoming Deadlines
            </h3>
            {deadlines.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No upcoming deadlines!</p>
            ) : (
              <div className="space-y-2">
                {deadlines.map(a => {
                  const d = daysUntil(a.dueDate);
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d < 0 ? 'bg-red-400' : d <= 2 ? 'bg-amber-400' : 'bg-green-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{a.title}</p>
                        <p className="text-[0.65rem] text-slate-500">{a.subject}</p>
                      </div>
                      <span className={`text-[0.6rem] font-medium ${d < 0 ? 'text-red-400' : d <= 2 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {getRelativeDeadline(a.dueDate)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="glass-card animate-slide-up stagger-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Megaphone size={16} className="text-pink-400" /> Announcements
                {unreadAnnouncements.length > 0 && (
                  <span className="bg-indigo-500/20 text-indigo-400 text-[0.6rem] px-1.5 py-0.5 rounded-full font-medium">
                    {unreadAnnouncements.length} new
                  </span>
                )}
              </h3>
              <button onClick={() => navigate('/announcements')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                All <ChevronRight size={14} />
              </button>
            </div>
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No announcements</p>
            ) : (
              <div className="space-y-2">
                {announcements.slice(0, 3).map(a => (
                  <div key={a.id} className={`p-2.5 rounded-lg ${!a.read ? 'bg-indigo-500/8 border border-indigo-500/15' : 'bg-white/3'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {!a.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />}
                      <p className="text-xs font-medium text-white truncate">{a.title}</p>
                    </div>
                    <p className="text-[0.65rem] text-slate-500 truncate">{a.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
