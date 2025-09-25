#!/usr/bin/env node

const { obfuscateMarkerPositions } = require('../utils/spreadMarkers')

const EARTH_RADIUS_KM = 6371

const toRadians = (value) => (value * Math.PI) / 180

const haversineDistanceKm = (lat1, lng1, lat2, lng2) => {
  const deltaLat = toRadians(lat2 - lat1)
  const deltaLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

const baseMarkers = [
  { _id: 'alpha', lat: 37.7749, lng: -122.4194 },
  { _id: 'bravo', lat: 34.0522, lng: -118.2437 },
  { _id: 'charlie', lat: 40.7128, lng: -74.006 },
  { _id: 'delta', lat: 47.6062, lng: -122.3321 },
]

const options = { maxOffsetKm: 3, minOffsetKm: 0.5, minSeparationKm: 1 }

const epsilon = 0.05

const verifyObfuscation = (original, obfuscated) => {
  if (original.length !== obfuscated.length) {
    throw new Error('Result length mismatch')
  }

  const seenPairs = new Map()

  original.forEach((marker, index) => {
    const obMarker = obfuscated[index]
    if (!obMarker || !Number.isFinite(obMarker.lat) || !Number.isFinite(obMarker.lng)) {
      throw new Error(`Marker ${marker._id} missing obfuscated coordinates`)
    }

    const distance = haversineDistanceKm(marker.lat, marker.lng, obMarker.lat, obMarker.lng)
    if (distance > options.maxOffsetKm + epsilon) {
      throw new Error(`Marker ${marker._id} exceeded max offset (${distance.toFixed(2)} km)`) }
    if (distance + epsilon < options.minOffsetKm) {
      throw new Error(`Marker ${marker._id} below min offset (${distance.toFixed(2)} km)`) }

    seenPairs.set(marker._id, obMarker)
  })

  const markers = Array.from(seenPairs.values())
  for (let i = 0; i < markers.length; i += 1) {
    for (let j = i + 1; j < markers.length; j += 1) {
      const separation = haversineDistanceKm(
        markers[i].lat,
        markers[i].lng,
        markers[j].lat,
        markers[j].lng
      )
      if (separation + epsilon < options.minSeparationKm) {
        throw new Error(
          `Markers ${i} and ${j} closer than required separation (${separation.toFixed(2)} km)`
        )
      }
    }
  }
}

const firstRun = obfuscateMarkerPositions(baseMarkers, options)
const secondRun = obfuscateMarkerPositions(baseMarkers, options)

try {
  verifyObfuscation(baseMarkers, firstRun)

  const stable = firstRun.every((marker, index) => {
    const comparison = secondRun[index]
    return (
      comparison &&
      Math.abs(marker.lat - comparison.lat) < 1e-9 &&
      Math.abs(marker.lng - comparison.lng) < 1e-9
    )
  })

  if (!stable) {
    throw new Error('Obfuscation is not deterministic between runs')
  }

  console.log('Obfuscation smoke check passed')
  process.exit(0)
} catch (error) {
  console.error('Obfuscation smoke check failed:', error.message)
  process.exit(1)
}
