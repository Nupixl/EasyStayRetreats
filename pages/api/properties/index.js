import { supabase, isSupabaseConfigured } from '../../../lib/supabase'
import fallbackData from '../../../data.json'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using fallback data')
        const time = Math.floor(Math.random() * 1000);
        setTimeout(() => {
          return res.json({ success: true, data: fallbackData });
        }, time);
        return;
      }

      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching properties:', error)
        return res.status(500).json({ success: false, error: error.message })
      }

      // Transform the data to match the expected format
      const transformedProperties = (properties || []).map(property => ({
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
      }))

      return res.json({ success: true, data: transformedProperties })
    } catch (error) {
      console.error('Unexpected error:', error)
      return res.status(500).json({ success: false, error: 'Internal server error' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
