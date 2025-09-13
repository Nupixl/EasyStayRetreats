"use client";
import React from 'react';
import { PropertyCard } from './webflow/PropertyCard';

interface WebflowPropertyCardProps {
  property: {
    id: number;
    title: string;
    location: string;
    price: number;
    rating: number;
    reviews: number;
    images: string[];
    host: {
      name: string;
      avatar: string;
      isSuperHost: boolean;
    };
    amenities: string[];
    propertyType: string;
  };
  onBookNow?: () => void;
}

export function WebflowPropertyCard({ property, onBookNow }: WebflowPropertyCardProps) {
  return (
    <PropertyCard
      propertyTitle={property.title}
      firstLine={property.location}
      secoundLine={property.propertyType}
      price={`$${property.price.toLocaleString()}`}
      duration="night"
      propertyRating={property.rating.toFixed(1)}
      numberOfReviews={`(${property.reviews})`}
      propertyAccolade={property.host.isSuperHost}
      propertyAccoladeType={property.host.isSuperHost ? "Super Host" : ""}
      accoladeImageDispaly={property.host.isSuperHost}
      accoladeIcon=""
      imageAccoladeAltText="Super Host"
      acolladeFavoriteTag="div"
      cardLink="div"
      imageSlot={
        <div className="property-image-gallery">
          {property.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${property.title} - Image ${index + 1}`}
              className="property-image"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          ))}
        </div>
      }
    />
  );
}
