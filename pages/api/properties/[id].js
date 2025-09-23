import { supabase, isSupabaseConfigured } from '../../../lib/supabase'
import fallbackData from '../../../data.json'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using fallback data')
        const property = fallbackData.find(p => p._id === id)
        if (!property) {
          return res.status(404).json({ success: false, error: 'Property not found' })
        }
        return res.json({ success: true, data: property })
      }

      const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching property:', error)
        return res.status(404).json({ success: false, error: 'Property not found' })
      }

      // Transform the data to match the expected format
      const transformedProperty = {
        _id: property.id,
        title: property.title,
        rating: property.rating?.toString() || '',
        review: `${property.review_count || 0} review${property.review_count !== 1 ? 's' : ''}`,
        lt: property.location,
        images: [{ url: property.image_url || '/images/default_image.png' }], // Use single image for now
        price: `$${property.price}`,
        about: property.about,
        user: null, // Will be populated later when we fix the relationships
        reviews: [], // Will be populated later when we fix the relationships
        geolocation: {
          lat: property.latitude,
          lng: property.longitude
        },
        amenities: [] // Will be populated later when we fix the relationships
      }

      return res.json({ success: true, data: transformedProperty })
    } catch (error) {
      console.error('Unexpected error:', error)
      return res.status(500).json({ success: false, error: 'Internal server error' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
