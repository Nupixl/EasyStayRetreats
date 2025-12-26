# Reset to Template Feature

## Overview
The "Reset to Template" button allows users to restore a component to its original default state, including all text content, styling, and background settings.

## Implementation Details

### Location
- Found in the Background Selector section of the Section Inspector
- Appears when an image is uploaded for a component's background

### Behavior
When clicked, the "Reset to Template" button:
1. ✅ Restores all text content (headline, subheadline, CTA text, etc.)
2. ✅ Resets background to default template image
3. ✅ Restores default background type (image)
4. ✅ Resets any custom styling to defaults
5. ✅ Returns component to its original template state

### Technical Implementation

**Function**: `onReset` callback
- Calls `createDefaultSection(type)` to get fresh template data
- Replaces entire section data with default values
- Type-safe with proper TypeScript casting

**Example**:
```typescript
onReset={() => onUpdate(createDefaultSection('hero').data as HeroSectionData)}
```

### Default Templates

Each component type has its own default template:

#### Hero Section
- Headline: "Find Your Perfect Mountain Retreat"
- Subheadline: "Discover luxury vacation rentals..."
- CTA: "Browse Properties"
- Background: Mountain resort image

#### Benefits Section
- Title: "Why Choose EasyStay Retreats"
- 3 benefit cards with icons
- Background: Luxury property image

#### Testimonial Section
- Quote from Sarah M.
- 5-star rating
- Background: Vacation home image

#### Form Section
- Header: "Property Owner Referral"
- Benefits list
- Background: Light gray (#f8fafc)

#### CTA Section
- Headline: "Ready to List Your Property?"
- Subheadline: "Join our network..."
- CTA: "Get Started Today"
- Background: Modern property image

## User Experience

### Visual Feedback
- Button styled in red (#ef4444) to indicate destructive action
- Hover state provides visual feedback
- Only appears when custom image is uploaded

### Use Cases
1. **Undo Custom Changes**: Quickly revert after experimenting
2. **Start Fresh**: Clear all customizations at once
3. **Fix Mistakes**: Easy recovery from unwanted changes
4. **Template Reference**: Return to see original design

## Code Structure

```typescript
// BackgroundSelector component
function BackgroundSelector({
    backgroundType,
    backgroundColor,
    backgroundImage,
    onUpdate,
    onReset, // ← New callback for full reset
}: {
    // ... props
    onReset: () => void;
}) {
    return (
        // ... UI
        <button onClick={onReset}>
            Reset to Template
        </button>
    );
}
```

## Benefits
- ✅ Prevents accidental data loss (intentional action required)
- ✅ Faster than manually reverting each field
- ✅ Maintains design consistency
- ✅ Improves user confidence to experiment
- ✅ Clear, predictable behavior

## Future Enhancements
- [ ] Add confirmation dialog for reset action
- [ ] Show preview of template before resetting
- [ ] Add "Undo" functionality after reset
- [ ] Track reset analytics to understand user behavior



