import { createClient } from '@supabase/supabase-js'

// Single shared Supabase client instance for the whole app.
// IMPORTANT: this file is the ONLY place Supabase should be
// initialized. Components must never import this directly —
// go through src/services/*.js instead.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
