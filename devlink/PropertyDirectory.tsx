'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { PropertyCard } from './PropertyCard'
import { InteractiveMap } from '@/components/InteractiveMap'
import { NoSSR } from '@/components/NoSSR'
import { Property, UIState, MapBounds, AnalyticsEvent } from '@/lib/types'

interface PropertyDirectoryProps {
  properties: Property[]
  initialFilters: {
    location: string
    checkIn: string
    checkOut: string
    guests: number
    priceRange: [number, number]
    amenities: string[]
  }
}

export function PropertyDirectory({ properties, initialFilters }: PropertyDirectoryProps) {
  const [uiState, setUIState] = useState<UIState>({
    selectedPropertyId: null,
    hoveredPropertyId: null,
    loadedPropertyIds: properties.map(p => p.id),
    mapBounds: null,
    filters: initialFilters,
    isFetching: false,
    error: null
  })

  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties)
  const listRef = useRef<HTMLDivElement>(null)

  // Debounced search input handler
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Apply filters
  useEffect(() => {
    let tempProperties = properties

    if (uiState.filters.location) {
      tempProperties = tempProperties.filter(p => 
        (p.locationLabel || p.location || '').toLowerCase().includes(uiState.filters.location.toLowerCase())
      )
    }

    tempProperties = tempProperties.filter(p => 
      p.price >= uiState.filters.priceRange[0] && p.price <= uiState.filters.priceRange[1]
    )

    // Basic amenity filtering (can be expanded)
    if (uiState.filters.amenities.length > 0) {
      tempProperties = tempProperties.filter(p => 
        uiState.filters.amenities.every(amenity => 
          (p.amenities || []).includes(amenity)
        )
      )
    }

    setFilteredProperties(tempProperties)
  }, [properties, uiState.filters])

  // Log data source information
  useEffect(() => {
    if (properties.length > 0) {
      console.log(`PropertyDirectory: Loaded ${properties.length} properties`)
      console.log('Sample property:', properties[0])
    }
  }, [properties])

  // Handle property selection
  const handlePropertySelect = useCallback((property: Property, source: 'card' | 'map') => {
    setUIState(prev => ({
      ...prev,
      selectedPropertyId: property.id
    }))

    // Scroll to property card if selected from map
    if (source === 'map' && listRef.current) {
      const cardElement = listRef.current.querySelector(`[data-property-id="${property.id}"]`)
      if (cardElement) {
        cardElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }
    }

    // Emit analytics event
    handleAnalyticsEvent({
      eventType: 'property_selected',
      propertyId: property.id,
      source,
      lat: property.lat,
      lng: property.lng,
      timestamp: new Date().toISOString()
    })
  }, [])

  // Handle property hover
  const handlePropertyHover = useCallback((property: Property | null) => {
    setUIState(prev => ({
      ...prev,
      hoveredPropertyId: property?.id || null
    }))

    if (property) {
      // Scroll to property card if hovered from map
      if (listRef.current) {
        const cardElement = listRef.current.querySelector(`[data-property-id="${property.id}"]`)
        if (cardElement) {
          cardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }

      // Emit analytics event
      handleAnalyticsEvent({
        eventType: 'card_hover',
        propertyId: property.id,
        timestamp: new Date().toISOString()
      })
    }
  }, [])

  // Handle map bounds change
  const handleMapBoundsChange = useCallback((bounds: MapBounds) => {
    setUIState(prev => ({
      ...prev,
      mapBounds: bounds
    }))
  }, [])

  // Handle analytics events
  const handleAnalyticsEvent = useCallback((event: AnalyticsEvent) => {
    // In a real app, you would send this to your analytics service
    console.log('Analytics Event:', event)
    
    // Example: Send to analytics API
    // fetch('/api/analytics/event', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // }).catch(console.error)
  }, [])

  // Get selected and hovered properties
  const selectedProperty = filteredProperties.find(p => p.id === uiState.selectedPropertyId) || null
  const hoveredProperty = filteredProperties.find(p => p.id === uiState.hoveredPropertyId) || null

  return (
    <section className="section_search_map">
      <div className="map-canvas">
        <div className="map-property-wrapper">
    <div className="map-property-contiainer">
            <div id="SearchNavWrapper" className="search-nav-wrapper">
              <div className="property-filter-block w-form">
                <form id="email-form" name="email-form" data-name="Email Form" method="get" className="property-filter" data-wf-page-id="68c19e5fa3e53a384ea0701c" data-wf-element-id="1e282275-790c-9df8-f43f-8faaee88f178">
                  <div className="search-menu-dropdown">Where</div>
                  <div className="search-menu-dropdown">When</div>
                  <div className="search-menu-dropdown">Who</div>
                  <div className="seach-menu-button">Search</div>
                </form>
                <div className="w-form-done">
                  <div>Thank you! Your submission has been received!</div>
                </div>
                <div className="w-form-fail">
                  <div>Oops! Something went wrong while submitting the form.</div>
            </div>
          </div>
          <div className="property-notice">
                <div id="NumberOfProperties" className="subtitle w-node-a2beae88-96a7-7cdd-e036-c2ad467326d0-467326cb">{filteredProperties.length}</div>
                <div className="subtitle">Properties</div>
                        <div className="data-source-indicator" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                          {properties.length > 0 && properties[0].id?.startsWith('68c') ? '📊 Webflow CMS Live' : '🔄 Fallback Data'}
          </div>
        </div>
      </div>
      <div className="map-property-bottom-contianer">
              <div className="property-listing-wrapper w-dyn-list" ref={listRef}>
                <div role="list" className="property-list w-dyn-items">
                  {filteredProperties.map((property) => (
                    <div 
                      key={property.id} 
                      role="listitem" 
                      className={`property w-dyn-item ${selectedProperty?.id === property.id ? 'selected' : ''} ${hoveredProperty?.id === property.id ? 'highlight' : ''}`}
                      data-property-id={property.id}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handlePropertySelect(property, 'card')
                        }
                      }}
                      onMouseEnter={() => handlePropertyHover(property)}
                      onMouseLeave={() => handlePropertyHover(null)}
                    >
            <PropertyCard
              property={property}
              isSelected={selectedProperty?.id === property.id}
                        onPropertySelect={(prop) => handlePropertySelect(prop, 'card')}
                      />
                    </div>
                  ))}
                </div>
                <div className="w-dyn-empty">
                  <div>No items found.</div>
              </div>
              </div>
            </div>
          </div>
        </div>
        <div className="map-element">
          <div id="search-map" className="map-container-full">
            <NoSSR fallback={
              <div style={{ height: '100%', width: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                <div className="map-loading-content">
                  <div className="map-loading-spinner"></div>
                  <p className="map-loading-text">Loading map...</p>
                </div>
              </div>
            }>
              <InteractiveMap 
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                hoveredProperty={hoveredProperty}
                onPropertySelect={handlePropertySelect}
                onPropertyHover={handlePropertyHover}
                onMapBoundsChange={handleMapBoundsChange}
                onAnalyticsEvent={handleAnalyticsEvent}
                initialView={{
                  lat: 39.8283, // Center of US
                  lng: -98.5795,
                  zoom: 4
                }}
              />
            </NoSSR>
          </div>
        </div>
      </div>
    </section>
  )
}