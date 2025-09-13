import { createClient } from '@supabase/supabase-js';

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback client if environment variables are not set
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          due_date: string | null;
          priority: 'low' | 'medium' | 'high';
          category: string;
          status: 'pending' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          due_date?: string | null;
          priority?: 'low' | 'medium' | 'high';
          category?: string;
          status?: 'pending' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          due_date?: string | null;
          priority?: 'low' | 'medium' | 'high';
          category?: string;
          status?: 'pending' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};