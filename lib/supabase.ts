import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Property-related functions
export const getProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching properties:', error)
    return []
  }

  return data || []
}

export const getPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching property:', error)
    return null
  }

  return data
}

export const searchProperties = async (filters: {
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  priceRange?: [number, number]
}) => {
  let query = supabase.from('properties').select('*')

  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }

  if (filters.guests) {
    query = query.gte('max_guests', filters.guests)
  }

  if (filters.priceRange) {
    query = query
      .gte('price_per_night', filters.priceRange[0])
      .lte('price_per_night', filters.priceRange[1])
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching properties:', error)
    return []
  }

  return data || []
}
