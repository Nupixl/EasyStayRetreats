# Form Layout Restructure - Remove Info Card

**Date:** December 22, 2025  
**Change Type:** DOM Structure / Layout Update

## CHANGE
Removed the info card section (with "PROPERTY OWNER REFERRAL" heading and bullet points) from the form section in LandingPageBuilder, leaving only the ReferralForm component.

## WHY
User requested to remove the info card that was displaying alongside the form. The form should stand alone without the additional "PROPERTY OWNER REFERRAL / Ready to grow" section with three bullet points.

## WHAT

### Files Modified
- `src/components/landing/LandingPageBuilder.tsx`

### Changes Made

1. **Removed Info Card Completely**
   - Deleted the entire info card section that contained:
     - "PROPERTY OWNER REFERRAL" label
     - "Ready to grow" headline
     - Dynamic subheadline
     - Three checkmark bullet points with benefits
   
2. **Simplified Grid Layout**
   - Removed grid layout classes entirely (`lg:grid-cols-[1.1fr,0.9fr]`)
   - Changed container from grid to simple `max-w-6xl` wrapper
   - Form now displays as a single centered component

3. **Form Section Structure**
   - Remains in its wrapper with background customization support
   - ReferralForm component now the only child element
   - All background image/color functionality preserved
   - Maintains responsive design and styling

## RISK

**Low Risk:**
- Visual layout change only - no logic or data flow affected
- The form functionality remains unchanged
- Mobile responsiveness maintained
- Cleaner, simpler layout with just the form

**Potential Issues:**
- Info card content is now removed - if that content was valuable, it's no longer visible
- Users who were used to seeing the bullet points will no longer see them
- May want to create a separate "bullet point" component if that content is needed elsewhere

**Rollback Steps:**
1. Revert the changes in `LandingPageBuilder.tsx`
2. Restore the two-column grid layout with info card
3. Re-add the info card JSX with "PROPERTY OWNER REFERRAL" content

## QA

✅ **Visual Check:** Info card removed, form displays standalone  
✅ **Tokens Used:** Simplified structure, removed unnecessary grid classes  
✅ **Accessibility:** Semantic HTML structure maintained, no changes to interactive elements  
✅ **Performance:** Improved - fewer DOM elements to render  
✅ **Naming & Documentation:** Component structure documented  
✅ **Linter:** No linter errors introduced  

### Breakpoint Considerations
- **Desktop:** Form now centered and standalone (no side-by-side layout)
- **Tablet:** Form displays centered
- **Mobile:** Form displays full-width as before

## Notes

- This change only affects the **LandingPageBuilder preview** component
- The actual referral page (`/refer/[slug]`) uses a different structure and wasn't modified
- The ReferralForm component itself remains unchanged
- The info card content (PROPERTY OWNER REFERRAL, bullet points) has been completely removed
- If you need that content as a separate component, it can be created as a new "bullet point" or "benefits" section type

