// Location Search & Navigation JavaScript - CMS Driven
class LocationSearchCMS {
  constructor() {
    this.locations = [];
    this.recentSearches = this.getRecentSearches();
    this.init();
  }

  async init() {
    await this.loadLocationsFromCMS();
    this.bindEvents();
    this.loadRecentSearches();
    this.loadTopLocations();
    this.setupSearchAutocomplete();
  }

  async loadLocationsFromCMS() {
    try {
      // Fetch properties from your Webflow CMS
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const properties = await response.json();
      
      // Group properties by city and count them
      const locationMap = new Map();
      
      properties.forEach(property => {
        const city = property.location;
        if (city) {
          if (locationMap.has(city)) {
            locationMap.get(city).count++;
          } else {
            locationMap.set(city, {
              name: city,
              id: city.toLowerCase().replace(/\s+/g, '-'),
              count: 1,
              popular: false, // We'll determine this based on count
              icon: this.getCityIcon(city)
            });
          }
        }
      });

      // Convert to array and sort by count
      this.locations = Array.from(locationMap.values())
        .sort((a, b) => b.count - a.count);

      // Mark top 4 as popular
      this.locations.slice(0, 4).forEach(location => {
        location.popular = true;
      });

      console.log('Loaded locations from CMS:', this.locations);
    } catch (error) {
      console.error('Error loading locations from CMS:', error);
      // Fallback to hardcoded data if CMS fails
      this.loadFallbackLocations();
    }
  }

