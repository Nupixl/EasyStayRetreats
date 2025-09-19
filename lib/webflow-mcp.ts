// Webflow MCP integration for fetching properties
import { Property } from './types'

export interface WebflowMCPProperty {
  id: string
  fieldData: {
    name: string
    slug: string
    city: string
    'street-address': string
    location: string
    'nightly-rate': number
    'card-image': {
      url: string
      alt: string
    }
    'property-rating': number
    'total-reviews': number
    beds: number
    baths: number
    guests: number
    'short-description': string
    'body-description': string
    latitude: number
    longitude: number
    'super-host': boolean
    'plus-host': boolean
    'premium-host': boolean
    'verified-host': boolean
  }
}

export const transformWebflowMCPProperty = (webflowProperty: WebflowMCPProperty): Property => {
  const fieldData = webflowProperty.fieldData
  
  return {
    id: webflowProperty.id,
    title: fieldData.name,
    location: fieldData.city,
    price: fieldData['nightly-rate'] || 0,
    image: fieldData['card-image']?.url || '/placeholder.jpg',
    rating: fieldData['property-rating'] || 4.5,
    reviews: fieldData['total-reviews'] || 0,
    coordinates: {
      lat: fieldData.latitude || 0,
      lng: fieldData.longitude || 0,
    },
    amenities: [], // Will be populated from other fields if needed
    bedrooms: fieldData.beds || 1,
    bathrooms: fieldData.baths || 1,
    guests: fieldData.guests || 2,
    description: fieldData['body-description'] || fieldData['short-description'] || '',
    superHost: fieldData['super-host'] || fieldData['premium-host'] || false,
  }
}

// This function will be called from the server-side to fetch properties
export const fetchPropertiesFromWebflowMCP = async (): Promise<Property[]> => {
  try {
    // This will be implemented using the MCP Webflow tools
    // For now, return empty array - the actual implementation will be in the page component
    console.log('Fetching properties using Webflow MCP...')
    return []
  } catch (error) {
    console.error('Error fetching properties from Webflow MCP:', error)
    return []
  }
}

