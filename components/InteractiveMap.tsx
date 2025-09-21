'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Property, MapBounds, AnalyticsEvent } from '@/lib/types'

interface InteractiveMapProps {
  properties: Property[]
  selectedProperty?: Property | null
  hoveredProperty?: Property | null
  onPropertySelect: (property: Property, source: 'card' | 'map') => void
  onPropertyHover: (property: Property | null) => void
  onMapBoundsChange: (bounds: MapBounds) => void
  onAnalyticsEvent: (event: AnalyticsEvent) => void
  initialView: {
    lat: number
    lng: number
    zoom: number
  }
}

export function InteractiveMap({
  properties,
  selectedProperty,
  hoveredProperty,
  onPropertySelect,
  onPropertyHover,
  onMapBoundsChange,
  onAnalyticsEvent,
  initialView
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Array<{
    marker: google.maps.marker.AdvancedMarkerElement
    infoWindow: google.maps.InfoWindow
    property: Property
  }>>([])
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create custom marker element
  const createCustomMarker = (property: Property, isSelected: boolean, isHovered: boolean) => {
    const markerElement = document.createElement('div')
    markerElement.className = `custom-marker ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`
    markerElement.innerHTML = `
      <div style="
        background: #ff5a5f;
        color: white;
        padding: 6px 10px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 60px;
        text-align: center;
      ">
        $${property.price}
      </div>
    `
    return markerElement
  }

  // Create info window content
  const createInfoWindowContent = (property: Property) => {
    const image = property.primaryImage || property.image || 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    const location = property.locationLabel || property.location || 'Location not specified'
    const reviews = property.reviewCount || property.reviews || 0

    return `
      <div class="map-info-window">
        <div class="info-window-image">
          <img src="${image}" alt="${property.title}" loading="lazy" />
        </div>
        <div class="info-window-content">
          <h3 class="info-window-title">${property.title}</h3>
          <p class="info-window-location">${location}</p>
          <div class="info-window-rating">
            <span class="rating-stars">★</span>
            <span class="rating-value">${property.rating}</span>
            <span class="rating-count">(${reviews})</span>
          </div>
          <div class="info-window-price">
            <span class="price">$${property.price}</span>
            <span class="duration">/ night</span>
          </div>
          <a href="${property.url || `/property/${property.slug || property.id}`}" class="info-window-link">
            View Property
          </a>
        </div>
      </div>
    `
  }

  // Initialize the map (only once)
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places']
        })

        const { Map } = await loader.importLibrary('maps')
        const { AdvancedMarkerElement } = await loader.importLibrary('marker')

        const map = new Map(mapRef.current, {
          center: initialView,
          zoom: initialView.zoom,
          mapId: 'property-search-map',
          gestureHandling: 'greedy',
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        })

        mapInstanceRef.current = map
        setIsLoaded(true)
      } catch (err) {
        console.error('Error loading Google Maps:', err)
        setError('Failed to load map')
      }
    }

    initMap()
  }, [initialView])

  // Add markers to map and fit bounds to show all properties
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach(({ marker }) => {
      marker.map = null
    })
    markersRef.current = []

    const validProperties: Property[] = []
    const bounds = new google.maps.LatLngBounds()

    // Add new markers
    properties.forEach((property) => {
      // Validate coordinates
      const lat = typeof property.lat === 'number' ? property.lat : parseFloat(property.lat?.toString() || '0')
      const lng = typeof property.lng === 'number' ? property.lng : parseFloat(property.lng?.toString() || '0')
      
      // Skip invalid coordinates
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        console.warn(`Skipping property ${property.id} with invalid coordinates:`, { lat, lng })
        return
      }
      
      validProperties.push(property)
      bounds.extend({ lat, lng })
      
      const isSelected = selectedProperty?.id === property.id
      const isHovered = hoveredProperty?.id === property.id
      
      const markerElement = createCustomMarker(property, isSelected, isHovered)
      
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current,
        position: { lat, lng },
        content: markerElement,
        title: property.title
      })

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(property),
        maxWidth: 300
      })

      // Add click listener
      marker.addListener('click', () => {
        onPropertySelect(property, 'map')
      })

      // Add hover listeners
      marker.addListener('mouseover', () => {
        onPropertyHover(property)
      })

      marker.addListener('mouseout', () => {
        onPropertyHover(null)
      })

      markersRef.current.push({ 
        marker, 
        infoWindow, 
        property
      })
    })

    // Fit map to show all valid properties
    if (validProperties.length > 0) {
      // Add some padding to the bounds
      const padding = 0.1 // 10% padding
      const ne = bounds.getNorthEast()
      const sw = bounds.getSouthWest()
      const latDiff = ne.lat() - sw.lat()
      const lngDiff = ne.lng() - sw.lng()
      
      const paddedBounds = new google.maps.LatLngBounds(
        { lat: sw.lat() - latDiff * padding, lng: sw.lng() - lngDiff * padding },
        { lat: ne.lat() + latDiff * padding, lng: ne.lng() + lngDiff * padding }
      )
      
      mapInstanceRef.current.fitBounds(paddedBounds)
      
      // Ensure minimum zoom level
      const listener = google.maps.event.addListener(mapInstanceRef.current, 'idle', () => {
        if (mapInstanceRef.current && mapInstanceRef.current.getZoom() > 15) {
          mapInstanceRef.current.setZoom(15)
        }
        google.maps.event.removeListener(listener)
      })
    }

    console.log(`Added ${validProperties.length} property markers to map`)
  }, [properties, isLoaded, selectedProperty, hoveredProperty, onPropertySelect, onPropertyHover])

  // Update selected property (simplified)
  useEffect(() => {
    if (!selectedProperty || !mapInstanceRef.current) return

    // Find the marker for the selected property
    const selectedMarker = markersRef.current.find(
      ({ property }) => property.id === selectedProperty.id
    )

    if (selectedMarker) {
      // Center map on selected property with slight zoom
      mapInstanceRef.current.setCenter({ lat: selectedProperty.lat, lng: selectedProperty.lng })
      mapInstanceRef.current.setZoom(Math.max(mapInstanceRef.current.getZoom() || 10, 12))

      // Open info window for selected property
      if (selectedMarker.infoWindow) {
        // Close all other info windows
        markersRef.current.forEach(({ infoWindow: iw }) => {
          if (iw && iw !== selectedMarker.infoWindow) {
            iw.close()
          }
        })
        
        selectedMarker.infoWindow.open(mapInstanceRef.current, selectedMarker.marker)
      }
    }
  }, [selectedProperty])

  if (error) {
    return (
      <div className="map-container-full map-error">
        <div className="map-error-message">
          <p>Failed to load map</p>
          <div className="error-details">{error}</div>
          <button 
            className="retry-button" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="map-element">
      <div 
        ref={mapRef} 
        className="map-container-full"
        style={{ 
          height: '100%', 
          width: '100%', 
          minHeight: '400px' 
        }}
      />
      {!isLoaded && (
        <div className="map-loading-overlay">
          <div className="map-loading-content">
            <div className="map-loading-spinner"></div>
            <p className="map-loading-text">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}