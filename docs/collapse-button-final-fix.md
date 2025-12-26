# Collapse Button - Final Fix

## Issues Reported

### Issue 1: Clicking Minimize on Benefits → Jumps to Hero
When clicking the minimize button (−) on the Benefits component, instead of collapsing, it would jump back to the Hero component at the top.

### Issue 2: Clicking Minimize on Hero → Just Blinks
When clicking the minimize button (−) on the Hero component, it would just blink/flash without actually collapsing.

## Root Cause Analysis

### The Problem
The click event was **bubbling up** and triggering the parent `onSelect` handler, which toggles the active section:

```typescript
onSelect={() => setActiveSectionId(section.id === activeSectionId ? '' : section.id)}
```

### What Was Happening

**Scenario 1: Benefits Component**
1. User clicks minimize (−) button
2. Event bubbles to parent button with `onClick={onSelect}`
3. `onSelect` toggles Benefits: `activeSectionId === 'benefits' ? '' : 'benefits'`
4. Since Benefits is already active, it sets `activeSectionId = ''`
5. useEffect detects no active section and defaults to first section (Hero)
6. **Result**: Jumps to Hero ❌

**Scenario 2: Hero Component**
1. User clicks minimize (−) button
2. Event bubbles to parent button with `onClick={onSelect}`
3. `onSelect` toggles Hero: `activeSectionId === 'hero' ? '' : 'hero'`
4. Sets `activeSectionId = ''`
5. useEffect immediately re-activates Hero (first section)
6. Component re-renders expanded
7. **Result**: Blinks but stays expanded ❌

## The Solution

### 1. Add `preventDefault()` and `stopPropagation()`
Both methods are needed:
- `preventDefault()`: Prevents default button behavior
- `stopPropagation()`: Stops event from bubbling to parent

```typescript
onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
}}
```

### 2. Apply to All Action Buttons
Also added `stopPropagation()` to the Remove button for consistency:

```typescript
onClick={(e) => {
    e.stopPropagation();
    onRemove();
}}
```

## Event Flow Comparison

### Before (Broken)
```
Click (−) Button
    ↓
setIsExpanded(!isExpanded)
    ↓
Event bubbles to parent <button onClick={onSelect}>
    ↓
onSelect() toggles active section
    ↓
Component deactivates or switches
    ↓
❌ Broken behavior
```

### After (Fixed)
```
Click (−) Button
    ↓
e.preventDefault()
e.stopPropagation()
    ↓
setIsExpanded(!isExpanded)
    ↓
[Event stopped - no bubbling]
    ↓
✅ Component collapses correctly
```

## Testing Checklist

### Test 1: Collapse Benefits
1. ✅ Click Benefits component to activate
2. ✅ Click minimize (−) button
3. ✅ Benefits should collapse (not jump to Hero)
4. ✅ Benefits should stay highlighted/active
5. ✅ Button should change to (+)

### Test 2: Collapse Hero
1. ✅ Click Hero component to activate
2. ✅ Click minimize (−) button
3. ✅ Hero should collapse (not blink)
4. ✅ Hero should stay highlighted/active
5. ✅ Button should change to (+)

### Test 3: Expand After Collapse
1. ✅ Collapse any component
2. ✅ Click expand (+) button
3. ✅ Component should expand
4. ✅ Button should change to (−)

### Test 4: Remove Button
1. ✅ Click Remove on any component (except form)
2. ✅ Component should be removed
3. ✅ Should not trigger onSelect

## Code Changes

### Toggle Button
```typescript
// Before
onClick={() => setIsExpanded(!isExpanded)}

// After
onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
}}
```

### Remove Button
```typescript
// Before
onClick={onRemove}

// After
onClick={(e) => {
    e.stopPropagation();
    onRemove();
}}
```

## Key Learnings

### Event Propagation in React
When you have nested interactive elements:
```
<button onClick={parentHandler}>
    <div>
        <button onClick={childHandler}>Click me</button>
    </div>
</button>
```

Without `stopPropagation()`, clicking the child button triggers **both** handlers:
1. childHandler (child button)
2. parentHandler (parent button) ← Unwanted!

### Best Practice
**Always use `stopPropagation()` on buttons inside clickable containers** to prevent unintended parent interactions.

## Files Modified
- `src/components/landing/LandingPageBuilder.tsx`
  - Added `e.preventDefault()` to toggle button
  - Added `e.stopPropagation()` to toggle button
  - Added `e.stopPropagation()` to remove button

## Related Documentation
- `docs/collapse-button-fix.md` - Initial fix attempt
- `docs/component-collapse-feature.md` - Original feature documentation



