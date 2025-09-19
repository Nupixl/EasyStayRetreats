import React from 'react'
import { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
  isSelected?: boolean
}

export function PropertyCard({ property, isSelected = false }: PropertyCardProps) {
  return (
    <div className={`property-card bg-white rounded-xl shadow-sm overflow-hidden ${
      isSelected ? 'ring-2 ring-dodger-blue' : ''
    }`}>
      {/* Property Image */}
      <div className="relative h-48 bg-grey-background">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a simple colored placeholder
            e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
              <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f7f8fc"/>
                <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="16" fill="#516381" text-anchor="middle" dy=".3em">${property.title}</text>
              </svg>
            `)}`
          }}
        />
        {/* Super Host Badge */}
        <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-xs font-semibold text-black shadow-sm">
          Super Host
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Card Title */}
        <h3 className="font-semibold text-black text-lg leading-tight mb-2">
          {property.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <svg className="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
          <span className="text-sm font-medium text-body-display">
            {property.rating} ({property.reviews.toLocaleString()})
          </span>
        </div>

        {/* First Line Details */}
        <p className="text-body-display text-sm mb-2">
          {property.location}
        </p>

        {/* Second Line Tags */}
        <div className="flex items-center text-sm text-body-display mb-4">
          <span>{property.guests} guests</span>
          <span className="mx-2">•</span>
          <span>{property.bedrooms} bed</span>
          <span className="mx-2">•</span>
          <span>{property.bathrooms} bath</span>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-bold text-black">
              ${property.price.toLocaleString()}
            </span>
            <span className="text-sm text-body-display">/night</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-black">
              ${(property.price * 30).toLocaleString()}
            </div>
            <div className="text-xs text-body-display">Monthly</div>
          </div>
        </div>
      </div>
    </div>
  )
}
