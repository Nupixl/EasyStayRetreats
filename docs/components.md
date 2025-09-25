# EasyStay Retreats - Component Library

## 🎯 **Component Overview**

This document provides a comprehensive guide to all components available in the EasyStay Retreats application, including Webflow DevLink components, custom React components, and utility components.

## 📁 **Component Categories**

### **1. Webflow DevLink Components**

These components are imported from your Webflow project and maintain exact design consistency.

#### **Navigation & Layout**
- **`NavBar`** - Main navigation component with responsive design
- **`Footer`** - Site footer with links and branding
- **`DashboardHeader`** - Dashboard-specific header component

#### **Property Components**
- **`PropertyCard`** - Individual property listing card
- **`PropertyDirectory`** - Property listing directory/grid
- **`MapElement`** - Interactive map component (Leaflet-based)
- **`Locations`** - Location-based components and utilities

#### **Statistics & Analytics**
- **`StatCard`** - Individual statistic display card
- **`StatContainer`** - Container for multiple stat cards
- **`StatWrapper`** - Wrapper component for statistics
- **`StickHeaderCard`** - Sticky header card component

#### **Interactive Elements**
- **`StepCard`** - Step-by-step process cards
- **`Preloader`** - Loading animation component
- **`ScrollIndicator`** - Scroll progress indicator
- **`Status`** - Status display component
- **`LoginButton`** - Authentication button component

#### **Built-in Components**
- **`BackgroundVideo`** - Video background component
- **`Basic`** - Basic utility components
- **`Dropdown`** - Dropdown menu component
- **`Form`** - Form handling components
- **`Map`** - Map integration utilities
- **`Navbar`** - Navigation bar utilities
- **`Slider`** - Image/content slider
- **`Tabs`** - Tabbed interface component
- **`Typography`** - Text styling components
- **`Video`** - Video player component
- **`YouTubeVideo`** - YouTube video integration

### **2. Custom React Components**

#### **Animation Components**
- **`AnimationWrapper`** - Wrapper for Framer Motion animations
- **`AnimatedNavBar`** - Enhanced navigation with animations
- **`PageTransition`** - Smooth page transitions

#### **Property & Search Components**
- **`MapFilter/LeafletMap`** - Optimized Leaflet map component
- **`MapFilter/PlacesListMapSection`** - Map and listings section
- **`MapFilter/Filters`** - Property filtering modal
- **`SingleListingBody/Location`** - Property location display
- **`PropertyCard`** - Custom property card component
- **`GuestPickerCard`** - Guest selection component

#### **Booking & Wishlist Components**
- **`book/BookingForm`** - Booking form component
- **`book/BookingSummary`** - Booking summary display
- **`Wishlist`** - Wishlist management component
- **`wishlist/WishlistMap`** - Wishlist map display

#### **UI Components**
- **`Button`** - Custom button component
- **`Button/BtnPrimary`** - Primary button variant
- **`Loading`** - Loading spinner components
- **`Pickers`** - Date and guest picker components
- **`search/SearchBar`** - Search functionality

### **3. Utility Components**

#### **Layout Components**
- **`layout/Container`** - Page container wrapper
- **`Header`** - Various header components

#### **Data Components**
- **`Posts`** - Blog post components
- **`SingleListingComponents`** - Property detail components
- **`SingleListingBody`** - Property body components

## 🚀 **Usage Examples**

### **Importing DevLink Components**
```jsx
import { DevLinkProvider } from '../devlink/DevLinkProvider';
import { NavBar, PropertyCard, Footer } from '../devlink';

function MyPage() {
  return (
    <DevLinkProvider>
      <NavBar />
      <PropertyCard />
      <Footer />
    </DevLinkProvider>
  );
}
```

### **Using Custom Components**
```jsx
import AnimationWrapper from '../components/AnimationWrapper';
import { LeafletMap } from '../components/MapFilter/LeafletMap';

function PropertyPage() {
  return (
    <AnimationWrapper animation="fadeInUp" delay={0.2}>
      <LeafletMap 
        setData={setData}
        location={location}
        places={places}
        setPlaces={setPlaces}
      />
    </AnimationWrapper>
  );
}
```

### **Animation Integration**
```jsx
import AnimationWrapper from '../components/AnimationWrapper';
import PageTransition from '../components/PageTransition';

function AnimatedPage() {
  return (
    <PageTransition>
      <AnimationWrapper animation="fadeInUp" trigger="onScroll">
        <h1>Animated Content</h1>
      </AnimationWrapper>
    </PageTransition>
  );
}
```

## 🎨 **Styling & Theming**

### **CSS Modules**
Each DevLink component comes with its own CSS module:
```jsx
import styles from '../devlink/PropertyCard.module.css';
```

### **Global Styles**
```jsx
import '../devlink/global.css';
```

### **Animation Classes**
```css
.hover-lift { transition: transform 0.3s ease; }
.hover-lift:hover { transform: translateY(-5px); }
```

## 🔧 **Configuration**

### **DevLink Provider Setup**
```jsx
import { DevLinkProvider } from '../devlink/DevLinkProvider';

function App({ Component, pageProps }) {
  return (
    <DevLinkProvider>
      <Component {...pageProps} />
    </DevLinkProvider>
  );
}
```

### **Global Styles Import**
```jsx
import Head from 'next/head';

export default function MyPage() {
  return (
    <>
      <Head>
        <link href="/devlink/global.css" rel="stylesheet" type="text/css" />
      </Head>
      {/* Your content */}
    </>
  );
}
```

## 🔄 **Syncing Updates**

To sync updates from your Webflow project:
```bash
npx webflow devlink sync
```

## 📊 **Component Performance**

### **Optimized Components**
- **LeafletMap** - Debounced API calls, memoized markers
- **PropertyCard** - Lazy loading, image optimization
- **AnimationWrapper** - Efficient Framer Motion usage

### **Performance Tips**
1. Use dynamic imports for heavy components
2. Implement proper loading states
3. Optimize images and assets
4. Use React.memo for expensive components

## 🎯 **Best Practices**

### **Component Usage**
1. **Always wrap with DevLinkProvider** for DevLink components
2. **Use AnimationWrapper** for consistent animations
3. **Implement proper loading states** for async components
4. **Follow naming conventions** for custom components

### **Styling Guidelines**
1. **Use CSS modules** for component-specific styles
2. **Leverage global styles** for consistent theming
3. **Implement responsive design** with breakpoint-specific styles
4. **Use utility classes** for common patterns

### **Animation Guidelines**
1. **Use consistent animation timing** (0.3s ease)
2. **Implement scroll-triggered animations** for better UX
3. **Add loading states** for smooth transitions
4. **Test on different devices** for performance

## 🚀 **Next Steps**

1. **Test Components** - Visit `/devlink-demo` to see all components
2. **Integrate** - Start using components in your pages
3. **Customize** - Modify components as needed for your use case
4. **Sync Updates** - Use `npx webflow devlink sync` to get updates from Webflow

## 📝 **Notes**

- All DevLink components maintain exact Webflow styling
- Custom components are optimized for performance
- Animation system replaces Webflow's built-in animations
- Components are fully responsive and accessible
- TypeScript definitions are available for all components

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Status:** ✅ Active Development
