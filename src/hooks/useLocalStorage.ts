// =============================================
// College Copilot — useLocalStorage Hook
// =============================================

import { useState, useEffect, useCallback } from 'react';
import { getData, setData, KEYS, isFirstLaunch, markInitialized } from '../services/storage';
import { ClassEntry, Assignment, AttendanceRecord, Note, Announcement, FeeEntry, Settings } from '../types';
import {
  sampleClasses, sampleAssignments, sampleAttendance,
  sampleNotes, sampleAnnouncements, sampleFees, sampleSettings
} from '../data/sampleData';

function useStorageState<T>(key: string, fallback: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    const stored = getData<T>(key);
    return stored !== null ? stored : fallback;
  });

  const setValue = useCallback((val: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof val === 'function' ? (val as (prev: T) => T)(prev) : val;
      setData(key, next);
      return next;
    });
  }, [key]);

  return [state, setValue];
}

export function useAppData() {
  // Seed on first launch
  useEffect(() => {
    if (isFirstLaunch()) {
      setData(KEYS.CLASSES, sampleClasses);
      setData(KEYS.ASSIGNMENTS, sampleAssignments);
      setData(KEYS.ATTENDANCE, sampleAttendance);
      setData(KEYS.NOTES, sampleNotes);
      setData(KEYS.ANNOUNCEMENTS, sampleAnnouncements);
      setData(KEYS.FEES, sampleFees);
      setData(KEYS.SETTINGS, sampleSettings);
      markInitialized();
      window.location.reload();
    }
  }, []);

  const [classes, setClasses] = useStorageState<ClassEntry[]>(KEYS.CLASSES, sampleClasses);
  const [assignments, setAssignments] = useStorageState<Assignment[]>(KEYS.ASSIGNMENTS, sampleAssignments);
  const [attendance, setAttendance] = useStorageState<AttendanceRecord[]>(KEYS.ATTENDANCE, sampleAttendance);
  const [notes, setNotes] = useStorageState<Note[]>(KEYS.NOTES, sampleNotes);
  const [announcements, setAnnouncements] = useStorageState<Announcement[]>(KEYS.ANNOUNCEMENTS, sampleAnnouncements);
  const [fees, setFees] = useStorageState<FeeEntry[]>(KEYS.FEES, sampleFees);
  const [settings, setSettings] = useStorageState<Settings>(KEYS.SETTINGS, sampleSettings);

  return {
    classes, setClasses,
    assignments, setAssignments,
    attendance, setAttendance,
    notes, setNotes,
    announcements, setAnnouncements,
    fees, setFees,
    settings, setSettings,
  };
}

export default useStorageState;
