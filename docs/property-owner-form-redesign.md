# Property Owner Form Redesign

**Date**: December 22, 2025  
**Component**: `ReferralForm.tsx`  
**Target Audience**: Property Owners seeking EasyStay property management services

---

## Overview

Redesigned the referral form to specifically target property owners who want their properties managed by EasyStay. The form now focuses on property management services rather than general referrals.

---

## Changes Summary

### CHANGE
Reworked ReferralForm component from a general referral form to a property management intake form targeting property owners.

### WHY
User requested to treat the live preview as the core template and rework it specifically for property owners who can get their properties managed by EasyStay.

### WHAT

#### 1. **Updated Default Messaging**
- **Headline**: "Let EasyStay Manage Your Property" (was: "Maximize Your Airbnb Potential")
- **Subheadline**: "Share a few details about your property and our management specialists will reach out within 24 hours with a custom plan."
- **Form Badge**: "Get Started Today" with emerald accent color

#### 2. **New Form Fields - Property Management Focused**

**Contact Information Section:**
- First Name *
- Last Name *
- Email Address *
- Phone Number *

**Property Details Section:**
- Property Type * (dropdown)
  - Single Family Home
  - Condo/Apartment
  - Townhouse
  - Multi-Unit Building
  - Vacation Home
  - Other
  
- Property Location (City, State) *
- Number of Properties Owned *
- Management Services Interest * (dropdown)
  - Full Property Management
  - Guest Communication Only
  - Cleaning & Maintenance
  - Listing Optimization
  - Not Sure - Need Consultation
  
- Currently Listed Status * (dropdown)
  - Yes, on Airbnb
  - Yes, on VRBO
  - Yes, on multiple platforms
  - No, not yet listed
  
- Property Listing Links or Additional Details (optional textarea)

#### 3. **Removed Fields**
- Role selection (was: Property Owner, Affiliate Marketer, Cleaning Service)

#### 4. **Visual Updates**
- **Color Scheme**: Changed from purple/blue accent to emerald green
  - Border colors: `border-emerald-200`
  - Background: `bg-emerald-50/30`
  - Focus states: `focus:border-emerald-500`, `focus:ring-emerald-100`
  - Button: Solid emerald-700 background (via `.premium-gradient` class)
  
- **Form Layout**: Organized into clear sections with headers
  - "Your Information" section
  - "Property Details" section
  
- **Enhanced Input Styling**:
  - Larger padding: `px-5 py-3.5`
  - Smooth transitions on all inputs
  - Emerald-themed focus states
  - Better visual hierarchy

#### 5. **Success State Updates**
- Updated success message to be property management-specific
- Added contact email: `info@easystayretreats.com`
- Changed accent colors to emerald theme
- More detailed confirmation message explaining next steps

#### 6. **Submit Button Enhancement**
- New CTA text: "Get Your Free Property Assessment"
- Added loading spinner animation
- Disabled state during submission
- Footer text: "Response within 24 hours • No obligation"

#### 7. **Data Structure Updates**

**New formData fields:**
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyType: string;          // NEW
  propertyLocation: string;      // NEW
  propertiesCount: string;
  managementInterest: string;    // NEW (replaces 'role')
  currentlyListed: string;       // NEW
  listingLinks: string;
}
```

**API Payload Updates:**
The form now sends property management-specific data:
- `propertyType`
- `propertyLocation`
- `managementInterest`
- `currentlyListed`

---

## Design Tokens Used

### Colors
- **Primary Accent**: Emerald (emerald-50, emerald-100, emerald-200, emerald-500, emerald-600, emerald-700)
- **Text Colors**: 
  - Primary: `#0F172A`
  - Secondary: `#64748B`
  - Muted: `#94A3B8`, `#A2A6B3`
- **Background**: `bg-white`, `bg-emerald-50/30`
- **Borders**: `border-emerald-100`, `border-emerald-200`

### Spacing
- Form sections: `space-y-5`
- Section internal spacing: `space-y-4`
- Input padding: `px-5 py-3.5`
- Form container: `p-8`

