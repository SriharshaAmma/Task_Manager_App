import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not configured, set loading to false
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase!.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') as AuthError };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') as AuthError };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') as AuthError };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isSupabaseConfigured: !!supabase
  };
}