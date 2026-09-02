// =============================================
// College Copilot — Analytics Service
// =============================================

import { ClassEntry, Assignment, AttendanceRecord, Settings } from '../types';
import { getDayOfWeek, getAttendancePercentage, daysUntil, getPriorityEmoji } from '../utils/helpers';

export function getTodayClasses(classes: ClassEntry[]): ClassEntry[] {
  const today = getDayOfWeek();
  return classes
    .filter(c => c.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function getTomorrowClasses(classes: ClassEntry[]): ClassEntry[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = getDayOfWeek(tomorrow);
  return classes
    .filter(c => c.day === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function getPendingAssignments(assignments: Assignment[]): Assignment[] {
  return assignments.filter(a => a.status !== 'completed');
}

export function getUpcomingDeadlines(assignments: Assignment[], limit = 5): Assignment[] {
  return assignments
    .filter(a => a.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, limit);
}

export function getOverdueAssignments(assignments: Assignment[]): Assignment[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return assignments.filter(a => a.status !== 'completed' && new Date(a.dueDate) < now);
}

export function getUrgentTasks(assignments: Assignment[]): Assignment[] {
  return assignments.filter(a => a.status !== 'completed' && a.priority === 'urgent');
}

export function getImportantTasks(assignments: Assignment[]): Assignment[] {
  return assignments.filter(a => a.status !== 'completed' && a.priority === 'important');
}

export function getNormalTasks(assignments: Assignment[]): Assignment[] {
  return assignments.filter(a => a.status !== 'completed' && a.priority === 'normal');
}

export function getAttendanceWarnings(attendance: AttendanceRecord[], threshold: number): AttendanceRecord[] {
  return attendance.filter(a => getAttendancePercentage(a.attendedClasses, a.totalClasses) < threshold);
}

export function generateDailyBrief(
  classes: ClassEntry[],
  assignments: Assignment[],
  attendance: AttendanceRecord[],
  settings: Settings
): string {
  const todayClasses = getTodayClasses(classes);
  const pending = getPendingAssignments(assignments);
  const overdue = getOverdueAssignments(assignments);
  const warnings = getAttendanceWarnings(attendance, settings.attendanceThreshold);
  const upcoming = pending.filter(a => {
    const d = daysUntil(a.dueDate);
    return d >= 0 && d <= 7;
  });

  const parts: string[] = [];

  if (todayClasses.length > 0) {
    parts.push(`You have ${todayClasses.length} class${todayClasses.length > 1 ? 'es' : ''} today`);
  } else {
    parts.push('No classes scheduled today');
  }

  if (upcoming.length > 0) {
    parts.push(`${upcoming.length} assignment${upcoming.length > 1 ? 's' : ''} due this week`);
  }

  if (overdue.length > 0) {
    parts.push(`${overdue.length} overdue assignment${overdue.length > 1 ? 's' : ''} need${overdue.length === 1 ? 's' : ''} attention`);
  }

  if (warnings.length > 0) {
    const subjectNames = warnings.map(w => w.subject).join(', ');
    parts.push(`your ${subjectNames} attendance needs attention`);
  }

  if (parts.length === 0) {
    return "You're all caught up! No urgent tasks or classes today. Great time to review notes or work ahead.";
  }

  return parts.join(', ') + '.';
}

export function generateAIRecommendation(
  classes: ClassEntry[],
  assignments: Assignment[],
  attendance: AttendanceRecord[],
  settings: Settings
): string {
  const todayClasses = getTodayClasses(classes);
  const warnings = getAttendanceWarnings(attendance, settings.attendanceThreshold);
  const urgent = getUrgentTasks(assignments);
  const overdue = getOverdueAssignments(assignments);

  const tips: string[] = [];

  // Attendance-based advice
  const warningSubjectsWithClassToday = warnings.filter(w =>
    todayClasses.some(c => c.subject === w.subject)
  );
  if (warningSubjectsWithClassToday.length > 0) {
    tips.push(`Attend today's ${warningSubjectsWithClassToday.map(w => w.subject).join(' and ')} class${warningSubjectsWithClassToday.length > 1 ? 'es' : ''} — your attendance is below ${settings.attendanceThreshold}%`);
  }

  // Overdue
  if (overdue.length > 0) {
    tips.push(`complete the overdue ${overdue[0].title} as soon as possible`);
  }

  // Urgent assignments
  if (urgent.length > 0 && overdue.length === 0) {
    const nearest = urgent.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    const d = daysUntil(nearest.dueDate);
    tips.push(`focus on "${nearest.title}" — it's due ${d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`}`);
  }

  if (tips.length === 0) {
    return "You're on track! Keep up the good work. Consider reviewing upcoming topics or working on assignments early.";
  }

  return tips.join(', and ') + '.';
}
