// =============================================
// College Copilot — Utility Helpers
// =============================================

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function getDayOfWeek(date?: Date): string {
  const d = date || new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[d.getDay()];
}

export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isTomorrow(dateStr: string): boolean {
  const date = new Date(dateStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
}

export function isPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getRelativeDeadline(dateStr: string): string {
  const days = daysUntil(dateStr);
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days <= 7) return `Due in ${days} days`;
  return `Due on ${formatDate(dateStr)}`;
}

export function getAttendancePercentage(attended: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((attended / total) * 100);
}

export function calculateProjection(attended: number, total: number, futureClasses: number): number {
  const newTotal = total + futureClasses;
  const newAttended = attended + futureClasses;
  return Math.round((newAttended / newTotal) * 100);
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent': return '#ef4444';
    case 'important': return '#f59e0b';
    case 'normal': return '#22c55e';
    default: return '#6b7280';
  }
}

export function getPriorityEmoji(priority: string): string {
  switch (priority) {
    case 'urgent': return '🔴';
    case 'important': return '🟡';
    case 'normal': return '🟢';
    default: return '⚪';
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'academic': return '#3b82f6';
    case 'exam': return '#ef4444';
    case 'event': return '#8b5cf6';
    case 'general': return '#6b7280';
    case 'urgent': return '#f59e0b';
    default: return '#6b7280';
  }
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen) + '...';
}

export function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function getISODate(date?: Date): string {
  return (date || new Date()).toISOString().split('T')[0];
}
