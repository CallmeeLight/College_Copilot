// =============================================
// College Copilot — Supabase Authentication Context
// Step 1: Secure Auth & User Profile Management
// =============================================

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getData, setData, KEYS } from '../services/storage';
import { Settings, UserProfile } from '../types';
import { fetchUserProfile, upsertUserProfile } from '../services/profileService';

interface SignUpMetadata {
  fullName: string;
  collegeName: string;
  semester: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<{ error: AuthError | Error | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | Error | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  demoLogin: (customName?: string, customCollege?: string, customSemester?: string) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile to app settings
  const syncSettings = (name?: string, college?: string, sem?: string) => {
    try {
      const currentSettings = getData<Settings>(KEYS.SETTINGS);
      if (currentSettings) {
        const updated: Settings = {
          ...currentSettings,
          studentName: name || currentSettings.studentName,
          collegeName: college || currentSettings.collegeName,
          semester: sem || currentSettings.semester,
        };
        setData(KEYS.SETTINGS, updated);
      }
    } catch (e) {
      console.error('Failed to sync settings with auth metadata', e);
    }
  };

  // Load profile from database and sync to state
  const loadProfile = async (currentUser: User) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data: dbProfile } = await fetchUserProfile(currentUser.id);
      if (dbProfile) {
        setProfile(dbProfile);
        syncSettings(dbProfile.full_name, dbProfile.college_name, dbProfile.semester);
      } else if (currentUser.user_metadata) {
        // Create or sync profile record if not found in database yet
        const meta = currentUser.user_metadata;
        const newProfile: UserProfile = {
          id: currentUser.id,
          full_name: meta.full_name || currentUser.email?.split('@')[0] || 'Student',
          email: currentUser.email || '',
          college_name: meta.college_name || 'University',
          semester: meta.semester || '1st Semester',
          created_at: currentUser.created_at || new Date().toISOString(),
        };
        await upsertUserProfile(newProfile);
        setProfile(newProfile);
        syncSettings(newProfile.full_name, newProfile.college_name, newProfile.semester);
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check if there was a saved demo user session in storage
      const savedDemoUser = localStorage.getItem('college-copilot-demo-auth');
      if (savedDemoUser) {
        try {
          const parsed = JSON.parse(savedDemoUser);
          setUser(parsed);
          setProfile({
            id: parsed.id,
            full_name: parsed.user_metadata?.full_name || 'Arjun Sharma',
            email: parsed.email || 'arjun@srm.edu.in',
            college_name: parsed.user_metadata?.college_name || 'SRM University',
            semester: parsed.user_metadata?.semester || '1st Semester',
            created_at: parsed.created_at || new Date().toISOString(),
          });
        } catch {
          // ignore
        }
      }
      setLoading(false);
      return;
    }

    // 1. Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user);
      }
      setLoading(false);
    }).catch(err => {
      console.warn('Error fetching Supabase session:', err);
      setLoading(false);
    });

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Offline / unconfigured demo fallback
      const demoUserObj = {
        id: 'demo-user-id',
        email,
        user_metadata: {
          full_name: email.split('@')[0].replace('.', ' '),
          college_name: 'SRM Institute of Science and Technology',
          semester: '1st Semester',
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const demoProfile: UserProfile = {
        id: demoUserObj.id,
        full_name: demoUserObj.user_metadata.full_name,
        email: demoUserObj.email!,
        college_name: demoUserObj.user_metadata.college_name,
        semester: demoUserObj.user_metadata.semester,
        created_at: demoUserObj.created_at,
      };

      localStorage.setItem('college-copilot-demo-auth', JSON.stringify(demoUserObj));
      setUser(demoUserObj);
      setProfile(demoProfile);
      syncSettings(demoProfile.full_name, demoProfile.college_name, demoProfile.semester);
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error };

      if (data.user) {
        setUser(data.user);
        await loadProfile(data.user);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, metadata: SignUpMetadata) => {
    if (!isSupabaseConfigured) {
      // Offline / unconfigured demo fallback
      const demoUserObj = {
        id: 'demo-user-' + Date.now(),
        email,
        user_metadata: {
          full_name: metadata.fullName,
          college_name: metadata.collegeName,
          semester: metadata.semester,
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const demoProfile: UserProfile = {
        id: demoUserObj.id,
        full_name: metadata.fullName,
        email,
        college_name: metadata.collegeName,
        semester: metadata.semester,
        created_at: demoUserObj.created_at,
      };

      localStorage.setItem('college-copilot-demo-auth', JSON.stringify(demoUserObj));
      setUser(demoUserObj);
      setProfile(demoProfile);
      syncSettings(metadata.fullName, metadata.collegeName, metadata.semester);
      return { error: null };
    }

    try {
      // 1. Create auth user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName,
            college_name: metadata.collegeName,
            semester: metadata.semester,
          },
        },
      });

      if (error) return { error };

      // 2. Insert profile record in database
      if (data.user) {
        setUser(data.user);
        const newProfile: UserProfile = {
          id: data.user.id,
          full_name: metadata.fullName,
          email: data.user.email || email,
          college_name: metadata.collegeName,
          semester: metadata.semester,
          created_at: data.user.created_at || new Date().toISOString(),
        };

        await upsertUserProfile(newProfile);
        setProfile(newProfile);
        syncSettings(metadata.fullName, metadata.collegeName, metadata.semester);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      demoLogin('Google Student', 'SRM Institute of Science and Technology', '1st Semester');
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('college-copilot-demo-auth');
    setUser(null);
    setProfile(null);
    setSession(null);
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error during signOut:', err);
      }
    }
  };

  const demoLogin = (name = 'Arjun Sharma', college = 'SRM University', sem = '1st Semester') => {
    const demoUserObj = {
      id: 'demo-student',
      email: 'arjun.sharma@srm.edu.in',
      user_metadata: {
        full_name: name,
        college_name: college,
        semester: sem,
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;

    const demoProfile: UserProfile = {
      id: demoUserObj.id,
      full_name: name,
      email: demoUserObj.email!,
      college_name: college,
      semester: sem,
      created_at: demoUserObj.created_at,
    };

    localStorage.setItem('college-copilot-demo-auth', JSON.stringify(demoUserObj));
    setUser(demoUserObj);
    setProfile(demoProfile);
    syncSettings(name, college, sem);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        signOut,
        demoLogin,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
