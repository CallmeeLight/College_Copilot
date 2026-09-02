// =============================================
// College Copilot — localStorage Persistence
// =============================================

const STORAGE_PREFIX = 'college-copilot-';

export function getData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function removeData(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

export function isFirstLaunch(): boolean {
  return !localStorage.getItem(STORAGE_PREFIX + 'initialized');
}

export function markInitialized(): void {
  localStorage.setItem(STORAGE_PREFIX + 'initialized', 'true');
}

export function clearAllData(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
}

// Storage keys
export const KEYS = {
  CLASSES: 'classes',
  ASSIGNMENTS: 'assignments',
  ATTENDANCE: 'attendance',
  NOTES: 'notes',
  ANNOUNCEMENTS: 'announcements',
  FEES: 'fees',
  SETTINGS: 'settings',
  CHAT_HISTORY: 'chat-history',
} as const;
