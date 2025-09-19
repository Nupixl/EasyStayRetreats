# Webflow Components Documentation

This document tracks all Webflow components used in the Easy Stay Retreats project, following the client-first naming conventions and component sync workflow.

## Component Sync Workflow

1. **Update Webflow DevLink first** - Always start by pulling the latest DevLink update
2. **Check for existing components** - Review the synced component library
3. **Use existing components** - If the required component exists, use it directly when building the page
4. **Create new components** - Use the Webflow MCP to create new components in Webflow Designer
5. **Sync to DevLink** - Upload new components to DevLink and confirm they appear in the library
6. **Insert into project** - Only after sync, use the component in the project build

## API Integration Components

### c-webflow-api-client
- **Purpose**: Real-time property data fetching from Webflow CMS
- **Tokens Used**: API authentication, data transformation
- **Variants**: None
- **Synced**: Webflow API v2 → Next.js 2025-01-15
- **Location**: `/lib/webflow-api.ts`
- **Usage**: Fetches and transforms property data from Webflow CMS
- **Features**: 
  - Real-time property data fetching
  - Search and filtering capabilities
  - Error handling and loading states
  - Fallback to client-side filtering
  - Support for multiple images per property
  - Super Host badge display

### c-property-data-transformer
- **Purpose**: Transform Webflow CMS data to Property interface
- **Tokens Used**: Type definitions, interface mapping
- **Variants**: None
- **Synced**: Webflow API → TypeScript interfaces 2025-01-15
- **Location**: `/lib/webflow-api.ts` (transformWebflowProperty function)
- **Usage**: Converts Webflow property data to standardized Property interface
- **Features**:
  - Field mapping from Webflow to Property interface
  - Data validation and fallback values
  - Support for new fields (images, superHost, propertyType)

## Components

### c-property-card
- **Purpose**: Reusable property card container for property listings
- **Tokens Used**: space-16, type-body, color-bg, color-accent-1
- **Variants**: --compact, --featured
- **Synced**: Webflow MCP → DevLink 2025-09-15
- **Location**: `/devlink/PropertyCard.tsx`
- **Usage**: Displays property information including image, title, rating, location, amenities, and pricing
- **Data Fields**: 
  - `data-title`: Property title
  - `data-lat`: Property latitude
  - `data-lng`: Property longitude
  - `data-property-id`: Unique property identifier
  - `data-city`: Property city/location

### c-search-filters
- **Purpose**: Search and filter interface for property discovery
- **Tokens Used**: space-16, type-body, color-bg, color-accent-1
- **Variants**: --compact, --expanded
- **Synced**: Webflow MCP → DevLink 2025-09-15
- **Location**: `/devlink/SearchFilters.tsx`
- **Usage**: Provides search inputs for location, dates, guests, and other filters
- **Features**: 
  - Location search input
  - Date picker for check-in/check-out
  - Guest counter
  - Property count display

### c-property-directory
- **Purpose**: Directory container for displaying all property listings with header and list structure
- **Tokens Used**: space-16, type-body, color-bg
- **Variants**: --compact, --expanded
- **Synced**: Webflow MCP → DevLink 2025-01-15
- **Location**: `/devlink/PropertyDirectory.tsx`
- **Usage**: Main container for property listings with header showing count and pricing info
- **Features**: 
  - Property count display
  - Pricing information header
  - Property cards grid layout
  - Empty state handling

### c-map-element
- **Purpose**: Interactive Google Maps integration for property visualization
- **Tokens Used**: space-16, color-bg
- **Variants**: --fullscreen, --compact
- **Synced**: Webflow MCP → DevLink 2025-09-15
- **Location**: `/devlink/MapElement.tsx`
- **Usage**: Displays properties on an interactive map with markers and selection
- **Features**:
  - Google Maps integration
  - Property markers with custom styling
  - Click handlers for property selection
  - Security radius circles around markers
  - Responsive design

### c-nav-bar
- **Purpose**: Main site navigation component
- **Tokens Used**: space-16, type-body, color-bg, color-accent-1
- **Variants**: --mobile, --desktop
- **Synced**: Webflow MCP → DevLink 2025-09-15
- **Location**: `/devlink/Navigation.tsx`
- **Usage**: Site-wide navigation with dropdown menus and mobile responsive design
- **Features**:
  - Logo and brand name
  - Travel dropdown with location links
  - Our Stays and Search Stays links
  - Accounts dropdown with user actions
  - Mobile hamburger menu
  - Responsive design

### c-footer
- **Purpose**: Site footer component
- **Tokens Used**: space-16, type-body, color-bg
- **Variants**: None
- **Synced**: Webflow MCP → DevLink 2025-09-15
- **Location**: `/devlink/Footer.tsx`
- **Usage**: Site footer with copyright and links
- **Features**:
  - Copyright notice
  - Clean, minimal design
  - Responsive layout

## Naming Conventions

- **Components**: `c-<name>` → `c-nav`, `c-footer`, `c-card`
- **Component modifiers**: `c-<name>--<modifier>` → `c-button--ghost`
- **Layout**: `l-<name>` → `l-grid-3`, `l-container`
- **Utilities**: `u-<prop>-<value>` → `u-mt-24`, `u-text-center`
- **JS hooks**: `js-<feature>` → `js-modal`, `js-tabs`

## Component Usage Examples

### Property Card
```tsx
import { PropertyCard } from '@/devlink/PropertyCard'

<PropertyCard
  property={property}
  isSelected={selectedProperty?.id === property.id}
/>
```

### Search Filters
```tsx
import { SearchFilters } from '@/devlink/SearchFilters'

<SearchFilters
  onSearch={handleSearch}
  initialFilters={searchFilters}
  propertyCount={filteredProperties.length}
/>
```

### Map Element
```tsx
import { MapElement } from '@/devlink/MapElement'

<MapElement
  properties={filteredProperties}
  selectedProperty={selectedProperty}
  onPropertySelect={handlePropertySelect}
/>
```

### Navigation
```tsx
import { Navigation } from '@/devlink/Navigation'

<Navigation />
```

### Footer
```tsx
import { Footer } from '@/devlink/Footer'

<Footer />
```

## Change Log

### 2025-01-15
- **CHANGE**: Integrated Webflow API v2 for real-time property data fetching
- **WHY**: Replace sample data with live property data from Webflow CMS
- **WHAT**: Added webflow-api.ts client, updated Property interface, replaced sample data in search-properties page
- **RISK**: API dependency - fallback to client-side filtering if API fails
- **QA**: Loading states, error handling, and fallback mechanisms implemented

### 2025-09-15
- **CHANGE**: Created c-property-card, c-search-filters, c-map-element, c-nav-bar, and c-footer components
- **WHY**: Replaced custom React components with Webflow-sourced components for consistency
- **WHAT**: Added PropertyCard.tsx, SearchFilters.tsx, MapElement.tsx, Navigation.tsx, Footer.tsx to /devlink directory
- **RISK**: None - components maintain same functionality with Webflow structure
- **QA**: Desktop/Tablet/Mobile checked; contrast OK; MCP mapping unaffected

## QA Checklist

- [x] Visual check on Desktop, Tablet, Mobile breakpoints
- [x] Confirm tokens used (no hard-coded colors/spacing)
- [x] Accessibility basics: semantic tags, keyboard navigation, text contrast >= WCAG AA
- [x] Performance: lazy-load images, minimize large scripts
- [x] Interaction tests: property selection, search functionality
- [x] MCP test calls: success and failure responses simulated
- [x] Naming & doc: classes follow rules, components documented
- [x] Backup: Webflow backup + change documentation
