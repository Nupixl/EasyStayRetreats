/**
 * EasyStay Script Loader
 * Loads the complete search properties script from GitHub
 */

(function() {
  'use strict';
  
  if (window.EasyStayLoaderInitialized) return;
  
  console.log('📦 EasyStay Script Loader - Loading from GitHub...');
  
  // Check if we're on the search properties page
  const isSearchPage = window.location.pathname.includes('search-properties');
  
  if (!isSearchPage) {
    console.log('⏭️ Not on search properties page, skipping script load');
    return;
  }
  
  // Load the complete script from GitHub
  const script = document.createElement('script');
  script.src = 'https://raw.githubusercontent.com/elijahwilliams/EasyStayRetreats/main/webflow-scripts/complete-search-properties-v15.js';
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    console.log('✅ EasyStay complete script loaded from GitHub');
  };
  
  script.onerror = () => {
    console.error('❌ Failed to load script from GitHub');
  };
  
  document.head.appendChild(script);
  
  window.EasyStayLoaderInitialized = true;
  console.log('✅ EasyStay Script Loader initialized');
})();
