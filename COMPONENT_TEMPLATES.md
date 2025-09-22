# Component Templates & Examples

## 🎨 Webflow Component Development Templates

### 1. **PropertyCard Component** (Already Created)
Your PropertyCard component is already set up and working. It includes:
- Property title and location
- Price and rating display
- Host information with Super Host status
- Property images
- Interactive buttons (Book Now, View Details)

### 2. **Navigation Component Template**
To create a Navigation component in Webflow:

#### Design Structure:
```
Navigation Container
├── Logo/Brand
├── Navigation Links
│   ├── Home
│   ├── Search Properties
│   ├── About
│   └── Contact
└── User Actions
    ├── Sign In
    └── Sign Up
```

#### Component Properties:
- `logoUrl` (Image)
- `logoAlt` (Text)
- `navLinks` (Text List)
- `showUserActions` (Boolean)

### 3. **SearchFilters Component Template**
To create a SearchFilters component in Webflow:

#### Design Structure:
```
Search Filters Container
├── Location Input
├── Date Range Picker
├── Guest Count Selector
├── Price Range Slider
├── Property Type Checkboxes
├── Amenities Checkboxes
└── Search Button
```

#### Component Properties:
- `defaultLocation` (Text)
- `minPrice` (Number)
- `maxPrice` (Number)
- `defaultGuests` (Number)
- `propertyTypes` (Text List)
- `amenities` (Text List)

### 4. **SearchResults Component Template**
To create a SearchResults component in Webflow:

#### Design Structure:
```
Search Results Container
├── Results Header
│   ├── Results Count
│   └── Sort Options
├── Results Grid
│   └── PropertyCard (reuse existing)
└── Pagination
```

#### Component Properties:
- `resultsCount` (Number)
- `sortOptions` (Text List)
- `showPagination` (Boolean)

### 5. **BookingForm Component Template**
To create a BookingForm component in Webflow:

#### Design Structure:
```
Booking Form Container
├── Property Details
├── Date Selection
├── Guest Information
├── Special Requests
├── Price Breakdown
└── Book Now Button
```

#### Component Properties:
- `propertyTitle` (Text)
- `propertyPrice` (Number)
- `minStay` (Number)
- `maxGuests` (Number)

## 🛠️ Component Development Checklist

### Before Creating a Component:
- [ ] Plan the component structure and layout
- [ ] Identify dynamic content that needs properties
- [ ] Consider responsive behavior
- [ ] Think about reusability

### During Design:
- [ ] Use consistent spacing and typography
- [ ] Test on different screen sizes
- [ ] Optimize images and assets
- [ ] Use semantic HTML structure

### After Creating Component:
- [ ] Set up component properties
- [ ] Test component in Webflow Designer
- [ ] Sync with DevLink
- [ ] Test in Next.js app
- [ ] Verify responsive behavior

## 📝 Component Naming Convention

### Good Names:
- `PropertyCard` - Clear and descriptive
- `SearchFilters` - Indicates purpose
- `BookingForm` - Specific functionality
- `Navigation` - Standard component name

### Avoid:
- `Card` - Too generic
- `Button` - Too basic
- `Component1` - Not descriptive
- `NewComponent` - Temporary names

## 🎯 Component Properties Best Practices

### Text Properties:
- Use descriptive names: `propertyTitle`, `hostName`
- Set default values when appropriate
- Consider character limits

### Number Properties:
- Set min/max values: `price` (0-10000)
- Use appropriate precision: `rating` (0.1-5.0)
- Consider units: `pricePerNight`, `maxGuests`

### Boolean Properties:
- Use clear true/false meanings: `isSuperHost`, `showPricing`
- Set sensible defaults
- Consider the user experience

### Image Properties:
- Set appropriate dimensions
- Consider aspect ratios
- Provide alt text options

## 🔄 Component Development Workflow

### Step 1: Design in Webflow
1. Open Webflow Designer
2. Navigate to Components page
3. Design your component layout
4. Style with consistent design system

### Step 2: Convert to Component
1. Select all component elements
2. Right-click → "Create Component"
3. Name your component
4. Set up component properties

### Step 3: Test Component
1. Test in Webflow Designer
2. Try different property values
3. Test responsive behavior
4. Verify interactions

### Step 4: Sync to Next.js
1. Run `npm run workflow:sync`
2. Check component in `src/components/`
3. Import and test in React
4. Verify functionality

### Step 5: Iterate
1. Make changes in Webflow
2. Re-sync with DevLink
3. Test changes locally
4. Deploy when ready

## 🚀 Quick Start Commands

```bash
# Sync components from Webflow
npm run workflow:sync

# Start development with auto-sync
npm run workflow:full

# Watch for Webflow changes
npm run workflow:watch

# Deploy to Webflow Cloud
npm run workflow:deploy
```

## 📚 Next Steps

1. **Create Components Page**: Set up a dedicated page in Webflow Designer for component development
2. **Design Navigation**: Create a navigation component for your site
3. **Build Search Filters**: Design the search functionality
4. **Test Integration**: Ensure all components work together
5. **Deploy**: Push your changes to Webflow Cloud

---

**Remember**: Always design in Webflow first, then sync to code. This ensures visual consistency and leverages Webflow's powerful design tools.
