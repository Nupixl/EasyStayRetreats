'use client';

import { useState } from 'react';

interface Filters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  priceRange: [number, number];
  propertyType: string;
  amenities: string[];
  rating: number;
}

interface SearchFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
}

const AMENITIES = [
  'WiFi',
  'Kitchen',
  'Parking',
  'Hot Tub',
  'Mountain View',
  'Ocean View',
  'Beach Access',
  'Yoga Studio',
  'Organic Garden',
  'Wildlife Spotting',
  'Waterfall Access',
  'Eco-Friendly',
  'Private Pool',
  'Spa',
  'Cultural Tours',
  'Hiking Trails',
  'Fireplace',
  'Kayaking',
  'Meditation Garden',
  'Spa Services'
];

const PROPERTY_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'retreat', label: 'Wellness Retreat' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' }
];

export function SearchFilters({ filters, onFilterChange, onClearFilters }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState({
    price: false,
    amenities: false,
    propertyType: false,
    rating: false
  });

  const toggleExpanded = (section: keyof typeof isExpanded) => {
    setIsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    onFilterChange({ amenities: newAmenities });
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newPriceRange: [number, number] = [...filters.priceRange];
    newPriceRange[index] = value;
    onFilterChange({ priceRange: newPriceRange });
  };

  return (
    <div className="search_filters">
      <div className="search_filters-header">
        <h3 className="heading-style-h4">Filters</h3>
        <button
          className="button is-text search_filters-clear"
          onClick={onClearFilters}
        >
          Clear all
        </button>
      </div>

      <div className="search_filters-content">
        {/* Location */}
        <div className="search_filter-group">
          <label className="search_filter-label">Location</label>
          <input
            type="text"
            placeholder="Where are you going?"
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="search_filter-input"
          />
        </div>

        {/* Dates */}
        <div className="search_filter-group">
          <label className="search_filter-label">Check-in & Check-out</label>
          <div className="search_filter-dates">
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) => onFilterChange({ checkIn: e.target.value })}
              className="search_filter-date"
            />
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) => onFilterChange({ checkOut: e.target.value })}
              className="search_filter-date"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="search_filter-group">
          <label className="search_filter-label">Guests</label>
          <select
            value={filters.guests}
            onChange={(e) => onFilterChange({ guests: parseInt(e.target.value) })}
            className="search_filter-select"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>
                {num} guest{num !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="search_filter-group">
          <button
            className="search_filter-toggle"
            onClick={() => toggleExpanded('price')}
          >
            <span className="search_filter-toggle-label">Price Range</span>
            <span className="search_filter-toggle-icon">
              {isExpanded.price ? '−' : '+'}
            </span>
          </button>
          
          {isExpanded.price && (
            <div className="search_filter-expanded">
              <div className="search_filter-price-range">
                <div className="search_filter-price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value) || 0)}
                    className="search_filter-price-input"
                  />
                  <span className="search_filter-price-separator">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value) || 1000)}
                    className="search_filter-price-input"
                  />
                </div>
                <div className="search_filter-price-slider">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value))}
                    className="search_filter-range"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value))}
                    className="search_filter-range"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Property Type */}
        <div className="search_filter-group">
          <button
            className="search_filter-toggle"
            onClick={() => toggleExpanded('propertyType')}
          >
            <span className="search_filter-toggle-label">Property Type</span>
            <span className="search_filter-toggle-icon">
              {isExpanded.propertyType ? '−' : '+'}
            </span>
          </button>
          
          {isExpanded.propertyType && (
            <div className="search_filter-expanded">
              <div className="search_filter-options">
                {PROPERTY_TYPES.map(type => (
                  <label key={type.value} className="search_filter-option">
                    <input
                      type="radio"
                      name="propertyType"
                      value={type.value}
                      checked={filters.propertyType === type.value}
                      onChange={(e) => onFilterChange({ propertyType: e.target.value })}
                      className="search_filter-radio"
                    />
                    <span className="search_filter-option-label">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="search_filter-group">
          <button
            className="search_filter-toggle"
            onClick={() => toggleExpanded('rating')}
          >
            <span className="search_filter-toggle-label">Rating</span>
            <span className="search_filter-toggle-icon">
              {isExpanded.rating ? '−' : '+'}
            </span>
          </button>
          
          {isExpanded.rating && (
            <div className="search_filter-expanded">
              <div className="search_filter-rating">
                {[4.5, 4.0, 3.5, 3.0].map(rating => (
                  <label key={rating} className="search_filter-option">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={(e) => onFilterChange({ rating: parseFloat(e.target.value) })}
                      className="search_filter-radio"
                    />
                    <span className="search_filter-option-label">
                      ⭐ {rating}+ stars
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="search_filter-group">
          <button
            className="search_filter-toggle"
            onClick={() => toggleExpanded('amenities')}
          >
            <span className="search_filter-toggle-label">Amenities</span>
            <span className="search_filter-toggle-icon">
              {isExpanded.amenities ? '−' : '+'}
            </span>
          </button>
          
          {isExpanded.amenities && (
            <div className="search_filter-expanded">
              <div className="search_filter-amenities">
                {AMENITIES.map(amenity => (
                  <label key={amenity} className="search_filter-amenity">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="search_filter-checkbox"
                    />
                    <span className="search_filter-amenity-label">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
