# Landing Page Builder Updates

## Overview
Enhanced the landing page builder with customizable background images/colors for each section type and implemented a mobile-first sticky CTA button strategy.

---

## Changes Made

### 1. **Added Background Image & Color Parameters to All Sections**

#### Updated Interfaces
- **BenefitsSectionData**: Added `backgroundImage?` and `backgroundColor?` properties
- **TestimonialSectionData**: Added `backgroundImage?` and `backgroundColor?` properties  
- **FormSectionData**: Added `backgroundImage?` and `backgroundColor?` properties
- **HeroSectionData** & **CtaSectionData**: Already had these properties

#### Default Values
- **Benefits Section**:
  - `backgroundImage`: `'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'`
  - `backgroundColor`: `'#ffffff'`

- **Testimonial Section**:
  - `backgroundImage`: `'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80'`
  - `backgroundColor`: `'#1e3a5f'`

- **Form Section**:
  - `backgroundImage`: `''` (empty by default)
  - `backgroundColor`: `'#f8fafc'`

#### Inspector Fields Added
Each section type now includes editable fields in the section inspector:
- **Background Image URL**: Text input for image URL
- **Background Color**: Text input for hex color code

---

### 2. **Mobile Button Strategy**

#### Hidden Buttons on Mobile
All CTA buttons are now hidden on mobile (`< 640px`) using Tailwind's `hidden sm:inline-flex` classes:
- Hero section CTA button
- Benefits section "CONTACT US" button
- Testimonial section "CONTACT US" button
- Final CTA section button

#### Sticky Mobile CTA Button
Added a fixed bottom sticky CTA button that:
- Only appears on mobile devices (`sm:hidden`)
- Sticks to the bottom of the viewport with `position: fixed`
- Has elevated shadow and modern styling
- Automatically determines:
  - **Button Text**: Uses CTA section button text, falls back to hero CTA text, or defaults to "Get Started"
  - **Button Link**: Links to form section if present (using `#form-{id}` anchor), otherwise uses CTA/hero link

#### Mobile Layout Adjustments
- Added `pb-24` (padding-bottom: 6rem) on mobile to prevent content from being hidden behind sticky button
- Removed on desktop with `sm:pb-0`

---

### 3. **Dynamic Background Rendering**

#### Benefits Section
```tsx
<div style={{ backgroundColor: section.data.backgroundColor || '#ffffff' }}>
  {section.data.backgroundImage && (
    <Image src={section.data.backgroundImage} alt="Benefits" fill className="object-cover" />
  )}
</div>
```

#### Testimonial Section
```tsx
<div style={{
  backgroundImage: section.data.backgroundImage 
    ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${section.data.backgroundImage})`
    : undefined,
  backgroundColor: section.data.backgroundColor || '#1e3a5f',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}} />
```

#### Form Section
```tsx
<div style={{
  backgroundColor: section.data.backgroundColor || '#f8fafc',
  backgroundImage: section.data.backgroundImage 
    ? `url(${section.data.backgroundImage})`
    : undefined,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}} />
```

---

### 4. **Public Referral Page Updates**

Updated `/app/refer/[slug]/page.tsx` to:
- Fetch landing page data from database
- Render full landing page if published
- Include all section types with proper styling
- Apply same mobile sticky CTA button
- Fallback to simple referral form if no landing page exists

---

## Files Modified

1. **`src/components/landing/LandingPageBuilder.tsx`**
   - Updated section interfaces
   - Added background fields to inspector
   - Updated section rendering with dynamic backgrounds
   - Hidden buttons on mobile
   - Added sticky mobile CTA button

2. **`src/app/refer/[slug]/page.tsx`**
   - Fetch landing page from database
   - Render full landing page if published
   - Include mobile sticky CTA
   - Maintain fallback to simple form

---

## User Experience Improvements

### Desktop (≥640px)
- All buttons visible and functional
- Full section backgrounds customizable
- Professional multi-section layout

### Mobile (<640px)
- Clean interface without button clutter
- Single prominent CTA at bottom
- Easy thumb-reach for primary action
- Smooth scrolling to form section
- Content padding prevents overlap

---

## Technical Details

### Sticky Button Logic
```typescript
const formSection = sections.find(s => s.type === 'form');
const ctaSection = sections.find(s => s.type === 'cta');
const heroSection = sections.find(s => s.type === 'hero');

const mobileCTAText = ctaSection?.data.buttonText || heroSection?.data.ctaText || 'Get Started';
const mobileCTALink = formSection ? `#form-${formSection.id}` : (ctaSection?.data.buttonLink || heroSection?.data.ctaLink || '#');
```

### Form Section Anchor
Form sections now include an `id` attribute for smooth scrolling:
```tsx
<div id={`form-${section.id}`}>
```

---

## QA Checklist

- ✅ No linter errors
- ✅ All section types support background images
- ✅ All section types support background colors
- ✅ Inspector fields functional for all sections
- ✅ Mobile buttons hidden on all sections
- ✅ Sticky CTA button appears only on mobile
- ✅ Sticky button links to form section
- ✅ Content padding prevents overlap
- ✅ Public referral page renders landing pages
- ✅ Fallback to simple form works
- ✅ TypeScript types updated correctly

---

---

## Update: All Buttons Link to Form Section

### Button Behavior
**All CTA buttons across all sections now link directly to the form section:**
- Hero section CTA button → Form section
- Benefits section "CONTACT US" button → Form section
- Testimonial section "CONTACT US" button → Form section
- Final CTA section button → Form section
- Mobile sticky CTA button → Form section

### Implementation
```typescript
const formSection = sections.find(s => s.type === 'form');
const formLink = formSection ? `#form-${formSection.id}` : '#';
```

All buttons now use `href={formLink}` instead of their individual link properties.

---

## Form Section Protection

### Mandatory Form Section
The form section is now **mandatory and cannot be deleted**:

```typescript
const removeSection = (id: string) => {
    const target = sections.find((section) => section.id === id);
    if (!target) return;

    // Form sections are mandatory and cannot be deleted
    if (target.type === 'form') {
        setToastMessage('The referral form is mandatory and cannot be removed.');
        return;
    }

    setSections((prev) => prev.filter((section) => section.id !== id));
};
```

### User Experience
- Attempting to delete a form section shows a toast message
- Message: "The referral form is mandatory and cannot be removed."
- Form section always remains on the page
- Ensures every landing page has a conversion point

---

## Next Steps (User Requested)

Waiting for example of the mobile CTA button styling/behavior to refine if needed.