### Typography
- Headline: `text-3xl font-bold`
- Section headers: `text-sm font-semibold uppercase tracking-wider`
- Subheadline: `text-base`
- Button: `text-base font-semibold`
- Footer text: `text-xs uppercase tracking-[0.4em]`

### Border Radius
- Inputs & selects: `rounded-2xl`
- Container: `rounded-[2.25rem]`
- Success state: `rounded-[2.5rem]`

---

## User Experience Improvements

1. **Clear Progressive Disclosure**: Form is organized into logical sections (Your Information → Property Details)
2. **Better Field Labels**: More descriptive placeholders that explain what information is needed
3. **Visual Feedback**: Enhanced focus states with emerald theme provide clear interaction feedback
4. **Loading State**: Animated spinner during form submission improves perceived performance
5. **Success Confirmation**: Detailed success message sets clear expectations for next steps
6. **Required Field Indicators**: All required fields marked with asterisk (*)
7. **No Obligation Messaging**: Footer text emphasizes low-pressure consultation

---

## Accessibility

- ✅ All inputs have proper `aria-label` attributes
- ✅ Form uses semantic HTML (`<form>`, `<input>`, `<select>`, `<textarea>`)
- ✅ Error messages use `role="alert"`
- ✅ Form has `aria-live="polite"` for dynamic updates
- ✅ Focus states are clearly visible with emerald ring
- ✅ Button disabled state prevents double submission
- ✅ Required fields marked both visually (*) and programmatically (required attribute)

---

## Responsive Design

- Mobile-first approach maintained
- Grid layout for name fields: `grid-cols-1 md:grid-cols-2`
- All inputs scale appropriately on mobile devices
- Touch-friendly input sizes (py-3.5 = ~14px vertical padding)
- Form container adapts with responsive padding

---

## Integration Notes

### API Endpoint
The form submits to `/api/referral` with the following new fields:
- `propertyType`
- `propertyLocation`
- `managementInterest`
- `currentlyListed`

**Backend Update Required**: The API endpoint may need to be updated to handle these new fields and store them appropriately in the database.

### Database Schema
Consider adding columns to the referrals table:
```sql
ALTER TABLE referrals 
ADD COLUMN property_type VARCHAR(50),
ADD COLUMN property_location VARCHAR(255),
ADD COLUMN management_interest VARCHAR(100),
ADD COLUMN currently_listed VARCHAR(50);
```

### Tracking
The form still tracks:
- Form engagement (partial/completed)
- Time to complete
- Field interaction patterns
- Company source

---

## Testing Checklist

- ✅ All required fields validate properly
- ✅ Form submission works with new data structure
- ✅ Loading state displays correctly
- ✅ Success state shows updated message
- ✅ Error handling still functions
- ✅ Partial submission tracking works with new fields
- ✅ Form is keyboard navigable
- ✅ Focus states are visible
- ✅ Responsive layout works on mobile/tablet/desktop
- ✅ No linter errors

---

## Rollback Plan

If issues arise, revert to previous version:
1. Restore original field structure (role instead of propertyType, managementInterest, etc.)
2. Revert color scheme from emerald back to purple/blue
3. Restore original messaging and CTAs
4. Update API to handle old field structure

Backup of previous version available in git history.

---

## Next Steps

1. **Update API Endpoint**: Modify `/api/referral` route to handle new fields
2. **Database Migration**: Add new columns to store property management data
3. **GHL Integration**: Update webhook to send new fields to GoHighLevel
4. **Email Templates**: Update notification emails to include property details
5. **Analytics**: Track conversion rates for property management leads
6. **A/B Testing**: Consider testing different CTAs and messaging variants

---

## Files Modified

- `src/components/referral/ReferralForm.tsx` - Complete form redesign
- `src/app/globals.css` - Added emerald-700 color token, updated premium-gradient class

---

## Component Usage

```tsx
<ReferralForm
  linkId="uuid-here"
  headline="Custom Headline (optional)"
  subheadline="Custom subheadline (optional)"
  companySource="EasyStay"
/>
```

If no headline/subheadline provided, defaults to property management messaging.