  // New method for comprehensive CMS search
  async searchCMS(query) {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const searchData = await response.json();
      return searchData.results || [];
    } catch (error) {
      console.error('Error searching CMS:', error);
      return [];
    }
  }

  loadFallbackLocations() {
    this.locations = [
      { name: 'Austin', id: 'austin', count: 1, popular: true, icon: '🤠' },
      { name: 'Miami Beach', id: 'miami-beach', count: 1, popular: true, icon: '🏖️' },
      { name: 'Asheville', id: 'asheville', count: 1, popular: true, icon: '🏔️' },
      { name: 'Albuquerque', id: 'albuquerque', count: 6, popular: true, icon: '🌵' },
      { name: 'Washington', id: 'washington', count: 1, popular: false, icon: '🏛️' },
      { name: 'Annapolis', id: 'annapolis', count: 1, popular: false, icon: '⚓' },
      { name: 'McHenry', id: 'mchenry', count: 1, popular: false, icon: '🏔️' },
      { name: 'Oakland', id: 'oakland', count: 1, popular: false, icon: '🌲' },
      { name: 'Lenox', id: 'lenox', count: 1, popular: false, icon: '🎭' },
      { name: 'Severn', id: 'severn', count: 1, popular: false, icon: '🏠' },
      { name: 'Glen Burnie', id: 'glen-burnie', count: 1, popular: false, icon: '⛵' },
      { name: 'Roseland', id: 'roseland', count: 1, popular: false, icon: '🏔️' }
    ];
  }

  getCityIcon(city) {
    const iconMap = {
      'Austin': '🤠',
      'Miami Beach': '🏖️',
      'Asheville': '🏔️',
      'Albuquerque': '🌵',
      'Washington': '🏛️',
      'Annapolis': '⚓',
      'McHenry': '🏔️',
      'Oakland': '🌲',
      'Lenox': '🎭',
      'Severn': '🏠',
      'Glen Burnie': '⛵',
      'Roseland': '🏔️',
      'New York': '🏙️',
      'Los Angeles': '🌴',
      'Miami': '🏖️',
      'Denver': '🏔️',
      'Seattle': '☕',
      'Portland': '🌲',
      'Phoenix': '🌵',
      'Las Vegas': '🎰',
      'Salt Lake City': '⛰️',
      'Bozeman': '🏔️',
      'Jackson': '🦌'
    };
    
    return iconMap[city] || '📍';
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.location-item')) {
        const locationItem = e.target.closest('.location-item');
        const locationName = locationItem.getAttribute('data-location');
        this.selectLocation(locationName);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('#view-all-locations-btn')) {
        this.showAllLocations();
      }
    });

    const searchInput = document.getElementById('location-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearchInput(e.target.value);
      });

      searchInput.addEventListener('focus', () => {
        this.showSuggestions();
      });

      searchInput.addEventListener('blur', (e) => {
        setTimeout(() => {
          this.hideSuggestions();
        }, 200);
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-filter-dropdown="location"]')) {
        this.closeDropdown();
      }
    });
  }

  getRecentSearches() {
    try {
      const recent = localStorage.getItem('recentLocationSearches');
      return recent ? JSON.parse(recent) : [];
    } catch (e) {
      return [];
    }
  }

  saveRecentSearches() {
    try {
      localStorage.setItem('recentLocationSearches', JSON.stringify(this.recentSearches));
    } catch (e) {
      console.warn('Could not save recent searches to localStorage');
    }
  }

  addToRecentSearches(locationName) {
    this.recentSearches = this.recentSearches.filter(search => search !== locationName);
    this.recentSearches.unshift(locationName);
    this.recentSearches = this.recentSearches.slice(0, 5);
    this.saveRecentSearches();
    this.loadRecentSearches();
  }

  loadRecentSearches() {
    const recentContainer = document.getElementById('recent-locations');
    if (!recentContainer) return;

    if (this.recentSearches.length === 0) {
      recentContainer.style.display = 'none';
      return;
    }

    recentContainer.style.display = 'block';
    const recentItemsContainer = recentContainer.querySelector('div:not(.section-title)');
    if (!recentItemsContainer) return;

    recentItemsContainer.innerHTML = '';
    this.recentSearches.forEach(locationName => {
      const location = this.locations.find(loc => loc.name === locationName);
      if (location) {
        const locationItem = this.createLocationItem(location, true);
        recentItemsContainer.appendChild(locationItem);
      }
    });
  }

  loadTopLocations() {
    const locationsGrid = document.getElementById('locations-grid');
    if (!locationsGrid) return;

    locationsGrid.innerHTML = '';
    const topLocations = this.locations.filter(location => location.popular).slice(0, 4);
    topLocations.forEach(location => {
      const locationItem = this.createLocationItem(location);
      locationsGrid.appendChild(locationItem);
    });
  }

  createLocationItem(location, isRecent = false) {
    const item = document.createElement('div');
    item.className = 'location-item';
    item.setAttribute('data-location', location.name);
    item.setAttribute('data-location-id', location.id);

    item.innerHTML = `
      <div class="location-content">
        <span class="location-icon">${location.icon || '📍'}</span>
        <span class="location-name">${location.name}</span>
      </div>
      <span class="location-count">${location.count} ${location.count === 1 ? 'property' : 'properties'}</span>
    `;

    return item;
  }

  setupSearchAutocomplete() {
    const searchInput = document.getElementById('location-search-input');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (!searchInput || !suggestionsContainer) return;

    const searchContainer = document.getElementById('location-search-container');
    if (searchContainer) {
      searchContainer.style.position = 'relative';
    }
  }

  async handleSearchInput(query) {
    if (!query.trim()) {
      this.hideSuggestions();
      return;
    }

    // Use comprehensive CMS search for better results
    const searchResults = await this.searchCMS(query);
    this.showSearchResults(searchResults, query);
  }

  getSuggestions(query) {
    const lowerQuery = query.toLowerCase();
    return this.locations.filter(location => 
      location.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 8);
  }

  showSuggestions(suggestions = []) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;

    if (suggestions.length === 0) {
      this.hideSuggestions();
      return;
    }

    suggestionsContainer.innerHTML = '';

    suggestions.forEach(location => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'suggestion-item';
      suggestionItem.innerHTML = `
        <div class="location-content">
          <span class="location-icon">${location.icon || '📍'}</span>
          <span class="suggestion-name">${location.name}</span>
        </div>
        <span class="suggestion-count">${location.count} ${location.count === 1 ? 'property' : 'properties'}</span>
      `;
      
      suggestionItem.addEventListener('click', () => {
        this.selectLocation(location.name);
      });

      suggestionsContainer.appendChild(suggestionItem);
    });

    suggestionsContainer.style.display = 'block';
  }

  // New method to show comprehensive search results
  showSearchResults(searchResults, query) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;

    if (searchResults.length === 0) {
      this.hideSuggestions();
      return;
    }

    suggestionsContainer.innerHTML = '';

    // Group results by location for better organization
    const locationGroups = new Map();
    
    searchResults.forEach(property => {
      const location = property.location;
      if (!locationGroups.has(location)) {
        locationGroups.set(location, {
          location: location,
          properties: [],
          icon: this.getCityIcon(location),
          totalCount: 0
        });
      }
      locationGroups.get(location).properties.push(property);
      locationGroups.get(location).totalCount++;
    });

    // Show up to 8 location groups
    const locationGroupsArray = Array.from(locationGroups.values()).slice(0, 8);
    
    locationGroupsArray.forEach(locationGroup => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'suggestion-item';
      
      // Show the most relevant property for this location
      const topProperty = locationGroup.properties[0];
      const matchIndicator = this.getMatchIndicator(topProperty, query);
      
      suggestionItem.innerHTML = `
        <div class="location-content">
          <span class="location-icon">${locationGroup.icon || '📍'}</span>
          <div class="suggestion-details">
            <span class="suggestion-name">${locationGroup.location}</span>
            <span class="suggestion-match">${matchIndicator}</span>
          </div>
        </div>
        <span class="suggestion-count">${locationGroup.totalCount} ${locationGroup.totalCount === 1 ? 'property' : 'properties'}</span>
      `;
      
      suggestionItem.addEventListener('click', () => {
        this.selectLocation(locationGroup.location);
      });

      suggestionsContainer.appendChild(suggestionItem);
    });

    suggestionsContainer.style.display = 'block';
  }

  // Helper method to show what matched in the search
  getMatchIndicator(property, query) {
    const queryLower = query.toLowerCase();
    
    if (property.title.toLowerCase().includes(queryLower)) {
      return `"${property.title}"`;
    } else if (property.shortDescription.toLowerCase().includes(queryLower)) {
      return property.shortDescription.substring(0, 50) + '...';
    } else if (property.streetAddress.toLowerCase().includes(queryLower)) {
      return property.streetAddress;
    } else {
      return property.shortDescription.substring(0, 30) + '...';
    }
  }

  hideSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
  }

  selectLocation(locationName) {
    const dropdownToggle = document.querySelector('[data-filter-dropdown="location"] .search-menu-dropdown-toggle');
    if (dropdownToggle) {
      const textElement = dropdownToggle.querySelector('div');
      if (textElement) {
        textElement.textContent = locationName;
      }
    }

    const searchInput = document.getElementById('location-search-input');
    if (searchInput) {
      searchInput.value = locationName;
    }

    this.addToRecentSearches(locationName);
    this.hideSuggestions();
    this.closeDropdown();
    this.onLocationSelected(locationName);
  }

  showAllLocations() {
    const locationsGrid = document.getElementById('locations-grid');
    if (!locationsGrid) return;

    locationsGrid.innerHTML = '';
    this.locations.forEach(location => {
      const locationItem = this.createLocationItem(location);
      locationsGrid.appendChild(locationItem);
    });

    const viewAllBtn = document.getElementById('view-all-locations-btn');
    if (viewAllBtn) {
      viewAllBtn.textContent = 'Show Popular Only';
      viewAllBtn.onclick = () => this.loadTopLocations();
    }
  }

  closeDropdown() {
    const dropdown = document.querySelector('[data-filter-dropdown="location"]');
    if (dropdown) {
      console.log('Closing dropdown...');
    }
  }

  onLocationSelected(locationName) {
    console.log('Location selected:', locationName);
    const event = new CustomEvent('locationSelected', {
      detail: { location: locationName }
    });
    document.dispatchEvent(event);
  }

  getLocationData(locationName) {
    return this.locations.find(location => 
      location.name.toLowerCase() === locationName.toLowerCase()
    );
  }

  addLocation(locationData) {
    this.locations.push(locationData);
    this.loadTopLocations();
  }

  updateLocationCount(locationName, newCount) {
    const location = this.locations.find(loc => 
      loc.name.toLowerCase() === locationName.toLowerCase()
    );
    if (location) {
      location.count = newCount;
      this.loadTopLocations();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LocationSearchCMS();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LocationSearchCMS();
  });
} else {
  new LocationSearchCMS();
}
