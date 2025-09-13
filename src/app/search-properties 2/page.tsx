'use client';

import { useState } from 'react';
import { EnhancedSearchFilters } from '@/components/EnhancedSearchFilters';
import { PropertyCard } from '@/components/PropertyCard';

// Mock data for properties
const mockProperties = [
  {
    id: 1,
    title: "Mountain Wellness Retreat",
    location: "Aspen, Colorado",
    type: "Luxury Cabin",
    pricePerNight: 450,
    rating: 4.9,
    reviewCount: 127,
    host: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      isSuperhost: true,
    },
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"],
    amenities: ["WiFi", "Pool", "Spa", "Kitchen"],
  },
  {
    id: 2,
    title: "Coastal Meditation Center",
    location: "Big Sur, California",
    type: "Ocean View Villa",
    pricePerNight: 650,
    rating: 4.8,
    reviewCount: 89,
    host: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      isSuperhost: true,
    },
    images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"],
    amenities: ["WiFi", "Ocean View", "Spa", "Kitchen"],
  },
  {
    id: 3,
    title: "Forest Yoga Sanctuary",
    location: "Sedona, Arizona",
    type: "Desert Retreat",
    pricePerNight: 380,
    rating: 4.7,
    reviewCount: 156,
    host: {
      name: "Emma Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      isSuperhost: false,
    },
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"],
    amenities: ["WiFi", "Gym", "Kitchen", "Parking"],
  },
  {
    id: 4,
    title: "Lakeside Wellness Lodge",
    location: "Lake Tahoe, Nevada",
    type: "Mountain Lodge",
    pricePerNight: 520,
    rating: 4.9,
    reviewCount: 203,
    host: {
      name: "David Thompson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      isSuperhost: true,
    },
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"],
    amenities: ["WiFi", "Pool", "Spa", "Gym", "Kitchen"],
  },
  {
    id: 5,
    title: "Desert Oasis Retreat",
    location: "Palm Springs, California",
    type: "Modern Villa",
    pricePerNight: 420,
    rating: 4.6,
    reviewCount: 94,
    host: {
      name: "Lisa Park",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
      isSuperhost: false,
    },
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"],
    amenities: ["WiFi", "Pool", "Kitchen", "Parking"],
  },
  {
    id: 6,
    title: "Bali Wellness Villa",
    location: "Ubud, Bali",
    type: "Tropical Villa",
    pricePerNight: 320,
    rating: 4.8,
    reviewCount: 178,
    host: {
      name: "Ahmad Surya",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      isSuperhost: true,
    },
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"],
    amenities: ["WiFi", "Pool", "Spa", "Kitchen", "Pet Friendly"],
  },
];

export default function SearchPropertiesPage() {
  const [filters, setFilters] = useState<any>({});
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    
    // Simple filtering logic
    let filtered = mockProperties;
    
    if (newFilters.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(newFilters.location.toLowerCase())
      );
    }
    
    if (newFilters.priceRange) {
      filtered = filtered.filter(property => 
        property.pricePerNight >= newFilters.priceRange[0] && 
        property.pricePerNight <= newFilters.priceRange[1]
      );
    }
    
    if (newFilters.propertyType) {
      filtered = filtered.filter(property => 
        property.type.toLowerCase().includes(newFilters.propertyType.toLowerCase())
      );
    }
    
    if (newFilters.amenities && newFilters.amenities.length > 0) {
      filtered = filtered.filter(property => 
        newFilters.amenities.every((amenity: string) => 
          property.amenities.includes(amenity)
        )
      );
    }
    
    setFilteredProperties(filtered);
  };

  const handleBookNow = (propertyId: number) => {
    console.log('Book now:', propertyId);
    // Navigate to booking page or open booking modal
  };

  const handleViewDetails = (propertyId: number) => {
    console.log('View details:', propertyId);
    // Navigate to property details page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Retreat
          </h1>
          <p className="text-lg text-gray-600">
            Discover transformative wellness retreats in stunning locations around the world
          </p>
        </div>

        {/* Search Filters */}
        <div className="mb-8">
          <EnhancedSearchFilters
            location={filters.location || ""}
            checkInDate={filters.checkInDate || ""}
            checkOutDate={filters.checkOutDate || ""}
            guests={filters.guests || 1}
            priceRange={filters.priceRange || [50, 1000]}
            propertyType={filters.propertyType || "Any"}
            amenities={filters.amenities || []}
            onLocationChange={(value: string) => handleFiltersChange({ location: value })}
            onCheckInChange={(value: string) => handleFiltersChange({ checkInDate: value })}
            onCheckOutChange={(value: string) => handleFiltersChange({ checkOutDate: value })}
            onGuestsChange={(value: number) => handleFiltersChange({ guests: value })}
            onPriceRangeChange={(value: [number, number]) => handleFiltersChange({ priceRange: value })}
            onPropertyTypeChange={(value: string) => handleFiltersChange({ propertyType: value })}
            onAmenitiesChange={(value: string[]) => handleFiltersChange({ amenities: value })}
            onSearch={() => {
              console.log('Search triggered with filters:', filters);
              // Additional search logic can be added here
            }}
            onReset={() => {
              setFilters({});
              setFilteredProperties(mockProperties);
            }}
            isLoading={false}
            propertyTypes={["Any", "Cabin", "Villa", "Treehouse", "Lodge", "Retreat", "Desert Retreat", "Mountain Lodge", "Modern Villa", "Tropical Villa"]}
            availableAmenities={["WiFi", "Pool", "Spa", "Kitchen", "Gym", "Parking", "Pet Friendly", "Ocean View", "Mountain View", "Desert Views", "Stargazing", "Lake Access", "Kayaking", "Firepit", "Yoga Studio", "Rice Paddy Views"]}
          />
        </div>

        {/* Search Results */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {filteredProperties.length} Retreats Found
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                propertyTitle={property.title}
                firstLine={property.location}
                secoundLine={property.type}
                price={`$${property.pricePerNight.toLocaleString()}`}
                duration="night"
                propertyRating={property.rating.toFixed(1)}
                numberOfReviews={`(${property.reviewCount})`}
                propertyAccolade={property.host.isSuperhost}
                propertyAccoladeType={property.host.isSuperhost ? "Super Host" : ""}
                accoladeImageDispaly={property.host.isSuperhost}
                accoladeIcon=""
                imageAccoladeAltText="Super Host"
                accoladeImageSrc={property.host.avatar}
                propertyImageSrc={property.images[0]}
                propertyImageAltText={property.title}
                onBookNow={() => handleBookNow(property.id)}
                onViewDetails={() => handleViewDetails(property.id)}
                onFavorite={() => console.log('Toggle favorite:', property.id)}
                onShare={() => console.log('Share property:', property.id)}
                isFavorite={false}
                isAvailable={true}
                discountPercentage={0}
                amenities={property.amenities}
                hostName={property.host.name}
                hostAvatar={property.host.avatar}
                propertyType={property.type}
                maxGuests={4}
                bedrooms={2}
                bathrooms={1}
                checkInTime="3:00 PM"
                checkOutTime="11:00 AM"
                cancellationPolicy="Flexible"
                instantBook={property.host.isSuperhost}
                verified={property.host.isSuperhost}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}