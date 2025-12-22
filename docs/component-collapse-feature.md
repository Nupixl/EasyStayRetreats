# Component Collapse/Minimize Feature

## Overview
Users can now collapse (minimize) the active component's parameter panel to reduce clutter and improve navigation when working with multiple components.

## Visual Design

### Expanded State (Default)
```
┌─────────────────────────────────────┐
│ ▶ HERO                    [−] ⋮⋮ [Remove] │
├─────────────────────────────────────┤
│ Headline: [___________________]     │
│ Subheadline: [_______________]      │
│ CTA text: [___________________]     │
│ Background: [Image/Color]           │
└─────────────────────────────────────┘
```

### Collapsed State
```
┌─────────────────────────────────────┐
│ ▶ HERO                    [+] ⋮⋮ [Remove] │
└─────────────────────────────────────┘
```

## Features

### Toggle Button
- **Location**: Between component name and drag handle
- **Icon**: 
  - `−` (minus) when expanded
  - `+` (plus) when collapsed
- **Visibility**: Only shown when component is active
- **Action**: Click to toggle between expanded/collapsed states

### Visual Indicators
1. **Chevron (▶)**:
   - Points right when collapsed
   - Points down (rotates 90°) when expanded
   - Syncs with collapse state

2. **Border Highlight**:
   - Active components have indigo border
   - Remains highlighted when collapsed

3. **Background**:
   - Active components have indigo-50 background
   - Persists in collapsed state

## User Experience

### Benefits
- ✅ **Reduced Clutter**: Hide parameters when not needed
- ✅ **Better Navigation**: Easier to see all components at once
- ✅ **Quick Access**: One click to expand/collapse
- ✅ **State Persistence**: Each component remembers its state
- ✅ **Visual Feedback**: Clear icons indicate current state

### Use Cases
1. **Working with Multiple Components**: Collapse finished components to focus on current one
2. **Overview Mode**: Collapse all to see component structure
3. **Quick Edits**: Expand only the component you need to edit
4. **Mobile Editing**: Save vertical space on smaller screens

## Technical Implementation

### State Management
```typescript
const [isExpanded, setIsExpanded] = useState(true);
```
- Local state in `SectionListItem` component
- Defaults to `true` (expanded)
- Independent for each component

### Conditional Rendering
```typescript
{isActive && isExpanded && (
    <div className="border-t border-[#e5e7eb] px-3 py-4">
        <SectionInspector ... />
    </div>
)}
```

### Toggle Button
```typescript
<button
    type="button"
    onClick={() => setIsExpanded(!isExpanded)}
    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94a3b8] transition-all hover:bg-[#f1f5f9] hover:text-[#475569]"
    aria-label={isExpanded ? 'Collapse' : 'Expand'}
    title={isExpanded ? 'Collapse' : 'Expand'}
>
    {isExpanded ? '−' : '+'}
</button>
```

### Chevron Sync
```typescript
<span className={`text-xs transition-transform ${isActive && isExpanded ? 'rotate-90' : ''}`}>
    ▶
</span>
```

## Interaction Flow

1. **Click Component**: Component becomes active (highlighted)
2. **Parameters Show**: Inspector panel expands by default
3. **Click Minus (−)**: Parameters collapse, button changes to plus (+)
4. **Click Plus (+)**: Parameters expand again
5. **Click Another Component**: New component activates with its own state

## Accessibility

- **ARIA Labels**: `aria-label` provides screen reader support
- **Tooltips**: `title` attribute shows hover tooltip
- **Keyboard Support**: Button is keyboard accessible
- **Visual Feedback**: Clear hover states

## Styling Details

### Button States
- **Default**: Gray text (#94a3b8)
- **Hover**: Darker text (#475569) with light gray background (#f1f5f9)
- **Active**: Maintains hover state while pressed

### Icons
- **Minus (−)**: Unicode character U+2212
- **Plus (+)**: Unicode character U+002B
- **Size**: 8x8 (h-8 w-8)
- **Font**: Inherits from parent

## Future Enhancements
- [ ] Remember collapse state in localStorage
- [ ] "Collapse All" / "Expand All" buttons
- [ ] Keyboard shortcuts (e.g., Cmd+M to toggle)
- [ ] Animation for smooth expand/collapse
- [ ] Auto-collapse previous when expanding new component

## Files Modified
- `src/components/landing/LandingPageBuilder.tsx`
  - Added `isExpanded` state to `SectionListItem`
  - Added toggle button UI
  - Updated conditional rendering logic
  - Synced chevron rotation with collapse state

