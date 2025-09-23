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
  if (req.method === 'HEAD') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using fallback search')
        return handleFallbackSearch(req, res)
      }

      const { markers, error: parseError } = parseMarkers(req.query)

      const client = supabaseAdmin ?? supabase
      if (!client) {
        throw new Error('Supabase client unavailable on the server')
      }

      if (parseError) {
        return res.status(400).json({ success: false, error: parseError })
      }

      if (markers.length < 4) {
        return res
          .status(400)
          .json({ success: false, error: "Incomplete bounds payload" })
      }

      // Calculate bounds from markers
      const minLat = Math.min(...markers.map(m => m.latitude))
      const maxLat = Math.max(...markers.map(m => m.latitude))
      const minLng = Math.min(...markers.map(m => m.longitude))
      const maxLng = Math.max(...markers.map(m => m.longitude))

      const { data: properties, error } = await client
        .from('App-Properties')
        .select('*')
        .gte('latitude', minLat)
        .lte('latitude', maxLat)
        .gte('longitude', minLng)
        .lte('longitude', maxLng)

     if (error) {
       console.error('Error searching properties:', error)
       return res.status(500).json({ success: false, error: error.message })
     }

      const transformedProperties = (properties || []).map(property => {
        const { amount, label } = resolvePrice(property)
        const formattedPrice = amount > 0 ? `$${amount.toLocaleString()}` : '$0'

        return {
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
            lat: Number(property.latitude) || 0,
            lng: Number(property.longitude) || 0,
          },
          amenities: [],
        }
      })

      if (transformedProperties.length === 0) {
        return res.json({
          success: true,
          data: [],
          message: 'No retreats match the current map area. Try panning or zooming out.',
        })
      }

      return res.json({ success: true, data: transformedProperties })
    } catch (error) {
      console.error('Unexpected error:', error)
      return res.status(500).json({ success: false, error: error.message || 'Internal server error' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
}

const parseMarkers = (query) => {
  const rawMarkers = query["data[]"] ?? query.data

  const fromSerialized = (input) => {
    const serialized = Array.isArray(input) ? input : [input]

    try {
      const markers = serialized.map((entry) => {
        const value = typeof entry === "string" ? JSON.parse(entry) : entry
        return {
          latitude: Number(value?.lat),
          longitude: Number(value?.lng),
        }
      })

      if (markers.some((marker) => !Number.isFinite(marker.latitude) || !Number.isFinite(marker.longitude))) {
        return { error: "Invalid bounds payload" }
      }

      return { markers }
    } catch (_err) {
      return { error: "Invalid bounds payload" }
    }
  }

  if (rawMarkers) {
    return fromSerialized(rawMarkers)
  }

  const bracketEntries = Object.entries(query).filter(([key]) => key.startsWith("data["))

  if (bracketEntries.length === 0) {
    return { error: "Missing map bounds payload" }
  }

  const markerMap = {}

  for (const [key, value] of bracketEntries) {
    const match = key.match(/^data\[(\d+)\]\[(lat|lng)\]$/)
    if (!match) {
      continue
    }

    const [, index, coordKey] = match
    const normalizedValue = Array.isArray(value) ? value[0] : value

    if (!markerMap[index]) {
      markerMap[index] = {}
    }

    markerMap[index][coordKey] = Number(normalizedValue)
  }

  const markers = Object.keys(markerMap)
    .map((idx) => Number(idx))
    .sort((a, b) => a - b)
    .map((idx) => ({
      latitude: markerMap[idx]?.lat,
      longitude: markerMap[idx]?.lng,
    }))

  if (
    markers.length === 0 ||
    markers.some(
      (marker) =>
        !Number.isFinite(marker.latitude) || !Number.isFinite(marker.longitude)
    )
  ) {
    return { error: "Invalid bounds payload" }
  }

  return { markers }
}

// Fallback search function using original logic
function handleFallbackSearch(req, res) {
  const { markers, error: parseError } = parseMarkers(req.query)

  if (parseError) {
    return res.status(400).json({ success: false, error: parseError })
  }

  if (markers.length < 4) {
    return res
      .status(400)
      .json({ success: false, error: "Incomplete bounds payload" })
  }

  const calcLocation = (lat, lng) => {
    if (
      +lat < +markers[0].latitude &&
      +lat > +markers[2].latitude &&
      +lng > +markers[0].longitude &&
      +lng < +markers[3].longitude
    ) {
      return true;
    } else {
      return false;
    }
  };

  let result;
  const newP = new Promise((r) => {
    if (true) {
      setTimeout(() => {
        r(
          (result = fallbackData
            .map((post) => {
              const res = calcLocation(
                post.geolocation.lat,
                post.geolocation.lng
              );
              if (res) {
                return post;
              } else {
                return null;
              }
            })
            .filter((e) => e !== null))
        );
      }, Math.floor(Math.random() * 800));
    }
  });
  newP
    .then((response) => res.json({ success: true, data: response }))
    .catch((err) => res.json({ success: false, data: null }));
}
