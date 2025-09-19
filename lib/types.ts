export interface Property {
  id: string
  title: string
  primaryImage: string
  images?: string[]
  lat: number
  lng: number
  locationLabel: string
  rating: number
  reviewCount: number
  shortDescription: string
  beds: number
  baths: number
  price: number
  badge?: string | null
  isFavorite: boolean
  url: string
  // Legacy fields for backward compatibility
  location?: string
  image?: string
  reviews?: number
  bedrooms?: number
  bathrooms?: number
  guests?: number
  description?: string
  fullDescription?: string
  superHost?: boolean
  propertyType?: string
  host?: {
    name: string
    avatar: string
  }
  availability?: boolean
  popular?: boolean
  deal?: boolean
  cleaningFee?: number
  serviceFeePercentage?: number
  taxPercentage?: number
  comparePrice?: number
  slug?: string
  amenities?: string[]
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface SearchFilters {
  location: string
  checkIn: string
  checkOut: string
  guests: number
  priceRange: [number, number]
  amenities: string[]
  propertyType?: string
  rating?: number
}

export interface MapMarker {
  id: string
  position: {
    lat: number
    lng: number
  }
  property: Property
  isSelected?: boolean
}

export interface ListResponse {
  items: Property[]
  total: number
  page: number
  pageSize: number
}

export interface MapBounds {
  sw_lat: number
  sw_lng: number
  ne_lat: number
  ne_lng: number
}

export interface UIState {
  selectedPropertyId: string | null
  hoveredPropertyId: string | null
  loadedPropertyIds: string[]
  mapBounds: MapBounds | null
  filters: Record<string, any>
  isFetching: boolean
  error: string | null
}

export interface AnalyticsEvent {
  eventType: string
  propertyId?: string
  payload?: Record<string, any>
  timestamp?: string
  lat?: number
  lng?: number
  bounds?: MapBounds
  filters?: Record<string, any>
  source?: 'card' | 'map'
  newState?: boolean
}
