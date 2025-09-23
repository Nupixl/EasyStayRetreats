import { supabaseAdmin, supabase, isSupabaseConfigured } from '../../../lib/supabase'
import fallbackData from '../../../data.json'

const buildImages = (property) => {
  const sources = [
    property.card_image,
    property.hero_slider_image_first,
    property.hero_slider_image_second,
    property.hero_slider_image_third,
    property.showcase_featured_image,
    property.showcase_images_4,
  ]

  const images = []
  const seen = new Set()
  for (const url of sources) {
    if (!url || typeof url !== 'string') continue
    const trimmed = url.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    images.push({ url: trimmed })
  }

  if (images.length === 0) {
    images.push({ url: '/images/default_image.png' })
  }

  return images
}

const resolvePrice = (property) => {
  if (property.nightly_rate) {
    return { amount: Number(property.nightly_rate), label: 'per night' }
  }
  if (property.weekly_rate) {
    return { amount: Number(property.weekly_rate), label: 'per week' }
  }
  if (property.monthly_rate) {
    return { amount: Number(property.monthly_rate), label: 'per month' }
  }
  if (property.price_starts_at) {
    return { amount: Number(property.price_starts_at), label: 'starting rate' }
  }
  if (property.price) {
    return { amount: Number(property.price), label: 'starting rate' }
  }

  return { amount: 0, label: 'per stay' }
}

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

      const client = supabaseAdmin ?? supabase
      if (!client) {
        console.error('Supabase client unavailable on the server')
        return res.status(500).json({ success: false, error: 'Supabase client unavailable' })
      }
      const { data: properties, error } = await client
        .from('App-Properties')
        .select('*')
        .eq('webflow_status', 'Active')
        .order('created', { ascending: false })

      if (error) {
        console.error('Error fetching properties:', error)
        return res.status(500).json({ success: false, error: error.message })
      }

      // Transform the data to match the expected format
      const transformedProperties = (properties || []).map(property => {
        const { amount, label } = resolvePrice(property)
        const formattedPrice = amount > 0 ? `$${amount.toLocaleString()}` : '$0'

        return {
          _id: property.whalesync_postgres_id || property.id,
          title: property.name || 'Untitled Property',
          rating: property.property_rating ? property.property_rating.toString() : '4.5',
          review: `${property.total_reviews || 0} review${property.total_reviews === 1 ? '' : 's'}`,
          lt: [property.city, property.state].filter(Boolean).join(', ') || property.street_address || 'United States',
          images: buildImages(property),
          price: formattedPrice,
          priceLabel: label,
          priceValue: amount,
          slug: property.slug || null,
          about: property.body_description,
          user: null,
          reviews: [],
          geolocation: {
            lat: Number(property.latitude) || 0,
            lng: Number(property.longitude) || 0,
          },
          amenities: [],
        }
      })

      return res.json({ success: true, data: transformedProperties })
    } catch (error) {
      console.error('Unexpected error:', error)
      return res.status(500).json({ success: false, error: 'Internal server error' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
