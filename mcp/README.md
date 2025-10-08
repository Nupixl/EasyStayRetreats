# Hospitable MCP Server

A Model Context Protocol (MCP) server for integrating Hospitable API with Supabase for property management and dynamic pricing.

## Features

- **Property Management**: Sync properties between Hospitable and Supabase
- **Dynamic Pricing**: Support for daily pricing, seasonal rules, and dynamic pricing
- **Calendar Integration**: Availability and booking management
- **Price Estimation**: Calculate total booking costs with fees
- **Reservation Management**: Handle bookings and reservations

## Quick Start

### 1. Install Dependencies

```bash
npm install @modelcontextprotocol/sdk node-fetch
```

### 2. Configure Environment

Add to your `.env.local`:

```bash
# Hospitable API
HOSPITABLE_API_KEY=your_hospitable_api_key
HOSPITABLE_API_URL=https://api.hospitable.com/v1
HOSPITABLE_SYNC_ENABLED=true

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Apply Database Schema

Run the pricing schema migration:

```bash
# In your Supabase SQL Editor, run:
# scripts/add-pricing-schema.sql
```

### 4. Start MCP Server

```bash
node mcp/hospitable/server.js
```

## Usage

### MCP Tools Available

#### Property Tools
- `get_property` - Get property by ID
- `list_properties` - List all properties
- `sync_property` - Sync property to Supabase

#### Pricing Tools
- `get_property_pricing` - Get pricing for date range
- `sync_property_pricing` - Sync pricing data
- `get_pricing_suggestions` - Get dynamic pricing suggestions

#### Calendar Tools
- `get_calendar` - Get availability calendar
- `sync_calendar` - Sync calendar data

#### Reservation Tools
- `get_reservations` - Get property reservations
- `get_reservation` - Get specific reservation

### API Endpoints

#### Price Estimation
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

#### Calendar Data
```bash
GET /api/pricing/calendar?propertyId=uuid&startDate=2024-01-01&endDate=2024-01-31
```

#### Manual Sync
```bash
POST /api/pricing/sync
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "syncType": "all"
}
```

## Architecture

```
mcp/hospitable/
├── server.js           # Main MCP server
├── client.js           # Hospitable API client
├── sync.js             # Supabase sync utilities
├── config.js           # Configuration
└── tools/
    ├── properties.js   # Property management tools
    ├── pricing.js      # Pricing tools
    ├── calendar.js     # Calendar tools
    └── reservations.js # Reservation tools
```

## Database Schema

The integration adds several new tables to support dynamic pricing:

- `property_pricing_config` - Base pricing configuration
- `daily_pricing` - Daily price variations
- `booking_fees` - Cleaning, service, and other fees
- `seasonal_pricing_rules` - Seasonal pricing multipliers
- `property_availability` - Calendar availability

## Configuration

### Hospitable API Setup

1. Get API key from Hospitable dashboard
2. Configure webhook endpoints (optional)
3. Set up property mappings

### Supabase Setup

1. Apply the pricing schema migration
2. Configure RLS policies
3. Set up service role permissions

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Verify Hospitable API key is correct
   - Check API key permissions

2. **Database Connection Failed**
   - Verify Supabase credentials
   - Check RLS policies

3. **Sync Failures**
   - Check property exists in both systems
   - Verify date formats (YYYY-MM-DD)

### Debug Mode

```bash
DEBUG=hospitable:* node mcp/hospitable/server.js
```

## Development

### Adding New Tools

1. Create tool in `tools/` directory
2. Add tool definition in `server.js`
3. Implement tool handler
4. Update documentation

### Testing

```bash
# Test MCP server
node mcp/hospitable/server.js

# Test API endpoints
curl -X POST http://localhost:3000/api/pricing/estimate \
  -H "Content-Type: application/json" \
  -d '{"propertyId":"uuid","checkIn":"2024-01-15","checkOut":"2024-01-22"}'
```

## License

MIT License - see LICENSE file for details.
