'use client'

import React from 'react'
import Link from 'next/link'
import { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
  isSelected?: boolean
  onPropertySelect?: (property: Property) => void
}

export function PropertyCard({ property, isSelected, onPropertySelect }: PropertyCardProps) {
  const handleCardClick = () => {
    if (onPropertySelect) {
      onPropertySelect(property)
    }
  }

  // Use property.images if available, otherwise fallback to a single image array
  const images = property.images && property.images.length > 0 
    ? property.images 
    : [property.primaryImage || property.image || "https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg"]

  return (
    <div 
      data-wf--property-card--variant="base" 
      className="property-card"
      onClick={handleCardClick}
    >
      <div className="property-card-top-content">
        <div data-delay="4000" data-animation="slide" className="slider w-slider" data-autoplay="false" data-easing="ease" data-hide-arrows="false" data-disable-swipe="false" data-autoplay-limit="0" data-nav-spacing="3" data-duration="500" data-infinite="true">
          <div className="card-top-interactive-container">
            <div className="card-favorite-button"></div>
          </div>
          <div className="mask w-slider-mask">
            {images.map((imgSrc, index) => (
              <div key={index} className="expand-slide w-slide">
                <img src={imgSrc} loading="lazy" alt="" className="property-card-image" />
              </div>
            ))}
          </div>
          <div className="left-arrow hide w-slider-arrow-left">
            <div className="w-icon-slider-left"></div>
          </div>
          <div className="right-arrow hide w-slider-arrow-right">
            <div className="w-icon-slider-right"></div>
          </div>
          <div className="property-card-slide-nav w-slider-nav w-round"></div>
        </div>
      </div>
      <Link href={`/property/${property.slug || property.id}`} className="property-card-link w-inline-block">
        <div className="propert-card-bottom-contnet">
          <div className="card-first-line">
            <div data-field="card-title" className="property-card-title">
              <div>{property.title}</div>
            </div>
            <div className="property-card-rating-wrapper">
              <div className="icon-wrapper small right-margin">
                <img src="/images/Star.png" loading="lazy" alt="" />
              </div>
              <div data-field="card-rating" className="property-card-rating">
                <div>{property.rating}</div>
              </div>
              <div data-field="card-rating-count" className="proper-card-number-of-ratings">
                <div>({property.reviewCount || property.reviews})</div>
              </div>
            </div>
          </div>
          <div className="card-second-line">
            <div>{property.locationLabel || property.location}</div>
            <div>,</div>
            <div></div>
          </div>
          <div className="card-fourth-line">
            <div className="card-price-wrapper">
              {property.comparePrice && property.comparePrice !== property.price && (
                <div className="card-compare-price">${property.comparePrice}</div>
              )}
              <div className="card-price">${property.price}</div>
              <div className="card-duration">/ night</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}