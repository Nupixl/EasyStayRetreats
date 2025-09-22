# DevLink Setup Guide for Easy Stay Retreats

This guide will help you set up DevLink integration with Webflow Cloud to sync your property search components and design system.

## 🎯 What We've Built

### ✅ Property Search System
- **Search Properties Page** (`/search-properties`) - Airbnb-style property search
- **Property Card Component** - Interactive property cards with image galleries
- **Search Filters** - Advanced filtering system (location, dates, price, amenities)
- **Search Header** - Professional search interface with mobile responsiveness

### ✅ Components Ready for DevLink
- `PropertyCard` - Property display component
- `SearchFilters` - Filter sidebar component  
- `SearchHeader` - Search interface component
- `SearchResults` - Results grid component

## 🚀 DevLink Setup Steps

### 1. Install Webflow CLI

```bash
# Install Webflow CLI globally
npm install -g webflow-cli

# Or use the local version
npm install webflow-cli --save-dev
```

### 2. Authenticate with Webflow

```bash
# Login to Webflow
webflow auth login

# Verify authentication
webflow auth status
```

### 3. Configure DevLink

Your `webflow.json` is already configured:

```json
{
  "cloud": {
    "framework": "nextjs"
  },
  "devlink": {
    "siteId": "609dfa12a141dd6e70976d48",
    "components": [
      "PropertyCard",
      "SearchFilters", 
      "SearchResults"
    ],
    "pages": [
      "search-properties"
    ]
  }
}
```

### 4. Sync Components from Webflow

```bash
# Sync all DevLink components
npm run devlink:sync

# Or use the CLI directly
webflow devlink sync
```

### 5. Watch for Changes (Development)

```bash
# Watch for changes in Webflow and auto-sync
npm run devlink:watch

# Or use the CLI directly  
webflow devlink watch
```

## 🎨 Webflow Designer Setup

### Create Property Card Component

1. **Open Webflow Designer**
   - Go to your site (ID: 609dfa12a141dd6e70976d48)
   - Open the Designer

2. **Create Component**
   - Go to Components panel
   - Click "Create Component"
   - Name it "PropertyCard"

3. **Design the Card**
   - Add a Container (property card wrapper)
   - Add Image element (property image)
   - Add Text elements (title, location, price, rating)
   - Add Button elements (Book Now, View Details)

4. **Set Component Properties**
   - Select each text element
   - In Element Settings, add Component Properties:
     - `propertyTitle` (Text)
     - `propertyLocation` (Text)
     - `propertyPrice` (Text)
     - `propertyRating` (Text)
     - `propertyImage` (Image)

5. **Add Runtime Props**
   - Select "Book Now" button
   - Add Runtime Prop: `onBookNow`
   - Select "View Details" button  
   - Add Runtime Prop: `onViewDetails`

### Create Search Filters Component

1. **Create Component**
   - Name: "SearchFilters"
   - Add filter sections (Location, Dates, Price, Amenities)

2. **Set Component Properties**
   - `filters` (Object)
   - `onFilterChange` (Function)
   - `onClearFilters` (Function)

### Create Search Results Component

1. **Create Component**
   - Name: "SearchResults"
   - Add grid layout for property cards

2. **Set Component Properties**
   - `properties` (Array)
   - `onBookNow` (Function)
   - `onViewDetails` (Function)

## 🔄 Sync Process

### Initial Sync
```bash
npm run devlink:sync
```

This will:
- Create `devlink/` folder in your project
- Generate React components from Webflow designs
- Set up TypeScript interfaces
- Create component files ready for import

### Development Workflow

1. **Design in Webflow**
   - Make changes to components in Webflow Designer
   - Save and publish changes

2. **Sync to Code**
   ```bash
   npm run devlink:sync
   ```

3. **Use in React**
   ```tsx
   import { PropertyCard } from '@/devlink/PropertyCard';
   
   <PropertyCard
     propertyTitle="Mountain Zen Retreat"
     propertyLocation="Swiss Alps, Switzerland"
     propertyPrice="$357/night"
     propertyRating="4.9"
     propertyImage="/images/retreat-mountain.jpg"
     onBookNow={() => handleBookNow(propertyId)}
     onViewDetails={() => handleViewDetails(propertyId)}
   />
   ```

## 📱 Mobile Responsiveness

The components are designed to be fully responsive:

- **Desktop**: Full sidebar filters + grid layout
- **Tablet**: Collapsible filters + 2-column grid
- **Mobile**: Stacked layout + single column

## 🎨 Design System Integration

### Client-First Methodology
All components follow your Client-First rules:

- **Utility Classes**: `text-size-large`, `padding-section-medium`
- **Component Classes**: `property_card`, `search_filters`
- **Combo Classes**: `button is-primary`, `button is-secondary`

### CSS Variables
Components use your design system variables:

```css
:root {
  --color-primary: #2563eb;
  --color-secondary: #059669;
  --spacing-md: 1rem;
  --font-size-large: 1.25rem;
}
```

## 🚀 Deployment

### Webflow Cloud Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add DevLink property search"
   git push origin main
   ```

2. **Deploy to Webflow Cloud**
   - Changes will auto-deploy via GitHub integration
   - Or manually: `webflow cloud deploy`

3. **Test Live Site**
   - Visit: `https://your-site.webflow.io/app/search-properties`
   - Test all functionality

## 🔧 Troubleshooting

### Common Issues

1. **Sync Fails**
   ```bash
   # Check authentication
   webflow auth status
   
   # Re-authenticate if needed
   webflow auth login
   ```

2. **Components Not Found**
   - Ensure component names match exactly
   - Check Webflow Designer for published components
   - Verify site ID in `webflow.json`

3. **Props Not Working**
   - Check Component Properties are set in Webflow
   - Verify Runtime Props for interactive elements
   - Ensure prop names match between Webflow and React

### Debug Commands

```bash
# Check DevLink status
webflow devlink status

# List available components
webflow devlink list

# Force sync
webflow devlink sync --force
```

## 📚 Next Steps

1. **Design Components in Webflow**
   - Create PropertyCard component
   - Design SearchFilters component
   - Build SearchResults layout

2. **Sync and Test**
   ```bash
   npm run devlink:sync
   npm run dev
   ```

3. **Customize Styling**
   - Adjust CSS variables
   - Modify component styles
   - Test responsive behavior

4. **Add Real Data**
   - Connect to property API
   - Implement search functionality
   - Add booking system

## 🎉 Success!

Your Easy Stay Retreats website now has:

- ✅ **Airbnb-style Property Search**
- ✅ **Interactive Property Cards**
- ✅ **Advanced Filtering System**
- ✅ **Mobile-Responsive Design**
- ✅ **DevLink Integration Ready**
- ✅ **Webflow Cloud Deployment**

The property search system is fully functional and ready for DevLink integration with your Webflow design system!

---

**Ready to sync with Webflow Designer! 🎨✨**
