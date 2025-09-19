/**
 * Location Search & Navigation JavaScript
 * Handles auto-completing search and dynamic location content
 */

class LocationSearch {
  constructor() {
    this.locations = [
      { name: 'New York City', id: 'nyc', count: 42, popular: true, icon: '🏙️' },
      { name: 'Los Angeles', id: 'la', count: 28, popular: true, icon: '🌴' },
      { name: 'Miami', id: 'miami', count: 35, popular: true, icon: '🏖️' },
      { name: 'Austin', id: 'austin', count: 19, popular: true, icon: '🤠' },
      { name: 'Denver', id: 'denver', count: 15, popular: false, icon: '🏔️' },
      { name: 'Seattle', id: 'seattle', count: 12, popular: false, icon: '☕' },
      { name: 'Portland', id: 'portland', count: 8, popular: false, icon: '🌲' },
      { name: 'Phoenix', id: 'phoenix', count: 22, popular: false, icon: '🌵' },
      { name: 'Las Vegas', id: 'vegas', count: 14, popular: false, icon: '🎰' },
      { name: 'Salt Lake City', id: 'slc', count: 7, popular: false, icon: '⛰️' },
      { name: 'Bozeman', id: 'bozeman', count: 5, popular: false, icon: '🏔️' },
      { name: 'Jackson', id: 'jackson', count: 3, popular: false, icon: '🦌' }
    ];
    
    this.recentSearches = this.getRecentSearches();
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadRecentSearches();
    this.loadTopLocations();
    this.setupSearchAutocomplete();
  }

  bindEvents() {
    // Location item clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.location-item')) {
        const locationItem = e.target.closest('.location-item');
        const locationName = locationItem.getAttribute('data-location');
        this.selectLocation(locationName);
      }
    });

    // View all locations button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#view-all-locations-btn')) {
        this.showAllLocations();
      }
    });

    // Search input events
    const searchInput = document.getElementById('location-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearchInput(e.target.value);
      });

      searchInput.addEventListener('focus', () => {
        this.showSuggestions();
      });

      searchInput.addEventListener('blur', (e) => {
        // Delay hiding to allow clicking on suggestions
        setTimeout(() => {
          this.hideSuggestions();
        }, 200);
      });
    }

    // Close dropdown when clicking outside
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
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(search => search !== locationName);
    // Add to beginning
    this.recentSearches.unshift(locationName);
    // Keep only last 5
    this.recentSearches = this.recentSearches.slice(0, 5);
    this.saveRecentSearches();
    this.loadRecentSearches();
  }

  loadRecentSearches() {
    const recentContainer = document.getElementById('recent-locations');
    if (!recentContainer) return;

    // Hide the entire recent searches section if no recent searches
    if (this.recentSearches.length === 0) {
      recentContainer.style.display = 'none';
      return;
    }

    // Show the section
    recentContainer.style.display = 'block';

    // Find the container for recent search items (the empty div after the title)
    const recentItemsContainer = recentContainer.querySelector('div:not(.section-title)');
    if (!recentItemsContainer) return;

    // Clear existing content
    recentItemsContainer.innerHTML = '';

    // Add recent search items
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

    // Clear existing content
    locationsGrid.innerHTML = '';

    // Get top 4 popular locations
    const topLocations = this.locations
      .filter(location => location.popular)
      .slice(0, 4);

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
      <span class="location-count">${location.count} properties</span>
    `;

    return item;
  }

  setupSearchAutocomplete() {
    const searchInput = document.getElementById('location-search-input');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (!searchInput || !suggestionsContainer) return;

    // Make search container relative for absolute positioning
    const searchContainer = document.getElementById('location-search-container');
    if (searchContainer) {
      searchContainer.style.position = 'relative';
    }
  }

  handleSearchInput(query) {
    if (!query.trim()) {
      this.hideSuggestions();
      return;
    }

    const suggestions = this.getSuggestions(query);
    this.showSuggestions(suggestions);
  }

  getSuggestions(query) {
    const lowerQuery = query.toLowerCase();
    return this.locations.filter(location => 
      location.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit to 8 suggestions
  }

  showSuggestions(suggestions = []) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;

    if (suggestions.length === 0) {
      this.hideSuggestions();
      return;
    }

    // Clear existing suggestions
    suggestionsContainer.innerHTML = '';

    // Add suggestion items
    suggestions.forEach(location => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'suggestion-item';
      suggestionItem.innerHTML = `
        <div class="location-content">
          <span class="location-icon">${location.icon || '📍'}</span>
          <span class="suggestion-name">${location.name}</span>
        </div>
        <span class="suggestion-count">${location.count} properties</span>
      `;
      
      suggestionItem.addEventListener('click', () => {
        this.selectLocation(location.name);
      });

      suggestionsContainer.appendChild(suggestionItem);
    });

    suggestionsContainer.style.display = 'block';
  }

  hideSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
  }

  selectLocation(locationName) {
    // Update dropdown toggle text - this is the key change you requested
    const dropdownToggle = document.querySelector('[data-filter-dropdown="location"] .search-menu-dropdown-toggle');
    if (dropdownToggle) {
      const textElement = dropdownToggle.querySelector('div');
      if (textElement) {
        textElement.textContent = locationName;
      }
    }

    // Update search input
    const searchInput = document.getElementById('location-search-input');
    if (searchInput) {
      searchInput.value = locationName;
    }

    // Add to recent searches
    this.addToRecentSearches(locationName);

    // Hide suggestions
    this.hideSuggestions();

    // Close dropdown
    this.closeDropdown();

    // Trigger location selection event
    this.onLocationSelected(locationName);
  }

  showAllLocations() {
    const locationsGrid = document.getElementById('locations-grid');
    if (!locationsGrid) return;

    // Clear existing content
    locationsGrid.innerHTML = '';

    // Show all locations
    this.locations.forEach(location => {
      const locationItem = this.createLocationItem(location);
      locationsGrid.appendChild(locationItem);
    });

    // Update button text
    const viewAllBtn = document.getElementById('view-all-locations-btn');
    if (viewAllBtn) {
      viewAllBtn.textContent = 'Show Popular Only';
      viewAllBtn.onclick = () => this.loadTopLocations();
    }
  }

  closeDropdown() {
    const dropdown = document.querySelector('[data-filter-dropdown="location"]');
    if (dropdown) {
      // This would typically close the Webflow dropdown
      // You might need to trigger Webflow's dropdown close method
      console.log('Closing dropdown...');
    }
  }

  onLocationSelected(locationName) {
    console.log('Location selected:', locationName);
    
    // Here you would typically:
    // 1. Filter properties by location
    // 2. Update the property list
    // 3. Update URL parameters
    // 4. Trigger any other location-based functionality
    
    // Example: Dispatch custom event
    const event = new CustomEvent('locationSelected', {
      detail: { location: locationName }
    });
    document.dispatchEvent(event);
  }

  // Public method to get current location data
  getLocationData(locationName) {
    return this.locations.find(location => 
      location.name.toLowerCase() === locationName.toLowerCase()
    );
  }

  // Public method to add new locations dynamically
  addLocation(locationData) {
    this.locations.push(locationData);
    this.loadTopLocations(); // Refresh the display
  }

  // Public method to update location counts
  updateLocationCount(locationName, newCount) {
    const location = this.locations.find(loc => 
      loc.name.toLowerCase() === locationName.toLowerCase()
    );
    if (location) {
      location.count = newCount;
      this.loadTopLocations(); // Refresh the display
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LocationSearch();
});

// Also initialize if script loads after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LocationSearch();
  });
} else {
  new LocationSearch();
}
