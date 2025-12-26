# Preview Mode Responsive Fix

**Date**: 2025-12-22  
**Component**: LandingPageBuilder.tsx  
**Issue**: Mobile preview mode not working correctly

## Problem

The preview mode switcher (Desktop/Mobile) in the landing page builder was only changing the container width but not actually triggering responsive behavior. This was because:

1. Tailwind's `lg:` breakpoint classes are based on **viewport width** (1024px+), not container width
2. When viewing "mobile" preview on a desktop browser, the viewport is still wide, so `lg:` classes remain active
3. The component appeared horizontal even in mobile preview mode

## Solution

Added explicit preview mode handling to conditionally apply classes based on the selected preview mode:

### Changes Made

1. **Added `previewMode` prop to `LandingPreview` component**
   - Type: `'desktop' | 'mobile'`
   - Default: `'desktop'`

2. **Updated feature section layout logic** (lines 825-843)
   - Mobile mode: Forces `flex-col` (vertical stacking)
   - Desktop mode: Uses responsive classes `flex-col lg:flex-row lg:items-center`
   - Image position reversal only applies in desktop mode

3. **Passed `previewMode` prop to all `LandingPreview` instances**
   - Main preview area (line 1129)
   - Modal preview overlay (line 1148)

### Code Changes

#### Feature Section Container (Line 825-829)
```tsx
<div className={`flex flex-nowrap gap-8 ${
    previewMode === 'mobile' 
        ? 'flex-col' 
        : 'flex-col lg:flex-row lg:items-center lg:gap-12'
} ${previewMode === 'desktop' && section.data.imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
```

#### Column Classes (Lines 831, 843)
```tsx
// Image column
<div className={`w-full ${previewMode === 'desktop' ? 'lg:flex-1' : ''}`}>

// Content column
<div className={`w-full space-y-4 ${previewMode === 'desktop' ? 'lg:flex-1' : ''}`}>
```

## Behavior

### Mobile Preview Mode
- Layout: Vertical stacking (flex-col)
- Image: Full width, stacked on top
- Content: Full width, below image
- No horizontal layout classes applied

### Desktop Preview Mode
- Layout: Vertical on small screens, horizontal on large screens (lg:flex-row)
- Image: 50% width on large screens (lg:flex-1)
- Content: 50% width on large screens (lg:flex-1)
- Image position can be reversed (lg:flex-row-reverse)

## Testing

✅ No linter errors  
✅ TypeScript compilation successful  
✅ Preview mode prop properly typed and passed  
✅ Conditional classes correctly applied

## Impact

- **Low Risk**: Changes only affect preview rendering, not production pages
- **User Experience**: Preview mode now accurately reflects mobile vs desktop layouts
- **Maintainability**: Clear separation between mobile and desktop preview logic

## Future Considerations

If other sections need similar preview mode handling, apply the same pattern:
1. Accept `previewMode` prop
2. Conditionally apply classes based on mode
3. Force mobile styles when `previewMode === 'mobile'`
4. Use responsive classes when `previewMode === 'desktop'`



