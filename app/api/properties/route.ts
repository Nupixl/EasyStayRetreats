import { NextResponse } from 'next/server'
import { Property, ListResponse } from '@/lib/types'
import { getWebflowProperties } from '@/lib/webflow-cms'

// Sample properties data from Webflow CMS (hardcoded for now)
const sampleProperties: Property[] = [
      {
        id: '68c0b6c4f37fb75b80189302',
    title: 'Downtown Loft with City Views',
    primaryImage: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    lat: 30.2672,
    lng: -97.7431,
    locationLabel: 'Austin, 1100 Congress Ave',
    rating: 4.5,
    reviewCount: 0,
    shortDescription: 'Modern downtown loft with panoramic city views and rooftop access',
          beds: 1,
          baths: 1,
    price: 120,
    badge: null,
    isFavorite: false,
    url: '/property/downtown-loft-city-views',
    // Legacy fields
    location: 'Austin, 1100 Congress Ave',
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    reviews: 0,
          guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    coordinates: { lat: 30.2672, lng: -97.7431 },
    superHost: false,
    amenities: [],
    description: 'Modern downtown loft with panoramic city views and rooftop access',
    fullDescription: 'Experience urban living at its finest in this stylish downtown loft. Features exposed brick walls, high ceilings, and access to a shared rooftop with city views. Walking distance to restaurants, bars, and entertainment.',
    availability: true,
    popular: false,
    deal: false,
    cleaningFee: 35,
    serviceFeePercentage: 12,
    taxPercentage: 8,
    comparePrice: null,
    slug: 'downtown-loft-city-views'
      },
      {
        id: '68c0b6c0eebdac2d33049622',
    title: 'Beachfront Condo with Ocean Views',
    location: 'Miami Beach, 4441 Collins Ave',
    price: 250,
    rating: 4.5,
    reviews: 0,
          guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    coordinates: { lat: 25.7907, lng: -80.1393 },
    superHost: false,
    amenities: [],
    description: 'Luxury beachfront condo with stunning ocean views and pool access',
    fullDescription: 'Wake up to breathtaking ocean views in this modern beachfront condo. Features floor-to-ceiling windows, private balcony, and access to resort amenities including pools, spa, and beach service.',
    availability: true,
    popular: true,
    deal: false,
    cleaningFee: 75,
    serviceFeePercentage: 15,
    taxPercentage: 10,
    comparePrice: null,
    slug: 'beachfront-condo-ocean-views'
      },
      {
        id: '68c0b6bcec294bdf0a7fa687',
    title: 'Mountain View Cabin with Hot Tub',
    location: 'Asheville, 1 Page Ave, Asheville, NC 28801',
    price: 150,
    rating: 4.5,
    reviews: 0,
          guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    coordinates: { lat: 35.5951, lng: -82.5515 },
    superHost: false,
    amenities: [],
    description: 'Cozy mountain cabin with stunning views and private hot tub',
    fullDescription: 'Escape to this beautiful mountain cabin with panoramic views of the Blue Ridge Mountains. Features a private hot tub, fireplace, and fully equipped kitchen. Perfect for romantic getaways or small family retreats.',
    availability: true,
    popular: true,
    deal: false,
    cleaningFee: 50,
    serviceFeePercentage: 10,
    taxPercentage: 7,
    comparePrice: null,
    slug: 'mountain-view-cabin-hot-tub'
      },
      {
        id: '68bc94aaca19f1d472cb11e6',
    title: 'Youghiogheny Hot Tub Cabin',
    location: 'Oakland, 15 S 3rd St, Oakland, MD 21550',
    price: 180,
    rating: 4.5,
    reviews: 0,
          guests: 8,
    bedrooms: 7,
    bathrooms: 1,
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    coordinates: { lat: 39.4073, lng: -79.4067 },
    superHost: false,
    amenities: [],
    description: 'Youghiogheny hot tub cabin in Oakland, Maryland.',
    fullDescription: 'Escape to this cozy cabin in Yough Mountain Resort, just 20 minutes from Deep Creek Lake and Oakland. Enjoy a private hot tub, indoor fireplace, outdoor fire pit, lofted sleeping area, full kitchen, and peaceful wooded views.',
    availability: true,
    popular: false,
    deal: false,
    cleaningFee: 60,
    serviceFeePercentage: 14,
    taxPercentage: 9,
    comparePrice: null,
    slug: 'youghiogheny-hot-tub-cabin'
      },
      {
        id: '68bc94a967f3b690b1bb3bca',
    title: 'Hot Tub, Pool Table, Ping Pong & Poker: Big Sky',
    location: 'McHenry, 296 Marsh Hill Rd, McHenry, MD 21541',
    price: 450,
    rating: 4.5,
    reviews: 0,
          guests: 16,
    bedrooms: 10,
    bathrooms: 5,
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    coordinates: { lat: 39.5581, lng: -79.3522 },
    superHost: false,
    amenities: [],
    description: 'Big Sky property with hot tub, pool table, ping pong, and poker.',
    fullDescription: 'Discover Big Sky, a luxurious ski-in/ski-out mountain retreat with a rich rental history and breathtaking panoramic views near Deep Creek Lake and the surrounding peaks.',
    availability: true,
    popular: false,
    deal: false,
    cleaningFee: 150,
    serviceFeePercentage: 18,
    taxPercentage: 12,
    comparePrice: null,
    slug: 'hot-tub-pool-table-ping-pong-poker-big-sky'
  },
  {
    id: '68bc94a791a1fc50f9505861',
    title: 'Luxurious Abode',
    location: 'Albuquerque, 600 Central Ave SE, Albuquerque, NM 87102',
    price: 275,
    rating: 4.5,
    reviews: 0,
    guests: 10,
    bedrooms: 4,
    bathrooms: 4,
    image: 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
    images: [
      'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'
    ],
    coordinates: { lat: 35.0844, lng: -106.6504 },
    superHost: false,
    amenities: [],
    description: 'Luxurious abode with hot tub and rooftop deck.',
    fullDescription: 'Discover the perfect blend of comfort, luxury, and peaceful living in our newly constructed home, designed with your ultimate relaxation in mind!',
    availability: true,
    popular: false,
    deal: false,
    cleaningFee: 85,
    serviceFeePercentage: 13,
    taxPercentage: 9,
    comparePrice: null,
    slug: 'luxurious-abode'
  }
]

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
    
    // Fetch from Webflow CMS (production data source)
    let webflowProperties: Property[] = []
    try {
      console.log('Fetching live data from Webflow CMS...')
      webflowProperties = await getWebflowProperties()
      console.log(`Found ${webflowProperties.length} properties from Webflow CMS`)
    } catch (webflowError) {
      console.error('Webflow CMS connection error:', webflowError)
    }
    
    // Use Webflow CMS data if available, otherwise fall back to sample data
    const sourceProperties = webflowProperties.length > 0 ? webflowProperties : sampleProperties
    
    // Transform all properties to ensure consistent format
    const transformedProperties = sourceProperties.map(property => ({
      ...property,
      // Ensure lat/lng are direct properties
      lat: property.lat || property.coordinates?.lat || 0,
      lng: property.lng || property.coordinates?.lng || 0,
      // Ensure required fields are present
      primaryImage: property.primaryImage || property.image || 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg',
      images: property.images || [property.primaryImage || property.image || 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg'],
      locationLabel: property.locationLabel || property.location || '',
      reviewCount: property.reviewCount || property.reviews || 0,
      shortDescription: property.shortDescription || property.description || '',
      beds: property.beds || property.bedrooms || 1,
      baths: property.baths || property.bathrooms || 1,
      url: property.url || `/property/${property.slug || property.id}`,
      isFavorite: property.isFavorite || false
    }))
    
    let filteredProperties = [...transformedProperties]
    
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
        source: webflowProperties.length > 0 ? 'webflow-cms-live' : 'fallback',
        webflowCount: webflowProperties.length,
        totalCount: transformedProperties.length,
        lastUpdated: new Date().toISOString(),
        productionReady: true
      }
    }
    
    return NextResponse.json(responseWithMetadata)

  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}