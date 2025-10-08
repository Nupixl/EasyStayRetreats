# Hospitable Integration Documentation

## Overview

This document describes the integration between EasyStay Retreats and Hospitable API, including the MCP server implementation, database schema enhancements, and API endpoints for dynamic pricing and property management.

## Architecture

### Components

1. **Hospitable MCP Server** (`mcp/hospitable/`) - Model Context Protocol server for Hospitable API integration
2. **Enhanced Supabase Schema** - New pricing tables for dynamic pricing support
3. **Price Estimation Utility** (`utils/priceEstimator.js`) - Calculate booking costs with dynamic pricing
4. **Next.js API Routes** - REST endpoints for pricing and calendar management

## Database Schema

### New Tables Added

#### 1. Property Pricing Configuration (`property_pricing_config`)
```sql
- id (UUID, Primary Key)
- property_id (UUID, FK to properties)
- base_price (DECIMAL)
- min_price (DECIMAL)
- max_price (DECIMAL)
- currency (TEXT, default 'USD')
- pricing_strategy (TEXT, default 'static')
- weekend_multiplier (DECIMAL, default 1.0)
- min_nights (INTEGER, default 1)
- hospitable_property_id (TEXT)
```

#### 2. Daily Pricing (`daily_pricing`)
```sql
- id (UUID, Primary Key)
- property_id (UUID, FK to properties)
- date (DATE)
- price (DECIMAL)
- availability_status (TEXT, default 'available')
- reason (TEXT)
- synced_from_hospitable (BOOLEAN, default FALSE)
```

#### 3. Booking Fees (`booking_fees`)
```sql
- id (UUID, Primary Key)
- property_id (UUID, FK to properties)
- cleaning_fee (DECIMAL, default 0)
- service_fee_percent (DECIMAL, default 0)
- pet_fee (DECIMAL, default 0)
- extra_guest_fee (DECIMAL, default 0)
- extra_guest_threshold (INTEGER, default 0)
```

#### 4. Seasonal Pricing Rules (`seasonal_pricing_rules`)
```sql
- id (UUID, Primary Key)
- property_id (UUID, FK to properties)
- rule_name (TEXT)
- start_date (DATE)
- end_date (DATE)
- price_multiplier (DECIMAL, default 1.0)
- fixed_price (DECIMAL)
- is_active (BOOLEAN, default TRUE)
```

#### 5. Property Availability (`property_availability`)
```sql
- id (UUID, Primary Key)
- property_id (UUID, FK to properties)
- date (DATE)
- status (TEXT)
- min_nights (INTEGER, default 1)
- check_in_allowed (BOOLEAN, default TRUE)
- check_out_allowed (BOOLEAN, default TRUE)
- synced_from_hospitable (BOOLEAN, default FALSE)
```

## MCP Server Tools

### Property Management Tools

#### `get_property`
Get property information by Hospitable ID
```javascript
{
  "name": "get_property",
  "arguments": {
    "propertyId": "hospitable_property_id"
  }
}
```

#### `list_properties`
List all properties from Hospitable
```javascript
{
  "name": "list_properties",
  "arguments": {}
}
```

#### `sync_property`
Sync property from Hospitable to Supabase
```javascript
{
  "name": "sync_property",
  "arguments": {
    "propertyId": "hospitable_property_id"
  }
}
```

### Pricing Tools

