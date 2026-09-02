// =============================================
// College Copilot — AI Assistant (Demo Mode)
// =============================================

import { ClassEntry, Assignment, AttendanceRecord, Note, Announcement, FeeEntry, Settings, ChatMessage } from '../types';
import { getTodayClasses, getTomorrowClasses, getPendingAssignments, getUpcomingDeadlines, getOverdueAssignments, getAttendanceWarnings, getUrgentTasks } from './analytics';
import { formatTime, getAttendancePercentage, daysUntil, formatDate, generateId, getRelativeDeadline, calculateProjection } from '../utils/helpers';

interface AppData {
  classes: ClassEntry[];
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  notes: Note[];
  announcements: Announcement[];
  fees: FeeEntry[];
  settings: Settings;
}

type PatternHandler = {
  patterns: string[];
  handler: (data: AppData) => string;
};

const patternHandlers: PatternHandler[] = [
  {
    patterns: ['what do i have today', 'aaj kya hai', 'today schedule', 'today class', "today's class", 'what is today', 'kya karna hai'],
    handler: (data) => {
      const classes = getTodayClasses(data.classes);
      if (classes.length === 0) return "You don't have any classes scheduled today! 🎉 Great time to catch up on assignments or review notes.";

      let msg = `You have **${classes.length} class${classes.length > 1 ? 'es' : ''}** today:\n\n`;
      classes.forEach(c => {
        msg += `• **${c.subject}** — ${formatTime(c.startTime)} to ${formatTime(c.endTime)} | ${c.room} | Prof. ${c.professor.replace('Dr. ', '').replace('Prof. ', '')}\n`;
      });

      const pending = getPendingAssignments(data.assignments);
      const urgent = getUrgentTasks(data.assignments);
      if (urgent.length > 0) {
        msg += `\n⚠️ You also have **${urgent.length} urgent assignment${urgent.length > 1 ? 's' : ''}** to work on.`;
      } else if (pending.length > 0) {
        msg += `\nYou have ${pending.length} pending assignment${pending.length > 1 ? 's' : ''} overall.`;
      }

      return msg;
    }
  },
  {
    patterns: ['tomorrow', 'kal', 'next day'],
    handler: (data) => {
      const classes = getTomorrowClasses(data.classes);
      if (classes.length === 0) return "No classes tomorrow! You can use the time to work on your assignments or take a well-deserved break. 😊";

      let msg = `Tomorrow you have **${classes.length} class${classes.length > 1 ? 'es' : ''}**:\n\n`;
      classes.forEach(c => {
        msg += `• **${c.subject}** — ${formatTime(c.startTime)} to ${formatTime(c.endTime)} | ${c.room}\n`;
      });
      return msg;
    }
  },
  {
    patterns: ['assignment due', 'next assignment', 'upcoming assignment', 'deadline', 'due date', 'kab tak'],
    handler: (data) => {
      const upcoming = getUpcomingDeadlines(data.assignments, 5);
      if (upcoming.length === 0) return "🎉 No pending assignments! You're all caught up. Maybe explore some advanced topics or help a friend?";

      let msg = "Here are your upcoming deadlines:\n\n";
      upcoming.forEach(a => {
        const d = daysUntil(a.dueDate);
        const emoji = d < 0 ? '🔴' : d <= 2 ? '🟠' : '🟢';
        msg += `${emoji} **${a.title}** (${a.subject}) — ${getRelativeDeadline(a.dueDate)}\n`;
      });

      const overdue = getOverdueAssignments(data.assignments);
      if (overdue.length > 0) {
        msg += `\n⚠️ **${overdue.length} assignment${overdue.length > 1 ? 's are' : ' is'} overdue!** Please prioritize ${overdue.length === 1 ? 'it' : 'them'}.`;
      }
      return msg;
    }
  },
  {
    patterns: ['low attendance', 'attendance warning', 'attendance problem', 'attendance issue', 'attendance below', 'haziri'],
    handler: (data) => {
      const warnings = getAttendanceWarnings(data.attendance, data.settings.attendanceThreshold);
      if (warnings.length === 0) return `✅ Great news! All your subjects are above the ${data.settings.attendanceThreshold}% threshold. Keep it up!`;

      let msg = `⚠️ These subjects are below your **${data.settings.attendanceThreshold}% threshold**:\n\n`;
      warnings.forEach(w => {
        const pct = getAttendancePercentage(w.attendedClasses, w.totalClasses);
        const projected = calculateProjection(w.attendedClasses, w.totalClasses, 4);
        msg += `• **${w.subject}** — ${pct}% (${w.attendedClasses}/${w.totalClasses} classes)\n  → If you attend the next 4 classes, it'll be ~${projected}%\n`;
      });
      msg += `\nI strongly recommend attending all upcoming classes for these subjects.`;
      return msg;
    }
  },
  {
    patterns: ['attendance', 'my attendance', 'attendance percentage', 'attendance status'],
    handler: (data) => {
      let msg = "Here's your attendance snapshot:\n\n";
      data.attendance.forEach(a => {
        const pct = getAttendancePercentage(a.attendedClasses, a.totalClasses);
        const bar = pct >= data.settings.attendanceThreshold ? '🟢' : '🔴';
        msg += `${bar} **${a.subject}** — ${pct}% (${a.attendedClasses}/${a.totalClasses})\n`;
      });
      const warnings = getAttendanceWarnings(data.attendance, data.settings.attendanceThreshold);
      if (warnings.length > 0) {
        msg += `\n⚠️ ${warnings.length} subject${warnings.length > 1 ? 's need' : ' needs'} attention.`;
      }
      return msg;
    }
  },
  {
    patterns: ['prioritize', 'priority', 'what should i do', 'suggest', 'recommend', 'study today', 'kya karun'],
    handler: (data) => {
      const overdue = getOverdueAssignments(data.assignments);
      const urgent = getUrgentTasks(data.assignments);
      const upcoming = getUpcomingDeadlines(data.assignments, 5);
      const warnings = getAttendanceWarnings(data.attendance, data.settings.attendanceThreshold);
      const todayClasses = getTodayClasses(data.classes);

      let msg = "Here's my recommended priority list:\n\n";
      let priority = 1;

      if (overdue.length > 0) {
        overdue.forEach(a => {
          msg += `**${priority++}. 🔴 OVERDUE** — ${a.title} (${a.subject})\n`;
        });
      }

      if (warnings.length > 0 && todayClasses.some(c => warnings.some(w => w.subject === c.subject))) {
        const critical = todayClasses.filter(c => warnings.some(w => w.subject === c.subject));
        critical.forEach(c => {
          msg += `**${priority++}. ⚠️ Attend** — ${c.subject} class at ${formatTime(c.startTime)}\n`;
        });
      }

      if (urgent.length > 0) {
        urgent.slice(0, 3).forEach(a => {
          msg += `**${priority++}. 🟠 Urgent** — ${a.title} (${getRelativeDeadline(a.dueDate)})\n`;
        });
      }

      if (priority === 1) {
        return "You're doing great! No urgent tasks. Consider reviewing your notes or working on upcoming assignments to stay ahead. 📚";
      }

      msg += `\nFocus on the top items first. You've got this! 💪`;
      return msg;
    }
  },
  {
    patterns: ['exam', 'test', 'mid sem', 'midterm', 'end sem'],
    handler: (data) => {
      const examAnnouncements = data.announcements.filter(a => a.category === 'exam');
      if (examAnnouncements.length === 0) return "No exam-related announcements found at the moment. Keep checking your announcements for updates!";

      let msg = "📋 Exam-related announcements:\n\n";
      examAnnouncements.forEach(a => {
        msg += `• **${a.title}**\n  ${a.description.substring(0, 120)}...\n  _Posted: ${formatDate(a.date)}_\n\n`;
      });
      return msg;
    }
  },
  {
    patterns: ['fee', 'payment', 'fees due', 'fee status', 'paisa'],
    handler: (data) => {
      const unpaid = data.fees.filter(f => f.status !== 'paid');
      if (unpaid.length === 0) return "✅ All fees are paid! You're up to date.";

      let msg = "💰 Here's your fee status:\n\n";
      let total = 0;
      unpaid.forEach(f => {
        const d = daysUntil(f.dueDate);
        const emoji = d < 0 ? '🔴' : d <= 5 ? '🟠' : '🟢';
        msg += `${emoji} **${f.feeType}** — ₹${f.amount.toLocaleString('en-IN')} | ${getRelativeDeadline(f.dueDate)}\n`;
        total += f.amount;
      });
      msg += `\n**Total pending: ₹${total.toLocaleString('en-IN')}**`;
      return msg;
    }
  },
  {
    patterns: ['note', 'notes', 'my notes'],
    handler: (data) => {
      if (data.notes.length === 0) return "You haven't created any notes yet. Try creating some notes in the Notes section!";

      let msg = `You have **${data.notes.length} notes**:\n\n`;
      const pinned = data.notes.filter(n => n.pinned);
      const unpinned = data.notes.filter(n => !n.pinned);

      if (pinned.length > 0) {
        msg += "📌 **Pinned:**\n";
        pinned.forEach(n => { msg += `• ${n.title} (${n.subject})\n`; });
        msg += "\n";
      }
      unpinned.slice(0, 5).forEach(n => { msg += `• ${n.title} (${n.subject})\n`; });
      return msg;
    }
  },
  {
    patterns: ['announcement', 'announcements', 'notice', 'update'],
    handler: (data) => {
      const unread = data.announcements.filter(a => !a.read);
      if (unread.length === 0) return "No unread announcements. You're all caught up! 📬";

      let msg = `📢 You have **${unread.length} unread announcement${unread.length > 1 ? 's' : ''}**:\n\n`;
      unread.forEach(a => {
        msg += `• **${a.title}** [${a.category.toUpperCase()}]\n  ${a.description.substring(0, 100)}...\n\n`;
      });
      return msg;
    }
  },
  {
    patterns: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening'],
    handler: (data) => {
      const todayClasses = getTodayClasses(data.classes);
      const pending = getPendingAssignments(data.assignments);
      return `Hello ${data.settings.studentName}! 👋 I'm your College Copilot. You have **${todayClasses.length} classes** today and **${pending.length} pending assignments**. Ask me anything about your schedule, assignments, attendance, or what you should prioritize!`;
    }
  },
  {
    patterns: ['help', 'what can you do', 'how to use'],
    handler: () => {
      return `I can help you with:\n\n• **"What do I have today?"** — Today's schedule\n• **"What's due next?"** — Upcoming deadlines\n• **"Which subject has low attendance?"** — Attendance warnings\n• **"What should I prioritize?"** — Smart task recommendations\n• **"Show my attendance"** — Full attendance snapshot\n• **"Tomorrow's classes"** — Tomorrow's schedule\n• **"Fee status"** — Pending fees\n• **"Upcoming exams"** — Exam announcements\n• **"Show my notes"** — Your notes overview\n\nJust ask naturally! I understand both English and some Hindi keywords. 😊`;
    }
  },
];

export function getAIResponse(query: string, data: AppData): string {
  const q = query.toLowerCase().trim();

  for (const { patterns, handler } of patternHandlers) {
    if (patterns.some(p => q.includes(p))) {
      return handler(data);
    }
  }

  // Fallback
  const todayClasses = getTodayClasses(data.classes);
  const pending = getPendingAssignments(data.assignments);
  const warnings = getAttendanceWarnings(data.attendance, data.settings.attendanceThreshold);

  return `I'm not sure I understood that, but here's a quick summary:\n\n• **${todayClasses.length}** classes today\n• **${pending.length}** pending assignments\n• **${warnings.length}** attendance warnings\n\nTry asking things like "What do I have today?", "Which assignment is due next?", or "What should I prioritize?" 😊`;
}

export function createUserMessage(content: string): ChatMessage {
  return { id: generateId(), role: 'user', content, timestamp: new Date().toISOString() };
}

export function createAssistantMessage(content: string): ChatMessage {
  return { id: generateId(), role: 'assistant', content, timestamp: new Date().toISOString() };
}
