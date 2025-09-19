import { NextResponse } from 'next/server'

// Transform function to convert Webflow property to our API format
const transformProperty = (webflowProperty: any) => {
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
    amenities: [],
    bedrooms: fieldData.beds || 1,
    bathrooms: fieldData.baths || 1,
    guests: fieldData.guests || 2,
    description: fieldData['body-description'] || fieldData['short-description'] || '',
    superHost: fieldData['super-host'] || fieldData['premium-host'] || false,
    // Add searchable fields
    streetAddress: fieldData['street-address'] || '',
    shortDescription: fieldData['short-description'] || '',
    bodyDescription: fieldData['body-description'] || '',
    propertyType: fieldData['property-type'] || 'Property',
    host: fieldData.host || '',
    availability: fieldData.availability || 'Available'
  }
}

// All properties data (same as in properties route)
const getAllProperties = () => {
  return [
    {
      id: '68c0b6c4f37fb75b80189302',
      fieldData: {
        name: 'Downtown Loft with City Views',
        slug: 'downtown-loft-city-views',
        city: 'Austin',
        'street-address': '1100 Congress Ave, Austin, TX 78701',
        location: '68bc41779cdf82cd1890c01a',
        'nightly-rate': 120,
        'card-image': {
          url: '/placeholder-loft.jpg',
          alt: 'Downtown Loft'
        },
        'property-rating': 4.8,
        'total-reviews': 124,
        beds: 1,
        baths: 1,
        guests: 2,
        'short-description': 'Modern downtown loft with panoramic city views and rooftop access',
        'body-description': 'Experience urban living at its finest in this stylish downtown loft.',
        latitude: 30.2672,
        longitude: -97.7431,
        'super-host': false,
        'plus-host': false,
        'premium-host': true,
        'verified-host': false
      }
    },
    {
      id: '68c0b6c0eebdac2d33049622',
      fieldData: {
        name: 'Beachfront Condo with Ocean Views',
        slug: 'beachfront-condo-ocean-views',
        city: 'Miami Beach',
        'street-address': '4441 Collins Ave, Miami Beach, FL 33140',
        location: '68bc41779cdf82cd1890c01a',
        'nightly-rate': 250,
        'card-image': {
          url: '/placeholder-beach.jpg',
          alt: 'Beachfront Condo'
        },
        'property-rating': 4.9,
        'total-reviews': 89,
        beds: 2,
        baths: 2,
        guests: 4,
        'short-description': 'Luxury beachfront condo with stunning ocean views and pool access',
        'body-description': 'Wake up to breathtaking ocean views in this modern beachfront condo.',
        latitude: 25.7907,
        longitude: -80.1393,
        'super-host': false,
        'plus-host': false,
        'premium-host': false,
        'verified-host': true
      }
    },
    {
      id: '68c0b6bcec294bdf0a7fa687',
      fieldData: {
        name: 'Mountain View Cabin with Hot Tub',
        slug: 'mountain-view-cabin-hot-tub',
        city: 'Asheville',
        'street-address': '1 Page Ave, Asheville, NC 28801',
        location: '68bc41779cdf82cd1890c01a',
        'nightly-rate': 150,
        'card-image': {
          url: '/placeholder-cabin.jpg',
          alt: 'Mountain Cabin'
        },
        'property-rating': 4.7,
        'total-reviews': 156,
        beds: 3,
        baths: 2,
        guests: 6,
        'short-description': 'Cozy mountain cabin with stunning views and private hot tub',
        'body-description': 'Escape to this beautiful mountain cabin with panoramic views.',
        latitude: 35.5951,
        longitude: -82.5515,
        'super-host': false,
        'plus-host': false,
        'premium-host': false,
        'verified-host': false
      }
    },
    {
      id: '68bc94aaca19f1d472cb11e6',
      fieldData: {
        name: 'Youghiogheny Hot Tub Cabin',
        slug: 'youghiogheny-hot-tub-cabin',
        city: 'Oakland',
        'street-address': '15 S 3rd St, Oakland, MD 21550',
        location: '68bc41779cdf82cd1890c01a',
        'nightly-rate': 180,
        'card-image': {
          url: '/placeholder-cabin.jpg',
          alt: 'Youghiogheny Cabin'
        },
        'property-rating': 4.9,
        'total-reviews': 203,
        beds: 7,
        baths: 1,
        guests: 8,
        'short-description': 'Youghiogheny hot tub cabin in Oakland, Maryland.',
        'body-description': 'Escape to this cozy cabin in Yough Mountain Resort.',
        latitude: 39.4073,
        longitude: -79.4067,
        'super-host': false,
        'plus-host': false,
        'premium-host': false,
        'verified-host': false
      }
    },
    {
      id: '68bc94a967f3b690b1bb3bca',
      fieldData: {
        name: 'Hot Tub, Pool Table, Ping Pong & Poker: Big Sky',
        slug: 'hot-tub-pool-table-ping-pong-poker-big-sky',
        city: 'McHenry',
        'street-address': '296 Marsh Hill Rd, McHenry, MD 21541',
        location: '68bc41779cdf82cd1890c01a',
        'nightly-rate': 450,
        'card-image': {
          url: '/placeholder-cabin.jpg',
          alt: 'Big Sky Property'
        },
        'property-rating': 4.8,
        'total-reviews': 98,
        beds: 10,
        baths: 5,
        guests: 16,
        'short-description': 'Big Sky property with hot tub, pool table, ping pong, and poker.',
        'body-description': 'Discover Big Sky, a luxurious ski-in/ski-out mountain retreat.',
        latitude: 39.5581,
        longitude: -79.3522,
        'super-host': false,
        'plus-host': false,
        'premium-host': false,
        'verified-host': false
      }
    },
    // Albuquerque properties (6 total)
    {
      id: '68bc94a8a1b2c3d4e5f67890',
      fieldData: {
        name: 'Albuquerque Downtown Loft',
        slug: 'albuquerque-downtown-loft',
        city: 'Albuquerque',
        'street-address': '123 Main St, Albuquerque, NM 87101',
        location: '68bc41779cdf82cd1890c01a',
        'nightly-rate': 95,
        'card-image': {
          url: '/placeholder-loft.jpg',
          alt: 'Albuquerque Loft'
        },
        'property-rating': 4.6,
        'total-reviews': 87,
        beds: 1,
        baths: 1,
        guests: 2,
        'short-description': 'Modern downtown loft in the heart of Albuquerque',
        'body-description': 'Experience the vibrant culture of Albuquerque from this central location.',
        latitude: 35.0844,
        longitude: -106.6504,
        'super-host': false,
        'plus-host': false,
        'premium-host': false,
        'verified-host': false
      }
    },
    {
      id: '68bc94a7b2c3d4e5f6789012',
      fieldData: {
        name: 'Albuquerque Mountain View Cabin',
        slug: 'albuquerque-mountain-view-cabin',
        city: 'Albuquerque',
        'street-address': '456 Mountain Rd, Albuquerque, NM 87102',
        location: '68bc41779cdf82cd1890c01a',
        'nightly-rate': 110,
        'card-image': {
          url: '/placeholder-cabin.jpg',
          alt: 'Albuquerque Cabin'
        },
        'property-rating': 4.7,
        'total-reviews': 92,
        beds: 2,
        baths: 1,
        guests: 4,
        'short-description': 'Cozy cabin with stunning mountain views',
        'body-description': 'Escape to the mountains while staying close to Albuquerque.',
        latitude: 35.0844,
        longitude: -106.6504,
        'super-host': false,
        'plus-host': false,
        'premium-host': false,
        'verified-host': false
      }
    },
    {
      id: '68bc94a6c3d4e5f678901234',
      fieldData: {
        name: 'Albuquerque Historic District Home',
        slug: 'albuquerque-historic-district-home',
        city: 'Albuquerque',
        'street-address': '789 Historic Ave, Albuquerque, NM 87103',
        location: '68bc41779cdf82cd1890c01a',
        'nightly-rate': 125,
        'card-image': {
          url: '/placeholder-loft.jpg',
          alt: 'Historic Home'
        },
        'property-rating': 4.8,
        'total-reviews': 156,
        beds: 3,
        baths: 2,
        guests: 6,
        'short-description': 'Charming historic home in the heart of Old Town',
        'body-description': 'Step back in time in this beautifully restored historic home.',
        latitude: 35.0844,
        longitude: -106.6504,
        'super-host': false,
        'plus-host': false,
        'premium-host': false,
        'verified-host': false
      }
    },
    {
      id: '68bc94a5d4e5f67890123456',
      fieldData: {
        name: 'Albuquerque Modern Apartment',
        slug: 'albuquerque-modern-apartment',
        city: 'Albuquerque',
        'street-address': '321 Modern St, Albuquerque, NM 87104',
        location: '68bc41779cdf82cd1890c01a',
        'nightly-rate': 85,
        'card-image': {
          url: '/placeholder-loft.jpg',
          alt: 'Modern Apartment'
        },
        'property-rating': 4.5,
        'total-reviews': 73,
        beds: 1,
        baths: 1,
        guests: 2,
        'short-description': 'Sleek modern apartment with city views',
        'body-description': 'Contemporary living in the heart of Albuquerque.',
        latitude: 35.0844,
        longitude: -106.6504,
        'super-host': false,
        'plus-host': false,
        'premium-host': false,
        'verified-host': false
      }
    },
    {
      id: '68bc94a4e5f6789012345678',
      fieldData: {
        name: 'Albuquerque Desert Retreat',
        slug: 'albuquerque-desert-retreat',
        city: 'Albuquerque',
        'street-address': '654 Desert Way, Albuquerque, NM 87105',
        location: '68bc41779cdf82cd1890c01a',
        'nightly-rate': 140,
        'card-image': {
          url: '/placeholder-cabin.jpg',
          alt: 'Desert Retreat'
        },
        'property-rating': 4.9,
        'total-reviews': 134,
        beds: 2,
        baths: 2,
        guests: 4,
        'short-description': 'Peaceful desert retreat with hot tub',
        'body-description': 'Relax in this serene desert setting with stunning views.',
        latitude: 35.0844,
        longitude: -106.6504,
        'super-host': false,
        'plus-host': false,
        'premium-host': false,
        'verified-host': false
      }
    },
    {
      id: '68bc94a3f678901234567890',
      fieldData: {
        name: 'Albuquerque Arts District Loft',
        slug: 'albuquerque-arts-district-loft',
        city: 'Albuquerque',
        'street-address': '987 Arts Blvd, Albuquerque, NM 87106',
        location: '68bc41779cdf82cd1890c01a',
        'nightly-rate': 105,
        'card-image': {
          url: '/placeholder-loft.jpg',
          alt: 'Arts District Loft'
        },
        'property-rating': 4.7,
        'total-reviews': 98,
        beds: 1,
        baths: 1,
        guests: 2,
        'short-description': 'Creative loft in the vibrant arts district',
        'body-description': 'Immerse yourself in Albuquerque\'s thriving arts scene.',
        latitude: 35.0844,
        longitude: -106.6504,
        'super-host': false,
        'plus-host': false,
        'premium-host': false,
        'verified-host': false
      }
    }
  ]
}

