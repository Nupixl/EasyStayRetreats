// Webflow API client with provided credentials
export interface WebflowProperty {
  id: string
  name: string
  slug: string
  'property-location': string
  'property-price': number
  'property-image': {
    url: string
    alt: string
  }
  'property-rating': number
  'property-reviews': number
  'property-bedrooms': number
  'property-bathrooms': number
  'property-guests': number
  'property-amenities': string[]
  'property-latitude': number
  'property-longitude': number
  'property-description': string
  'property-type': string
  'property-super-host': boolean
  'property-images': Array<{
    url: string
    alt: string
  }>
  'created-on': string
  'updated-on': string
}

export interface WebflowAPIResponse {
  items: WebflowProperty[]
  pagination: {
    offset: number
    limit: number
    total: number
  }
}

// API Configuration
const WEBFLOW_API_KEY = 'ck_328bf8f1f48e672cfb0465bcab21e59a2ede07a6'
const WEBFLOW_API_SECRET = 'cs_42e67b691a038285f58c4946e510282650a5d781'
const WEBFLOW_COLLECTION_ID = '648b412e0dd822359604117b' // Properties collection
const WEBFLOW_BASE_URL = 'https://api.webflow.com/v2'

class WebflowAPIClient {
  private apiKey: string
  private apiSecret: string
  private baseURL: string

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.baseURL = WEBFLOW_BASE_URL
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'accept-version': '1.0.0',
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Webflow API Error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return response.json()
  }

  // Get all properties from the collection
  async getProperties(params?: {
    limit?: number
    offset?: number
    sort?: string
    filter?: Record<string, any>
  }): Promise<WebflowAPIResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.sort) queryParams.append('sort', params.sort)
    
    // Add filters if provided
    if (params?.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        queryParams.append(`filter[${key}]`, value.toString())
      })
    }

    const queryString = queryParams.toString()
    const endpoint = `/collections/${WEBFLOW_COLLECTION_ID}/items${queryString ? `?${queryString}` : ''}`
    
    return this.makeRequest<WebflowAPIResponse>(endpoint)
  }

  // Get a specific property by ID
  async getProperty(propertyId: string): Promise<WebflowProperty> {
    const endpoint = `/collections/${WEBFLOW_COLLECTION_ID}/items/${propertyId}`
    return this.makeRequest<WebflowProperty>(endpoint)
  }

  // Search properties by location
  async searchPropertiesByLocation(location: string): Promise<WebflowAPIResponse> {
    return this.getProperties({
      filter: {
        'property-location': location
      }
    })
  }

  // Get properties within price range
  async getPropertiesByPriceRange(minPrice: number, maxPrice: number): Promise<WebflowAPIResponse> {
    return this.getProperties({
      filter: {
        'property-price': `gte:${minPrice},lte:${maxPrice}`
      }
    })
  }

  // Get properties by amenities
  async getPropertiesByAmenities(amenities: string[]): Promise<WebflowAPIResponse> {
    // Note: This would need to be implemented based on how amenities are stored in Webflow
    // For now, we'll get all properties and filter client-side
    return this.getProperties()
  }
}

// Initialize the API client
export const webflowAPI = new WebflowAPIClient(WEBFLOW_API_KEY, WEBFLOW_API_SECRET)

// Transform Webflow property to our Property interface
export const transformWebflowProperty = (webflowProperty: WebflowProperty) => {
  return {
    id: webflowProperty.id,
    title: webflowProperty.name,
    location: webflowProperty['property-location'],
    price: webflowProperty['property-price'],
    image: webflowProperty['property-image']?.url || '/placeholder.jpg',
    images: webflowProperty['property-images']?.map(img => img.url) || [webflowProperty['property-image']?.url || '/placeholder.jpg'],
    rating: webflowProperty['property-rating'] || 4.5,
    reviews: webflowProperty['property-reviews'] || 0,
    coordinates: {
      lat: webflowProperty['property-latitude'] || 0,
      lng: webflowProperty['property-longitude'] || 0,
    },
    amenities: webflowProperty['property-amenities'] || [],
    bedrooms: webflowProperty['property-bedrooms'] || 1,
    bathrooms: webflowProperty['property-bathrooms'] || 1,
    guests: webflowProperty['property-guests'] || 2,
    description: webflowProperty['property-description'] || '',
    superHost: webflowProperty['property-super-host'] || false,
    propertyType: webflowProperty['property-type'] || 'apartment',
  }
}

// Fetch and transform all properties
export const fetchWebflowProperties = async (): Promise<any[]> => {
  try {
    const response = await webflowAPI.getProperties({ limit: 100 })
    return response.items.map(transformWebflowProperty)
  } catch (error) {
    console.error('Error fetching Webflow properties:', error)
    return []
  }
}

// Search properties with filters
export const searchWebflowProperties = async (filters: {
  location?: string
  priceRange?: [number, number]
  amenities?: string[]
  guests?: number
}): Promise<any[]> => {
  try {
    let response: WebflowAPIResponse

    if (filters.location) {
      response = await webflowAPI.searchPropertiesByLocation(filters.location)
    } else if (filters.priceRange) {
      response = await webflowAPI.getPropertiesByPriceRange(
        filters.priceRange[0], 
        filters.priceRange[1]
      )
    } else {
      response = await webflowAPI.getProperties({ limit: 100 })
    }

    let properties = response.items.map(transformWebflowProperty)

    // Apply client-side filters for complex queries
    if (filters.amenities && filters.amenities.length > 0) {
      properties = properties.filter(property =>
        filters.amenities!.every(amenity =>
          property.amenities.includes(amenity)
        )
      )
    }

    if (filters.guests) {
      properties = properties.filter(property =>
        property.guests >= filters.guests!
      )
    }

    return properties
  } catch (error) {
    console.error('Error searching Webflow properties:', error)
    return []
  }
}
