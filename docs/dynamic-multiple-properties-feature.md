# Dynamic Multiple Properties Feature

**Date**: December 22, 2025  
**Component**: `ReferralForm.tsx`  
**Feature**: Dynamic property addition for multi-property owners

---

## Overview

Enhanced the property owner form to support dynamic addition of multiple properties. Property owners can now add details for each property they own individually, rather than just specifying a count.

---

## Changes Summary

### CHANGE
Converted single property form to dynamic multi-property form with add/remove functionality.

### WHY
Most property owners have multiple properties, and collecting individual details for each property provides better qualification data and allows for more targeted management proposals.

### WHAT

#### 1. **New Data Structure**

**Property Interface:**
```typescript
interface Property {
    id: string;                    // Unique identifier (UUID)
    propertyType: string;          // Single Family, Condo, etc.
    propertyLocation: string;      // City, State
    managementInterest: string;    // Service type needed
    currentlyListed: string;       // Listing status
    listingLinks: string;          // URLs or details (optional)
}
```

**Form State:**
```typescript
const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
});

const [properties, setProperties] = useState<Property[]>([
    { /* initial property */ }
]);
```

#### 2. **Dynamic Property Management Functions**

**Add Property:**
```typescript
const addProperty = () => {
    setProperties([...properties, {
        id: crypto.randomUUID(),
        propertyType: '',
        propertyLocation: '',
        managementInterest: '',
        currentlyListed: '',
        listingLinks: '',
    }]);
};
```

**Remove Property:**
```typescript
const removeProperty = (id: string) => {
    if (properties.length > 1) {
        setProperties(properties.filter(p => p.id !== id));
    }
};
```

**Update Property Field:**
```typescript
const updateProperty = (id: string, field: keyof Property, value: string) => {
    setProperties(properties.map(p => 
        p.id === id ? { ...p, [field]: value } : p
    ));
};
```

#### 3. **UI Components**

**Property Section Header:**
- Shows "Property Details" for single property
- Shows "Your Properties (X)" count for multiple properties
- "Add Property" button (max 10 properties)

**Individual Property Card:**
- Emerald-themed bordered container
- Property number badge (Property 1, Property 2, etc.)
- Remove button (X icon) - only shown when multiple properties exist
- All property fields contained within card

**Add Property Button:**
```tsx
<button
    type="button"
    onClick={addProperty}
    className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95"
>
    <svg>+</svg>
    Add Property
</button>
```

**Remove Property Button:**
```tsx
<button
    type="button"
    onClick={() => removeProperty(property.id)}
    className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-all hover:bg-red-50 active:scale-95"
>
    <svg>×</svg>
</button>
```

#### 4. **Property Card Fields**

Each property card contains:
1. **Property Type** (required dropdown)
   - Single Family Home
   - Condo/Apartment
   - Townhouse
   - Multi-Unit Building
   - Vacation Home
   - Other

2. **Property Location** (required text input)
   - Format: City, State
   - Example: "Miami, FL"

3. **Management Services Interest** (required dropdown)
   - Full Property Management
   - Guest Communication Only
   - Cleaning & Maintenance
   - Listing Optimization
   - Not Sure - Need Consultation

4. **Currently Listed Status** (required dropdown)
   - Yes, on Airbnb
   - Yes, on VRBO
   - Yes, on multiple platforms
   - No, not yet listed

5. **Listing Links or Details** (optional textarea)
   - Property URLs
   - Additional notes
   - Special considerations

#### 5. **Visual Design**

**Property Card Styling:**
```css
- Container: rounded-2xl border-2 border-emerald-100 bg-emerald-50/20 p-5
- Inputs: bg-white (stands out from card background)
- Spacing: space-y-4 between fields
- Border: 2px emerald border for emphasis
```

**Button Styling:**
- Add button: emerald-50 background, emerald-700 text
- Remove button: red-500 text, red-50 hover background
- Active scale effect: active:scale-95

#### 6. **Validation & Constraints**

**Limits:**
- Minimum properties: 1 (cannot remove last property)
- Maximum properties: 10 (Add button hidden at limit)

**Required Fields per Property:**
- Property Type ✓
- Property Location ✓
- Management Interest ✓
- Currently Listed ✓
- Listing Links (optional)

**Form-level Required:**
- First Name ✓
- Last Name ✓
- Email ✓
- Phone ✓
- At least 1 complete property ✓

#### 7. **API Payload Structure**

**Submitted Data:**
```json
{
  "linkId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "propertiesCount": 3,
  "properties": [
    {
      "propertyType": "single-family",
      "propertyLocation": "Miami, FL",
      "managementInterest": "full-management",
      "currentlyListed": "yes-airbnb",
      "listingLinks": "https://airbnb.com/..."
    },
    {
      "propertyType": "condo",
      "propertyLocation": "Orlando, FL",
      "managementInterest": "cleaning-maintenance",
      "currentlyListed": "no",
      "listingLinks": ""
    },
    // ... more properties
  ],
  "companySource": "EasyStay",
  "formEngagement": "completed",
  "startedAt": "2025-12-22T...",
  "completedAt": "2025-12-22T...",
  "timeToComplete": 120
}
```

---

## User Experience Flow

### Single Property Owner
1. Fills in contact information
2. Sees "Property Details" section with one property card
3. Fills in property details
4. Submits form
5. No "Add Property" button needed

### Multi-Property Owner
1. Fills in contact information
2. Sees "Property Details" section with one property card
3. Fills in first property
4. Clicks "Add Property" button
5. New property card appears below
6. Fills in second property details
7. Repeats as needed (up to 10 properties)
8. Can remove properties using X button
9. Submits form with all properties

