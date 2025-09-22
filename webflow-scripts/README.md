# EasyStay Webflow Scripts

This directory contains external JavaScript files for the EasyStay Webflow site to avoid script size limitations.

## Files

### `search-properties-complete.js`
**Version**: 2.4.0  
**Purpose**: Complete functionality for the search properties page

**Features:**
- ✅ Interactive Google Maps with property markers
- ✅ Property listing cards with filtering
- ✅ Airbnb-style navigation dropdowns
- ✅ Map-to-list synchronization  
- ✅ Location privacy features (obfuscated markers)
- ✅ Hover/click interactions
- ✅ URL parameter handling for booking flow

**Usage:**
This script is automatically loaded by the External Script Loader in Webflow when visiting the search properties page.

**URLs:**
- **Primary**: `https://raw.githubusercontent.com/EasyStayRetreats/EasyStayRetreats/main/webflow-scripts/search-properties-complete.js`
- **CDN Backup**: `https://cdn.jsdelivr.net/gh/EasyStayRetreats/EasyStayRetreats@main/webflow-scripts/search-properties-complete.js`

## Setup Instructions

1. **Webflow Integration**:
   - The External Script Loader (v1.1.0) is already configured in Webflow
   - It automatically loads this script on search properties pages
   - No additional Webflow configuration needed

2. **Making Updates**:
   - Edit the script file in this repository
   - Commit changes to the `main` branch
   - Updates are automatically reflected (may take 1-2 minutes for CDN cache)

3. **Testing**:
   - Visit the search properties page
   - Open browser console and look for: `🏠 EasyStay Search Properties v2.4.0`
   - Verify all functionality works: map, listings, dropdowns, interactions

## Benefits

- **No Webflow Script Limits**: External files can be any size
- **Easy Updates**: Edit GitHub file, changes reflect immediately  
- **Version Control**: Track changes with Git
- **CDN Acceleration**: JSDelivr provides global caching
- **Fallback Protection**: Multiple loading strategies
- **Team Collaboration**: Multiple developers can contribute

## Dependencies

- Google Maps JavaScript API (Key: `AIzaSyD8v_6yM27IK1EqjrA9zQKsl5XyoQmA92Q`)
- Webflow native interactions (IX2, Slider)

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge

---

*For issues or updates, please open an issue in this repository.*
