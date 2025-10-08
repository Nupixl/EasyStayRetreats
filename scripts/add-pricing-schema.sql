-- Hospitable MCP Pricing Schema Migration
-- This script adds comprehensive pricing tables to support dynamic pricing from Hospitable

-- 1. Property Pricing Configuration Table
CREATE TABLE IF NOT EXISTS property_pricing_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    hospitable_property_id VARCHAR(255) UNIQUE,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    pricing_strategy VARCHAR(50) DEFAULT 'dynamic', -- 'dynamic', 'fixed', 'seasonal'
    weekend_multiplier DECIMAL(3,2) DEFAULT 1.0,
    min_nights INTEGER DEFAULT 1,
    max_nights INTEGER,
    advance_booking_days INTEGER DEFAULT 365,
    last_minute_discount_percent DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Daily Pricing Table
CREATE TABLE IF NOT EXISTS daily_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    availability_status VARCHAR(20) DEFAULT 'available', -- 'available', 'blocked', 'booked', 'maintenance'
    reason VARCHAR(50) DEFAULT 'dynamic', -- 'manual', 'dynamic', 'seasonal', 'event', 'hospitable_sync'
    synced_from_hospitable BOOLEAN DEFAULT FALSE,
    hospitable_sync_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, date)
);

-- 3. Booking Fees Table
CREATE TABLE IF NOT EXISTS booking_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    cleaning_fee DECIMAL(10,2) DEFAULT 0,
    service_fee_percent DECIMAL(5,2) DEFAULT 0,
    pet_fee DECIMAL(10,2) DEFAULT 0,
    extra_guest_fee DECIMAL(10,2) DEFAULT 0,
    extra_guest_fee_per_guest DECIMAL(10,2) DEFAULT 0,
    security_deposit DECIMAL(10,2) DEFAULT 0,
    resort_fee DECIMAL(10,2) DEFAULT 0,
    city_tax_percent DECIMAL(5,2) DEFAULT 0,
    hospitable_sync_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id)
);

-- 4. Seasonal Pricing Rules Table
CREATE TABLE IF NOT EXISTS seasonal_pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    rule_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price_multiplier DECIMAL(3,2) DEFAULT 1.0,
    fixed_price DECIMAL(10,2),
    min_nights INTEGER,
    max_nights INTEGER,
    advance_booking_required_days INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (end_date >= start_date),
    CHECK (price_multiplier > 0 OR fixed_price > 0)
);

-- 5. Property Availability Table
CREATE TABLE IF NOT EXISTS property_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    availability_reason VARCHAR(50) DEFAULT 'open', -- 'open', 'blocked', 'booked', 'maintenance', 'owner_use'
    min_nights INTEGER,
    max_nights INTEGER,
    check_in_allowed BOOLEAN DEFAULT TRUE,
    check_out_allowed BOOLEAN DEFAULT TRUE,
    synced_from_hospitable BOOLEAN DEFAULT FALSE,
    hospitable_sync_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, date)
);

-- 6. Property Pricing History Table (for analytics)
CREATE TABLE IF NOT EXISTS property_pricing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    occupancy_rate DECIMAL(5,2),
    revenue DECIMAL(10,2),
    booking_count INTEGER DEFAULT 0,
    avg_booking_value DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_pricing_config_property_id ON property_pricing_config(property_id);
CREATE INDEX IF NOT EXISTS idx_property_pricing_config_hospitable_id ON property_pricing_config(hospitable_property_id);

CREATE INDEX IF NOT EXISTS idx_daily_pricing_property_id ON daily_pricing(property_id);
CREATE INDEX IF NOT EXISTS idx_daily_pricing_date ON daily_pricing(date);
CREATE INDEX IF NOT EXISTS idx_daily_pricing_property_date ON daily_pricing(property_id, date);

CREATE INDEX IF NOT EXISTS idx_booking_fees_property_id ON booking_fees(property_id);

CREATE INDEX IF NOT EXISTS idx_seasonal_pricing_property_id ON seasonal_pricing_rules(property_id);
CREATE INDEX IF NOT EXISTS idx_seasonal_pricing_dates ON seasonal_pricing_rules(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_seasonal_pricing_active ON seasonal_pricing_rules(is_active);

CREATE INDEX IF NOT EXISTS idx_property_availability_property_id ON property_availability(property_id);
CREATE INDEX IF NOT EXISTS idx_property_availability_date ON property_availability(date);
CREATE INDEX IF NOT EXISTS idx_property_availability_property_date ON property_availability(property_id, date);

CREATE INDEX IF NOT EXISTS idx_pricing_history_property_id ON property_pricing_history(property_id);
CREATE INDEX IF NOT EXISTS idx_pricing_history_date ON property_pricing_history(date);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_property_pricing_config_updated_at 
    BEFORE UPDATE ON property_pricing_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_pricing_updated_at 
    BEFORE UPDATE ON daily_pricing 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_fees_updated_at 
    BEFORE UPDATE ON booking_fees 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seasonal_pricing_rules_updated_at 
    BEFORE UPDATE ON seasonal_pricing_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_availability_updated_at 
    BEFORE UPDATE ON property_availability 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE property_pricing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_pricing_history ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON property_pricing_config
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON daily_pricing
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON booking_fees
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON seasonal_pricing_rules
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON property_availability
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON property_pricing_history
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for service role (for MCP server)
CREATE POLICY "Enable all access for service role" ON property_pricing_config
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON daily_pricing
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON booking_fees
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON seasonal_pricing_rules
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON property_availability
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON property_pricing_history
    FOR ALL USING (auth.role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE property_pricing_config IS 'Configuration for property pricing strategies and base pricing';
COMMENT ON TABLE daily_pricing IS 'Daily pricing data with availability status';
COMMENT ON TABLE booking_fees IS 'Additional fees for bookings (cleaning, service, pets, etc.)';
COMMENT ON TABLE seasonal_pricing_rules IS 'Seasonal pricing rules and multipliers';
COMMENT ON TABLE property_availability IS 'Property availability calendar';
COMMENT ON TABLE property_pricing_history IS 'Historical pricing data for analytics';