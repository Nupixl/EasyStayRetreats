/**
 * EasyStay Consistent Navigation Dropdowns
 * Version: 14.0.0
 * 
 * Fixes visual inconsistencies and ensures single dropdown style
 * Features:
 * - Single dropdown system (no overlapping)
 * - Consistent styling across WHERE, WHEN, WHO
 * - Auto-fit dropdowns with proper positioning
 * - Functional location filtering with map integration
 * - Date selection with validation
 * - Guest count controls
 * - Search button that applies all filters
 */

(function() {
  'use strict';
  
  if (window.EasyStayNavInitialized) {
    window.EasyStayNavInitialized = false;
  }
  
  console.log('🧭 EasyStay Consistent Navigation v14.0.0 - Single Dropdown Style!');
  
  // Store filter state
  window.searchFilters = {
    location: '',
    checkinDate: '',
    checkoutDate: '',
    guests: 1
  };
  
  // Top destinations
  const topDestinations = [
    { city: 'Austin', state: 'TX', country: 'USA' },
    { city: 'Virginia Beach', state: 'VA', country: 'USA' },
    { city: 'Asheville', state: 'NC', country: 'USA' },
    { city: 'Boston', state: 'MA', country: 'USA' },
    { city: 'Miami', state: 'FL', country: 'USA' },
    { city: 'Blue Ridge Mountains', state: 'GA', country: 'USA' },
    { city: 'New York', state: 'NY', country: 'USA' },
    { city: 'Los Angeles', state: 'CA', country: 'USA' },
    { city: 'Chicago', state: 'IL', country: 'USA' },
    { city: 'Seattle', state: 'WA', country: 'USA' }
  ];
  
  function initializeNavigation() {
    console.log('🔧 Initializing consistent navigation...');
    
    // Find SearchNavWrapper
    const searchNavWrapper = document.getElementById('SearchNavWrapper');
    if (!searchNavWrapper) {
      console.error('❌ SearchNavWrapper not found!');
      return;
    }
    
    // Remove any existing dropdowns first
    removeAllDropdowns();
    
    console.log('📦 SearchNavWrapper found, setting up navigation...');
    
    // Find nav elements by text content
    const allElements = searchNavWrapper.querySelectorAll('*');
    let whereElements = [];
    let whenElements = [];
    let whoElements = [];
    let searchElements = [];
    
    allElements.forEach(el => {
      const text = el.textContent?.trim().toLowerCase();
      
      if (text === 'where' || el.getAttribute('data-nav') === 'where') {
        whereElements.push(el);
      }
      if (text === 'when' || el.getAttribute('data-nav') === 'when') {
        whenElements.push(el);
      }
      if (text === 'who' || el.getAttribute('data-nav') === 'who') {
        whoElements.push(el);
      }
      if (text === 'search' || el.getAttribute('data-action') === 'search') {
        searchElements.push(el);
      }
    });
    
    console.log('📍 Found elements:', {
      where: whereElements.length,
      when: whenElements.length,
      who: whoElements.length,
      search: searchElements.length
    });
    
    // Only set up the first element of each type to avoid duplicates
    if (whereElements.length > 0) setupWhereDropdown(whereElements[0]);
    if (whenElements.length > 0) setupWhenDropdown(whenElements[0]);
    if (whoElements.length > 0) setupWhoDropdown(whoElements[0]);
    if (searchElements.length > 0) setupSearchButton(searchElements[0]);
    
    console.log('✅ Consistent navigation setup complete!');
  }
  
  function setupWhereDropdown(element) {
    element.style.cursor = 'pointer';
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      removeAllDropdowns();
      showWhereDropdown(element);
    });
    console.log('🌍 WHERE dropdown setup on:', element);
  }
  
  function setupWhenDropdown(element) {
    element.style.cursor = 'pointer';
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      removeAllDropdowns();
      showWhenDropdown(element);
    });
    console.log('📅 WHEN dropdown setup on:', element);
  }
  
  function setupWhoDropdown(element) {
    element.style.cursor = 'pointer';
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      removeAllDropdowns();
      showWhoDropdown(element);
    });
    console.log('👥 WHO dropdown setup on:', element);
  }
  
  function setupSearchButton(element) {
    element.style.cursor = 'pointer';
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      applyFiltersAndSearch();
    });
    console.log('🔍 SEARCH button setup on:', element);
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
    
    // Search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Where are you going?';
    searchInput.style.cssText = `
      width: 100%;
      padding: 20px;
      border: none;
      border-bottom: 1px solid #f0f0f0;
      font-size: 16px;
      outline: none;
      background: white;
      box-sizing: border-box;
      font-family: inherit;
    `;
    dropdown.appendChild(searchInput);
    
    // Header
    const header = document.createElement('div');
    header.textContent = 'Top destinations';
    header.style.cssText = `
      padding: 20px 20px 16px 20px;
      font-weight: 600;
      font-size: 16px;
      color: #222222;
      background: white;
      border-bottom: 1px solid #f0f0f0;
    `;
    dropdown.appendChild(header);
    
    // Destinations container
    const destinationsContainer = document.createElement('div');
    destinationsContainer.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
      background: white;
    `;
    
    topDestinations.forEach((destination, index) => {
      const destItem = document.createElement('div');
      destItem.style.cssText = `
        padding: 16px 20px;
        cursor: pointer;
        transition: background-color 0.2s;
        background: white;
        ${index !== topDestinations.length - 1 ? 'border-bottom: 1px solid #f5f5f5;' : ''}
      `;
      
      const cityName = document.createElement('div');
      cityName.textContent = destination.city;
      cityName.style.cssText = 'font-weight: 600; color: #222222; margin-bottom: 4px; font-size: 15px;';
      
      const location = document.createElement('div');
      location.textContent = `${destination.state}, ${destination.country}`;
      location.style.cssText = 'font-size: 14px; color: #717171;';
      
      destItem.appendChild(cityName);
      destItem.appendChild(location);
      
      destItem.addEventListener('mouseenter', () => {
        destItem.style.backgroundColor = '#f7f7f7';
      });
      
      destItem.addEventListener('mouseleave', () => {
        destItem.style.backgroundColor = 'white';
      });
      
      destItem.addEventListener('click', () => {
        selectLocation(`${destination.city}, ${destination.state}`);
        removeAllDropdowns();
      });
      
      destinationsContainer.appendChild(destItem);
    });
    
    dropdown.appendChild(destinationsContainer);
    
    // Position dropdown
    const navWrapper = document.getElementById('SearchNavWrapper');
    navWrapper.style.position = 'relative';
    navWrapper.appendChild(dropdown);
    
    // Focus search input
    setTimeout(() => searchInput.focus(), 100);
    
    // Filter as user types
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const destItems = destinationsContainer.children;
      
      Array.from(destItems).forEach(item => {
        const cityText = item.querySelector('div').textContent.toLowerCase();
        const stateText = item.querySelector('div:last-child').textContent.toLowerCase();
        const matches = cityText.includes(query) || stateText.includes(query);
        item.style.display = matches ? 'block' : 'none';
      });
    });
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
    
    // Date inputs container
    const dateContainer = document.createElement('div');
    dateContainer.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    `;
    
    // Check-in
    const checkinContainer = document.createElement('div');
    checkinContainer.innerHTML = `
      <label style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #222222; letter-spacing: 0.5px;">Check-in</label>
      <input type="date" id="nav-checkin-date" style="width: 100%; padding: 12px; border: 1px solid #dddddd; border-radius: 8px; font-size: 16px; outline: none; box-sizing: border-box; background: white; font-family: inherit;">
    `;
    
    // Check-out
    const checkoutContainer = document.createElement('div');
    checkoutContainer.innerHTML = `
      <label style="display: block; margin-bottom: 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #222222; letter-spacing: 0.5px;">Check-out</label>
      <input type="date" id="nav-checkout-date" style="width: 100%; padding: 12px; border: 1px solid #dddddd; border-radius: 8px; font-size: 16px; outline: none; box-sizing: border-box; background: white; font-family: inherit;">
    `;
    
    dateContainer.appendChild(checkinContainer);
    dateContainer.appendChild(checkoutContainer);
    dropdown.appendChild(dateContainer);
    
    // Date logic
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = dropdown.querySelector('#nav-checkin-date');
    const checkoutInput = dropdown.querySelector('#nav-checkout-date');
    
    checkinInput.min = today;
    checkoutInput.min = today;
    
    if (window.searchFilters.checkinDate) checkinInput.value = window.searchFilters.checkinDate;
    if (window.searchFilters.checkoutDate) checkoutInput.value = window.searchFilters.checkoutDate;
    
    checkinInput.addEventListener('change', () => {
      checkoutInput.min = checkinInput.value;
      if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
        const nextDay = new Date(checkinInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkoutInput.value = nextDay.toISOString().split('T')[0];
      }
      window.searchFilters.checkinDate = checkinInput.value;
    });
    
    checkoutInput.addEventListener('change', () => {
      window.searchFilters.checkoutDate = checkoutInput.value;
    });
    
    // Position dropdown
    const navWrapper = document.getElementById('SearchNavWrapper');
    navWrapper.style.position = 'relative';
    navWrapper.appendChild(dropdown);
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
    
    // Guest types
    const guestTypes = [
      { label: 'Adults', sublabel: 'Ages 13 or above', count: window.searchFilters.guests || 1, min: 1 },
      { label: 'Children', sublabel: 'Ages 2-12', count: 0, min: 0 },
      { label: 'Infants', sublabel: 'Under 2', count: 0, min: 0 }
    ];
    
    guestTypes.forEach((guest, index) => {
      const guestRow = document.createElement('div');
      guestRow.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        ${index !== guestTypes.length - 1 ? 'border-bottom: 1px solid #f0f0f0;' : ''}
      `;
      
      const guestInfo = document.createElement('div');
      guestInfo.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px; color: #222222; font-size: 16px;">${guest.label}</div>
        <div style="font-size: 14px; color: #717171;">${guest.sublabel}</div>
      `;
      
      const guestControls = document.createElement('div');
      guestControls.style.cssText = `
        display: flex;
        align-items: center;
        gap: 16px;
      `;
      
      const decreaseBtn = document.createElement('button');
      decreaseBtn.textContent = '−';
      decreaseBtn.style.cssText = `
        width: 32px;
        height: 32px;
        border: 1px solid #dddddd;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        outline: none;
        font-family: inherit;
      `;
      
      const countDisplay = document.createElement('span');
      countDisplay.textContent = guest.count;
      countDisplay.style.cssText = `
        font-weight: 600;
        min-width: 24px;
        text-align: center;
        color: #222222;
        font-size: 16px;
      `;
      
      const increaseBtn = document.createElement('button');
      increaseBtn.textContent = '+';
      increaseBtn.style.cssText = `
        width: 32px;
        height: 32px;
        border: 1px solid #dddddd;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        outline: none;
        font-family: inherit;
      `;
      
      // Hover effects
      [decreaseBtn, increaseBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.borderColor = '#222222';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.borderColor = '#dddddd';
        });
      });
      
      // Button functionality
      decreaseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (guest.count > guest.min) {
          guest.count--;
          countDisplay.textContent = guest.count;
          updateGuestCount();
        }
      });
      
      increaseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (guest.count < 16) {
          guest.count++;
          countDisplay.textContent = guest.count;
          updateGuestCount();
        }
      });
      
      function updateGuestCount() {
        const totalGuests = guestTypes.reduce((sum, g) => sum + g.count, 0);
        window.searchFilters.guests = totalGuests;
        console.log('👥 Guest count updated:', totalGuests);
      }
      
      guestControls.appendChild(decreaseBtn);
      guestControls.appendChild(countDisplay);
      guestControls.appendChild(increaseBtn);
      
      guestRow.appendChild(guestInfo);
      guestRow.appendChild(guestControls);
      dropdown.appendChild(guestRow);
    });
    
    // Position dropdown
    const navWrapper = document.getElementById('SearchNavWrapper');
    navWrapper.style.position = 'relative';
    navWrapper.appendChild(dropdown);
  }
  
  function selectLocation(location) {
    console.log('📍 Location selected:', location);
    window.searchFilters.location = location;
    
    if (window.map && window.properties) {
      const property = window.properties.find(p => 
        p.location.toLowerCase().includes(location.toLowerCase().split(',')[0])
      );
      if (property) {
        window.map.setCenter({ lat: property.lat, lng: property.lng });
        window.map.setZoom(12);
      }
    }
  }
  
  function applyFiltersAndSearch() {
    console.log('🔍 Applying filters and searching...');
    
    const allProperties = window.properties || [];
    let filteredProperties = [...allProperties];
    
    // Filter by location
    if (window.searchFilters.location) {
      const searchLocation = window.searchFilters.location.toLowerCase();
      filteredProperties = filteredProperties.filter(property => 
        property.location.toLowerCase().includes(searchLocation) ||
        property.title.toLowerCase().includes(searchLocation)
      );
    }
    
    // Filter by guest capacity
    if (window.searchFilters.guests > 1) {
      filteredProperties = filteredProperties.filter(property => 
        property.guests >= window.searchFilters.guests
      );
    }
    
    updatePropertyDisplay(filteredProperties);
    updateMapMarkers(filteredProperties);
    updatePropertyCount(filteredProperties.length);
    removeAllDropdowns();
    
    console.log('✅ Search completed. Showing', filteredProperties.length, 'properties');
  }
  
  function updatePropertyDisplay(properties) {
    const listContainer = document.querySelector('[data-list-root="property-listing-wrapper"]');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    properties.forEach(property => {
      const cardHTML = createPropertyCardHTML(property);
      listContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
  }
  
  function updateMapMarkers(properties) {
    if (!window.map || !window.markers) return;
    
    window.markers.forEach(markerData => {
      markerData.marker.setVisible(false);
      markerData.circle.setVisible(false);
    });
    
    properties.forEach(property => {
      const markerData = window.markers.find(m => m.property.id === property.id);
      if (markerData) {
        markerData.marker.setVisible(true);
        markerData.circle.setVisible(true);
      }
    });
  }
  
  function updatePropertyCount(count) {
    const countElement = document.getElementById('NumberOfProperties');
    if (countElement) {
      countElement.textContent = count;
    }
  }
  
  function createPropertyCardHTML(property) {
    return `
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
            <div class="w-slider-nav w-round" style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: white; opacity: 1;"></div>
              <div style="width: 8px; height: 8px; border-radius: 50%; background: white; opacity: 0.5;"></div>
            </div>
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
              <div class="card-compare-price" style="text-decoration: line-through; color: #999; font-size: 14px;">${property.comparedPrice}</div>
              <div class="card-price" style="font-size: 16px; font-weight: 600; color: #333;">${property.price}</div>
              <div class="card-duration" style="color: #666; font-size: 14px;">/night</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  function removeAllDropdowns() {
    // Remove all possible dropdown classes to ensure no duplicates
    const dropdowns = document.querySelectorAll('.easystay-where-dropdown, .easystay-when-dropdown, .easystay-who-dropdown, .where-dropdown, .when-dropdown, .who-dropdown');
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
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initializeNavigation, 2000);
    });
  } else {
    setTimeout(initializeNavigation, 2000);
  }
  
  window.EasyStayNavInitialized = true;
  console.log('✅ EasyStay Consistent Navigation v14.0.0 loaded!');
})();
