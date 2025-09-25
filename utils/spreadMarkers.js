const DEFAULT_RADIUS = 0.0006
const DEFAULT_PRECISION = 6
const EARTH_RADIUS_KM = 6371

const toRadians = (value) => (value * Math.PI) / 180
const toDegrees = (value) => (value * 180) / Math.PI

const normalizeLongitude = (lngRad) => {
  const twoPi = Math.PI * 2
  return ((lngRad + Math.PI) % twoPi + twoPi) % twoPi - Math.PI
}

const haversineDistanceKm = (lat1, lng1, lat2, lng2) => {
  const lat1Rad = toRadians(lat1)
  const lat2Rad = toRadians(lat2)
  const deltaLat = toRadians(lat2 - lat1)
  const deltaLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

const projectPoint = (latDeg, lngDeg, distanceKm, bearingRad) => {
  const angularDistance = distanceKm / EARTH_RADIUS_KM
  const latRad = toRadians(latDeg)
  const lngRad = toRadians(lngDeg)

  const sinLat = Math.sin(latRad)
  const cosLat = Math.cos(latRad)
  const sinAngular = Math.sin(angularDistance)
  const cosAngular = Math.cos(angularDistance)

  const targetLat = Math.asin(
    sinLat * cosAngular + cosLat * sinAngular * Math.cos(bearingRad)
  )

  const targetLng =
    lngRad +
    Math.atan2(
      Math.sin(bearingRad) * sinAngular * cosLat,
      cosAngular - sinLat * Math.sin(targetLat)
    )

  return {
    lat: toDegrees(targetLat),
    lng: toDegrees(normalizeLongitude(targetLng)),
  }
}

const hashStringToSeed = (value = '') => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    const chr = value.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return Math.abs(hash) || 1
}

const mulberry32 = (seed) => {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const sanitizeIdentifier = (idValue, lat, lng) => {
  if (idValue !== undefined && idValue !== null && `${idValue}`.length > 0) {
    return `${idValue}`
  }
  // fall back to coordinate fingerprint if no id was provided
  return `${lat.toFixed(8)}|${lng.toFixed(8)}`
}

const obfuscateMarkerPositions = (
  items = [],
  {
    maxOffsetKm = 3,
    minOffsetKm = 0.3,
    minSeparationKm = 1,
    latKey = 'lat',
    lngKey = 'lng',
    idKey = '_id',
    maxAttempts = 24,
  } = {}
) => {
  if (!Array.isArray(items) || items.length === 0) {
    return []
  }

  const effectiveMaxOffset = Math.max(0, Number(maxOffsetKm) || 0)
  if (effectiveMaxOffset === 0) {
    return items.map((item) => ({ ...(item || {}) }))
  }

  const effectiveMinOffset = Math.min(
    effectiveMaxOffset,
    Math.max(0, Number(minOffsetKm) || 0)
  )
  const requireSpacing = Number(minSeparationKm) > 0
  const spacingDistance = requireSpacing ? Number(minSeparationKm) : 0

  const placed = []

  return items.map((original) => {
    if (!original || typeof original !== 'object') {
      return { ...(original || {}) }
    }

    const latValue = Number(original[latKey])
    const lngValue = Number(original[lngKey])

    if (!Number.isFinite(latValue) || !Number.isFinite(lngValue)) {
      return { ...original }
    }

    const identifier = sanitizeIdentifier(original[idKey], latValue, lngValue)
    const random = mulberry32(hashStringToSeed(identifier))

    let chosen = null
    let lastCandidate = null

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const maxRange = effectiveMaxOffset - effectiveMinOffset
      const distanceKm =
        effectiveMinOffset + (maxRange > 0 ? random() * maxRange : effectiveMaxOffset)
      const bearing = random() * Math.PI * 2
      const candidate = projectPoint(latValue, lngValue, distanceKm, bearing)
      lastCandidate = candidate

      if (!requireSpacing) {
        chosen = candidate
        break
      }

      const tooClose = placed.some(
        (existing) => haversineDistanceKm(existing.lat, existing.lng, candidate.lat, candidate.lng) < spacingDistance
      )

      if (!tooClose) {
        chosen = candidate
        break
      }
    }

    const finalPosition = chosen || lastCandidate || { lat: latValue, lng: lngValue }
    const result = {
      ...original,
      [latKey]: finalPosition.lat,
      [lngKey]: finalPosition.lng,
    }

    placed.push({ lat: result[latKey], lng: result[lngKey] })
    return result
  })
}

/**
 * Returns a clone of the marker list with overlapping pins distributed
 * around a small circle so they do not sit exactly on top of each other.
 *
 * @param {Array<Object>} items
 * @param {Object} [options]
 * @param {number} [options.radius=DEFAULT_RADIUS] - offset distance in degrees
 * @param {number} [options.precision=DEFAULT_PRECISION] - number of decimals to group by
 * @param {string} [options.latKey='lat']
 * @param {string} [options.lngKey='lng']
 */
const spreadOverlappingMarkers = (
  items = [],
  { radius = DEFAULT_RADIUS, precision = DEFAULT_PRECISION, latKey = 'lat', lngKey = 'lng' } = {}
) => {
  const grouped = new Map()
  const singles = []

  items.forEach((original) => {
    if (!original || typeof original !== 'object') {
      singles.push({ ...original })
      return
    }

    const latValue = Number(original[latKey])
    const lngValue = Number(original[lngKey])

    if (!Number.isFinite(latValue) || !Number.isFinite(lngValue)) {
      singles.push({ ...original })
      return
    }

    const key = `${latValue.toFixed(precision)}|${lngValue.toFixed(precision)}`
    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key).push({ item: original, lat: latValue, lng: lngValue })
  })

  const results = []

  grouped.forEach((group) => {
    if (group.length <= 1) {
      results.push({ ...group[0].item })
      return
    }

    const angleStep = (Math.PI * 2) / group.length

    group.forEach(({ item, lat, lng }, idx) => {
      const angle = angleStep * idx
      const latOffset = radius * Math.cos(angle)
      const cosLat = Math.cos((lat * Math.PI) / 180) || 1
      const lngOffset = radius * Math.sin(angle) / (Math.abs(cosLat) < 1e-6 ? 1 : cosLat)

      results.push({
        ...item,
        [latKey]: lat + latOffset,
        [lngKey]: lng + lngOffset,
      })
    })
  })

  // Add back entries that were skipped because of missing coords without modifying them
  singles.forEach((item) => {
    results.push({ ...item })
  })

  return results
}

module.exports = {
  obfuscateMarkerPositions,
  spreadOverlappingMarkers,
  default: spreadOverlappingMarkers,
}
