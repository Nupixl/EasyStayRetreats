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

interface SearchHeaderProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  resultCount: number;
}

export function SearchHeader({ filters, onFilterChange, resultCount }: SearchHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.checkIn || filters.checkOut) count++;
    if (filters.guests > 1) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.propertyType !== 'all') count++;
    if (filters.amenities.length > 0) count++;
    if (filters.rating > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <header className="search_header">
      <div className="container-large padding-global">
        <div className="search_header-content">
          {/* Logo */}
          <div className="search_header-logo">
            <a href="/" className="search_header-logo-link">
              <span className="search_header-logo-text">Easy Stay Retreats</span>
            </a>
          </div>

          {/* Search Bar */}
          <div className="search_header-search">
            <div className="search_header-search-bar">
              <div className="search_header-search-item">
                <label className="search_header-search-label">Where</label>
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={filters.location}
                  onChange={(e) => onFilterChange({ location: e.target.value })}
                  className="search_header-search-input"
                />
              </div>

              <div className="search_header-search-divider"></div>

              <div className="search_header-search-item">
                <label className="search_header-search-label">Check in</label>
                <input
                  type="date"
                  value={filters.checkIn}
                  onChange={(e) => onFilterChange({ checkIn: e.target.value })}
                  className="search_header-search-input"
                />
              </div>

              <div className="search_header-search-divider"></div>

              <div className="search_header-search-item">
                <label className="search_header-search-label">Check out</label>
                <input
                  type="date"
                  value={filters.checkOut}
                  onChange={(e) => onFilterChange({ checkOut: e.target.value })}
                  className="search_header-search-input"
                />
              </div>

              <div className="search_header-search-divider"></div>

              <div className="search_header-search-item">
                <label className="search_header-search-label">Who</label>
                <select
                  value={filters.guests}
                  onChange={(e) => onFilterChange({ guests: parseInt(e.target.value) })}
                  className="search_header-search-input"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num} guest{num !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button className="search_header-search-button">
                <span className="search_header-search-icon">🔍</span>
                <span className="search_header-search-text">Search</span>
              </button>
            </div>
          </div>

          {/* User Menu */}
          <div className="search_header-user">
            <button className="search_header-user-button">
              <span className="search_header-user-text">Become a Host</span>
            </button>
            <button className="search_header-user-button">
              <span className="search_header-user-icon">🌐</span>
            </button>
            <button className="search_header-user-menu">
              <div className="search_header-user-avatar">
                <span className="search_header-user-avatar-icon">👤</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Toggle */}
        <div className="search_header-mobile">
          <button
            className="search_header-mobile-toggle"
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          >
            <div className="search_header-mobile-search">
              <span className="search_header-mobile-location">
                {filters.location || 'Where to?'}
              </span>
              <span className="search_header-mobile-dates">
                {filters.checkIn && filters.checkOut 
                  ? `${formatDate(filters.checkIn)} - ${formatDate(filters.checkOut)}`
                  : 'Add dates'
                }
              </span>
              <span className="search_header-mobile-guests">
                {filters.guests} guest{filters.guests !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="search_header-mobile-filters">
              {activeFiltersCount > 0 && (
                <span className="search_header-mobile-filter-count">
                  {activeFiltersCount}
                </span>
              )}
              <span className="search_header-mobile-filter-icon">⚙️</span>
            </div>
          </button>
        </div>

        {/* Results Summary */}
        <div className="search_header-results">
          <div className="search_header-results-content">
            <h1 className="search_header-results-title">
              {resultCount} properties found
            </h1>
            <div className="search_header-results-filters">
              {filters.location && (
                <span className="search_header-results-filter">
                  {filters.location}
                </span>
              )}
              {filters.checkIn && filters.checkOut && (
                <span className="search_header-results-filter">
                  {formatDate(filters.checkIn)} - {formatDate(filters.checkOut)}
                </span>
              )}
              {filters.guests > 1 && (
                <span className="search_header-results-filter">
                  {filters.guests} guests
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
