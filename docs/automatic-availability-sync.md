# Automatic Availability Sync System

## Overview

The automatic availability sync system ensures that property availability data from Hospitable is automatically synchronized to Supabase whenever properties are updated. This system provides multiple triggers and methods for keeping availability data current.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Property      │    │   API Endpoints  │    │   Supabase      │
│   Updates       │───▶│   + Middleware   │───▶│   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        ▼                        │
         │              ┌──────────────────┐              │
         │              │  Availability    │              │
         └──────────────▶│  Sync Service    │──────────────┘
                        └──────────────────┘
```

## API Endpoints

### 1. Property Update with Auto-Sync
**Endpoint:** `PUT /api/properties/update?id={propertyId}`

Updates a property and automatically triggers availability sync if the property has Hospitable integration.

```javascript
// Example usage
const response = await fetch('/api/properties/update?id=123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Updated Property Title',
    description: 'Updated description',
    price: 150
  })
})

const result = await response.json()
// result.data.availability_sync_triggered will be true if sync was triggered
```

### 2. Direct Availability Sync
**Endpoint:** `POST /api/properties/sync-availability`

Manually trigger availability sync for a specific property.

```javascript
// Example usage
const response = await fetch('/api/properties/sync-availability', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    propertyId: 'supabase-property-id',
    hospitablePropertyId: 'hospitable-property-id', // optional
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    trigger: 'manual'
  })
})
```

### 3. Bulk Availability Sync
**Endpoint:** `POST /api/properties/sync-all`

Sync availability for multiple properties at once.

```javascript
// Example usage
const response = await fetch('/api/properties/sync-all', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    property_ids: ['id1', 'id2', 'id3'], // optional - sync all if not provided
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    force_sync: false,
    trigger: 'bulk_update'
  })
})
```

### 4. Webhook Handler
**Endpoint:** `POST /api/webhooks/hospitable`

Receives webhooks from Hospitable and triggers availability sync.

```javascript
// Example webhook payload
{
  "type": "property.availability.changed",
  "data": {
    "property_id": "hospitable-property-id",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }
}
```

## Trigger Types

### 1. Property Update Trigger
- **When:** Property is updated via API
- **How:** Automatic middleware in update endpoint
- **Scope:** Single property
- **Frequency:** On every property update

### 2. Webhook Trigger
- **When:** Hospitable sends webhook notification
- **How:** Webhook endpoint processes notification
- **Scope:** Single or multiple properties
- **Frequency:** Real-time when Hospitable data changes

### 3. Manual Trigger
- **When:** Explicit API call
- **How:** Direct API endpoint call
- **Scope:** Single or multiple properties
- **Frequency:** On-demand

### 4. Scheduled Trigger
- **When:** Cron job or scheduled task
- **How:** Background script execution
- **Scope:** All properties updated in last 24 hours
- **Frequency:** Configurable (e.g., hourly, daily)

## Configuration

### Environment Variables

```bash
# Required
HOSPITABLE_API_KEY=your_hospitable_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Optional
HOSPITABLE_API_URL=https://public.api.hospitable.com/v2
HOSPITABLE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Database Schema

The system requires the `property_availability` table in Supabase:

```sql
CREATE TABLE IF NOT EXISTS property_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  min_nights INTEGER DEFAULT 1,
  check_in_allowed BOOLEAN DEFAULT TRUE,
  check_out_allowed BOOLEAN DEFAULT TRUE,
  synced_from_hospitable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, date)
);
```

## Usage Examples

### 1. Update Property with Auto-Sync

```javascript
// Update property - availability will sync automatically
const updateProperty = async (propertyId, updateData) => {
  const response = await fetch(`/api/properties/update?id=${propertyId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  })
  
  const result = await response.json()
  
  if (result.data.availability_sync_triggered) {
    console.log('Property updated and availability synced')
  } else {
    console.log('Property updated (no Hospitable integration)')
  }
}
```

### 2. Manual Availability Sync

```javascript
// Manually sync availability for a property
const syncAvailability = async (propertyId, startDate, endDate) => {
  const response = await fetch('/api/properties/sync-availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      propertyId,
      startDate,
      endDate,
      trigger: 'manual'
    })
  })
  
  const result = await response.json()
  console.log(`Synced ${result.data.records_synced} availability records`)
}
```

### 3. Bulk Sync All Properties

```javascript
// Sync all properties with Hospitable integration
const syncAllProperties = async () => {
  const response = await fetch('/api/properties/sync-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      trigger: 'bulk_sync'
    })
  })
  
  const result = await response.json()
  console.log(`Bulk sync completed: ${result.data.sync_summary.successful}/${result.data.sync_summary.total} properties`)
}
```

### 4. Scheduled Sync (Cron Job)

```bash
# Add to crontab for hourly sync
0 * * * * cd /path/to/project && node scripts/scheduled-availability-sync.js

# Or daily sync at 2 AM
0 2 * * * cd /path/to/project && node scripts/scheduled-availability-sync.js
```

## Testing

### Run Test Script

```bash
# Test all automatic sync functionality
node scripts/test-automatic-sync.js
```

### Test Individual Components

```bash
# Test property update with auto-sync
curl -X PUT "http://localhost:3000/api/properties/update?id=test-id" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'

# Test direct availability sync
curl -X POST "http://localhost:3000/api/properties/sync-availability" \
  -H "Content-Type: application/json" \
  -d '{"propertyId": "property-id", "startDate": "2024-01-01", "endDate": "2024-01-31"}'

# Test bulk sync
curl -X POST "http://localhost:3000/api/properties/sync-all" \
  -H "Content-Type: application/json" \
  -d '{"start_date": "2024-01-01", "end_date": "2024-01-31"}'
```

## Monitoring and Logging

### Console Logs

The system provides detailed logging for monitoring:

```
🔄 Triggering availability sync for property 123
🔧 Trigger: property_update
✅ Availability sync completed: 30 records synced
📊 Synced 30 availability records
```

### Error Handling

- **API Errors:** Returned in response with error details
- **Sync Failures:** Logged to console, don't break property updates
- **Webhook Errors:** Returned in webhook response
- **Background Job Errors:** Logged to console with exit codes

## Best Practices

### 1. Error Handling
- Always handle API response errors
- Don't let sync failures break property updates
- Log errors for debugging

### 2. Performance
- Use bulk sync for multiple properties
- Set appropriate date ranges
- Use background jobs for large syncs

### 3. Security
- Use webhook signatures for validation
- Secure API endpoints with authentication
- Limit sync frequency to prevent rate limiting

### 4. Monitoring
- Monitor sync success rates
- Set up alerts for sync failures
- Track sync performance metrics

## Troubleshooting

### Common Issues

1. **Property not found in Supabase**
   - Check if property has `hospitable_property_id` column
   - Verify property exists in database

2. **Sync API fails**
   - Check Hospitable API key
   - Verify Supabase connection
   - Check date range validity

3. **Webhook not triggering**
   - Verify webhook URL is correct
   - Check webhook signature validation
   - Ensure Hospitable is configured to send webhooks

4. **Background job fails**
   - Check environment variables
   - Verify database schema
   - Check cron job configuration

### Debug Commands

```bash
# Test environment setup
node scripts/test-calendar-availability.js

# Test automatic sync
node scripts/test-automatic-sync.js

# Run scheduled sync manually
node scripts/scheduled-availability-sync.js
```

## Support

For issues or questions:
1. Check console logs for error details
2. Verify environment variables are set
3. Test individual API endpoints
4. Check database schema and permissions


