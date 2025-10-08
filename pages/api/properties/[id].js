import axios from 'axios'
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

const parseAmount = (value) => {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.]/g, '')
    const numeric = Number(cleaned)
    return Number.isFinite(numeric) ? numeric : null
  }
  return null
}

const resolvePrice = (property) => {
  const nightly = parseAmount(property.nightly_rate)
  if (nightly) return { amount: nightly, label: 'per night' }

  const weekly = parseAmount(property.weekly_rate)
  if (weekly) return { amount: weekly, label: 'per week' }

  const monthly = parseAmount(property.monthly_rate)
  if (monthly) return { amount: monthly, label: 'per month' }

  const starting = parseAmount(property.price_starts_at)
  if (starting) return { amount: starting, label: 'starting rate' }

  const generic = parseAmount(property.price)
  if (generic) return { amount: generic, label: 'starting rate' }

  return { amount: 0, label: 'per stay' }
}

const isValidCoordinate = (value) => Number.isFinite(value) && Math.abs(value) > 0.000001

const buildAddressQuery = (property) => {
  const parts = [
    property.street_address,
    property.city,
    property.state,
    property.postal_code,
    property.country || 'United States',
  ]

  const formatted = parts
    .filter((segment) => typeof segment === 'string' && segment.trim())
    .join(', ')

  return formatted || null
}

const coordinateCache = new Map()

const geocodeCoordinates = async (property) => {
  const address = buildAddressQuery(property)
  if (!address) return null

  if (coordinateCache.has(address)) {
    return coordinateCache.get(address)
  }

  try {
    const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        format: 'json',
        limit: 1,
        q: address,
      },
      headers: {
        'User-Agent': 'EasyStayRetreats/1.0 (support@easystayretreats.com)',
        'Accept-Language': 'en',
      },
    })

    if (Array.isArray(data) && data.length > 0) {
      const [match] = data
      const parsedLat = Number(match?.lat)
      const parsedLng = Number(match?.lon ?? match?.lng)

      if (isValidCoordinate(parsedLat) && isValidCoordinate(parsedLng)) {
        const resolved = { lat: parsedLat, lng: parsedLng }
        coordinateCache.set(address, resolved)
        return resolved
      }
    }
  } catch (error) {
    console.warn('Failed to geocode property address', {
      address,
      error: error?.message,
    })
  }

  return null
}

const ensureCoordinates = async (property, client) => {
  const currentLat = Number(property.latitude)
  const currentLng = Number(property.longitude)

  if (isValidCoordinate(currentLat) && isValidCoordinate(currentLng)) {
    return { lat: currentLat, lng: currentLng, updated: false }
  }

  const geocoded = await geocodeCoordinates(property)

  if (geocoded && client && property.id) {
    try {
      await client
        .from('App-Properties')
        .update({ latitude: geocoded.lat, longitude: geocoded.lng })
        .eq('id', property.id)
    } catch (error) {
      console.warn('Failed to persist geocoded coordinates', {
        propertyId: property.id,
        error: error?.message,
      })
    }
  }

  return {
    lat: geocoded?.lat ?? currentLat ?? 0,
    lng: geocoded?.lng ?? currentLng ?? 0,
    updated: Boolean(geocoded),
  }
}

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

      const client = supabaseAdmin ?? supabase
      if (!client) {
        console.error('Supabase client unavailable on the server')
        return res.status(500).json({ success: false, error: 'Supabase client unavailable' })
      }

      const { data: property, error } = await client
        .from('App-Properties')
        .select('*')
        .eq('whalesync_postgres_id', id)
        .single()

      if (error) {
        console.error('Error fetching property:', error)
        return res.status(404).json({ success: false, error: 'Property not found' })
      }

      // Get pricing data from new pricing tables
      const [pricingConfig, bookingFees] = await Promise.all([
        client
          .from('property_pricing_config')
          .select('base_price, min_price, max_price, currency, pricing_strategy, weekend_multiplier, min_nights')
          .eq('property_id', property.id)
          .single(),
        client
          .from('booking_fees')
          .select('cleaning_fee, service_fee_percent, pet_fee, extra_guest_fee, extra_guest_threshold')
          .eq('property_id', property.id)
          .single()
      ])

      // Transform the data to match the expected format
      const { amount, label } = resolvePrice(property)
      const formattedPrice = amount > 0 ? `$${amount.toLocaleString()}` : '$0'
      const { lat, lng } = await ensureCoordinates(property, client)

      const transformedProperty = {
        _id: property.whalesync_postgres_id || property.id,
        title: property.name || 'Untitled Property',
        rating: property.property_rating ? property.property_rating.toString() : '4.5',
        review: `${property.total_reviews || 0} review${property.total_reviews === 1 ? '' : 's'}`,
        lt: [property.city, property.state].filter(Boolean).join(', ') || property.street_address,
        images: buildImages(property),
        price: formattedPrice,
        priceLabel: label,
        priceValue: amount,
        slug: property.slug || null,
        about: property.body_description,
        user: null,
        reviews: [],
        geolocation: {
          lat,
          lng,
        },
        amenities: [],
        // Enhanced pricing data
        pricing: {
          basePrice: pricingConfig?.data?.base_price || amount,
          minPrice: pricingConfig?.data?.min_price || null,
          maxPrice: pricingConfig?.data?.max_price || null,
          currency: pricingConfig?.data?.currency || 'USD',
          strategy: pricingConfig?.data?.pricing_strategy || 'static',
          weekendMultiplier: pricingConfig?.data?.weekend_multiplier || 1.0,
          minNights: pricingConfig?.data?.min_nights || 1
        },
        fees: {
          cleaning: bookingFees?.data?.cleaning_fee || 0,
          servicePercent: bookingFees?.data?.service_fee_percent || 0,
          pet: bookingFees?.data?.pet_fee || 0,
          extraGuest: bookingFees?.data?.extra_guest_fee || 0,
          extraGuestThreshold: bookingFees?.data?.extra_guest_threshold || 0
        }
      }

      return res.json({ success: true, data: transformedProperty })
    } catch (error) {
      console.error('Unexpected error:', error)
      return res.status(500).json({ success: false, error: 'Internal server error' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}
