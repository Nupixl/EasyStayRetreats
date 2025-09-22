/**
 * EasyStay Complete Search Properties v15.0.0
 * All-in-one script for search properties page with map, property cards, and navigation
 */

(function() {
  'use strict';
  
  if (window.EasyStayCompleteInitialized) return;
  
  console.log('🏠 EasyStay Complete v15.0.0 - Initializing everything...');
  
  // Properties data
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
    }
  ];
  
  // Add location obfuscation for privacy
  properties.forEach(property => {
    property.obfuscatedLat = property.lat + (Math.random() - 0.5) * 0.001;
    property.obfuscatedLng = property.lng + (Math.random() - 0.5) * 0.001;
  });
  
  let map, markers = [], infoWindow, bounds;
  
  // Google Maps API Key
  const API_KEY = 'AIzaSyD8v_6yM27IK1EqjrA9zQKsl5XyoQmA92Q';
  
  function loadGoogleMaps() {
    if (typeof google !== 'undefined' && google.maps) {
      initMap();
      return;
    }
    
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
    
    properties.forEach(property => {
      addMarker(property);
      bounds.extend(new google.maps.LatLng(property.lat, property.lng));
    });
    
    map.fitBounds(bounds);
    renderPropertyCards();
    updatePropertyCount();
    
    console.log('✅ Map initialized with', properties.length, 'properties');
  }
  
  function addMarker(property) {
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
    
    const circle = new google.maps.Circle({
      strokeColor: '#4285f4',
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: '#4285f4',
      fillOpacity: 0.1,
      map: map,
      center: { lat: property.lat, lng: property.lng },
      radius: 120
    });
    
    marker.addListener('click', () => {
      map.setCenter({ lat: property.lat, lng: property.lng });
      map.setZoom(15);
      
      const infoContent = `
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
      infoWindow.setContent(infoContent);
      infoWindow.open(map, marker);
    });
    
    markers.push({ marker, circle, property });
  }
  
  function renderPropertyCards() {
    const listContainer = document.querySelector('[data-list-root="property-listing-wrapper"]');
    if (!listContainer) {
      console.error('❌ List container not found');
      return;
    }
    
    console.log('🏠 Rendering', properties.length, 'property cards');
    
    listContainer.innerHTML = '';
    properties.forEach(property => {
      const cardHTML = `
        <div class="property-card" data-property-id="${property.id}" style="cursor: pointer; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <div class="property-card-top-content">
            <div class="w-slider" style="position: relative; height: 200px;">
              <div class="card-top-interactive-container" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 10;">
                <div class="card-accolade" style="position: absolute; top: 12px; right: 12px; display: flex; align-items: center; background: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                  <div class="icon-wrapper small" style="margin-right: 4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21L12 17.77L5.82 21L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  <div>Super Host</div>
                </div>
                <div class="card-favorite-button" style="position: absolute; top: 12px; left: 12px; width: 32px; height: 32px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
              </div>
              <img src="${property.image}" loading="lazy" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          </div>
          <div class="propert-card-bottom-contnet" style="padding: 16px;">
            <div class="card-first-line" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div class="property-card-title" style="flex: 1; margin-right: 8px;">
                <div style="font-size: 16px; font-weight: 600; color: #333; margin: 0;">${property.title}</div>
              </div>
              <div class="property-card-rating-wrapper" style="display: flex; align-items: center; white-space: nowrap;">
                <div class="icon-wrapper small" style="margin-right: 4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21L12 17.77L5.82 21L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <div class="property-card-rating">
                  <div style="font-size: 14px; font-weight: 500; color: #333;">${property.rating}</div>
                </div>
                <div class="proper-card-number-of-ratings">
                  <div style="font-size: 14px; color: #666; margin-left: 4px;">(${property.ratingCount})</div>
                </div>
              </div>
            </div>
            <div class="card-second-line" style="margin-bottom: 8px;">
              <div style="color: #666; font-size: 14px;">${property.location}</div>
            </div>
            <div class="card-third-line" style="margin-bottom: 8px;">
              <div style="color: #666; font-size: 14px;">${property.guests} guests • ${property.bedrooms} bedrooms • ${property.bathrooms} bathrooms</div>
            </div>
            <div class="card-fourth-line">
              <div class="card-price-wrapper" style="display: flex; align-items: center; gap: 8px;">
                <div class="card-price" style="font-size: 16px; font-weight: 600; color: #333;">${property.price}</div>
                <div class="card-duration" style="color: #666; font-size: 14px;">/night</div>
              </div>
            </div>
          </div>
        </div>
      `;
      listContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
    
    setupCardInteractions();
  }
  
  function setupCardInteractions() {
    const listContainer = document.querySelector('[data-list-root="property-listing-wrapper"]');
    if (!listContainer) return;
    
    listContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.property-card[data-property-id]');
      if (!card) return;
      
      e.preventDefault();
      const propertyId = card.getAttribute('data-property-id');
      const property = properties.find(p => p.id === propertyId);
      if (!property) return;
      
      console.log('🏠 Property card clicked:', property.title);
      
      // Highlight map pin
      const markerData = markers.find(m => m.property.id === propertyId);
      if (markerData) {
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
      }
      
      // Navigate to property page
      setTimeout(() => {
        window.location.href = property.url;
      }, 300);
    });
  }
  
  function updatePropertyCount() {
    const countElement = document.getElementById('NumberOfProperties');
    if (countElement) {
      countElement.textContent = properties.length;
    }
  }
  
  // Navigation functionality
  function initNavigation() {
    console.log('🧭 Initializing navigation...');
    
    const searchNavWrapper = document.getElementById('SearchNavWrapper');
    if (!searchNavWrapper) {
      console.error('❌ SearchNavWrapper not found');
      return;
    }
    
    console.log('✅ SearchNavWrapper found');
    
    // Find navigation elements by text content
    const allElements = searchNavWrapper.querySelectorAll('*');
    let whereElements = [];
    let whenElements = [];
    let whoElements = [];
    let searchElements = [];
    
    allElements.forEach(el => {
      const text = el.textContent?.trim().toLowerCase();
      if (text === 'where') whereElements.push(el);
      if (text === 'when') whenElements.push(el);
      if (text === 'who') whoElements.push(el);
      if (text === 'search') searchElements.push(el);
    });
    
    console.log('📍 Found navigation elements:', {
      where: whereElements.length,
      when: whenElements.length,
      who: whoElements.length,
      search: searchElements.length
    });
    
    // Setup click handlers
    if (whereElements.length > 0) {
      setupWhereDropdown(whereElements[0]);
      console.log('✅ WHERE dropdown setup');
    }
    
    if (whenElements.length > 0) {
      setupWhenDropdown(whenElements[0]);
      console.log('✅ WHEN dropdown setup');
    }
    
    if (whoElements.length > 0) {
      setupWhoDropdown(whoElements[0]);
      console.log('✅ WHO dropdown setup');
    }
    
    if (searchElements.length > 0) {
      setupSearchButton(searchElements[0]);
      console.log('✅ SEARCH button setup');
    }
  }
  
  function setupWhereDropdown(element) {
    element.style.cursor = 'pointer';
    element.style.userSelect = 'none';
    
    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🌍 WHERE clicked!');
      removeAllDropdowns();
      showWhereDropdown(element);
    });
  }
  
  function setupWhenDropdown(element) {
    element.style.cursor = 'pointer';
    element.style.userSelect = 'none';
    
    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('📅 WHEN clicked!');
      removeAllDropdowns();
      showWhenDropdown(element);
    });
  }
  
  function setupWhoDropdown(element) {
    element.style.cursor = 'pointer';
    element.style.userSelect = 'none';
    
    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('👥 WHO clicked!');
      removeAllDropdowns();
      showWhoDropdown(element);
    });
  }
  
  function setupSearchButton(element) {
    element.style.cursor = 'pointer';
    element.style.userSelect = 'none';
    
    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔍 SEARCH clicked!');
    });
  }
  
  function showWhereDropdown(element) {
    console.log('🌍 Opening WHERE dropdown...');
    
    const dropdown = document.createElement('div');
    dropdown.className = 'easystay-where-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: calc(100% + 12px);
      left: 0;
      width: 360px;
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
      z-index: 10000;
      overflow: hidden;
      font-family: inherit;
    `;
    
    dropdown.innerHTML = `
      <div style="padding: 20px;">
        <input type="text" placeholder="Where are you going?" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; outline: none; box-sizing: border-box; margin-bottom: 16px;">
        <div style="font-weight: 600; margin-bottom: 12px; color: #222;">Top destinations</div>
        <div style="display: grid; gap: 8px;">
          <div style="padding: 12px; cursor: pointer; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#f7f7f7'" onmouseout="this.style.backgroundColor='white'" onclick="console.log('Austin selected'); this.closest('.easystay-where-dropdown').remove();">Austin, TX</div>
          <div style="padding: 12px; cursor: pointer; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#f7f7f7'" onmouseout="this.style.backgroundColor='white'" onclick="console.log('Virginia Beach selected'); this.closest('.easystay-where-dropdown').remove();">Virginia Beach, VA</div>
          <div style="padding: 12px; cursor: pointer; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#f7f7f7'" onmouseout="this.style.backgroundColor='white'" onclick="console.log('Asheville selected'); this.closest('.easystay-where-dropdown').remove();">Asheville, NC</div>
          <div style="padding: 12px; cursor: pointer; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#f7f7f7'" onmouseout="this.style.backgroundColor='white'" onclick="console.log('Boston selected'); this.closest('.easystay-where-dropdown').remove();">Boston, MA</div>
          <div style="padding: 12px; cursor: pointer; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#f7f7f7'" onmouseout="this.style.backgroundColor='white'" onclick="console.log('Miami selected'); this.closest('.easystay-where-dropdown').remove();">Miami, FL</div>
        </div>
      </div>
    `;
    
    const navWrapper = document.getElementById('SearchNavWrapper');
    navWrapper.style.position = 'relative';
    navWrapper.appendChild(dropdown);
    
    console.log('✅ WHERE dropdown created');
  }
  
  function showWhenDropdown(element) {
    console.log('📅 Opening WHEN dropdown...');
    
    const dropdown = document.createElement('div');
    dropdown.className = 'easystay-when-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: calc(100% + 12px);
      left: 0;
      width: 420px;
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
      z-index: 10000;
      padding: 24px;
      box-sizing: border-box;
      font-family: inherit;
    `;
    
    const today = new Date().toISOString().split('T')[0];
    dropdown.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <div>
          <label style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #222; letter-spacing: 0.5px;">Check-in</label>
          <input type="date" style="width: 100%; padding: 12px; border: 1px solid #dddddd; border-radius: 8px; font-size: 16px; outline: none; box-sizing: border-box;" min="${today}">
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #222; letter-spacing: 0.5px;">Check-out</label>
          <input type="date" style="width: 100%; padding: 12px; border: 1px solid #dddddd; border-radius: 8px; font-size: 16px; outline: none; box-sizing: border-box;" min="${today}">
        </div>
      </div>
    `;
    
    const navWrapper = document.getElementById('SearchNavWrapper');
    navWrapper.style.position = 'relative';
    navWrapper.appendChild(dropdown);
    
    console.log('✅ WHEN dropdown created');
  }
  
  function showWhoDropdown(element) {
    console.log('👥 Opening WHO dropdown...');
    
    const dropdown = document.createElement('div');
    dropdown.className = 'easystay-who-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: calc(100% + 12px);
      left: 0;
      width: 380px;
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
      z-index: 10000;
      padding: 24px;
      box-sizing: border-box;
      font-family: inherit;
    `;
    
    dropdown.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #f0f0f0;">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px; color: #222; font-size: 16px;">Adults</div>
          <div style="font-size: 14px; color: #717171;">Ages 13 or above</div>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <button style="width: 32px; height: 32px; border: 1px solid #dddddd; border-radius: 50%; background: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;" onclick="console.log('Decrease guests');">−</button>
          <span style="font-weight: 600; min-width: 24px; text-align: center; color: #222; font-size: 16px;">1</span>
          <button style="width: 32px; height: 32px; border: 1px solid #dddddd; border-radius: 50%; background: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;" onclick="console.log('Increase guests');">+</button>
        </div>
      </div>
    `;
    
    const navWrapper = document.getElementById('SearchNavWrapper');
    navWrapper.style.position = 'relative';
    navWrapper.appendChild(dropdown);
    
    console.log('✅ WHO dropdown created');
  }
  
  function removeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.easystay-where-dropdown, .easystay-when-dropdown, .easystay-who-dropdown');
    dropdowns.forEach(dropdown => {
      console.log('🗑️ Removing dropdown:', dropdown.className);
      dropdown.remove();
    });
  }
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.easystay-where-dropdown') && 
        !e.target.closest('.easystay-when-dropdown') && 
        !e.target.closest('.easystay-who-dropdown') &&
        !e.target.closest('#SearchNavWrapper')) {
      removeAllDropdowns();
    }
  });
  
  // Initialize everything
  function initialize() {
    console.log('🚀 Starting EasyStay initialization...');
    loadGoogleMaps();
    initNavigation();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initialize, 1000);
    });
  } else {
    setTimeout(initialize, 1000);
  }
  
  window.EasyStayCompleteInitialized = true;
  console.log('✅ EasyStay Complete v15.0.0 loaded!');
})();
