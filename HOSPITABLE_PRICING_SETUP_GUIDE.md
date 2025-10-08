# Hospitable MCP Pricing Schema Setup Guide

## Overview

This guide will help you set up the comprehensive pricing schema for the Hospitable MCP integration. The schema includes 6 new tables to support dynamic pricing, seasonal rules, booking fees, and availability management.

## 🏗️ Database Schema Setup

### Step 1: Access Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**

### Step 2: Execute the Pricing Schema

Copy and paste the entire contents of `scripts/add-pricing-schema.sql` into the SQL Editor and execute it.

**Important**: Execute the entire script at once to ensure all dependencies are created properly.

### Step 3: Verify Tables Were Created

After executing the SQL, you should see these new tables in your database:

- ✅ `property_pricing_config` - Base pricing configuration
- ✅ `daily_pricing` - Daily pricing data with availability
- ✅ `booking_fees` - Additional fees (cleaning, service, pets, etc.)
- ✅ `seasonal_pricing_rules` - Seasonal pricing multipliers
- ✅ `property_availability` - Availability calendar
- ✅ `property_pricing_history` - Historical pricing for analytics

## 📊 Schema Details

### 1. Property Pricing Configuration (`property_pricing_config`)

**Purpose**: Base pricing strategy and configuration for each property

**Key Fields**:
- `property_id` - Links to properties table
- `hospitable_property_id` - External Hospitable property ID
- `base_price` - Base nightly rate
- `min_price` / `max_price` - Price boundaries
- `pricing_strategy` - 'dynamic', 'fixed', or 'seasonal'
- `weekend_multiplier` - Weekend price multiplier
- `min_nights` / `max_nights` - Stay duration limits

### 2. Daily Pricing (`daily_pricing`)

**Purpose**: Daily pricing data with availability status

**Key Fields**:
- `property_id` - Links to properties table
- `date` - Specific date
- `price` - Price for that date
- `availability_status` - 'available', 'blocked', 'booked', 'maintenance'
- `reason` - 'manual', 'dynamic', 'seasonal', 'event', 'hospitable_sync'
- `synced_from_hospitable` - Whether data came from Hospitable API

### 3. Booking Fees (`booking_fees`)

**Purpose**: Additional fees for bookings

**Key Fields**:
- `property_id` - Links to properties table
- `cleaning_fee` - One-time cleaning fee
- `service_fee_percent` - Service fee percentage
- `pet_fee` - Pet fee per stay
- `extra_guest_fee` - Fee for additional guests
- `security_deposit` - Security deposit amount
- `city_tax_percent` - Local tax percentage

### 4. Seasonal Pricing Rules (`seasonal_pricing_rules`)

**Purpose**: Seasonal pricing multipliers and rules

**Key Fields**:
- `property_id` - Links to properties table
- `rule_name` - Human-readable rule name
- `start_date` / `end_date` - Rule period
- `price_multiplier` - Price multiplier (e.g., 1.5 for 50% increase)
- `fixed_price` - Fixed price override
- `min_nights` - Minimum nights for this rule
- `is_active` - Whether rule is currently active

### 5. Property Availability (`property_availability`)

**Purpose**: Availability calendar with booking restrictions

**Key Fields**:
- `property_id` - Links to properties table
- `date` - Specific date
- `is_available` - Whether property is available
- `availability_reason` - 'open', 'blocked', 'booked', 'maintenance', 'owner_use'
- `min_nights` / `max_nights` - Stay duration limits for this date
- `check_in_allowed` / `check_out_allowed` - Check-in/out restrictions

### 6. Property Pricing History (`property_pricing_history`)

**Purpose**: Historical pricing data for analytics

**Key Fields**:
- `property_id` - Links to properties table
- `date` - Historical date
- `price` - Price that was charged
- `occupancy_rate` - Occupancy percentage
- `revenue` - Revenue generated
- `booking_count` - Number of bookings
- `avg_booking_value` - Average booking value

## 🧪 Testing the Schema

After creating the tables, run this command to test and populate with sample data:

```bash
node scripts/create-pricing-tables-manual.js
```

This script will:
1. ✅ Verify all tables exist
2. ✅ Create sample pricing configuration for Berkshires Retreat
3. ✅ Add booking fees
4. ✅ Create seasonal pricing rules
5. ✅ Generate 30 days of sample daily pricing
6. ✅ Set up availability calendar

## 🔗 Integration with Hospitable MCP

Once the schema is set up, the Hospitable MCP server can:

1. **Sync Property Data**: Pull property details from Hospitable API
2. **Sync Pricing**: Import daily pricing and availability
3. **Calculate Estimates**: Use the pricing data for price estimation
4. **Update Rules**: Modify seasonal pricing rules
5. **Track History**: Store pricing history for analytics

## 📋 Next Steps

1. ✅ Execute the SQL schema in Supabase dashboard
2. ✅ Run the test script to populate sample data
3. ✅ Test the Hospitable MCP server with the new schema
4. ✅ Integrate pricing estimation into your Next.js app

## 🚨 Troubleshooting

### Common Issues:

1. **"Table doesn't exist" errors**: Make sure you executed the full SQL schema
2. **Permission errors**: Check that RLS policies are set up correctly
3. **Foreign key errors**: Ensure the `properties` table has the correct structure

### Verification Commands:

```bash
# Test if tables exist
node scripts/create-pricing-tables-manual.js

# Check specific table structure
node scripts/check-property-images-structure.js
```

## 📚 Related Files

- `scripts/add-pricing-schema.sql` - Complete SQL schema
- `scripts/create-pricing-tables-manual.js` - Test and populate script
- `mcp/hospitable/` - MCP server implementation
- `utils/priceEstimator.js` - Price calculation utilities
- `pages/api/pricing/` - Next.js API routes for pricing

---

**Ready to proceed?** Execute the SQL schema in your Supabase dashboard, then run the test script to verify everything is working correctly!
