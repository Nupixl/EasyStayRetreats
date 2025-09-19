'use client'

import React, { useState } from 'react'
import { SearchFilters } from '@/lib/types'

interface EnhancedSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters: SearchFilters
}

export function EnhancedSearchFilters({ onSearch, initialFilters }: EnhancedSearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)

  const handleInputChange = (field: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  return (
    <div className="space-y-8">
      {/* Where Section */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-4">Where</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-body-display mb-2">Search by Location</h4>
            <input
              type="text"
              placeholder="Enter destination"
              value={filters.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-dodger-blue focus:border-transparent text-sm bg-white"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-body-display mb-2">Popular Destinations</h4>
            <div className="space-y-2">
              {['New York', 'California', 'Florida', 'Texas', 'Colorado'].map((destination) => (
                <button
                  key={destination}
                  onClick={() => handleInputChange('location', destination)}
                  className="block w-full text-left px-3 py-2 text-sm text-body-display hover:bg-grey-background rounded-md transition-colors"
                >
                  {destination}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* When Section */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-4">When</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-body-display mb-2">Check-in & Check-out</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={filters.checkIn}
                onChange={(e) => handleInputChange('checkIn', e.target.value)}
                className="w-full px-3 py-2 border border-outline rounded-md focus:outline-none focus:ring-2 focus:ring-dodger-blue focus:border-transparent text-sm bg-white"
              />
              <input
                type="date"
                value={filters.checkOut}
                onChange={(e) => handleInputChange('checkOut', e.target.value)}
                className="w-full px-3 py-2 border border-outline rounded-md focus:outline-none focus:ring-2 focus:ring-dodger-blue focus:border-transparent text-sm bg-white"
              />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-body-display mb-2">Trip Length</h4>
            <div className="space-y-2">
              {['Weekend (2-3 days)', 'Week (4-7 days)', 'Extended (8+ days)'].map((length) => (
                <button
                  key={length}
                  className="block w-full text-left px-3 py-2 text-sm text-body-display hover:bg-grey-background rounded-md transition-colors"
                >
                  {length}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Who Section */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-4">Who</h3>
        <div>
          <h4 className="text-sm font-medium text-body-display mb-2">Guests</h4>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleInputChange('guests', Math.max(1, filters.guests - 1))}
              className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-body-display hover:bg-grey-background"
            >
              -
            </button>
            <span className="text-sm font-medium text-black min-w-[2rem] text-center">
              {filters.guests}
            </span>
            <button
              onClick={() => handleInputChange('guests', filters.guests + 1)}
              className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-body-display hover:bg-grey-background"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={() => onSearch(filters)}
        className="w-full bg-dodger-blue text-white py-3 px-4 rounded-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-dodger-blue focus:ring-offset-2 transition-colors font-medium"
      >
        Search
      </button>
    </div>
  )
}
