/**
 * EasyStay Search Properties Complete Script
 * Version: 2.4.0
 * 
 * This script provides complete functionality for the search properties page including:
 * - Interactive Google Maps with property markers
 * - Property listing cards with filtering
 * - Airbnb-style navigation dropdowns
 * - Map-to-list synchronization
 * - Location privacy features
 * 
 * Host this file on GitHub and load via external script loader in Webflow
 */

(function() {
  'use strict';
  
  // Prevent multiple initializations
  if (window.EasyStaySearchInitialized) {
    console.log('EasyStay search already initialized');
    return;
  }
  
  console.log('🏠 EasyStay Search Properties v2.4.0 - Initializing...');
  
  // Wait for DOM and all elements to load
  function initSearchPage() {
    // Properties data with 10 properties across Eastern seaboard
    const properties = [
      {
        id: 'test-1',
        title: 'Downtown Loft with City Views',
        rating: 4.8,
        ratingCount: 125,
        location: 'Austin, TX',
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        price: '$120',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
        lat: 30.274665,
        lng: -97.74035,
        url: '/properties/downtown-loft-city-views'
      },
      {
        id: 'test-2',
        title: 'Cozy Beachfront Cottage',
        rating: 4.9,
        ratingCount: 89,
        location: 'Virginia Beach, VA',
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        price: '$185',
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800&auto=format&fit=crop',
        lat: 36.8508,
        lng: -75.9776,
        url: '/properties/beachfront-cottage'
      },
      {
        id: 'test-3',
        title: 'Modern Mountain Retreat',
        rating: 4.7,
        ratingCount: 156,
        location: 'Asheville, NC',
        guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        price: '$220',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop',
        lat: 35.5951,
        lng: -82.5515,
        url: '/properties/mountain-retreat'
      },
      {
        id: 'test-4',
        title: 'Historic Brownstone',
        rating: 4.6,
        ratingCount: 203,
        location: 'Boston, MA',
        guests: 5,
        bedrooms: 3,
        bathrooms: 2,
        price: '$165',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
        lat: 42.3601,
        lng: -71.0589,
        url: '/properties/historic-brownstone'
      },
      {
        id: 'test-5',
        title: 'Luxury Waterfront Condo',
        rating: 4.9,
        ratingCount: 94,
        location: 'Miami, FL',
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        price: '$280',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
        lat: 25.7617,
        lng: -80.1918,
        url: '/properties/waterfront-condo'
      },
      {
        id: 'test-6',
        title: 'Charming Desert Oasis',
        rating: 4.5,
        ratingCount: 78,
        location: 'Santa Fe, NM',
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        price: '$195',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop',
        lat: 35.6870,
        lng: -105.9378,
        url: '/properties/desert-oasis'
      },
      {
        id: 'test-7',
        title: 'Capitol Hill Apartment',
        rating: 4.4,
        ratingCount: 167,
        location: 'Washington, DC',
        guests: 3,
        bedrooms: 1,
        bathrooms: 1,
        price: '$145',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
        lat: 38.9072,
        lng: -77.0369,
        url: '/properties/capitol-hill-apt'
      },
      {
        id: 'test-8',
        title: 'Seaside Escape',
        rating: 4.8,
        ratingCount: 112,
        location: 'Ocean City, MD',
        guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        price: '$250',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
        lat: 38.3365,
        lng: -75.0849,
        url: '/properties/seaside-escape'
      },
      {
        id: 'test-9',
        title: 'Urban Penthouse',
        rating: 4.7,
        ratingCount: 145,
        location: 'Charlotte, NC',
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        price: '$210',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
        lat: 35.2271,
        lng: -80.8431,
        url: '/properties/urban-penthouse'
      },
      {
        id: 'test-10',
        title: 'Coastal Getaway',
        rating: 4.6,
        ratingCount: 89,
        location: 'Outer Banks, NC',
        guests: 10,
        bedrooms: 5,
        bathrooms: 4,
        price: '$320',
        image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c50a?q=80&w=800&auto=format&fit=crop',
        lat: 35.5582,
        lng: -75.4665,
        url: '/properties/coastal-getaway'
      }
    ];

    // Add location obfuscation for privacy (randomized once per session)
    properties.forEach(property => {
      const offsetLat = (Math.random() - 0.5) * 0.001; // ~60m radius
      const offsetLng = (Math.random() - 0.5) * 0.001;
      property.obfuscatedLat = property.lat + offsetLat;
      property.obfuscatedLng = property.lng + offsetLng;
    });

    let map, markers = [], infoWindow, bounds;
    let currentlyHighlightedCard = null;
    let currentlyHighlightedPin = null;

    // Google Maps API Key
    const API_KEY = 'AIzaSyD8v_6yM27IK1EqjrA9zQKsl5XyoQmA92Q';

    function loadGoogleMaps() {
      if (typeof google !== 'undefined' && google.maps) {
        console.log('📍 Google Maps API already loaded, initializing map...');
        initMap();
        return;
      }

      console.log('📍 Loading Google Maps API...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);
    }

    function initMap() {
      const mapElement = document.getElementById('search-map');
      if (!mapElement) {
        console.error('❌ Map element #search-map not found');
        return;
      }

      console.log('🗺️ Initializing Google Maps...');
      
      // Ensure map container has dimensions
      mapElement.style.minHeight = '40rem';
      mapElement.style.width = '100%';

      map = new google.maps.Map(mapElement, {
        zoom: 6,
        center: { lat: 36.0, lng: -79.0 },
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      bounds = new google.maps.LatLngBounds();
      infoWindow = new google.maps.InfoWindow();

      // Add markers for all properties
      properties.forEach(property => {
        addMarker(property);
        bounds.extend(new google.maps.LatLng(property.lat, property.lng));
      });

      map.fitBounds(bounds);

      // Listen for bounds changes to update visible properties
      google.maps.event.addListener(map, 'bounds_changed', () => {
        setTimeout(updateVisibleProperties, 100);
      });

      console.log('✅ Map initialized with', properties.length, 'properties');
      
      renderPropertyCards();
      updatePropertyCount();
    }

    function addMarker(property) {
      // Create custom white pin with rating
      const marker = new google.maps.Marker({
        position: { lat: property.obfuscatedLat, lng: property.obfuscatedLng },
        map: map,
        title: property.title,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2C11.7 2 5 8.7 5 17c0 8.3 15 29 15 29s15-20.7 15-29c0-8.3-6.7-15-15-15z" fill="white" stroke="#ccc" stroke-width="2"/>
              <circle cx="20" cy="17" r="12" fill="white" stroke="#ddd" stroke-width="1"/>
              <text x="20" y="22" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="black">${property.rating}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(40, 50),
          anchor: new google.maps.Point(20, 50)
        }
      });

      // Add privacy circle at actual location
      const circle = new google.maps.Circle({
        strokeColor: '#4285f4',
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: '#4285f4',
        fillOpacity: 0.1,
        map: map,
        center: { lat: property.lat, lng: property.lng },
        radius: 120 // 120 meters
      });

      marker.addListener('click', () => {
        // Zoom to the property location (actual location, not obfuscated)
        map.setCenter({ lat: property.lat, lng: property.lng });
        map.setZoom(15);

        // Show info window with property details
        const infoContent = createInfoWindowContent(property);
        infoWindow.setContent(infoContent);
        infoWindow.open(map, marker);
      });

      markers.push({ marker, circle, property });
    }

    function createInfoWindowContent(property) {
      return `
        <div style="max-width: 300px; font-family: Arial, sans-serif;">
          <div style="position: relative; margin-bottom: 12px;">
            <img src="${property.image}" alt="${property.title}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px;">
          </div>
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${property.title}</h3>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="color: #333; font-size: 14px;">⭐ ${property.rating}</span>
            <span style="color: #777; font-size: 14px; margin-left: 4px;">(${property.ratingCount})</span>
          </div>
          <div style="color: #666; font-size: 14px; margin-bottom: 8px;">
            ${property.guests} guests • ${property.bedrooms} bedrooms • ${property.bathrooms} bathrooms
          </div>
          <div style="font-size: 16px; font-weight: 600; color: #333;">
            ${property.price}/night
          </div>
        </div>
      `;
    }

    function updateVisibleProperties() {
      if (!map) return;
      
      const visibleProperties = getVisibleProperties();
      renderPropertyCards(visibleProperties);
      updatePropertyCount(visibleProperties.length);
    }

    function getVisibleProperties() {
      if (!map) return properties;
      
      const bounds = map.getBounds();
      if (!bounds) return properties;
      
      return properties.filter(property => {
        const position = new google.maps.LatLng(property.lat, property.lng);
        return bounds.contains(position);
      });
    }

    function renderPropertyCards(propertiesToShow = properties) {
      const listContainer = document.querySelector('[data-list-root="property-listing-wrapper"]');
      const template = document.querySelector('[data-template="property-card"]');
      
      if (!listContainer || !template) {
        console.error('❌ List container or template not found');
        return;
      }

      console.log('🏠 Rendering', propertiesToShow.length, 'property cards');

      // Clear existing cards (except template)
      const existingCards = listContainer.querySelectorAll('.w-dyn-item:not([data-template])');
      existingCards.forEach(card => card.remove());

      propertiesToShow.forEach(property => {
        const cardClone = template.cloneNode(true);
        cardClone.removeAttribute('data-template');
        cardClone.style.display = 'block';
        
        // Add property data
        cardClone.setAttribute('data-property-id', property.id);
        
        // Find and populate title, rating, count fields
        const titleEl = cardClone.querySelector('[data-field="card-title"]');
        const ratingEl = cardClone.querySelector('[data-field="card-rating"]');
        const ratingCountEl = cardClone.querySelector('[data-field="card-rating-count"]');
        
        if (titleEl) titleEl.textContent = property.title;
        if (ratingEl) ratingEl.textContent = property.rating;
        if (ratingCountEl) ratingCountEl.textContent = `(${property.ratingCount})`;
        
        // Set images in slider
        const sliderSlides = cardClone.querySelectorAll('.w-slider-slide');
        sliderSlides.forEach(slide => {
          const img = slide.querySelector('img');
          if (img && !img.closest('.icon-wrapper.small')) {
            img.src = property.image;
            img.alt = property.title;
          }
          // Set background image as fallback
          slide.style.backgroundImage = `url(${property.image})`;
          slide.style.backgroundSize = 'cover';
          slide.style.backgroundPosition = 'center';
        });
        
        // Populate other fields with fallbacks
        populateTextField(cardClone, '.location, .card-location', property.location);
        populateTextField(cardClone, '.price, .card-price', `${property.price}/night`);
        populateTextField(cardClone, '.guests, .card-guests', `${property.guests} guests`);
        populateTextField(cardClone, '.bedrooms, .card-bedrooms', `${property.bedrooms} bedrooms`);
        populateTextField(cardClone, '.bathrooms, .card-bathrooms', `${property.bathrooms} bathrooms`);
        
        listContainer.appendChild(cardClone);
      });
      
      // Reinitialize Webflow interactions
      if (typeof Webflow !== 'undefined') {
        Webflow.require('ix2').init();
        Webflow.require('slider').redraw();
      }
      
      setupCardInteractions();
    }

    function populateTextField(container, selector, text) {
      const element = container.querySelector(selector);
      if (element) {
        element.textContent = text;
      }
    }

    function setupCardInteractions() {
      const listContainer = document.querySelector('[data-list-root="property-listing-wrapper"]');
      if (!listContainer) return;

      // Remove existing listeners
      listContainer.removeEventListener('click', handleCardClick);
      listContainer.removeEventListener('mouseenter', handleCardHover, true);
      listContainer.removeEventListener('mouseleave', handleCardLeave, true);

      // Add delegated event listeners
      listContainer.addEventListener('click', handleCardClick);
      listContainer.addEventListener('mouseenter', handleCardHover, true);
      listContainer.addEventListener('mouseleave', handleCardLeave, true);
      
      // Add pointer cursor style
      const style = document.createElement('style');
      style.textContent = '.w-dyn-item[data-property-id] { cursor: pointer; }';
      document.head.appendChild(style);
    }

    function handleCardClick(e) {
      const card = e.target.closest('.w-dyn-item[data-property-id]');
      if (!card) return;

      e.preventDefault();
      const propertyId = card.getAttribute('data-property-id');
      const property = properties.find(p => p.id === propertyId);
      if (!property) return;

      console.log('🏠 Property card clicked:', property.title);

      // Highlight the corresponding map pin (blue)
      highlightMapPin(propertyId, true);
      
      // Highlight the card with blue border
      highlightCard(card, true);
      
      // Navigate to property page after a brief delay
      setTimeout(() => {
        // Get search params from URL to pass along
        const searchParams = new URLSearchParams(window.location.search);
        const searchContext = {
          where: searchParams.get('where') || '',
          checkin: searchParams.get('checkin') || '',
          checkout: searchParams.get('checkout') || '',
          guests: searchParams.get('guests') || ''
        };
        
        const urlParams = new URLSearchParams(searchContext);
        window.location.href = `${property.url}?${urlParams.toString()}`;
      }, 300);
    }

    function handleCardHover(e) {
      const card = e.target.closest('.w-dyn-item[data-property-id]');
      if (!card) return;

      const propertyId = card.getAttribute('data-property-id');
      highlightMapPin(propertyId, false); // false = hover (blue), not click
    }

    function handleCardLeave(e) {
      const card = e.target.closest('.w-dyn-item[data-property-id]');
      if (!card) return;

      const propertyId = card.getAttribute('data-property-id');
      // Only remove highlight if it's not the clicked one
      if (currentlyHighlightedPin !== propertyId) {
        resetMapPin(propertyId);
      }
    }

    function highlightMapPin(propertyId, isClick = false) {
      const markerData = markers.find(m => m.property.id === propertyId);
      if (!markerData) return;

      // Create blue highlighted pin
      const bluePinIcon = {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2C11.7 2 5 8.7 5 17c0 8.3 15 29 15 29s15-20.7 15-29c0-8.3-6.7-15-15-15z" fill="#4285f4" stroke="#1a73e8" stroke-width="2"/>
            <circle cx="20" cy="17" r="12" fill="white" stroke="#1a73e8" stroke-width="1"/>
            <text x="20" y="22" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="black">${markerData.property.rating}</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 50),
        anchor: new google.maps.Point(20, 50)
      };

      markerData.marker.setIcon(bluePinIcon);
      
      if (isClick) {
        currentlyHighlightedPin = propertyId;
      }
    }

    function resetMapPin(propertyId) {
      const markerData = markers.find(m => m.property.id === propertyId);
      if (!markerData) return;

      // Reset to white pin
      const whitePinIcon = {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2C11.7 2 5 8.7 5 17c0 8.3 15 29 15 29s15-20.7 15-29c0-8.3-6.7-15-15-15z" fill="white" stroke="#ccc" stroke-width="2"/>
            <circle cx="20" cy="17" r="12" fill="white" stroke="#ddd" stroke-width="1"/>
            <text x="20" y="22" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="black">${markerData.property.rating}</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 50),
        anchor: new google.maps.Point(20, 50)
      };

      markerData.marker.setIcon(whitePinIcon);
    }

    function highlightCard(card, highlight) {
      if (currentlyHighlightedCard && currentlyHighlightedCard !== card) {
        currentlyHighlightedCard.style.border = '';
      }
      
      if (highlight) {
        card.style.border = '2px solid #4285f4';
        card.style.borderRadius = '8px';
        currentlyHighlightedCard = card;
      } else {
        card.style.border = '';
      }
    }

    function updatePropertyCount(count = properties.length) {
      const countElement = document.getElementById('NumberOfProperties');
      if (countElement) {
        countElement.textContent = count;
      }
    }

    // Airbnb-style navigation functionality
    function initAirbnbNavigation() {
      console.log('🎯 Initializing Airbnb-style navigation...');
      
      // Popular cities data for autocomplete
      const popularCities = [
        { name: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060 },
        { name: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
        { name: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
        { name: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
        { name: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 },
        { name: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321 },
        { name: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589 },
        { name: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903 }
      ];
      
      let filters = {
        location: '',
        checkin: '',
        checkout: '',
        adults: 2,
        children: 0,
        infants: 0,
        pets: 0
      };
      
      // Read URL parameters on page load
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('where')) filters.location = urlParams.get('where');
      if (urlParams.get('checkin')) filters.checkin = urlParams.get('checkin');
      if (urlParams.get('checkout')) filters.checkout = urlParams.get('checkout');
      if (urlParams.get('guests')) {
        const guests = parseInt(urlParams.get('guests'));
        if (guests > 0) filters.adults = Math.max(1, guests);
      }
      
      // Apply initial filters if any
      if (filters.location || filters.checkin || filters.checkout || urlParams.get('guests')) {
        console.log('🔍 Applying initial filters from URL');
        applyFilters();
      }
      
      // Find navigation elements
      const whereSection = document.getElementById('SearchWhere');
      const whenSection = document.getElementById('SearchWhen');
      const whoSection = document.getElementById('SearchWho');
      const searchButton = document.getElementById('SearchButton');
      
      if (!whereSection || !whenSection || !whoSection) {
        console.warn('⚠️ Navigation elements not found, skipping dropdown creation');
        return;
      }
      
      // Create dropdowns only if elements exist
      if (whereSection) createWhereDropdown(whereSection, popularCities);
      if (whenSection) createWhenDropdown(whenSection);
      if (whoSection) createWhoDropdown(whoSection);
      
      // Setup interactions
      setupDropdownInteractions();
      if (searchButton) setupSearchButton();
      
      console.log('✅ Navigation initialized');
      
      // Helper functions for navigation (condensed for brevity)
      function createWhereDropdown(whereSection, cities) {
        const dropdown = document.createElement('div');
        dropdown.className = 'search_dropdown';
        dropdown.style.cssText = 'width: 500px; padding: 40px; height: auto;';
        
        dropdown.innerHTML = `
          <div class="dropdown_section">
            <h3 class="dropdown_heading">Search destinations</h3>
            <input type="text" class="search_input" placeholder="Search destinations" style="width: 100%; padding: 16px 20px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 16px; box-sizing: border-box;">
            <div id="autocomplete-suggestions" style="margin-top: 12px;"></div>
          </div>
          <div class="dropdown_section">
            <h3 class="dropdown_heading">Popular destinations</h3>
            <div class="city-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
              ${cities.slice(0, 8).map(city => `
                <div class="city-item" data-city="${city.name}" data-state="${city.state}" data-lat="${city.lat}" data-lng="${city.lng}" 
                     style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; background: white; font-size: 16px; text-align: center;">
                  ${city.name}, ${city.state}
                </div>
              `).join('')}
            </div>
          </div>
        `;
        
        whereSection.appendChild(dropdown);
        setupCityInteractions(dropdown, cities);
      }
      
      function setupCityInteractions(dropdown, cities) {
        const searchInput = dropdown.querySelector('.search_input');
        const suggestionsDiv = dropdown.querySelector('#autocomplete-suggestions');
        
        // Search input autocomplete
        searchInput?.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          const matches = cities.filter(city => 
            city.name.toLowerCase().includes(query) || 
            city.state.toLowerCase().includes(query)
          );
          
          if (query && matches.length > 0) {
            suggestionsDiv.innerHTML = matches.slice(0, 5).map(city => `
              <div class="autocomplete-item" data-city="${city.name}" data-state="${city.state}" data-lat="${city.lat}" data-lng="${city.lng}"
                   style="padding: 16px 20px; cursor: pointer; border-radius: 8px; margin-bottom: 4px; font-size: 16px; transition: background 0.2s;">
                ${city.name}, ${city.state}
              </div>
            `).join('');
            suggestionsDiv.style.display = 'block';
          } else {
            suggestionsDiv.style.display = 'none';
          }
        });
        
        // City grid hover effects
        dropdown.querySelectorAll('.city-item').forEach(item => {
          item.addEventListener('mouseenter', () => {
            item.style.cssText += 'background: #4285f4; color: white; border-color: #4285f4;';
          });
          item.addEventListener('mouseleave', () => {
            item.style.cssText = item.style.cssText.replace('background: #4285f4; color: white; border-color: #4285f4;', '');
          });
        });
      }
      
      function createWhenDropdown(whenSection) {
        // Simplified when dropdown for brevity
        const dropdown = document.createElement('div');
        dropdown.className = 'search_dropdown';
        dropdown.innerHTML = `
          <div class="dropdown_section">
            <h3 class="dropdown_heading">Select dates</h3>
            <p style="color: #666; margin-bottom: 16px;">Choose your check-in and check-out dates</p>
            <div style="display: flex; gap: 16px;">
              <input type="date" id="checkin-date" style="flex: 1; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <input type="date" id="checkout-date" style="flex: 1; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">
            </div>
          </div>
        `;
        whenSection.appendChild(dropdown);
      }
      
      function createWhoDropdown(whoSection) {
        // Simplified who dropdown for brevity
        const dropdown = document.createElement('div');
        dropdown.className = 'search_dropdown';
        dropdown.innerHTML = `
          <div class="dropdown_section">
            <h3 class="dropdown_heading">Guests</h3>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0;">
              <div>
                <div style="font-weight: 600;">Adults</div>
                <div style="color: #666; font-size: 14px;">Ages 13 or above</div>
              </div>
              <div style="display: flex; align-items: center; gap: 16px;">
                <button class="guest-decrease" data-type="adults" style="width: 32px; height: 32px; border: 1px solid #ddd; border-radius: 50%; background: white; cursor: pointer;">-</button>
                <span class="guest-count" data-type="adults" style="min-width: 24px; text-align: center;">2</span>
                <button class="guest-increase" data-type="adults" style="width: 32px; height: 32px; border: 1px solid #ddd; border-radius: 50%; background: white; cursor: pointer;">+</button>
              </div>
            </div>
          </div>
        `;
        whoSection.appendChild(dropdown);
        
        // Setup guest counter interactions
        dropdown.querySelectorAll('.guest-decrease, .guest-increase').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const type = btn.dataset.type;
            const isIncrease = btn.classList.contains('guest-increase');
            const countSpan = dropdown.querySelector(`.guest-count[data-type="${type}"]`);
            
            let count = parseInt(countSpan.textContent);
            if (isIncrease) {
              count++;
            } else if (count > 1) { // Minimum 1 adult
              count--;
            }
            
            countSpan.textContent = count;
            filters[type] = count;
            updateGuestDisplay();
          });
        });
      }
      
      function setupDropdownInteractions() {
        const navSections = [whereSection, whenSection, whoSection].filter(Boolean);
        
        navSections.forEach(section => {
          const dropdown = section.querySelector('.search_dropdown');
          if (!dropdown) return;
          
          // Show dropdown on hover
          section.addEventListener('mouseenter', () => {
            hideAllDropdowns();
            dropdown.classList.add('is_visible');
          });
          
          // Keep dropdown open when clicking inside
          dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
          });
          
          // Handle city selection
          dropdown.addEventListener('click', (e) => {
            const cityItem = e.target.closest('.city-item, .autocomplete-item');
            if (cityItem) {
              const cityName = cityItem.dataset.city;
              const stateName = cityItem.dataset.state;
              const lat = parseFloat(cityItem.dataset.lat);
              const lng = parseFloat(cityItem.dataset.lng);
              
              filters.location = `${cityName}, ${stateName}`;
              updateLocationDisplay();
              
              // Zoom map to selected city
              if (map) {
                map.setCenter({ lat, lng });
                map.setZoom(11);
              }
              
              applyFilters();
              hideAllDropdowns();
            }
          });
        });
        
        // Hide dropdowns when clicking outside
        document.addEventListener('click', hideAllDropdowns);
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') hideAllDropdowns();
        });
      }
      
      function hideAllDropdowns() {
        document.querySelectorAll('.search_dropdown').forEach(dropdown => {
          dropdown.classList.remove('is_visible');
        });
      }
      
      function updateLocationDisplay() {
        if (whereSection && filters.location) {
          const textEl = whereSection.querySelector('.nav-link-text, .text-block');
          if (textEl) textEl.textContent = filters.location;
        }
      }
      
      function updateGuestDisplay() {
        if (whoSection) {
          const textEl = whoSection.querySelector('.nav-link-text, .text-block');
          if (textEl) {
            const totalGuests = filters.adults + filters.children;
            textEl.textContent = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`;
          }
        }
      }
      
      function setupSearchButton() {
        searchButton.addEventListener('click', (e) => {
          e.preventDefault();
          
          const totalGuests = filters.adults + filters.children;
          const searchParams = new URLSearchParams({
            where: filters.location || '',
            checkin: filters.checkin || '',
            checkout: filters.checkout || '',
            guests: totalGuests.toString()
          });
          
          if (window.location.pathname.includes('search-properties')) {
            applyFilters();
          } else {
            window.location.href = `/search-properties?${searchParams.toString()}`;
          }
        });
      }
      
      function applyFilters() {
        let filteredProperties = [...properties];
        
        // Filter by location
        if (filters.location) {
          filteredProperties = filteredProperties.filter(property => {
            return property.location.toLowerCase().includes(filters.location.toLowerCase()) ||
                   filters.location.toLowerCase().includes(property.location.toLowerCase());
          });
        }
        
        // Filter by guest capacity
        const totalGuests = filters.adults + filters.children;
        if (totalGuests > 0) {
          filteredProperties = filteredProperties.filter(property => property.guests >= totalGuests);
        }
        
        console.log('🔍 Filtered to', filteredProperties.length, 'properties');
        
        // Update display
        renderPropertyCards(filteredProperties);
        updatePropertyCount(filteredProperties.length);
        
        // Update map bounds to show filtered properties
        if (map && filteredProperties.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          filteredProperties.forEach(property => {
            bounds.extend(new google.maps.LatLng(property.lat, property.lng));
          });
          map.fitBounds(bounds);
        }
      }
    }
    
    // Initialize everything when DOM is ready
    function initialize() {
      console.log('🚀 Starting EasyStay search initialization...');
      loadGoogleMaps();
      initAirbnbNavigation();
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initialize, 1000);
      });
    } else {
      setTimeout(initialize, 1000);
    }
  }

  // Mark as initialized and start
  window.EasyStaySearchInitialized = true;
  initSearchPage();
  
  console.log('✅ EasyStay Search Properties script loaded successfully');
  
})();