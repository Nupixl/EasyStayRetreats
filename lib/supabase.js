import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

// Only create clients if environment variables are present
let supabase = null
let supabaseAdmin = null

if (supabaseUrl && supabaseAnonKey) {
  const options = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'easystay-retreats@1.0.0',
      },
    },
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, options)

  // For server-side operations requiring elevated permissions
  supabaseAdmin = supabaseServiceRole
    ? createClient(supabaseUrl, supabaseServiceRole, options)
    : supabase
}

// For API routes, use the admin client to bypass RLS issues
export { supabase, supabaseAdmin }

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Test Supabase connection
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    const client = supabaseAdmin ?? supabase
    if (!client) {
      return { success: false, error: 'Supabase client not available' }
    }

    const { data, error } = await client
      .from('App-Properties')
      .select('id')
      .limit(1)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
