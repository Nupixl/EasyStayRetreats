'use client';

import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/property-card';
import { SearchFilters } from '@/components/search-filters';
import { SearchHeader } from '@/components/search-header';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  images: string[];
  type: 'retreat' | 'cabin' | 'villa' | 'apartment';
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  isAvailable: boolean;
  host: {
    name: string;
    avatar: string;
    isSuperhost: boolean;
  };
}

export default function SearchPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: [0, 1000] as [number, number],
    propertyType: 'all',
    amenities: [] as string[],
    rating: 0
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockProperties: Property[] = [
      {
        id: 1,
        title: "Mountain Zen Retreat",
        location: "Swiss Alps, Switzerland",
        price: 2499,
        pricePerNight: 357,
        rating: 4.9,
        reviewCount: 127,
        images: ["/images/retreat-mountain.jpg", "/images/retreat-mountain-2.jpg"],
        type: "retreat",
        amenities: ["WiFi", "Kitchen", "Parking", "Hot Tub", "Mountain View"],
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        isAvailable: true,
        host: {
          name: "Sarah Johnson",
          avatar: "/images/host-1.jpg",
          isSuperhost: true
        }
      },
      {
        id: 2,
        title: "Coastal Mindfulness Villa",
        location: "Big Sur, California",
        price: 1899,
        pricePerNight: 380,
        rating: 4.8,
        reviewCount: 89,
        images: ["/images/retreat-coastal.jpg", "/images/retreat-coastal-2.jpg"],
        type: "villa",
        amenities: ["WiFi", "Ocean View", "Beach Access", "Yoga Studio", "Organic Garden"],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        isAvailable: true,
        host: {
          name: "Michael Chen",
          avatar: "/images/host-2.jpg",
          isSuperhost: true
        }
      },
      {
        id: 3,
        title: "Forest Sanctuary Cabin",
        location: "Costa Rica",
        price: 3299,
        pricePerNight: 330,
        rating: 4.9,
        reviewCount: 156,
        images: ["/images/retreat-forest.jpg", "/images/retreat-forest-2.jpg"],
        type: "cabin",
        amenities: ["WiFi", "Jungle View", "Wildlife Spotting", "Waterfall Access", "Eco-Friendly"],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        isAvailable: true,
        host: {
          name: "Emma Rodriguez",
          avatar: "/images/host-3.jpg",
          isSuperhost: true
        }
      },
      {
        id: 4,
        title: "Desert Oasis Retreat",
        location: "Sedona, Arizona",
        price: 1599,
        pricePerNight: 320,
        rating: 4.7,
        reviewCount: 73,
        images: ["/images/retreat-desert.jpg"],
        type: "retreat",
        amenities: ["WiFi", "Desert View", "Meditation Garden", "Spa Services", "Hiking Trails"],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        isAvailable: true,
        host: {
          name: "David Thompson",
          avatar: "/images/host-4.jpg",
          isSuperhost: false
        }
      },
      {
        id: 5,
        title: "Lakeside Wellness Cabin",
        location: "Lake Tahoe, California",
        price: 2199,
        pricePerNight: 440,
        rating: 4.8,
        reviewCount: 94,
        images: ["/images/retreat-lake.jpg"],
        type: "cabin",
        amenities: ["WiFi", "Lake View", "Private Dock", "Fireplace", "Kayaking"],
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        isAvailable: true,
        host: {
          name: "Lisa Anderson",
          avatar: "/images/host-5.jpg",
          isSuperhost: true
        }
      },
      {
        id: 6,
        title: "Tropical Paradise Villa",
        location: "Bali, Indonesia",
        price: 2799,
        pricePerNight: 400,
        rating: 4.9,
        reviewCount: 201,
        images: ["/images/retreat-bali.jpg"],
        type: "villa",
        amenities: ["WiFi", "Private Pool", "Beach Access", "Spa", "Cultural Tours"],
        maxGuests: 10,
        bedrooms: 5,
        bathrooms: 4,
        isAvailable: true,
        host: {
          name: "Ayu Putri",
          avatar: "/images/host-6.jpg",
          isSuperhost: true
        }
      }
    ];

    setProperties(mockProperties);
    setFilteredProperties(mockProperties);
    setLoading(false);
  }, []);

  // Filter properties based on search criteria
  useEffect(() => {
    let filtered = properties;

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.title.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(property =>
      property.pricePerNight >= filters.priceRange[0] &&
      property.pricePerNight <= filters.priceRange[1]
    );

    // Property type filter
    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(property => property.type === filters.propertyType);
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(property => property.rating >= filters.rating);
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities.every(amenity => property.amenities.includes(amenity))
      );
    }

    setFilteredProperties(filtered);
  }, [properties, filters]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      priceRange: [0, 1000] as [number, number],
      propertyType: 'all',
      amenities: [],
      rating: 0
    });
  };

  if (loading) {
    return (
      <div className="search_loading">
        <div className="container-large padding-global padding-section-large">
          <div className="search_loading-content text-align-center">
            <div className="search_loading-spinner"></div>
            <p className="text-size-large margin-top-medium">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search_properties-page">
      <SearchHeader 
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={filteredProperties.length}
      />
      
      <div className="search_properties-content">
        <div className="container-large padding-global">
          <div className="search_properties-layout">
            <aside className="search_filters-sidebar">
              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </aside>
            
            <main className="search_properties-main">
              <div className="search_results-header">
                <h1 className="heading-style-h2">
                  {filteredProperties.length} properties found
                </h1>
                <div className="search_results-sort">
                  <select className="search_sort-select">
                    <option value="relevance">Sort by relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest rated</option>
                    <option value="newest">Newest first</option>
                  </select>
                </div>
              </div>
              
              <div className="search_results-grid">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onBookNow={(propertyId) => {
                      // Handle booking logic
                      console.log('Book now:', propertyId);
                    }}
                    onViewDetails={(propertyId) => {
                      // Handle view details logic
                      console.log('View details:', propertyId);
                    }}
                  />
                ))}
              </div>
              
              {filteredProperties.length === 0 && (
                <div className="search_no-results text-align-center padding-section-large">
                  <h2 className="heading-style-h3 margin-bottom-medium">
                    No properties found
                  </h2>
                  <p className="text-size-large text-color-neutral-600 margin-bottom-large">
                    Try adjusting your search criteria or filters
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="button is-primary"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
