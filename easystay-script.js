/**
 * EasyStay Search Properties Script
 * External hosting solution
 */

(function() {
  'use strict';
  
  if (window.EasyStayExternalLoaded) return;
  
  console.log('🏠 EasyStay External Script - Loading...');
  
  // Only run on search properties page
  if (!window.location.pathname.includes('search-properties')) return;
  
  // Properties data
  const properties = [
    { id: 'test-1', title: 'Downtown Loft', rating: 4.8, location: 'Austin, TX', guests: 4, bedrooms: 2, bathrooms: 2, price: '$120', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop', lat: 30.274665, lng: -97.74035, url: '/properties/downtown-loft' },
    { id: 'test-2', title: 'Beachfront Cottage', rating: 4.9, location: 'Virginia Beach, VA', guests: 6, bedrooms: 3, bathrooms: 2, price: '$185', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=400&auto=format&fit=crop', lat: 36.8508, lng: -75.9776, url: '/properties/beachfront-cottage' },
    { id: 'test-3', title: 'Mountain Retreat', rating: 4.7, location: 'Asheville, NC', guests: 8, bedrooms: 4, bathrooms: 3, price: '$220', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop', lat: 35.5951, lng: -82.5515, url: '/properties/mountain-retreat' },
    { id: 'test-4', title: 'Historic Brownstone', rating: 4.6, location: 'Boston, MA', guests: 5, bedrooms: 3, bathrooms: 2, price: '$165', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&auto=format&fit=crop', lat: 42.3601, lng: -71.0589, url: '/properties/historic-brownstone' },
    { id: 'test-5', title: 'Waterfront Condo', rating: 4.9, location: 'Miami, FL', guests: 4, bedrooms: 2, bathrooms: 2, price: '$280', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=400&auto=format&fit=crop', lat: 25.7617, lng: -80.1918, url: '/properties/waterfront-condo' },
    { id: 'test-6', title: 'Desert Oasis', rating: 4.5, location: 'Santa Fe, NM', guests: 6, bedrooms: 3, bathrooms: 2, price: '$195', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop', lat: 35.6870, lng: -105.9378, url: '/properties/desert-oasis' }
  ];
  
  let map, markers = [];
  
  // Load Google Maps
  function loadMaps() {
    if (typeof google !== 'undefined' && google.maps) {
      initMap();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD8v_6yM27IK1EqjrA9zQKsl5XyoQmA92Q&callback=initMap';
    script.async = true;
    window.initMap = initMap;
    document.head.appendChild(script);
  }
  
  function initMap() {
    const mapEl = document.getElementById('search-map');
    if (!mapEl) return;
    
    mapEl.style.minHeight = '40rem';
    mapEl.style.width = '100%';
    
    map = new google.maps.Map(mapEl, {
      zoom: 6,
      center: { lat: 36.0, lng: -79.0 }
    });
    
    properties.forEach(property => {
      const marker = new google.maps.Marker({
        position: { lat: property.lat, lng: property.lng },
        map: map,
        title: property.title
      });
      markers.push({ marker, property });
    });
    
    renderCards();
    console.log('✅ Map and cards loaded');
  }
  
  function renderCards() {
    const container = document.querySelector('[data-list-root="property-listing-wrapper"]');
    if (!container) return;
    
    container.innerHTML = '';
    properties.forEach(property => {
      const card = document.createElement('div');
      card.className = 'property-card';
      card.style.cssText = 'background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px; cursor: pointer;';
      
      card.innerHTML = `
        <div style="height: 200px; position: relative;">
          <img src="${property.image}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; top: 12px; right: 12px; background: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">Super Host</div>
        </div>
        <div style="padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div style="font-size: 16px; font-weight: 600; color: #333; flex: 1; margin-right: 8px;">${property.title}</div>
            <div style="display: flex; align-items: center; white-space: nowrap;">
              <span style="color: #333; font-size: 14px;">⭐ ${property.rating}</span>
            </div>
          </div>
          <div style="color: #666; font-size: 14px; margin-bottom: 8px;">${property.location}</div>
          <div style="color: #666; font-size: 14px; margin-bottom: 8px;">${property.guests} guests • ${property.bedrooms} bedrooms • ${property.bathrooms} bathrooms</div>
          <div style="font-size: 16px; font-weight: 600; color: #333;">${property.price}/night</div>
        </div>
      `;
      
      card.addEventListener('click', () => {
        const markerData = markers.find(m => m.property.id === property.id);
        if (markerData) {
          map.setCenter({ lat: property.lat, lng: property.lng });
          map.setZoom(15);
        }
        setTimeout(() => window.location.href = property.url, 300);
      });
      
      container.appendChild(card);
    });
  }
  
  // Initialize
  setTimeout(() => {
    loadMaps();
  }, 1000);
  
  window.EasyStayExternalLoaded = true;
  console.log('✅ EasyStay External Script loaded');
})();
