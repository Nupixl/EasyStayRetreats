# Hospitable MCP Server Setup Guide

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create `.env.local` in your project root with the following variables:

```bash
# Supabase Configuration (you should already have these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Hospitable API Configuration (NEW - you need to get these)
HOSPITABLE_API_KEY=your_hospitable_api_key_here
HOSPITABLE_API_URL=https://api.hospitable.com/v1
HOSPITABLE_SYNC_ENABLED=true

# MCP Server Configuration (optional)
MCP_PORT=3001
```

### 3. Get Hospitable API Key

1. Go to [Hospitable Dashboard](https://app.hospitable.com)
2. Navigate to Settings → API
3. Generate a new API key
4. Copy the key and add it to your `.env.local` file

### 4. Apply Database Schema

Run the pricing schema migration in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of scripts/add-pricing-schema.sql
```

### 5. Test the Integration

```bash
# Test pulling properties from Hospitable
node scripts/pull-hospitable-properties.js

# Test the full MCP server
node scripts/test-hospitable-mcp.js
```

## Using the MCP Server

### Start the MCP Server

```bash
node mcp/hospitable/server.js
```

### Available Tools

The MCP server provides these tools:

#### Property Management
- `get_property` - Get property by ID
- `list_properties` - List all properties
- `sync_property` - Sync property to Supabase

#### Pricing Management
- `get_property_pricing` - Get pricing for date range
- `sync_property_pricing` - Sync pricing data
- `get_pricing_suggestions` - Get dynamic pricing suggestions

#### Calendar Management
- `get_calendar` - Get availability calendar
- `sync_calendar` - Sync calendar data

#### Reservation Management
- `get_reservations` - Get property reservations
- `get_reservation` - Get specific reservation

## API Endpoints

### Price Estimation

```bash
POST /api/pricing/estimate
{
  "propertyId": "uuid",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-22",
  "guests": 4,
  "pets": false
}
```

### Calendar Data

```bash
GET /api/pricing/calendar?propertyId=uuid&startDate=2024-01-01&endDate=2024-01-31
```

### Manual Sync

```bash
POST /api/pricing/sync
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "syncType": "all"
}
```

## Troubleshooting

### Common Issues

1. **"HOSPITABLE_API_KEY is required"**
   - Add your Hospitable API key to `.env.local`
   - Make sure the key is valid and has proper permissions

2. **"Failed to connect to Hospitable API"**
   - Check your internet connection
   - Verify your API key is correct
   - Check if Hospitable API is accessible

3. **"Supabase not configured"**
   - Make sure your Supabase credentials are in `.env.local`
   - Verify your Supabase project is active

### Debug Mode

```bash
# Enable debug logging
DEBUG=hospitable:* node scripts/pull-hospitable-properties.js
```

## Next Steps

1. **Get your Hospitable API key** from the Hospitable dashboard
2. **Add it to your `.env.local` file**
3. **Run the test script** to verify everything works
4. **Start using the MCP server** with Claude Desktop or other MCP clients

## Example Usage

Once configured, you can:

1. **Pull properties** from Hospitable
2. **Sync them to Supabase** for local storage
3. **Calculate pricing** with dynamic rates
4. **Manage availability** calendars
5. **Handle reservations**

The MCP server provides a unified interface for all these operations!
