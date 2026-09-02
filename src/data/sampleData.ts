// =============================================
// College Copilot — Sample / Seed Data
// =============================================

import { ClassEntry, Assignment, AttendanceRecord, Note, Announcement, FeeEntry, Settings, DayOfWeek } from '../types';
import { getDateOffset, generateId } from '../utils/helpers';

// The current day of the week for realistic scheduling
const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const today = new Date();
const todayDay = (['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] as const)[today.getDay()];

export const sampleSettings: Settings = {
  studentName: 'Arjun Sharma',
  collegeName: 'SRM University',
  semester: '1st Semester',
  attendanceThreshold: 75,
  theme: 'dark',
  notifications: true,
};

export const sampleClasses: ClassEntry[] = [
  // Monday
  { id: generateId(), subject: 'Mathematics', professor: 'Dr. Ramesh Gupta', room: 'Room 301', day: 'Monday', startTime: '09:00', endTime: '10:00', color: '#3b82f6' },
  { id: generateId(), subject: 'Physics', professor: 'Dr. Anita Desai', room: 'Lab 102', day: 'Monday', startTime: '10:15', endTime: '11:15', color: '#8b5cf6' },
  { id: generateId(), subject: 'Programming in C', professor: 'Prof. Vikram Singh', room: 'CS Lab 1', day: 'Monday', startTime: '11:30', endTime: '12:30', color: '#06b6d4' },
  { id: generateId(), subject: 'English', professor: 'Dr. Priya Nair', room: 'Room 205', day: 'Monday', startTime: '14:00', endTime: '15:00', color: '#f59e0b' },
  // Tuesday
  { id: generateId(), subject: 'Chemistry', professor: 'Dr. Suresh Kumar', room: 'Lab 201', day: 'Tuesday', startTime: '09:00', endTime: '10:00', color: '#ef4444' },
  { id: generateId(), subject: 'Mathematics', professor: 'Dr. Ramesh Gupta', room: 'Room 301', day: 'Tuesday', startTime: '10:15', endTime: '11:15', color: '#3b82f6' },
  { id: generateId(), subject: 'Electronics', professor: 'Prof. Meera Joshi', room: 'Room 404', day: 'Tuesday', startTime: '11:30', endTime: '12:30', color: '#10b981' },
  { id: generateId(), subject: 'Programming in C', professor: 'Prof. Vikram Singh', room: 'CS Lab 1', day: 'Tuesday', startTime: '14:00', endTime: '15:30', color: '#06b6d4' },
  // Wednesday
  { id: generateId(), subject: 'Physics', professor: 'Dr. Anita Desai', room: 'Room 302', day: 'Wednesday', startTime: '09:00', endTime: '10:00', color: '#8b5cf6' },
  { id: generateId(), subject: 'English', professor: 'Dr. Priya Nair', room: 'Room 205', day: 'Wednesday', startTime: '10:15', endTime: '11:15', color: '#f59e0b' },
  { id: generateId(), subject: 'Mathematics', professor: 'Dr. Ramesh Gupta', room: 'Room 301', day: 'Wednesday', startTime: '11:30', endTime: '12:30', color: '#3b82f6' },
  { id: generateId(), subject: 'Chemistry', professor: 'Dr. Suresh Kumar', room: 'Lab 201', day: 'Wednesday', startTime: '14:00', endTime: '15:00', color: '#ef4444' },
  // Thursday
  { id: generateId(), subject: 'Programming in C', professor: 'Prof. Vikram Singh', room: 'CS Lab 1', day: 'Thursday', startTime: '09:00', endTime: '10:30', color: '#06b6d4' },
  { id: generateId(), subject: 'Electronics', professor: 'Prof. Meera Joshi', room: 'Room 404', day: 'Thursday', startTime: '11:00', endTime: '12:00', color: '#10b981' },
  { id: generateId(), subject: 'Physics', professor: 'Dr. Anita Desai', room: 'Lab 102', day: 'Thursday', startTime: '14:00', endTime: '15:00', color: '#8b5cf6' },
  // Friday
  { id: generateId(), subject: 'Mathematics', professor: 'Dr. Ramesh Gupta', room: 'Room 301', day: 'Friday', startTime: '09:00', endTime: '10:00', color: '#3b82f6' },
  { id: generateId(), subject: 'Chemistry', professor: 'Dr. Suresh Kumar', room: 'Room 303', day: 'Friday', startTime: '10:15', endTime: '11:15', color: '#ef4444' },
  { id: generateId(), subject: 'English', professor: 'Dr. Priya Nair', room: 'Room 205', day: 'Friday', startTime: '11:30', endTime: '12:30', color: '#f59e0b' },
  { id: generateId(), subject: 'Electronics', professor: 'Prof. Meera Joshi', room: 'Lab 301', day: 'Friday', startTime: '14:00', endTime: '15:00', color: '#10b981' },
  // Saturday (short day)
  { id: generateId(), subject: 'Programming in C', professor: 'Prof. Vikram Singh', room: 'CS Lab 1', day: 'Saturday', startTime: '09:00', endTime: '10:30', color: '#06b6d4' },
  { id: generateId(), subject: 'Physics', professor: 'Dr. Anita Desai', room: 'Lab 102', day: 'Saturday', startTime: '11:00', endTime: '12:00', color: '#8b5cf6' },
];

export const sampleAssignments: Assignment[] = [
  {
    id: generateId(), title: 'Linear Algebra Problem Set 3', subject: 'Mathematics',
    description: 'Solve exercises 5.1 to 5.15 from the textbook. Show all working steps for eigenvalue problems.',
    dueDate: getDateOffset(1), priority: 'urgent', status: 'in-progress', createdAt: getDateOffset(-3),
  },
  {
    id: generateId(), title: 'Physics Lab Report — Pendulum Experiment', subject: 'Physics',
    description: 'Write a complete lab report including observations, calculations, graphs, and conclusion for the simple pendulum experiment.',
    dueDate: getDateOffset(2), priority: 'urgent', status: 'pending', createdAt: getDateOffset(-5),
  },
  {
    id: generateId(), title: 'C Programming — Linked List Implementation', subject: 'Programming in C',
    description: 'Implement singly linked list with insert, delete, search, and display operations. Submit .c file and output screenshots.',
    dueDate: getDateOffset(4), priority: 'important', status: 'pending', createdAt: getDateOffset(-2),
  },
  {
    id: generateId(), title: 'English Essay — Impact of Technology', subject: 'English',
    description: 'Write a 1500-word essay on "The Impact of Technology on Modern Education". Include at least 5 references.',
    dueDate: getDateOffset(5), priority: 'important', status: 'pending', createdAt: getDateOffset(-4),
  },
  {
    id: generateId(), title: 'Chemistry Worksheet — Organic Reactions', subject: 'Chemistry',
    description: 'Complete the worksheet on organic reaction mechanisms. Draw all reaction pathways and name the products.',
    dueDate: getDateOffset(7), priority: 'normal', status: 'pending', createdAt: getDateOffset(-1),
  },
  {
    id: generateId(), title: 'Electronics Circuit Diagram', subject: 'Electronics',
    description: 'Design and draw the circuit diagram for a half-adder using logic gates. Include truth table.',
    dueDate: getDateOffset(6), priority: 'normal', status: 'pending', createdAt: getDateOffset(-2),
  },
  {
    id: generateId(), title: 'Mathematics Tutorial Sheet 2', subject: 'Mathematics',
    description: 'Complete all problems from Tutorial Sheet 2 on differential equations.',
    dueDate: getDateOffset(-1), priority: 'urgent', status: 'completed', createdAt: getDateOffset(-7),
  },
  {
    id: generateId(), title: 'Physics Numerical Problems', subject: 'Physics',
    description: 'Solve numerical problems from Chapter 4 — Rotational Mechanics.',
    dueDate: getDateOffset(10), priority: 'normal', status: 'pending', createdAt: getDateOffset(-1),
  },
];

export const sampleAttendance: AttendanceRecord[] = [
  { id: generateId(), subject: 'Mathematics', totalClasses: 22, attendedClasses: 18, color: '#3b82f6' },
  { id: generateId(), subject: 'Physics', totalClasses: 20, attendedClasses: 14, color: '#8b5cf6' },
  { id: generateId(), subject: 'Programming in C', totalClasses: 18, attendedClasses: 17, color: '#06b6d4' },
  { id: generateId(), subject: 'Chemistry', totalClasses: 16, attendedClasses: 13, color: '#ef4444' },
  { id: generateId(), subject: 'English', totalClasses: 14, attendedClasses: 12, color: '#f59e0b' },
  { id: generateId(), subject: 'Electronics', totalClasses: 15, attendedClasses: 12, color: '#10b981' },
];

export const sampleNotes: Note[] = [
  {
    id: generateId(), title: 'Eigenvalues & Eigenvectors — Key Formulas', subject: 'Mathematics', pinned: true,
    content: '## Key Formulas\n\n- **Characteristic Equation**: det(A - λI) = 0\n- **Eigenvalue**: λ (scalar)\n- **Eigenvector**: v such that Av = λv\n\n### Steps:\n1. Find det(A - λI) = 0\n2. Solve for λ\n3. For each λ, solve (A - λI)v = 0\n\n> Important: Eigenvectors are not unique — any scalar multiple works.',
    createdAt: getDateOffset(-5), updatedAt: getDateOffset(-1),
  },
  {
    id: generateId(), title: 'Simple Pendulum Lab Notes', subject: 'Physics', pinned: false,
    content: '## Experiment: Simple Pendulum\n\n**Aim**: To determine g using simple pendulum\n\n**Formula**: T = 2π√(l/g)\n\n**Observations**:\n- Length: 50cm, 70cm, 90cm, 100cm\n- Take 20 oscillations each\n- Calculate T for each\n\n**Result**: g ≈ 9.8 m/s²',
    createdAt: getDateOffset(-3), updatedAt: getDateOffset(-3),
  },
  {
    id: generateId(), title: 'Linked List — Pseudocode', subject: 'Programming in C', pinned: true,
    content: '## Singly Linked List Operations\n\n### Insert at beginning:\n```\nnewNode->data = value\nnewNode->next = head\nhead = newNode\n```\n\n### Delete node:\n```\ntemp = head\nwhile temp->next->data != key\n  temp = temp->next\ntemp->next = temp->next->next\n```\n\n### Traverse:\n```\nwhile temp != NULL\n  print temp->data\n  temp = temp->next\n```',
    createdAt: getDateOffset(-2), updatedAt: getDateOffset(-1),
  },
  {
    id: generateId(), title: 'Organic Chemistry — Reaction Types', subject: 'Chemistry', pinned: false,
    content: '## Major Reaction Types\n\n1. **Substitution** — One group replaces another\n2. **Addition** — Two molecules combine\n3. **Elimination** — Small molecule removed\n4. **Rearrangement** — Molecular structure changes\n\n### SN1 vs SN2:\n- SN1: Two steps, carbocation intermediate\n- SN2: One step, backside attack',
    createdAt: getDateOffset(-4), updatedAt: getDateOffset(-4),
  },
];

export const sampleAnnouncements: Announcement[] = [
  {
    id: generateId(), title: 'Mid-Semester Exam Schedule Released', description: 'The mid-semester examination schedule has been published. Mathematics on Sept 15, Physics on Sept 17, Programming on Sept 19. Check the exam portal for detailed timetable.',
    date: getDateOffset(0), category: 'exam', read: false,
  },
  {
    id: generateId(), title: 'Hackathon 2026 — Register Now!', description: 'Annual college hackathon is scheduled for September 20-21. Teams of 1-4 members. Register on the college portal by September 10. Exciting prizes worth ₹50,000!',
    date: getDateOffset(-1), category: 'event', read: false,
  },
  {
    id: generateId(), title: 'Physics Lab Rescheduled', description: 'Thursday\'s Physics lab session has been rescheduled to Saturday 11:00 AM due to equipment maintenance. All students must attend.',
    date: getDateOffset(-1), category: 'academic', read: true,
  },
  {
    id: generateId(), title: 'Library Hours Extended', description: 'The central library will remain open until 10:00 PM during the exam preparation period (September 8-25). Digital library access remains 24/7.',
    date: getDateOffset(-2), category: 'general', read: true,
  },
  {
    id: generateId(), title: 'Submit Scholarship Applications', description: 'Last date to submit merit scholarship applications is September 12. Required documents: marksheets, income certificate, Aadhaar. Submit at Room 101, Admin Block.',
    date: getDateOffset(-3), category: 'urgent', read: false,
  },
  {
    id: generateId(), title: 'Programming Contest — CodeWars', description: 'Department of Computer Science is organizing CodeWars — a competitive programming contest on September 14. Individual participation. Register with your class representative.',
    date: getDateOffset(-2), category: 'event', read: true,
  },
];

export const sampleFees: FeeEntry[] = [
  { id: generateId(), feeType: 'Tuition Fee — Semester 1', amount: 125000, dueDate: getDateOffset(12), status: 'unpaid' },
  { id: generateId(), feeType: 'Hostel Fee', amount: 45000, dueDate: getDateOffset(12), status: 'unpaid' },
  { id: generateId(), feeType: 'Lab Fee', amount: 8000, dueDate: getDateOffset(-5), status: 'paid' },
  { id: generateId(), feeType: 'Library Fee', amount: 2000, dueDate: getDateOffset(-10), status: 'paid' },
  { id: generateId(), feeType: 'Exam Fee — Mid Semester', amount: 3500, dueDate: getDateOffset(5), status: 'unpaid' },
];