// Fast search function that searches across all property fields
const searchProperties = (query: string, properties: any[]) => {
  if (!query || query.trim().length < 2) {
    return []
  }

  const searchTerm = query.toLowerCase().trim()
  const results: any[] = []

  properties.forEach(property => {
    const transformed = transformProperty(property)
    
    // Create a searchable text that includes all relevant fields
    const searchableText = [
      transformed.title,
      transformed.location,
      transformed.streetAddress,
      transformed.shortDescription,
      transformed.bodyDescription,
      transformed.propertyType,
      transformed.host,
      transformed.availability,
      // Add amenities if they exist
      ...(transformed.amenities || [])
    ].join(' ').toLowerCase()

    // Check if search term matches
    if (searchableText.includes(searchTerm)) {
      // Calculate relevance score
      let score = 0
      
      // Exact title match gets highest score
      if (transformed.title.toLowerCase().includes(searchTerm)) {
        score += 100
      }
      
      // Location match gets high score
      if (transformed.location.toLowerCase().includes(searchTerm)) {
        score += 80
      }
      
      // Address match gets medium score
      if (transformed.streetAddress.toLowerCase().includes(searchTerm)) {
        score += 60
      }
      
      // Description match gets lower score
      if (transformed.shortDescription.toLowerCase().includes(searchTerm)) {
        score += 40
      }
      
      if (transformed.bodyDescription.toLowerCase().includes(searchTerm)) {
        score += 30
      }

      results.push({
        ...transformed,
        relevanceScore: score,
        matchType: getMatchType(transformed, searchTerm)
      })
    }
  })

  // Sort by relevance score (highest first)
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
}

// Helper function to determine match type
const getMatchType = (property: any, searchTerm: string) => {
  if (property.title.toLowerCase().includes(searchTerm)) {
    return 'title'
  } else if (property.location.toLowerCase().includes(searchTerm)) {
    return 'location'
  } else if (property.streetAddress.toLowerCase().includes(searchTerm)) {
    return 'address'
  } else if (property.shortDescription.toLowerCase().includes(searchTerm)) {
    return 'description'
  } else {
    return 'general'
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')

    const allProperties = getAllProperties()
    const searchResults = searchProperties(query, allProperties)
    
    // Limit results
    const limitedResults = searchResults.slice(0, limit)

    return NextResponse.json({
      query,
      results: limitedResults,
      total: searchResults.length,
      hasMore: searchResults.length > limit
    })
  } catch (error) {
    console.error('Error in search API:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
