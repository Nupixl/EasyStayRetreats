'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Navigation } from '@/devlink/Navigation'

export function NavigationWrapper() {
  const pathname = usePathname()
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: [0, 1000],
    amenities: []
  })

  const handleSearch = (filters: typeof searchFilters) => {
    setSearchFilters(filters)
    // Dispatch custom event to communicate with the page component
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('searchUpdate', { detail: filters }))
    }
  }

  // Only pass search props if we're on the search-properties page
  const isSearchPage = pathname === '/search-properties'

  return (
    <Navigation 
      onSearch={isSearchPage ? handleSearch : undefined}
      searchFilters={isSearchPage ? searchFilters : undefined}
    />
  )
}
