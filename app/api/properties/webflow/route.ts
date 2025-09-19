import { NextResponse } from 'next/server'
import { Property, ListResponse } from '@/lib/types'

// Webflow CMS Configuration
const WEBFLOW_SITE_ID = '609dfa12a141dd6e70976d48'
const WEBFLOW_COLLECTION_ID = '648b412e0dd822359604117b'
const WEBFLOW_ACCESS_TOKEN = process.env.WEBFLOW_ACCESS_TOKEN

// Transform Webflow CMS data to our Property interface
function transformWebflowProperty(webflowItem: any): Property {
  const fieldData = webflowItem.fieldData
  
  return {
    id: webflowItem.id,
    title: fieldData.name || 'Untitled Property',
    primaryImage: fieldData['main-image']?.url || 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: fieldData['main-image']?.url ? [fieldData['main-image'].url] : [],
    lat: parseFloat(fieldData.latitude) || 0,
    lng: parseFloat(fieldData.longitude) || 0,
    locationLabel: fieldData.location || 'Unknown Location',
    rating: parseFloat(fieldData.rating) || 0,
    reviewCount: parseInt(fieldData['number-of-reviews']) || 0,
    shortDescription: fieldData.description || '',
    beds: parseInt(fieldData.beds) || 0,
    baths: parseInt(fieldData.baths) || 0,
    price: parseFloat(fieldData.price) || 0,
    badge: fieldData.badge || null,
    isFavorite: false,
    url: `/property/${fieldData.slug || webflowItem.id}`,
    // Legacy fields for backward compatibility
    location: fieldData.location || 'Unknown Location',
    image: fieldData['main-image']?.url || 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    reviews: parseInt(fieldData['number-of-reviews']) || 0,
    bedrooms: parseInt(fieldData.beds) || 0,
    bathrooms: parseInt(fieldData.baths) || 0,
    guests: parseInt(fieldData.guests) || (parseInt(fieldData.beds) || 0) * 2,
    description: fieldData.description || '',
    fullDescription: fieldData.description || '',
    superHost: fieldData['super-host'] === 'Yes',
    propertyType: fieldData['property-type'] || 'House',
    host: {
      name: fieldData['host-name'] || 'Host',
      avatar: fieldData['host-image']?.url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    availability: true,
    popular: fieldData.badge === 'Popular',
    deal: fieldData.badge === 'Deal',
    cleaningFee: parseFloat(fieldData['cleaning-fee']) || 0,
    serviceFeePercentage: 12,
    taxPercentage: 8.5,
    comparePrice: parseFloat(fieldData['compare-price']) || null,
    slug: fieldData.slug || webflowItem.id,
    amenities: fieldData.amenities ? fieldData.amenities.split(',').map((a: string) => a.trim()) : [],
    coordinates: {
      lat: parseFloat(fieldData.latitude) || 0,
      lng: parseFloat(fieldData.longitude) || 0
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const q = searchParams.get('q') || ''
    const sw_lat = parseFloat(searchParams.get('sw_lat') || '')
    const sw_lng = parseFloat(searchParams.get('sw_lng') || '')
    const ne_lat = parseFloat(searchParams.get('ne_lat') || '')
    const ne_lng = parseFloat(searchParams.get('ne_lng') || '')
    
    // Fetch from Webflow CMS
    let webflowProperties: Property[] = []
    
    try {
      console.log('Fetching properties from Webflow CMS...')
      
      const webflowResponse = await fetch(
        `https://api.webflow.com/v2/sites/${WEBFLOW_SITE_ID}/collections/${WEBFLOW_COLLECTION_ID}/items?limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${WEBFLOW_ACCESS_TOKEN}`,
            'accept-version': '1.0.0'
          }
        }
      )
      
      if (!webflowResponse.ok) {
        throw new Error(`Webflow API error: ${webflowResponse.status} ${webflowResponse.statusText}`)
      }
      
      const webflowData = await webflowResponse.json()
      console.log(`Found ${webflowData.items?.length || 0} properties in Webflow CMS`)
      
      if (webflowData.items && webflowData.items.length > 0) {
        webflowProperties = webflowData.items.map(transformWebflowProperty)
      }
      
    } catch (webflowError) {
      console.error('Webflow CMS error:', webflowError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch from Webflow CMS',
          details: webflowError instanceof Error ? webflowError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
    
    if (webflowProperties.length === 0) {
      return NextResponse.json(
        { error: 'No properties found in Webflow CMS' },
        { status: 404 }
      )
    }
    
    let filteredProperties = [...webflowProperties]
    
    // Apply text search
    if (q) {
      filteredProperties = filteredProperties.filter(property =>
        property.title.toLowerCase().includes(q.toLowerCase()) ||
        (property.locationLabel || '').toLowerCase().includes(q.toLowerCase()) ||
        (property.shortDescription || '').toLowerCase().includes(q.toLowerCase())
      )
    }
    
    // Apply bounds filtering
    if (!isNaN(sw_lat) && !isNaN(sw_lng) && !isNaN(ne_lat) && !isNaN(ne_lng)) {
      filteredProperties = filteredProperties.filter(property =>
        property.lat >= sw_lat && property.lat <= ne_lat &&
        property.lng >= sw_lng && property.lng <= ne_lng
      )
    }
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex)
    
    const response: ListResponse = {
      items: paginatedProperties,
      total: filteredProperties.length,
      page,
      pageSize
    }
    
    // Add metadata about data source
    const responseWithMetadata = {
      ...response,
      metadata: {
        source: 'webflow-cms',
        webflowCount: webflowProperties.length,
        totalCount: filteredProperties.length,
        lastUpdated: new Date().toISOString()
      }
    }
    
    return NextResponse.json(responseWithMetadata)

  } catch (error) {
    console.error('Error fetching properties from Webflow CMS:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch properties from Webflow CMS',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

