# Landing Page Builder - Final Updates

## Summary of Changes

### 1. ✅ Background Image Upload (Instead of URL)
- Replaced text input for background image URL with file upload
- Added `BackgroundSelector` component with:
  - Toggle between "Color" and "Image" modes
  - Color picker with hex input for color mode
  - File upload input for image mode
  - Live preview of uploaded image
  - Uses FileReader API to convert to data URL (production should upload to storage service)

### 2. ✅ Background Type Selection
- Added `backgroundType?: 'color' | 'image'` to all section interfaces:
  - `HeroSectionData`
  - `BenefitsSectionData`
  - `TestimonialSectionData`
  - `FormSectionData`
  - `CtaSectionData`
- Rendering logic now respects `backgroundType`:
  - `color`: Uses `backgroundColor` only
  - `image`: Uses `backgroundImage` with overlay

### 3. ✅ Removed CTA Link Parameter
- Removed `ctaLink` from `HeroSectionData`
- Removed `buttonLink` from `CtaSectionData`
- Removed CTA link input fields from inspector
- All buttons automatically link to form section via `formLink`

### 4. ✅ Mobile Button Visibility
- **ALL buttons are hidden on mobile** using `hidden sm:inline-flex`:
  - Hero CTA buttons
  - Benefits "CONTACT US" buttons
  - Testimonial "CONTACT US" buttons
  - Final CTA buttons

### 5. ✅ Mobile Sticky CTA with Auto-Hide
- Sticky CTA button at bottom of viewport
- Only visible on mobile (`sm:hidden`)
- **Automatically hides when form section is in view**
- Uses `IntersectionObserver` API to detect form visibility
- Smooth transition when hiding/showing

---

## Technical Implementation

### BackgroundSelector Component

```typescript
function BackgroundSelector({
    backgroundType,
    backgroundColor,
    backgroundImage,
    onUpdate,
}: {
    backgroundType: 'color' | 'image';
    backgroundColor: string;
    backgroundImage: string;
    onUpdate: (updates: { backgroundType?: 'color' | 'image'; backgroundColor?: string; backgroundImage?: string }) => void;
}) {
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            onUpdate({ backgroundImage: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    return (
        // Toggle buttons + Color picker / File upload
    );
}
```

### Form Visibility Detection

```typescript
const [isFormVisible, setIsFormVisible] = useState(false);

useEffect(() => {
    if (!formSection) return;
    
    const formElement = document.getElementById(`form-${formSection.id}`);
    if (!formElement) return;
    
    const observer = new IntersectionObserver(
        ([entry]) => {
            setIsFormVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
    );
    
    observer.observe(formElement);
    return () => observer.disconnect();
}, [formSection]);
```

### Conditional Mobile CTA Rendering

```typescript
{!isFormVisible && (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 transition-transform duration-300">
        <a href={formLink} className="...">
            {mobileCTAText}
        </a>
    </div>
)}
```

### Background Rendering Logic

```typescript
// Hero/Testimonial/CTA sections
style={{
    backgroundImage: (section.data.backgroundType === 'image' && section.data.backgroundImage)
        ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${section.data.backgroundImage})`
        : undefined,
    backgroundColor: section.data.backgroundType === 'color' 
        ? section.data.backgroundColor 
        : (section.data.backgroundColor || '#default'),
}}

// Benefits section (uses Next Image)
{section.data.backgroundType === 'image' && section.data.backgroundImage && (
    <Image src={section.data.backgroundImage} alt="Benefits" fill className="object-cover" />
)}

// Form section
style={{
    backgroundColor: section.data.backgroundType === 'color' 
        ? section.data.backgroundColor 
        : '#f8fafc',
    backgroundImage: (section.data.backgroundType === 'image' && section.data.backgroundImage)
        ? `url(${section.data.backgroundImage})`
        : undefined,
}}
```

---

## Files Modified

1. **`src/components/landing/LandingPageBuilder.tsx`**
   - Added `BackgroundSelector` component
   - Updated all section interfaces
   - Updated default section data
   - Updated inspector to use `BackgroundSelector`
   - Removed CTA link fields
   - Added form visibility detection
   - Updated mobile CTA to hide when form visible
   - Updated rendering logic for backgroundType

2. **`src/app/refer/[slug]/page.tsx`** (PENDING)
   - Needs same updates for public-facing pages

---

## User Experience

### Desktop (≥640px)
- All buttons visible
- Background selector in inspector
- Upload images or choose colors
- Professional appearance

### Mobile (<640px)
- **No buttons visible in sections**
- Single sticky CTA at bottom
- CTA automatically hides when scrolling to form
- Clean, focused conversion flow
- No visual clutter

---

## Production Considerations

### Image Upload
Currently using `FileReader` to create data URLs. For production:
- Upload to cloud storage (S3, Cloudinary, etc.)
- Store URL in database
- Implement image optimization
- Add file size limits
- Add format validation

### Example Implementation:
```typescript
const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Upload to storage service
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
    });
    
    const { url } = await response.json();
    onUpdate({ backgroundImage: url });
};
```

---

## QA Checklist

- ✅ Background type toggle works
- ✅ Color picker functional
- ✅ File upload works
- ✅ Image preview displays
- ✅ CTA link fields removed
- ✅ All buttons link to form
- ✅ Mobile buttons hidden
- ✅ Sticky CTA appears on mobile
- ✅ Sticky CTA hides when form visible
- ✅ IntersectionObserver cleanup
- ✅ No linter errors
- ⏳ Public page needs updates

---

## Next Steps

1. Update public referral page (`/refer/[slug]`) with same changes
2. Implement production image upload to cloud storage
3. Add image optimization and validation
4. Test on real mobile devices
5. Add loading states for image upload



