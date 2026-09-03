// =============================================
// College Copilot — User Profile Service
// Supabase Database interaction with RLS
// =============================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

/**
 * Fetch a user's profile from the Supabase PostgreSQL database
 */
export async function fetchUserProfile(userId: string): Promise<{ data: UserProfile | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching user profile from database:', error.message);
      return { data: null, error };
    }

    return { data: data as UserProfile | null, error: null };
  } catch (err: any) {
    console.error('Unexpected error fetching profile:', err);
    return { data: null, error: err };
  }
}

/**
 * Insert or update a user profile record in the database
 */
export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<{ data: UserProfile | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }

  try {
    const now = new Date().toISOString();
    const payload = {
      ...profile,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error upserting profile in database:', error.message);
      return { data: null, error };
    }

    return { data: data as UserProfile, error: null };
  } catch (err: any) {
    console.error('Unexpected error upserting profile:', err);
    return { data: null, error: err };
  }
}

/**
 * Update specific profile fields in the database
 */
export async function updateUserProfile(userId: string, updates: Partial<Omit<UserProfile, 'id' | 'created_at'>>): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error.message);
      return { error };
    }

    return { error: null };
  } catch (err: any) {
    console.error('Unexpected error updating profile:', err);
    return { error: err };
  }
}
