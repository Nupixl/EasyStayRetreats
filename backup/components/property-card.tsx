'use client';

import Image from 'next/image';
import { useState } from 'react';

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

interface PropertyCardProps {
  property: Property;
  onBookNow: (propertyId: number) => void;
  onViewDetails: (propertyId: number) => void;
}

export function PropertyCard({ property, onBookNow, onViewDetails }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels = {
      retreat: 'Wellness Retreat',
      cabin: 'Cabin',
      villa: 'Villa',
      apartment: 'Apartment'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="property_card">
      <div className="property_card-image-wrapper">
        <div className="property_card-image-container">
          <Image
            src={property.images[currentImageIndex] || '/images/placeholder-property.jpg'}
            alt={property.title}
            width={400}
            height={300}
            className="property_card-image"
            priority
          />
          
          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                className="property_card-nav property_card-nav-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageNavigation('prev');
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                className="property_card-nav property_card-nav-next"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageNavigation('next');
                }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
          
          {/* Image Indicators */}
          {property.images.length > 1 && (
            <div className="property_card-indicators">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  className={`property_card-indicator ${
                    index === currentImageIndex ? 'is-active' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Favorite Button */}
        <button
          className={`property_card-favorite ${isFavorite ? 'is-favorited' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className="property_card-favorite-icon">
            {isFavorite ? '❤️' : '🤍'}
          </span>
        </button>
        
        {/* Property Type Badge */}
        <div className="property_card-type-badge">
          {getPropertyTypeLabel(property.type)}
        </div>
      </div>
      
      <div className="property_card-content">
        <div className="property_card-header">
          <div className="property_card-location">
            <h3 className="property_card-title">{property.title}</h3>
            <p className="property_card-location-text">{property.location}</p>
          </div>
          
          <div className="property_card-rating">
            <span className="property_card-rating-icon">⭐</span>
            <span className="property_card-rating-value">{property.rating}</span>
            <span className="property_card-review-count">
              ({property.reviewCount})
            </span>
          </div>
        </div>
        
        <div className="property_card-details">
          <div className="property_card-specs">
            <span className="property_card-spec">
              {property.maxGuests} guest{property.maxGuests !== 1 ? 's' : ''}
            </span>
            <span className="property_card-spec">
              {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}
            </span>
            <span className="property_card-spec">
              {property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="property_card-amenities">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="property_card-amenity">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="property_card-amenity-more">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="property_card-host">
          <div className="property_card-host-info">
            <Image
              src={property.host.avatar || '/images/placeholder-avatar.jpg'}
              alt={property.host.name}
              width={32}
              height={32}
              className="property_card-host-avatar"
            />
            <div className="property_card-host-details">
              <span className="property_card-host-name">{property.host.name}</span>
              {property.host.isSuperhost && (
                <span className="property_card-superhost">Superhost</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="property_card-footer">
          <div className="property_card-pricing">
            <span className="property_card-price">
              {formatPrice(property.pricePerNight)}
            </span>
            <span className="property_card-price-period">per night</span>
          </div>
          
          <div className="property_card-actions">
            <button
              className="button is-text property_card-view-details"
              onClick={() => onViewDetails(property.id)}
            >
              View Details
            </button>
            <button
              className="button is-primary property_card-book-now"
              onClick={() => onBookNow(property.id)}
              disabled={!property.isAvailable}
            >
              {property.isAvailable ? 'Book Now' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