#### `get_property_pricing`
Get pricing for a property date range
```javascript
{
  "name": "get_property_pricing",
  "arguments": {
    "propertyId": "hospitable_property_id",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

#### `sync_property_pricing`
Sync pricing from Hospitable to Supabase
```javascript
{
  "name": "sync_property_pricing",
  "arguments": {
    "propertyId": "hospitable_property_id",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

#### `get_pricing_suggestions`
Get dynamic pricing suggestions from Hospitable
```javascript
{
  "name": "get_pricing_suggestions",
  "arguments": {
    "propertyId": "hospitable_property_id",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

### Calendar Tools

#### `get_calendar`
Get calendar availability
```javascript
{
  "name": "get_calendar",
  "arguments": {
    "propertyId": "hospitable_property_id",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

#### `sync_calendar`
Sync calendar from Hospitable to Supabase
```javascript
{
  "name": "sync_calendar",
  "arguments": {
    "propertyId": "hospitable_property_id",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

### Reservation Tools

#### `get_reservations`
Get reservations for a property
```javascript
{
  "name": "get_reservations",
  "arguments": {
    "propertyId": "hospitable_property_id",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
}
```

#### `get_reservation`
Get specific reservation by ID
```javascript
{
  "name": "get_reservation",
  "arguments": {
    "reservationId": "reservation_id"
  }
}
```

## API Endpoints

### Price Estimation

#### `POST /api/pricing/estimate`
Calculate total price for a booking

**Request Body:**
```json
{
  "propertyId": "uuid",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-22",
  "guests": 4,
  "pets": false,
  "includeFees": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "propertyId": "uuid",
    "checkIn": "2024-01-15",
    "checkOut": "2024-01-22",
    "nights": 7,
    "basePrice": 1400.00,
    "fees": {
      "cleaning": 150.00,
      "service": 210.00,
      "pets": 0.00,
      "extraGuests": 0.00
    },
    "totalFees": 360.00,
    "total": 1760.00,
    "currency": "USD",
    "dailyBreakdown": [...],
    "pricing": {
      "basePrice": 200.00,
      "minPrice": 150.00,
      "maxPrice": 300.00,
      "strategy": "dynamic"
    }
  }
}
```

### Pricing Calendar

#### `GET /api/pricing/calendar`
Get availability and pricing calendar

**Query Parameters:**
- `propertyId` (required): Property UUID
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)
- `includePricing` (optional): Include pricing data (default: true)

**Response:**
```json
{
  "success": true,
  "data": {
    "property": {
      "id": "uuid",
      "title": "Property Name",
      "location": "City, State"
    },
    "pricingConfig": {
      "basePrice": 200.00,
      "minPrice": 150.00,
      "maxPrice": 300.00,
      "currency": "USD",
      "strategy": "dynamic"
    },
    "calendar": [
      {
        "date": "2024-01-15",
        "available": true,
        "status": "available",
        "minNights": 1,
        "checkInAllowed": true,
        "checkOutAllowed": true,
        "price": 200.00,
        "priceReason": "base_price"
      }
    ]
  }
}
```

### Sync Operations

#### `POST /api/pricing/sync`
Trigger manual sync from Hospitable

**Request Body:**
```json
{
  "propertyId": "hospitable_property_id", // Optional for full sync
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "syncType": "all" // "pricing", "calendar", or "all"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "syncType": "all",
    "timestamp": "2024-01-15T10:30:00Z",
    "result": {
      "pricing": {
        "synced": 5,
        "errors": 0,
        "errors_list": []
      },
      "calendar": {
        "synced": 5,
        "errors": 0,
        "errors_list": []
      },
      "totalSynced": 10,
      "totalErrors": 0
    }
  }
}
```

## Configuration

### Environment Variables

Add to `.env.local`:

```bash
# Hospitable API Configuration
HOSPITABLE_API_KEY=your_hospitable_api_key
HOSPITABLE_API_URL=https://api.hospitable.com/v1
HOSPITABLE_SYNC_ENABLED=true

# Supabase Configuration (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Package Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "node-fetch": "^3.3.0"
  }
}
```

## Usage Examples

### 1. Calculate Booking Price

```javascript
// Frontend usage
const response = await fetch('/api/pricing/estimate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    propertyId: 'property-uuid',
    checkIn: '2024-01-15',
    checkOut: '2024-01-22',
    guests: 4,
    pets: true,
    includeFees: true
  })
});

const { data } = await response.json();
console.log(`Total cost: $${data.total}`);
```

### 2. Get Property Calendar

```javascript
// Get availability and pricing for next 30 days
const startDate = new Date().toISOString().split('T')[0];
const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const response = await fetch(
  `/api/pricing/calendar?propertyId=property-uuid&startDate=${startDate}&endDate=${endDate}`
);
const { data } = await response.json();
```

### 3. Sync from Hospitable

```javascript
// Sync all pricing and calendar data
const response = await fetch('/api/pricing/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    syncType: 'all'
  })
});
```

### 4. Using MCP Server

```bash
# Start the MCP server
node mcp/hospitable/server.js

# The server will be available for MCP clients like Claude Desktop
```

## Sync Strategy

### Data Flow

1. **Hospitable → Supabase**: Primary sync direction
2. **Conflict Resolution**: Hospitable data takes precedence
3. **Sync Frequency**: Manual triggers + scheduled jobs
4. **Batch Operations**: Process multiple properties in parallel

### Sync Types

1. **Property Sync**: Basic property information
2. **Pricing Sync**: Daily pricing and configuration
3. **Calendar Sync**: Availability and booking rules
4. **Full Sync**: All data types combined

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Verify `HOSPITABLE_API_KEY` is correct
   - Check API key permissions in Hospitable dashboard

2. **Database Connection**
   - Ensure Supabase credentials are correct
   - Check RLS policies for new tables

3. **Sync Failures**
   - Check property exists in both systems
   - Verify date formats (YYYY-MM-DD)
   - Review error logs for specific issues

4. **Price Calculation Errors**
   - Ensure pricing configuration exists
   - Check for missing daily pricing data
   - Verify date range validity

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=hospitable:*
```

### Monitoring

Monitor sync operations through:
- API response logs
- Supabase dashboard
- Hospitable API usage dashboard

## Security Considerations

1. **API Keys**: Store securely in environment variables
2. **Rate Limiting**: Built-in delays between requests
3. **Data Validation**: Input sanitization and validation
4. **Error Handling**: Graceful failure without exposing sensitive data

## Performance Optimization

1. **Caching**: Coordinate caching for frequently accessed data
2. **Batch Operations**: Process multiple items together
3. **Database Indexes**: Optimized for common queries
4. **Rate Limiting**: Respect Hospitable API limits

## Future Enhancements

1. **Real-time Sync**: WebSocket connections for live updates
2. **Advanced Pricing**: Machine learning price optimization
3. **Multi-currency**: Support for international properties
4. **Analytics**: Pricing performance metrics and insights
