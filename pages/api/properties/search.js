import axios from 'axios'
import { supabaseAdmin, supabase, isSupabaseConfigured } from '../../../lib/supabase'
import { asyncHandler, withTimeout, withRetry } from '../../../lib/errorHandler'
import DebugLogger, { generateCorrelationId } from '../../../lib/debugLogger'
import { supabaseCircuitBreaker } from '../../../lib/circuitBreaker'
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

const toTitleCase = (value = '') =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

const resolveAvailability = (property) => {
  const raw =
    property.availability_status ??
    property.availabilityStatus ??
    property.availability ??
    property.status ??
    null

  let normalized = null

  if (typeof raw === 'string') {
    normalized = raw.trim().toLowerCase()
  } else if (typeof raw === 'boolean') {
    normalized = raw ? 'available' : 'unavailable'
  }

  if (!normalized) {
    normalized = 'available'
  }

  return {
    normalized,
    label: toTitleCase(normalized),
  }
}

const transformPropertyShape = (property, availabilityDefaults = 'available') => {
  const base = property ?? {}
  const hasAvailabilityField =
    base.availability_status !== undefined ||
    base.availabilityStatus !== undefined ||
    base.availability !== undefined ||
    base.status !== undefined

  const availabilitySource = hasAvailabilityField
    ? base
    : { ...base, availability: availabilityDefaults }

  const { normalized: availabilityNormalized, label: availabilityStatus } =
    resolveAvailability(availabilitySource)
  const capacity = Number(
    base.person_capacity ??
      base.personCapacity ??
      base.guests ??
      base.max_guests ??
      base.capacity
  )

  return {
    ...base,
    availabilityStatus: base.availabilityStatus || availabilityStatus,
    availabilityNormalized: base.availabilityNormalized || availabilityNormalized,
    isAvailable:
      base.isAvailable ??
      (availabilityNormalized ? availabilityNormalized === 'available' : true),
    personCapacity: Number.isFinite(capacity) ? capacity : base.personCapacity ?? null,
  }
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

const parseMarkers = (query) => {
  const rawMarkers = query['data[]'] ?? query.data

  const normalise = (input) => {
    const serialized = Array.isArray(input) ? input : [input]

    try {
      const markers = serialized.map(entry => {
        const value = typeof entry === 'string' ? JSON.parse(entry) : entry
        return {
          latitude: Number(value?.lat),
          longitude: Number(value?.lng),
        }
      })

      if (markers.some(marker => !Number.isFinite(marker.latitude) || !Number.isFinite(marker.longitude))) {
        return { error: 'Invalid bounds payload' }
      }

      return { markers }
    } catch (_err) {
      return { error: 'Invalid bounds payload' }
    }
  }

  if (rawMarkers) return normalise(rawMarkers)

  const bracketEntries = Object.entries(query).filter(([key]) => key.startsWith('data['))
  if (bracketEntries.length === 0) {
    return { error: 'Missing map bounds payload' }
  }

  const markerMap = {}
  for (const [key, value] of bracketEntries) {
    const match = key.match(/^data\[(\d+)\]\[(lat|lng)\]$/)
    if (!match) continue

    const [, index, coordKey] = match
    const normalisedValue = Array.isArray(value) ? value[0] : value

    if (!markerMap[index]) markerMap[index] = {}
    markerMap[index][coordKey] = Number(normalisedValue)
  }

  const markers = Object.keys(markerMap)
    .map(idx => Number(idx))
    .sort((a, b) => a - b)
    .map(idx => ({
      latitude: markerMap[idx]?.lat,
      longitude: markerMap[idx]?.lng,
    }))

  if (
    markers.length === 0 ||
    markers.some(marker => !Number.isFinite(marker.latitude) || !Number.isFinite(marker.longitude))
  ) {
    return { error: 'Invalid bounds payload' }
  }

  return { markers }
}

const handleFallbackSearch = (req, res) => {
  const logger = new DebugLogger('fallback-search');
  logger.warn('Using fallback search data');
  
  const { markers, error: parseError } = parseMarkers(req.query)

  if (parseError) {
    logger.warn('Invalid markers in fallback search', { parseError });
    return res.status(400).json({ success: false, error: parseError })
  }

  if (markers.length < 4) {
    logger.warn('Incomplete bounds in fallback search', { markerCount: markers.length });
    return res
      .status(400)
      .json({ success: false, error: 'Incomplete bounds payload' })
  }

  const calcLocation = (lat, lng) => {
    return (
      +lat < +markers[0].latitude &&
      +lat > +markers[2].latitude &&
      +lng > +markers[0].longitude &&
      +lng < +markers[3].longitude
    )
  }

  const results = fallbackData
    .map(post => {
      const within = calcLocation(post.geolocation.lat, post.geolocation.lng)
      return within ? post : null
    })
    .filter(Boolean)

  const transformed = results.map((property) =>
    transformPropertyShape(property, 'available')
  )

  logger.info('Fallback search completed', {
    resultCount: transformed.length,
    totalFallbackData: fallbackData.length
  });

  return res.json({ success: true, data: transformed })
}

async function handler(req, res) {
  // Initialize debugging
  const correlationId = generateCorrelationId();
  const logger = new DebugLogger('properties-search-api');
  logger.setCorrelationId(correlationId);
  
  // Add correlation ID to response headers
  res.setHeader('X-Correlation-ID', correlationId);
  
  if (req.method === 'HEAD') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    logger.warn('Method not allowed', { method: req.method });
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    logger.info('Properties search API request started', {
      method: req.method,
      url: req.url,
      query: req.query
    });

    if (!isSupabaseConfigured()) {
      logger.warn('Supabase not configured, using fallback search');
      return handleFallbackSearch(req, res)
    }

    const { markers, error: parseError } = parseMarkers(req.query)
    if (parseError) {
      logger.warn('Invalid markers payload', { parseError });
      return res.status(400).json({ success: false, error: parseError })
    }

    if (markers.length < 4) {
      logger.warn('Incomplete bounds payload', { markerCount: markers.length });
      return res.status(400).json({ success: false, error: 'Incomplete bounds payload' })
    }

    const client = supabaseAdmin ?? supabase
    if (!client) {
      logger.error('Supabase client unavailable on the server');
      throw new Error('Supabase client unavailable on the server')
    }

    const minLat = Math.min(...markers.map(m => m.latitude))
    const maxLat = Math.max(...markers.map(m => m.latitude))
    const minLng = Math.min(...markers.map(m => m.longitude))
    const maxLng = Math.max(...markers.map(m => m.longitude))

    logger.debug('Search bounds calculated', {
      minLat, maxLat, minLng, maxLng,
      markerCount: markers.length
    });

    // Use circuit breaker for database operations
    const searchProperties = async () => {
      logger.debug('Executing search query');
      const { data: properties, error } = await client
        .from('App-Properties')
        .select('*')
        .eq('webflow_status', 'Active')
        .gte('latitude', minLat)
        .lte('latitude', maxLat)
        .gte('longitude', minLng)
        .lte('longitude', maxLng)

      if (error) {
        logger.error('Search query failed', error);
        throw new Error(`Search error: ${error.message}`)
      }

      logger.info('Search query successful', {
        propertyCount: properties?.length || 0
      });

      return properties
    }

    const properties = await supabaseCircuitBreaker.execute(
      () => withRetry(
        () => withTimeout(searchProperties(), 15000),
        3,
        1000
      ),
      async () => {
        logger.warn('Circuit breaker fallback: using fallback search');
        await handleFallbackSearch(req, res);
        return null;
      }
    )

    if (res.headersSent || res.writableEnded) {
      // Fallback responded directly; avoid double responses
      logger.debug('Response already sent by fallback handler, exiting early');
      return
    }

    logger.debug('Starting property transformation for search results', {
      propertyCount: properties?.length || 0
    });

    const transformed = await Promise.all(
      (properties || []).map(async (property, index) => {
        try {
          logger.trace(`Transforming search property ${index + 1}/${properties.length}`, {
            propertyId: property.id,
            propertyName: property.name
          });

          const { amount, label } = resolvePrice(property)
          const formattedPrice = amount > 0 ? `$${amount.toLocaleString()}` : '$0'
          const { lat, lng } = await ensureCoordinates(property, client)
          const enriched = transformPropertyShape(property)
          const {
            availabilityStatus,
            availabilityNormalized,
            isAvailable,
            personCapacity,
          } = enriched

          const result = {
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
            bedrooms: Number.isFinite(Number(property.bedrooms))
              ? Number(property.bedrooms)
              : Number.isFinite(Number(property.number_of_room))
              ? Number(property.number_of_room)
              : null,
            beds:
              Number.isFinite(Number(property.beds))
                ? Number(property.beds)
                : Number.isFinite(Number(property.bed))
                ? Number(property.bed)
                : null,
            baths: Number.isFinite(Number(property.baths)) ? Number(property.baths) : null,
            user: null,
            reviews: [],
            availabilityStatus,
            availabilityNormalized,
            isAvailable,
            personCapacity,
            geolocation: {
              lat,
              lng,
            },
            amenities: [],
          }

          logger.trace(`Search property ${index + 1} transformed successfully`);
          return result;
        } catch (error) {
          logger.error(`Error transforming search property ${property.id}`, error, {
            propertyId: property.id,
            propertyName: property.name,
            errorType: error.name
          });
          
          // Return a minimal property object to prevent complete failure
          return {
            _id: property.whalesync_postgres_id || property.id,
            title: property.name || 'Property',
            rating: '4.5',
            review: '0 reviews',
            lt: property.street_address || 'United States',
            images: [],
            price: '$0',
            priceLabel: 'per night',
            priceValue: 0,
            slug: property.slug || null,
            about: property.body_description || '',
            bedrooms: null,
            beds: null,
            baths: null,
            user: null,
            reviews: [],
            availabilityStatus: 'unknown',
            availabilityNormalized: 'unknown',
            isAvailable: false,
            personCapacity: property?.personCapacity ?? null,
            geolocation: {
              lat: property.latitude || 0,
              lng: property.longitude || 0,
            },
            amenities: [],
          }
        }
      })
    )

    logger.info('Search property transformation completed', {
      transformedCount: transformed.length,
      circuitBreakerStats: supabaseCircuitBreaker.getStats()
    });

    if (transformed.length === 0) {
      logger.info('No properties found in search area');
      return res.json({
        success: true,
        data: [],
        message: 'No retreats match the current map area. Try panning or zooming out.',
      })
    }

    logger.info('Search completed successfully', {
      resultCount: transformed.length
    });

    return res.json({ success: true, data: transformed })
  } catch (error) {
    logger.error('Unexpected error in search API', error, {
      errorType: error.name,
      errorMessage: error.message,
      stack: error.stack
    });
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error',
      correlationId 
    })
  }
}

export default asyncHandler(handler)
