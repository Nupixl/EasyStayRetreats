-- Unified Properties Schema
-- This schema consolidates properties and App-Properties tables
-- Based on App-Properties as the canonical structure with enhancements from properties table

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the unified properties table
-- This will be the single source of truth for all property data
CREATE TABLE unified_properties (
  -- Primary key
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Core property information (from App-Properties)
  name TEXT NOT NULL,                    -- title/name of the property
  city TEXT,                             -- location/city
  state TEXT,                            -- state/province
  country TEXT,                          -- country
  address TEXT,                          -- full address
  
  -- Pricing information
  price_starts_at DECIMAL(10,2),         -- starting price
  price_per_night DECIMAL(10,2),        -- price per night
  currency TEXT DEFAULT 'USD',          -- currency code
  
  -- Property details
  body_description TEXT,                 -- detailed description
  short_description TEXT,                -- brief description
  property_type TEXT,                    -- type of property (house, apartment, etc.)
  bedrooms INTEGER,                      -- number of bedrooms
  bathrooms INTEGER,                      -- number of bathrooms
  max_guests INTEGER,                    -- maximum number of guests
  
  -- Location coordinates
  latitude DECIMAL(10, 8),               -- latitude
  longitude DECIMAL(11, 8),              -- longitude
  
  -- Ratings and reviews
  property_rating DECIMAL(2,1),          -- average rating
  total_reviews INTEGER DEFAULT 0,       -- total number of reviews
  
  -- Images
  card_image TEXT,                       -- main/hero image URL
  
  -- External IDs and references
  whalesync_postgres_id TEXT,            -- external system ID
  external_id TEXT,                      -- other external reference
  
  -- Status and availability
  is_active BOOLEAN DEFAULT true,        -- whether property is active
  is_featured BOOLEAN DEFAULT false,     -- whether property is featured
  availability_status TEXT DEFAULT 'available', -- availability status
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_images table (normalized from JSON)
CREATE TABLE property_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES unified_properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_hero BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hosts table
CREATE TABLE hosts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  profile_image_url TEXT,
  bio TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_count INTEGER DEFAULT 0,
  response_rate DECIMAL(5,2),
  response_time TEXT,
  is_superhost BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_hosts junction table
CREATE TABLE property_hosts (
  property_id UUID REFERENCES unified_properties(id) ON DELETE CASCADE,
  host_id UUID REFERENCES hosts(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (property_id, host_id)
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES unified_properties(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT,
  user_profile_image_url TEXT,
  review_text TEXT NOT NULL,
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5),
  cleanliness_rating DECIMAL(2,1),
  communication_rating DECIMAL(2,1),
  checkin_rating DECIMAL(2,1),
  accuracy_rating DECIMAL(2,1),
  location_rating DECIMAL(2,1),
  value_rating DECIMAL(2,1),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create amenities table
CREATE TABLE amenities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,                         -- e.g., 'safety', 'kitchen', 'outdoor'
  icon TEXT,                             -- icon name or URL
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_amenities junction table
CREATE TABLE property_amenities (
  property_id UUID REFERENCES unified_properties(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (property_id, amenity_id)
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_categories junction table
CREATE TABLE property_categories (
  property_id UUID REFERENCES unified_properties(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (property_id, category_id)
);

-- Create property_availability table for booking management
CREATE TABLE property_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES unified_properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  price DECIMAL(10,2),
  minimum_nights INTEGER DEFAULT 1,
  maximum_nights INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_unified_properties_location ON unified_properties(latitude, longitude);
CREATE INDEX idx_unified_properties_city ON unified_properties(city);
CREATE INDEX idx_unified_properties_price ON unified_properties(price_starts_at);
CREATE INDEX idx_unified_properties_rating ON unified_properties(property_rating);
CREATE INDEX idx_unified_properties_active ON unified_properties(is_active);
CREATE INDEX idx_property_images_property_id ON property_images(property_id);
CREATE INDEX idx_reviews_property_id ON reviews(property_id);
CREATE INDEX idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX idx_property_categories_property_id ON property_categories(property_id);
CREATE INDEX idx_property_availability_property_date ON property_availability(property_id, date);

-- Row Level Security (RLS) policies
ALTER TABLE unified_properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON unified_properties FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated insert unified_properties" ON unified_properties
  FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated update unified_properties" ON unified_properties
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated delete unified_properties" ON unified_properties
  FOR DELETE TO authenticated USING (TRUE);

ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_images FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated insert property_images" ON property_images
  FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated update property_images" ON property_images
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated delete property_images" ON property_images
  FOR DELETE TO authenticated USING (TRUE);

ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON hosts FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated insert hosts" ON hosts
  FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated update hosts" ON hosts
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated delete hosts" ON hosts
  FOR DELETE TO authenticated USING (TRUE);

ALTER TABLE property_hosts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_hosts FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated insert property_hosts" ON property_hosts
  FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated update property_hosts" ON property_hosts
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated delete property_hosts" ON property_hosts
  FOR DELETE TO authenticated USING (TRUE);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated insert reviews" ON reviews
  FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated update reviews" ON reviews
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated delete reviews" ON reviews
  FOR DELETE TO authenticated USING (TRUE);

ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON amenities FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated insert amenities" ON amenities
  FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated update amenities" ON amenities
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated delete amenities" ON amenities
  FOR DELETE TO authenticated USING (TRUE);

ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_amenities FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated insert property_amenities" ON property_amenities
  FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated update property_amenities" ON property_amenities
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated delete property_amenities" ON property_amenities
  FOR DELETE TO authenticated USING (TRUE);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated insert categories" ON categories
  FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated update categories" ON categories
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated delete categories" ON categories
  FOR DELETE TO authenticated USING (TRUE);

ALTER TABLE property_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_categories FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated insert property_categories" ON property_categories
  FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated update property_categories" ON property_categories
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated delete property_categories" ON property_categories
  FOR DELETE TO authenticated USING (TRUE);

ALTER TABLE property_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_availability FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated insert property_availability" ON property_availability
  FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Authenticated update property_availability" ON property_availability
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated delete property_availability" ON property_availability
  FOR DELETE TO authenticated USING (TRUE);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_unified_properties_updated_at
    BEFORE UPDATE ON unified_properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hosts_updated_at
    BEFORE UPDATE ON hosts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_images_updated_at
    BEFORE UPDATE ON property_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_hosts_updated_at
    BEFORE UPDATE ON property_hosts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_amenities_updated_at
    BEFORE UPDATE ON amenities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_amenities_updated_at
    BEFORE UPDATE ON property_amenities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_categories_updated_at
    BEFORE UPDATE ON property_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_availability_updated_at
    BEFORE UPDATE ON property_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default amenities
INSERT INTO amenities (name, category, description) VALUES
('WiFi', 'internet', 'Free WiFi available'),
('Kitchen', 'kitchen', 'Fully equipped kitchen'),
('Parking', 'parking', 'Free parking on premises'),
('Pool', 'outdoor', 'Swimming pool'),
('Hot tub', 'outdoor', 'Hot tub or jacuzzi'),
('Gym', 'fitness', 'Fitness center or gym'),
('Pet friendly', 'pets', 'Pets allowed'),
('Smoking allowed', 'smoking', 'Smoking permitted'),
('Air conditioning', 'climate', 'Air conditioning available'),
('Heating', 'climate', 'Heating available'),
('Washer', 'laundry', 'Washing machine'),
('Dryer', 'laundry', 'Clothes dryer'),
('TV', 'entertainment', 'Television'),
('Cable TV', 'entertainment', 'Cable television'),
('Netflix', 'entertainment', 'Netflix streaming'),
('Fireplace', 'comfort', 'Fireplace'),
('Balcony', 'outdoor', 'Private balcony'),
('Garden', 'outdoor', 'Private garden'),
('BBQ grill', 'outdoor', 'Barbecue grill'),
('Beach access', 'location', 'Beach access nearby');

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Entire home', 'entire-home', 'Entire home or apartment'),
('Private room', 'private-room', 'Private room in a shared space'),
('Shared room', 'shared-room', 'Shared room with others'),
('Unique stays', 'unique-stays', 'Unique and unusual accommodations'),
('Beachfront', 'beachfront', 'Properties with beach access'),
('Mountain view', 'mountain-view', 'Properties with mountain views'),
('City center', 'city-center', 'Properties in city centers'),
('Rural', 'rural', 'Rural and countryside properties'),
('Luxury', 'luxury', 'High-end luxury properties'),
('Budget', 'budget', 'Budget-friendly options');

-- Create a view for easy querying with all related data
CREATE VIEW properties_with_details AS
SELECT 
    p.id,
    p.name,
    p.city,
    p.state,
    p.country,
    p.address,
    p.price_starts_at,
    p.price_per_night,
    p.currency,
    p.body_description,
    p.short_description,
    p.property_type,
    p.bedrooms,
    p.bathrooms,
    p.max_guests,
    p.latitude,
    p.longitude,
    p.property_rating,
    p.total_reviews,
    p.card_image,
    p.is_active,
    p.is_featured,
    p.availability_status,
    p.created_at,
    p.updated_at,
    -- Host information
    h.name as host_name,
    h.profile_image_url as host_image,
    h.is_superhost,
    h.response_rate,
    h.response_time,
    -- Images
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', pi.id,
                'url', pi.url,
                'alt_text', pi.alt_text,
                'caption', pi.caption,
                'display_order', pi.display_order,
                'is_hero', pi.is_hero
            )
        ) FILTER (WHERE pi.id IS NOT NULL),
        '[]'::json
    ) as images,
    -- Amenities
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', a.id,
                'name', a.name,
                'category', a.category,
                'icon', a.icon
            )
        ) FILTER (WHERE a.id IS NOT NULL),
        '[]'::json
    ) as amenities,
    -- Categories
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'slug', c.slug,
                'description', c.description
            )
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'::json
    ) as categories
FROM unified_properties p
LEFT JOIN property_hosts ph ON p.id = ph.property_id AND ph.is_primary = true
LEFT JOIN hosts h ON ph.host_id = h.id
LEFT JOIN property_images pi ON p.id = pi.property_id
LEFT JOIN property_amenities pa ON p.id = pa.property_id
LEFT JOIN amenities a ON pa.amenity_id = a.id
LEFT JOIN property_categories pc ON p.id = pc.property_id
LEFT JOIN categories c ON pc.category_id = c.id
WHERE p.is_active = true
GROUP BY p.id, h.id;

-- Grant permissions
GRANT SELECT ON properties_with_details TO anon;
GRANT SELECT ON properties_with_details TO authenticated;
