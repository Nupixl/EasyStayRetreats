# Collapse Button Fix

## Issue
The collapse/minimize button was not working - clicking it did not collapse the component parameters.

## Root Cause
**Event Bubbling**: The click event on the toggle button was propagating up to parent elements, potentially interfering with the state change.

## Solution
Added `e.stopPropagation()` to the toggle button's onClick handler to prevent the event from bubbling up.

### Before
```typescript
<button
    type="button"
    onClick={() => setIsExpanded(!isExpanded)}
    ...
>
    {isExpanded ? '−' : '+'}
</button>
```

### After
```typescript
<button
    type="button"
    onClick={(e) => {
        e.stopPropagation();  // ← Prevents event bubbling
        setIsExpanded(!isExpanded);
    }}
    ...
>
    {isExpanded ? '−' : '+'}
</button>
```

## Why This Works

### Event Bubbling Explained
When you click a button inside a container, the click event "bubbles" up through parent elements:

```
Click Button → Parent Div → Grandparent Div → ...
```

### The Problem
In our case:
1. User clicks toggle button (−)
2. Event fires: `setIsExpanded(!isExpanded)`
3. Event bubbles to parent container
4. Parent might re-render or trigger other handlers
5. State change gets lost or overridden

### The Fix
`e.stopPropagation()` stops the event from bubbling:

```
Click Button → [STOP] ✋
```

Now only the toggle button's handler executes, ensuring the state change persists.

## Testing
To verify the fix works:

1. ✅ Click a component to activate it
2. ✅ Click the minus (−) button
3. ✅ Parameters should collapse
4. ✅ Button should change to plus (+)
5. ✅ Click plus (+) button
6. ✅ Parameters should expand
7. ✅ Button should change back to minus (−)

## Related Patterns

### When to Use stopPropagation()
- Buttons inside clickable containers
- Nested interactive elements
- Preventing unwanted parent handlers
- Form inputs in clickable rows

### When NOT to Use
- Top-level buttons (no parents to bubble to)
- When you WANT parent handlers to fire
- Global event listeners that need to know about all clicks

## Files Modified
- `src/components/landing/LandingPageBuilder.tsx`
  - Added `e.stopPropagation()` to toggle button onClick handler

## Additional Notes
This is a common React pattern when dealing with nested interactive elements. Always consider event propagation when buttons don't seem to work as expected.

