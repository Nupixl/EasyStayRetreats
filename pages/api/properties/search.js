import { supabase, isSupabaseConfigured } from '../../../lib/supabase'
import fallbackData from '../../../data.json'

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

      if (!supabase) {
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

      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .gte('latitude', minLat)
        .lte('latitude', maxLat)
        .gte('longitude', minLng)
        .lte('longitude', maxLng)

      if (error) {
        console.error('Error searching properties:', error)
        return res.status(500).json({ success: false, error: error.message })
      }

      // Transform the data to match the expected format
      const transformedProperties = (properties || []).map(property => ({
        _id: property.id,
        title: property.title,
        rating: property.rating?.toString() || '',
        review: `${property.review_count || 0} review${property.review_count !== 1 ? 's' : ''}`,
        lt: property.location,
        images: [{ url: property.image_url || '/images/default_image.png' }],
        price: `$${property.price}`,
        about: property.about,
        user: null,
        reviews: [],
        geolocation: {
          lat: property.latitude,
          lng: property.longitude,
        },
        amenities: [],
      }))

      // Add artificial delay to match original behavior
      const delay = Math.floor(Math.random() * 800)
      setTimeout(() => {
        res.json({ success: true, data: transformedProperties })
      }, delay)
      
      return // Important: return here to prevent further execution
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
