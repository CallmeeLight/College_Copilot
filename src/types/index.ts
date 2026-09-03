// =============================================
// College Copilot — Type Definitions
// =============================================

export interface ClassEntry {
  id: string;
  subject: string;
  professor: string;
  room: string;
  day: DayOfWeek;
  startTime: string; // HH:MM format
  endTime: string;
  color: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string; // ISO date string
  priority: Priority;
  status: AssignmentStatus;
  createdAt: string;
}

export type Priority = 'urgent' | 'important' | 'normal';
export type AssignmentStatus = 'pending' | 'in-progress' | 'completed';

export interface AttendanceRecord {
  id: string;
  subject: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: AnnouncementCategory;
  read: boolean;
}

export type AnnouncementCategory = 'academic' | 'exam' | 'event' | 'general' | 'urgent';

export interface FeeEntry {
  id: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: FeeStatus;
}

export type FeeStatus = 'paid' | 'unpaid' | 'overdue';

export interface Settings {
  studentName: string;
  collegeName: string;
  semester: string;
  attendanceThreshold: number;
  theme: 'dark' | 'light';
  notifications: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'class' | 'assignment' | 'exam' | 'fee' | 'deadline';
  color: string;
  details?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  college_name: string;
  semester: string;
  created_at: string;
  updated_at?: string;
}