### Visual Feedback
- Property count shown in header: "Your Properties (3)"
- Each card numbered: "Property 1", "Property 2", etc.
- Add button disappears at 10 properties
- Remove button only shows when 2+ properties exist
- Smooth transitions and hover states

---

## Accessibility Features

- ✅ Each property has unique `aria-label` attributes (e.g., "Property Type 1", "Property Type 2")
- ✅ Remove button has descriptive `aria-label`: "Remove property 2"
- ✅ Keyboard navigation works for all fields
- ✅ Focus states clearly visible
- ✅ Form validation works per-property
- ✅ Screen readers announce property count

---

## Responsive Design

**Mobile (< 640px):**
- Property cards stack vertically
- Full-width buttons
- Adequate touch targets (44px minimum)
- Comfortable spacing between properties

**Tablet (640px - 1024px):**
- Property cards maintain full width
- Header and button side-by-side
- Optimized spacing

**Desktop (> 1024px):**
- Property cards at comfortable reading width
- All interactive elements easily accessible
- Visual hierarchy clear

---

## Technical Implementation

### State Management
- Uses React `useState` for properties array
- Each property has unique UUID for React key
- Immutable updates using spread operators
- Form data separated from properties array

### Performance
- Efficient re-renders (only affected property updates)
- UUID generation using native `crypto.randomUUID()`
- No unnecessary component re-renders
- Smooth animations with CSS transitions

### Validation
- HTML5 native validation (required attributes)
- Client-side validation before submission
- All fields validated per-property
- Form won't submit with incomplete properties

---

## Backend Integration Notes

### API Endpoint Updates Required

**Endpoint:** `/api/referral`

**New Payload Structure:**
```typescript
{
  // ... existing contact fields
  propertiesCount: number;        // Total count
  properties: Property[];         // Array of property objects
  // ... tracking fields
}
```

### Database Schema Updates

**Option 1: JSON Column (Recommended)**
```sql
ALTER TABLE referrals 
ADD COLUMN properties_count INTEGER,
ADD COLUMN properties JSONB;

-- Index for querying
CREATE INDEX idx_referrals_properties_count 
ON referrals(properties_count);
```

**Option 2: Separate Properties Table**
```sql
CREATE TABLE referral_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE,
    property_type VARCHAR(50) NOT NULL,
    property_location VARCHAR(255) NOT NULL,
    management_interest VARCHAR(100) NOT NULL,
    currently_listed VARCHAR(50) NOT NULL,
    listing_links TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_referral_properties_referral_id 
ON referral_properties(referral_id);
```

### GHL Webhook Updates

Update webhook payload to include properties array:
```typescript
{
  contact: { /* ... */ },
  customFields: {
    properties_count: 3,
    property_1_type: "single-family",
    property_1_location: "Miami, FL",
    // ... or send as JSON string
    properties_json: JSON.stringify(properties)
  }
}
```

---

## Testing Checklist

- ✅ Add property button creates new property card
- ✅ Remove property button deletes correct property
- ✅ Cannot remove last property (button disabled)
- ✅ Maximum 10 properties enforced
- ✅ Each property validates independently
- ✅ Form submits with correct properties array
- ✅ Property count updates in header
- ✅ UUIDs are unique for each property
- ✅ Keyboard navigation works through all properties
- ✅ Mobile responsive layout works
- ✅ Success state shows correct confirmation
- ✅ Partial submission tracking includes property count
- ✅ No linter errors

---

## User Benefits

1. **Accurate Data Collection**: Individual property details instead of aggregate count
2. **Better Qualification**: Management team can assess each property individually
3. **Targeted Proposals**: Can provide property-specific recommendations
4. **Flexible Input**: Owners can add properties as they think of them
5. **Clear Organization**: Visual separation of each property's details
6. **Easy Corrections**: Can remove properties if added by mistake
7. **Scalable**: Works for 1 property or 10 properties equally well

---

## Business Benefits

1. **Higher Quality Leads**: More detailed property information
2. **Better Segmentation**: Can prioritize by property type/location
3. **Improved Conversion**: Tailored follow-up based on specific properties
4. **Portfolio Insights**: Understand typical property owner profiles
5. **Service Matching**: Match properties to appropriate management services
6. **Revenue Forecasting**: Better estimate potential contract value

---

## Future Enhancements

### Potential Additions:
1. **Property Images**: Upload photos for each property
2. **Bedrooms/Bathrooms**: Add property size details
3. **Current Revenue**: Track existing rental income
4. **Duplicate Property**: Clone property details for similar properties
5. **Reorder Properties**: Drag-and-drop to reorder
6. **Save Draft**: Local storage to save progress
7. **Property Templates**: Quick-fill for common property types
8. **Bulk Import**: CSV upload for large portfolios

### Analytics Enhancements:
1. Track average properties per submission
2. Most common property types
3. Geographic distribution
4. Service interest patterns
5. Listing platform preferences

---

## Rollback Plan

If issues arise:

1. **Revert to Single Property:**
   - Restore previous formData structure
   - Remove properties array
   - Remove add/remove functions
   - Restore single property fields

2. **Database Rollback:**
   ```sql
   ALTER TABLE referrals DROP COLUMN properties;
   ALTER TABLE referrals DROP COLUMN properties_count;
   -- Restore old columns if needed
   ```

3. **API Rollback:**
   - Revert to accepting single property fields
   - Update webhook to old format

Backup available in git history: commit before this feature.

---

## Files Modified

- `src/components/referral/ReferralForm.tsx` - Complete dynamic property implementation

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

Form automatically handles 1-10 properties with dynamic add/remove functionality.

