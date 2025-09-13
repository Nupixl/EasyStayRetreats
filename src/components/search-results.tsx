'use client';

import { PropertyCard } from './PropertyCard';

interface Property {
  id: number;
  title: string;
  location: string;
  type: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  host: {
    name: string;
    avatar: string;
    isSuperhost: boolean;
  };
  images: string[];
  amenities: string[];
}

interface SearchResultsProps {
  properties: Property[];
  onBookNow?: (propertyId: number) => void;
  onViewDetails?: (propertyId: number) => void;
}

export function SearchResults({ properties, onBookNow, onViewDetails }: SearchResultsProps) {
  if (properties.length === 0) {
    return (
      <div className="search-results-empty text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
        <p className="text-gray-500">Try adjusting your search filters to find more properties.</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results-header mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
        </h2>
        <p className="text-gray-600 mt-1">
          Discover your perfect wellness retreat
        </p>
      </div>

      <div className="search-results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
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
            acolladeImageUrl={property.host.avatar}
            propertyImageUrl={property.images[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"}
            propertyImageAltText={property.title}
            onBookNow={() => onBookNow?.(property.id)}
            onViewDetails={() => onViewDetails?.(property.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {properties.length > 0 && (
        <div className="search-results-pagination mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md">
              1
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
