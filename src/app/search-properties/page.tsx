'use client';

import { NavbarWrapper, NavbarContainer, NavbarBrand, NavbarMenu, NavbarLink, NavbarButton } from '@/components/_Builtin/Navbar';
import { SearchFilters } from '@/components/SearchFilters';
import { PropertyCard } from '@/components/PropertyCard';
import { Footer } from '@/components/Footer';
import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { properties as sampleProperties, Property } from '@/data/properties';
import { useSearchParams, useRouter } from 'next/navigation';

// Mapbox configuration
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';
const USE_MAPBOX = false; // Set to true when you have a Mapbox token

function SearchPropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filteredProperties, setFilteredProperties] = useState<any[]>(sampleProperties);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    // Filter logic will be implemented when we connect to CMS
  };

  const handleBookNow = (propertyId: string) => {
    console.log('Book now:', propertyId);
  };

  const handleViewDetails = (propertyId: string) => {
    console.log('View details:', propertyId);
  };

  // Minimal native Google Maps init for local testing
  useEffect(() => {
    function ensureMapEl() {
      const el = document.getElementById('search-map');
      if (el && !el.getAttribute('data-ready')) {
        el.setAttribute('data-ready', 'true');
        if (!/height:\s*\d|vh|%/.test(el.getAttribute('style') || '')) {
          (el as HTMLDivElement).style.minHeight = '60vh';
          (el as HTMLDivElement).style.width = '100%';
        }
      }
      return el as HTMLDivElement | null;
    }

    function loadGoogle(cb: () => void) {
      if ((window as any).google && (window as any).google.maps) { cb(); return; }
      const s = document.createElement('script');
      s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD8v_6yM27IK1EqjrA9zQKsl5XyoQmA92Q&libraries=places';
      s.async = true; s.defer = true; s.onload = cb; document.head.appendChild(s);
    }

    function render() {
      const el = ensureMapEl(); if (!el) return;
      const googleAny = (window as any).google;
      const map = new googleAny.maps.Map(el, { center: { lat: 34.0522, lng: -118.2437 }, zoom: 5 });
      const info = new googleAny.maps.InfoWindow();
      const bounds = new googleAny.maps.LatLngBounds();

      filteredProperties.forEach((p) => {
        if (isNaN(p.lat) || isNaN(p.lng)) return;
        const marker = new googleAny.maps.Marker({ position: { lat: p.lat, lng: p.lng }, map, title: p.title });
        bounds.extend(marker.getPosition());
        marker.addListener('click', () => {
          info.setContent(`<div><strong>${p.title}</strong><div>${p.location}</div></div>`);
          info.open({ anchor: marker, map });
          const card = document.querySelector(`[data-property-id="${p.id}"]`) as HTMLElement | null;
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('is-active');
            setTimeout(() => card.classList.remove('is-active'), 800);
          }
        });
      });
      if (!bounds.isEmpty()) { map.fitBounds(bounds); }
    }

    loadGoogle(render);
  }, [filteredProperties]);

  return (
    <>
      {/* Navigation */}
      <NavbarWrapper
        tag="nav"
        className="navbar"
        config={{
          animation: "over-right",
          collapse: "medium",
          docHeight: false,
          duration: 400,
          easing: "ease",
          easing2: "ease",
          noScroll: true,
        }}
      >
        <NavbarContainer className="container-large" tag="div" {...({} as any)}>
          <NavbarBrand
            options={{ href: "/" }}
            className="nav-brand"
          >
            Easy Stay Retreats
          </NavbarBrand>
          <NavbarButton className="nav-menu-button">
            <div className="w-icon-nav-menu"></div>
          </NavbarButton>
          <NavbarMenu className="nav-menu">
            <NavbarLink options={{ href: "/" }} className="nav-link">Home</NavbarLink>
            <NavbarLink options={{ href: "/search-properties" }} className="nav-link">Retreats</NavbarLink>
            <NavbarLink options={{ href: "/about-us" }} className="nav-link">About</NavbarLink>
            <NavbarLink options={{ href: "/contact" }} className="nav-link">Contact</NavbarLink>
          </NavbarMenu>
        </NavbarContainer>
      </NavbarWrapper>

      <main className="main-wrapper">
        {/* Map Section (local) */}
        <section className="section">
          <div className="container-large">
            <div id="search-map" style={{ minHeight: '60vh', width: '100%' }} />
          </div>
        </section>
        {/* Search Header */}
        <section className="section">
          <div className="container-large">
            <div className="text-center">
              <h1 className="heading-style-h1">Find Your Perfect Retreat</h1>
              <p className="body-display large">Discover transformative wellness retreats in stunning locations around the world</p>
            </div>

            {/* Search Filters */}
            {/* @ts-ignore */}
            <EnhancedSearchFilters
              location={filters.location}
              checkInDate={filters.checkInDate}
              checkOutDate={filters.checkOutDate}
              guests={filters.guests}
              priceRange={filters.priceRange}
              propertyType={filters.propertyType}
              amenities={filters.amenities}
              onLocationChange={(value: string) => handleFiltersChange({ ...filters, location: value })}
              onCheckInChange={(value: string) => handleFiltersChange({ ...filters, checkInDate: value })}
              onCheckOutChange={(value: string) => handleFiltersChange({ ...filters, checkOutDate: value })}
              onGuestsChange={(value: number) => handleFiltersChange({ ...filters, guests: value })}
              onPriceRangeChange={(value: [number, number]) => handleFiltersChange({ ...filters, priceRange: value })}
              onPropertyTypeChange={(value: string) => handleFiltersChange({ ...filters, propertyType: value })}
              onAmenitiesChange={(value: string[]) => handleFiltersChange({ ...filters, amenities: value })}
              onSearch={() => {
                console.log('Search triggered with filters:', filters);
              }}
              onReset={() => {
                setFilters({
                  location: '',
                  checkInDate: '',
                  checkOutDate: '',
                  guests: 1,
                  priceRange: [50, 1000],
                  propertyType: 'Any',
                  amenities: []
                });
                setFilteredProperties([]);
              }}
              isLoading={false}
              propertyTypes={["Any", "Cabin", "Villa", "Treehouse", "Lodge", "Retreat", "Desert Retreat", "Mountain Lodge", "Modern Villa", "Tropical Villa"]}
              availableAmenities={["WiFi", "Pool", "Spa", "Kitchen", "Gym", "Parking", "Pet Friendly", "Ocean View", "Mountain View", "Desert Views", "Stargazing", "Lake Access", "Kayaking", "Firepit", "Yoga Studio", "Rice Paddy Views"]}
            />
          </div>
        </section>

        {/* Search Results */}
        <section className="section">
          <div className="container-large">
            <h2 className="heading-style-h2">{filteredProperties.length} Retreats Found</h2>
              
            {filteredProperties.length === 0 ? (
              <div className="text-center">
                <div className="body-display">
                  No properties found matching your criteria. Try adjusting your filters.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-lg">
                {filteredProperties.map((property: any) => (
                  <div
                    key={property.id}
                    data-property-id={property.id}
                    data-title={property.title}
                    data-lat={property.lat}
                    data-lng={property.lng}
                  >
                    {/* @ts-ignore */}
                    <PropertyCard
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
                      isAvailable={property.availability}
                      discountPercentage={0}
                      amenities={property.amenities}
                      hostName={property.host.name}
                      hostAvatar={property.host.avatar}
                      propertyType={property.type}
                      maxGuests={property.guests}
                      bedrooms={property.beds}
                      bathrooms={property.baths}
                      checkInTime="3:00 PM"
                      checkOutTime="11:00 AM"
                      cancellationPolicy="Flexible"
                      instantBook={property.host.isSuperhost}
                      verified={property.host.isSuperhost}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default function SearchPropertiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPropertiesContent />
    </Suspense>
  );
}