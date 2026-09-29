// src/context/AuthContext.tsx — Robust Auth Context with Supabase Auth & Session Persistence
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { calculateTrustScore } from '../lib/trust';
import type { AuthUser, UserProfile } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_SESSION_KEY = 'borrowbuddy_auth_session_v2';

function isUniversityEmail(email: string): boolean {
  return /(@.*\.edu|@.*\.ac\.[a-z]{2}|@.*uni.*|@.*campus.*|@.*student.*)/i.test(email);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  // Load user profile from Supabase profiles table
  const fetchProfile = useCallback(async (userId: string, email: string, fallbackName?: string): Promise<AuthUser> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const profile = data as UserProfile;
        const computedScore = calculateTrustScore(profile);
        return {
          id: profile.id,
          name: profile.name,
          email: profile.university_email || email,
          trustScore: profile.trust_score || computedScore,
          verified: profile.verified_email,
          course: profile.course,
          avatarColor: profile.avatar_color || '#4338CA',
        };
      }
    } catch (e) {
      console.warn('Failed to fetch profile from Supabase:', e);
    }

    const verified = isUniversityEmail(email);
    return {
      id: userId,
      name: fallbackName || email.split('@')[0],
      email,
      trustScore: verified ? 90 : 85,
      verified,
      course: 'Student Member',
      avatarColor: '#4338CA',
    };
  }, []);

  // Initialize session and listen to auth changes
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            const profile = await fetchProfile(
              session.user.id,
              session.user.email || '',
              session.user.user_metadata?.name,
            );
            if (mounted) setUser(profile);
          }
        } catch (err) {
          console.warn('Error checking Supabase session:', err);
        }
      } else {
        // Fallback local session
        try {
          const saved = localStorage.getItem(STORAGE_SESSION_KEY);
          if (saved && mounted) {
            setUser(JSON.parse(saved));
          }
        } catch {}
      }

      if (mounted) setIsLoading(false);
    }

    initAuth();

    // Supabase Auth listener
    let subscription: any = null;
    if (isConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.name,
          );
          if (mounted) setUser(profile);
        } else if (event === 'SIGNED_OUT') {
          if (mounted) setUser(null);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [isConfigured, fetchProfile]);

  // Login handler
  const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);

    if (isConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          const profile = await fetchProfile(
            data.user.id,
            data.user.email || email,
            data.user.user_metadata?.name,
          );
          setUser(profile);
          setIsLoading(false);
          return {};
        }
      } catch (err: any) {
        setIsLoading(false);
        return { error: err?.message || 'Login failed' };
      }
    }

    // Demo/offline mode login
    await new Promise((r) => setTimeout(r, 600));
    const verified = isUniversityEmail(email);
    const mockUser: AuthUser = {
      id: '00000000-0000-0000-0000-000000000001',
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim() || 'Sofia Mensah',
      email,
      trustScore: verified ? 92 : 85,
      verified,
      course: 'Student Member',
      avatarColor: '#4338CA',
    };

    setUser(mockUser);
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(mockUser));
    } catch {}
    setIsLoading(false);
    return {};
  }, [isConfigured, fetchProfile]);

  // Signup handler
  const signup = useCallback(async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);

    if (isConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          // If auto sign-in is enabled or user returned
          const profile = await fetchProfile(data.user.id, email, name);
          setUser(profile);
          setIsLoading(false);
          return {};
        }
      } catch (err: any) {
        setIsLoading(false);
        return { error: err?.message || 'Sign up failed' };
      }
    }

    // Demo/offline mode signup
    await new Promise((r) => setTimeout(r, 750));
    const verified = isUniversityEmail(email);
    const newUserId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`;
    const newUser: AuthUser = {
      id: newUserId,
      name: name.trim(),
      email: email.trim(),
      trustScore: verified ? 90 : 85,
      verified,
      course: 'New Member',
      avatarColor: '#4338CA',
    };

    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newUser));
    } catch {}
    setIsLoading(false);
    return {};
  }, [isConfigured, fetchProfile]);

  // Logout handler
  const logout = useCallback(async () => {
    setIsLoading(true);
    if (isConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase logout error:', e);
      }
    }
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {}
    setIsLoading(false);
  }, [isConfigured]);

  // Reset password
  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    if (isConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (error) {
          return { success: false, message: error.message };
        }
        return { success: true, message: 'Password reset link sent to your email.' };
      } catch (e: any) {
        return { success: false, message: e?.message || 'Failed to send reset link.' };
      }
    }
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, message: 'Password reset email simulated for ' + email };
  }, [isConfigured]);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const updated = await fetchProfile(user.id, user.email, user.name);
    setUser(updated);
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isConfigured,
        login,
        signup,
        logout,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
