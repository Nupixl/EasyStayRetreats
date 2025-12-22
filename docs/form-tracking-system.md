# Form Tracking System

**Date**: 2025-12-22  
**Feature**: Advanced form tracking and analytics for referral forms

## Overview

The referral form now includes comprehensive tracking capabilities to monitor form engagement, conversion rates, and company-specific performance metrics. This system enables data-driven insights into form performance across different companies/brands.

## Features

### 1. Role Options Update
**Removed:**
- Traveler (not relevant for property management focus)

**Current Options:**
- Property Owner
- Affiliate Marketer
- Cleaning Service

### 2. Hidden Tracking Fields

#### Company Source
- **Purpose**: Track which company/brand the form submission came from
- **Default**: `EasyStay`
- **Configurable**: Yes, in the landing page builder under Form section settings
- **Use Case**: When white-labeling or running multiple brands, track performance per brand

#### Form Engagement
- **Values**: `partial` | `completed`
- **Partial**: User started filling the form but didn't submit
- **Completed**: User successfully submitted the form

#### Time Tracking
- **started_at**: Timestamp when user first interacted with form
- **completed_at**: Timestamp when form was submitted
- **time_to_complete**: Duration in seconds from start to completion

### 3. Engagement Tracking

The form automatically tracks:
- **First Interaction**: Records timestamp when user first clicks/types in any field
- **Partial Submissions**: Captures when users leave with partial data (using `beforeunload` event)
- **Completion Time**: Calculates how long it took to complete the form
- **Field Completion**: Tracks which fields were filled in partial submissions

## Database Schema

### New Columns in `referrals` Table

```sql
company_source TEXT DEFAULT 'EasyStay'
form_engagement TEXT CHECK (form_engagement IN ('partial', 'completed')) DEFAULT 'completed'
started_at TIMESTAMPTZ
completed_at TIMESTAMPTZ
time_to_complete INTEGER -- in seconds
```

### Analytics View: `referral_conversion_metrics`

Provides aggregated metrics per affiliate link and company:

```sql
SELECT * FROM referral_conversion_metrics;
```

**Returns:**
- `affiliate_link_id`: The link ID
- `company_source`: Company/brand name
- `total_submissions`: Total form submissions (partial + completed)
- `completed_submissions`: Successfully completed forms
- `partial_submissions`: Forms started but not completed
- `completion_rate`: Percentage of completed forms
- `avg_time_to_complete`: Average time to complete in seconds
- `first_submission`: Date of first submission
- `last_submission`: Date of most recent submission

## Usage

### In Landing Page Builder

1. **Add/Edit Form Section**
2. **Configure Company Source**
   - Open the form section in the sidebar
   - Find "Company Source" field
   - Enter your company/brand name (e.g., "EasyStay", "PartnerCo", "BrandX")
   - This value will be hidden from users but tracked in the database

### In Code

```tsx
<ReferralForm
  linkId="your-link-id"
  headline="Ready to grow?"
  subheadline="Share some details..."
  companySource="EasyStay" // Hidden tracking field
/>
```

## API Endpoints

### POST /api/referral

**Completed Submission:**
```json
{
  "linkId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "555-0100",
  "role": "property-owner",
  "propertiesCount": 3,
  "listingLinks": "https://...",
  "companySource": "EasyStay",
  "formEngagement": "completed",
  "startedAt": "2025-12-22T10:00:00Z",
  "completedAt": "2025-12-22T10:02:30Z",
  "timeToComplete": 150
}
```

**Partial Submission (Auto-tracked):**
```json
{
  "linkId": "uuid",
  "companySource": "EasyStay",
  "formEngagement": "partial",
  "startedAt": "2025-12-22T10:00:00Z",
  "partialData": {
    "hasFirstName": true,
    "hasLastName": true,
    "hasEmail": false,
    "hasPhone": false,
    "hasRole": false
  }
}
```

## Analytics Queries

### Conversion Rate by Company

```sql
SELECT 
  company_source,
  completion_rate,
  total_submissions,
  completed_submissions,
  partial_submissions
FROM referral_conversion_metrics
ORDER BY completion_rate DESC;
```

