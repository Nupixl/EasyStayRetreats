import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

// Only create clients if environment variables are present
let supabase = null
let supabaseAdmin = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)

  // For server-side operations requiring elevated permissions
  supabaseAdmin = supabaseServiceRole
    ? createClient(supabaseUrl, supabaseServiceRole)
    : supabase
}

// For API routes, use the admin client to bypass RLS issues
export { supabase, supabaseAdmin }

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}
