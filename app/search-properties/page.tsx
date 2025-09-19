import { Property } from '@/lib/types'
import { PropertyDirectory } from '@/devlink/PropertyDirectory'

async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch('http://localhost:3000/api/properties', {
      cache: 'no-store' // Ensure data is always fresh
    })
        if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.statusText}`)
    }
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}


export default async function SearchPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await searchParams before using them
  const params = await searchParams
  
  // Fetch properties from API
  const properties = await getProperties()

  // Get initial filters from URL parameters
  const initialFilters = {
    location: typeof params.location === 'string' ? params.location : '',
    checkIn: typeof params.checkIn === 'string' ? params.checkIn : '',
    checkOut: typeof params.checkOut === 'string' ? params.checkOut : '',
    guests: typeof params.guests === 'string' ? parseInt(params.guests) : 1,
    priceRange: [
      typeof params.minPrice === 'string' ? parseInt(params.minPrice) : 0,
      typeof params.maxPrice === 'string' ? parseInt(params.maxPrice) : 1000
    ] as [number, number],
    amenities: typeof params.amenities === 'string' ? params.amenities.split(',') : []
  }

  return (
    <PropertyDirectory 
      properties={properties}
      initialFilters={initialFilters}
    />
  )
}