### Average Time to Complete

```sql
SELECT 
  company_source,
  ROUND(avg_time_to_complete) as avg_seconds,
  ROUND(avg_time_to_complete / 60.0, 1) as avg_minutes
FROM referral_conversion_metrics
WHERE avg_time_to_complete IS NOT NULL;
```

### Recent Submissions

```sql
SELECT 
  first_name,
  last_name,
  email,
  company_source,
  form_engagement,
  time_to_complete,
  completed_at
FROM referrals
WHERE completed_at > NOW() - INTERVAL '7 days'
ORDER BY completed_at DESC;
```

### Partial Abandonment Analysis

```sql
SELECT 
  company_source,
  COUNT(*) as partial_count,
  ROUND(AVG(EXTRACT(EPOCH FROM (NOW() - started_at)))) as avg_time_before_abandon
FROM referrals
WHERE form_engagement = 'partial'
GROUP BY company_source;
```

## Implementation Details

### Client-Side Tracking

**ReferralForm.tsx** automatically:
1. Detects first interaction (focus or input event)
2. Records start time
3. Monitors form abandonment via `beforeunload`
4. Calculates completion time on submit
5. Sends tracking data with submission

### Server-Side Processing

**route.ts** handles:
1. Partial submission logging (non-blocking)
2. Complete submission with full tracking data
3. Referral count incrementing
4. GHL webhook triggering (future)

### Privacy & Performance

- **No PII in partial submissions**: Only field completion status is tracked
- **Non-blocking**: Partial submissions use `navigator.sendBeacon` for reliability
- **Indexed**: Database indexes on tracking fields for fast analytics queries
- **Secure**: All tracking data stored server-side, never exposed to client

## Configuration Options

### Form Section Data Structure

```typescript
interface FormSectionData {
  headline: string;
  subheadline: string;
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundType?: 'color' | 'image';
  companySource?: string; // NEW: Track company/brand
}
```

### Default Values

- **companySource**: `'EasyStay'`
- **formEngagement**: `'completed'` (for successful submissions)
- **Role options**: Property Owner, Affiliate Marketer, Cleaning Service

## Migration Instructions

### Apply Database Migration

```bash
# Run the migration
psql -d your_database -f supabase/migrations/20251222000000_form_tracking.sql
```

### Verify Installation

```sql
-- Check new columns exist
\d referrals

-- Check view was created
\dv referral_conversion_metrics

-- Test the view
SELECT * FROM referral_conversion_metrics LIMIT 5;
```

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Completion Rate**: Should be > 60% for healthy forms
2. **Avg Time to Complete**: Typical range 60-180 seconds
3. **Partial Submissions**: High rate (>40%) indicates UX issues
4. **Company Performance**: Compare conversion rates across brands

### Dashboard Queries

Create a monitoring dashboard with:
- Real-time conversion rate
- Submissions per company (last 24h, 7d, 30d)
- Time to complete trends
- Partial vs completed ratio

## Troubleshooting

### Partial Submissions Not Recording

- Check browser console for errors
- Verify `navigator.sendBeacon` is supported
- Ensure API endpoint accepts partial submissions

### Time to Complete is NULL

- User may have refreshed page (loses start time)
- User may have filled form across multiple sessions
- This is expected behavior; filter these out in analytics

### Company Source Not Updating

- Ensure you've saved the landing page after editing
- Check the form section data includes `companySource`
- Verify the prop is passed to `ReferralForm` component

## Future Enhancements

- [ ] A/B testing support (track form variant)
- [ ] Field-level analytics (which fields cause abandonment)
- [ ] Heatmap integration
- [ ] Real-time dashboard
- [ ] Email alerts for low conversion rates
- [ ] Multi-step form tracking

## Change Log

**2025-12-22**: Initial implementation
- Added company source tracking
- Added form engagement metrics (partial/completed)
- Added time tracking fields
- Created analytics view
- Removed "Traveler" role option
- Added configurable company source in builder

