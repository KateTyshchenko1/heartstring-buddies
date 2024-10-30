import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://tjwmfsfafrjsdwixutdd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqd21mc2ZhZnJqc2R3aXh1dGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxNDM5ODksImV4cCI6MjA0NTcxOTk4OX0.bQtuaK3kjHNC5pPppx4AOWa0YJ3E6Cfg1u8Bo3i9hgI";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
});