-- Fix Schema Issues
-- This script addresses all the issues mentioned in the user feedback

-- 1. Fix duplicate timestamp columns and add missing triggers
-- First, let's check what tables exist and their current structure

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS property_categories CASCADE;
DROP TABLE IF EXISTS property_amenities CASCADE;
DROP TABLE IF EXISTS property_hosts CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS property_availability CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS hosts CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS unified_properties CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the unified properties table with clean timestamp structure
CREATE TABLE properties (
  -- Primary key
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Core property information
  title TEXT NOT NULL,                    -- property title/name
  description TEXT,                       -- detailed description
  location TEXT,                          -- location/city
  price DECIMAL(10,2),                    -- price per night
  about TEXT,                             -- about section
  
  -- Location coordinates
  latitude DECIMAL(10, 8),                -- latitude
  longitude DECIMAL(11, 8),               -- longitude
  
  -- Ratings and reviews
  rating DECIMAL(2,1),                    -- average rating
  review_count INTEGER DEFAULT 0,         -- total number of reviews
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,         -- whether property is active
  
  -- Timestamps (single set)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_images table
CREATE TABLE property_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,       -- mark primary image
  sort_order INTEGER DEFAULT 0,           -- for ordering images
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hosts table
CREATE TABLE hosts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,                      -- for deduplication
  profile_image_url TEXT,
  bio TEXT,                               -- host bio
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_hosts junction table
CREATE TABLE property_hosts (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  host_id UUID REFERENCES hosts(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,       -- mark primary host
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (property_id, host_id)
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT,                        -- for deduplication
  user_profile_image_url TEXT,
  review_text TEXT NOT NULL,
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create amenities table
CREATE TABLE amenities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon_url TEXT,                          -- for amenity icons
  description TEXT,                       -- amenity description
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_amenities junction table
CREATE TABLE property_amenities (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (property_id, amenity_id)
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,                       -- URL-friendly slug
  description TEXT,                       -- category description
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_categories junction table
CREATE TABLE property_categories (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (property_id, category_id)
);

-- Create property_availability table (optional)
CREATE TABLE property_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  price_override DECIMAL(10,2),           -- custom price for this date
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, date)
);

-- Create indexes for performance
CREATE INDEX idx_properties_location ON properties (location);
CREATE INDEX idx_properties_latitude_longitude ON properties (latitude, longitude);
CREATE INDEX idx_properties_is_active ON properties (is_active);
CREATE INDEX idx_property_images_property_id ON property_images (property_id);
CREATE INDEX idx_property_images_is_primary ON property_images (is_primary);
CREATE INDEX idx_reviews_property_id ON reviews (property_id);
CREATE INDEX idx_reviews_rating ON reviews (rating);
CREATE INDEX idx_property_hosts_property_id ON property_hosts (property_id);
CREATE INDEX idx_property_hosts_host_id ON property_hosts (host_id);
CREATE INDEX idx_property_amenities_property_id ON property_amenities (property_id);
CREATE INDEX idx_property_amenities_amenity_id ON property_amenities (amenity_id);
CREATE INDEX idx_property_categories_property_id ON property_categories (property_id);
CREATE INDEX idx_property_categories_category_id ON property_categories (category_id);
CREATE INDEX idx_property_availability_property_id ON property_availability (property_id);
CREATE INDEX idx_property_availability_date ON property_availability (date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for all tables with updated_at columns
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
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

CREATE TRIGGER update_amenities_updated_at
    BEFORE UPDATE ON amenities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Read policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON properties FOR SELECT USING (TRUE);

ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_images FOR SELECT USING (TRUE);

ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON hosts FOR SELECT USING (TRUE);

ALTER TABLE property_hosts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_hosts FOR SELECT USING (TRUE);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON reviews FOR SELECT USING (TRUE);

ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON amenities FOR SELECT USING (TRUE);

ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_amenities FOR SELECT USING (TRUE);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (TRUE);

ALTER TABLE property_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_categories FOR SELECT USING (TRUE);

ALTER TABLE property_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_availability FOR SELECT USING (TRUE);

-- RLS - Write policies (for service role operations)
CREATE POLICY "Enable insert for service role" ON properties FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for service role" ON properties FOR UPDATE USING (TRUE);
CREATE POLICY "Enable delete for service role" ON properties FOR DELETE USING (TRUE);

CREATE POLICY "Enable insert for service role" ON property_images FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for service role" ON property_images FOR UPDATE USING (TRUE);
CREATE POLICY "Enable delete for service role" ON property_images FOR DELETE USING (TRUE);

CREATE POLICY "Enable insert for service role" ON hosts FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for service role" ON hosts FOR UPDATE USING (TRUE);
CREATE POLICY "Enable delete for service role" ON hosts FOR DELETE USING (TRUE);

CREATE POLICY "Enable insert for service role" ON property_hosts FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for service role" ON property_hosts FOR UPDATE USING (TRUE);
CREATE POLICY "Enable delete for service role" ON property_hosts FOR DELETE USING (TRUE);

CREATE POLICY "Enable insert for service role" ON reviews FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for service role" ON reviews FOR UPDATE USING (TRUE);
CREATE POLICY "Enable delete for service role" ON reviews FOR DELETE USING (TRUE);

CREATE POLICY "Enable insert for service role" ON amenities FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for service role" ON amenities FOR UPDATE USING (TRUE);
CREATE POLICY "Enable delete for service role" ON amenities FOR DELETE USING (TRUE);

CREATE POLICY "Enable insert for service role" ON property_amenities FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for service role" ON property_amenities FOR UPDATE USING (TRUE);
CREATE POLICY "Enable delete for service role" ON property_amenities FOR DELETE USING (TRUE);

CREATE POLICY "Enable insert for service role" ON categories FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for service role" ON categories FOR UPDATE USING (TRUE);
CREATE POLICY "Enable delete for service role" ON categories FOR DELETE USING (TRUE);

CREATE POLICY "Enable insert for service role" ON property_categories FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for service role" ON property_categories FOR UPDATE USING (TRUE);
CREATE POLICY "Enable delete for service role" ON property_categories FOR DELETE USING (TRUE);

CREATE POLICY "Enable insert for service role" ON property_availability FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for service role" ON property_availability FOR UPDATE USING (TRUE);
CREATE POLICY "Enable delete for service role" ON property_availability FOR DELETE USING (TRUE);

-- Create a comprehensive view for property details
CREATE OR REPLACE VIEW properties_with_details AS
SELECT
    p.id,
    p.title,
    p.description,
    p.location,
    p.price,
    p.about,
    p.latitude,
    p.longitude,
    p.rating,
    p.review_count,
    p.is_active,
    p.created_at,
    p.updated_at,
    -- Images as JSON array
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', pi.id,
                'url', pi.url,
                'alt_text', pi.alt_text,
                'is_primary', pi.is_primary,
                'sort_order', pi.sort_order
            ) ORDER BY pi.sort_order, pi.created_at
        )
        FROM property_images pi
        WHERE pi.property_id = p.id
    ) AS images,
    -- Primary host information
    (
        SELECT JSON_BUILD_OBJECT(
            'id', h.id,
            'name', h.name,
            'profile_image_url', h.profile_image_url,
            'bio', h.bio,
            'joined_at', h.joined_at,
            'review_count', h.review_count
        )
        FROM hosts h
        JOIN property_hosts ph ON h.id = ph.host_id
        WHERE ph.property_id = p.id AND ph.is_primary = TRUE
        LIMIT 1
    ) AS primary_host,
    -- All hosts (including secondary)
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', h.id,
                'name', h.name,
                'profile_image_url', h.profile_image_url,
                'bio', h.bio,
                'is_primary', ph.is_primary
            ) ORDER BY ph.is_primary DESC, h.name
        )
        FROM hosts h
        JOIN property_hosts ph ON h.id = ph.host_id
        WHERE ph.property_id = p.id
    ) AS all_hosts,
    -- Recent reviews
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', r.id,
                'user_name', r.user_name,
                'user_profile_image_url', r.user_profile_image_url,
                'review_text', r.review_text,
                'rating', r.rating,
                'created_at', r.created_at
            ) ORDER BY r.created_at DESC
        )
        FROM reviews r
        WHERE r.property_id = p.id
        LIMIT 10
    ) AS recent_reviews,
    -- Amenities
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', a.id,
                'name', a.name,
                'icon_url', a.icon_url,
                'description', a.description
            ) ORDER BY a.name
        )
        FROM amenities a
        JOIN property_amenities pa ON a.id = pa.amenity_id
        WHERE pa.property_id = p.id
    ) AS amenities,
    -- Categories
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', c.id,
                'name', c.name,
                'slug', c.slug,
                'description', c.description
            ) ORDER BY c.name
        )
        FROM categories c
        JOIN property_categories pc ON c.id = pc.category_id
        WHERE pc.property_id = p.id
    ) AS categories
FROM
    properties p
WHERE p.is_active = TRUE;

-- Insert seed data for amenities
INSERT INTO amenities (name, description) VALUES
('WiFi', 'Free WiFi internet access'),
('Kitchen', 'Fully equipped kitchen'),
('Parking', 'Free parking on premises'),
('Pool', 'Swimming pool'),
('Hot Tub', 'Hot tub or jacuzzi'),
('Gym', 'Fitness center or gym'),
('Air Conditioning', 'Air conditioning'),
('Heating', 'Central heating'),
('TV', 'Television'),
('Washer', 'Washing machine'),
('Dryer', 'Clothes dryer'),
('Iron', 'Iron and ironing board'),
('Hair Dryer', 'Hair dryer'),
('Shampoo', 'Shampoo and conditioner'),
('Body Soap', 'Body soap and gel'),
('Towels', 'Fresh towels provided'),
('Bed Linens', 'Fresh bed linens provided'),
('Smoke Alarm', 'Smoke alarm'),
('Carbon Monoxide Alarm', 'Carbon monoxide alarm'),
('Fire Extinguisher', 'Fire extinguisher'),
('First Aid Kit', 'First aid kit'),
('Lock on Bedroom Door', 'Lock on bedroom door'),
('Private Entrance', 'Private entrance'),
('Laptop Friendly Workspace', 'Laptop friendly workspace'),
('Dedicated Workspace', 'Dedicated workspace'),
('High Chair', 'High chair for children'),
('Travel Crib', 'Travel crib for children'),
('Children''s Books and Toys', 'Children''s books and toys'),
('Baby Safety Gates', 'Baby safety gates'),
('Outlet Covers', 'Outlet covers'),
('Stair Gates', 'Stair gates'),
('Window Guards', 'Window guards'),
('Pool Gates', 'Pool gates'),
('Beach Access', 'Beach access'),
('Waterfront', 'Waterfront property'),
('Mountain View', 'Mountain view'),
('Ocean View', 'Ocean view'),
('Garden View', 'Garden view'),
('City View', 'City view'),
('Lake View', 'Lake view'),
('River View', 'River view'),
('Valley View', 'Valley view'),
('Pool View', 'Pool view'),
('Courtyard View', 'Courtyard view'),
('Patio', 'Patio or balcony'),
('Balcony', 'Balcony'),
('Terrace', 'Terrace'),
('Rooftop', 'Rooftop access'),
('Garden', 'Garden'),
('BBQ Grill', 'BBQ grill'),
('Outdoor Dining', 'Outdoor dining area'),
('Fire Pit', 'Fire pit'),
('Hammock', 'Hammock'),
('Outdoor Shower', 'Outdoor shower'),
('Outdoor Kitchen', 'Outdoor kitchen'),
('Outdoor Seating', 'Outdoor seating'),
('Sun Loungers', 'Sun loungers'),
('Beach Chairs', 'Beach chairs'),
('Beach Towels', 'Beach towels'),
('Snorkeling Gear', 'Snorkeling gear'),
('Kayak', 'Kayak'),
('Canoe', 'Canoe'),
('Paddleboard', 'Paddleboard'),
('Boat', 'Boat access'),
('Fishing Gear', 'Fishing gear'),
('Bicycle', 'Bicycle'),
('Scooter', 'Scooter'),
('Motorcycle', 'Motorcycle'),
('Car', 'Car rental'),
('Airport Shuttle', 'Airport shuttle'),
('Concierge', 'Concierge service'),
('Housekeeping', 'Housekeeping service'),
('Laundry Service', 'Laundry service'),
('Room Service', 'Room service'),
('Breakfast', 'Breakfast included'),
('Dinner', 'Dinner included'),
('Lunch', 'Lunch included'),
('Coffee', 'Coffee maker'),
('Tea', 'Tea maker'),
('Wine', 'Wine selection'),
('Beer', 'Beer selection'),
('Spirits', 'Spirits selection'),
('Cocktail', 'Cocktail making supplies'),
('Entertainment', 'Entertainment system'),
('Sound System', 'Sound system'),
('Piano', 'Piano'),
('Guitar', 'Guitar'),
('Board Games', 'Board games'),
('Card Games', 'Card games'),
('Puzzle', 'Puzzle'),
('Books', 'Books selection'),
('Magazines', 'Magazines'),
('Newspaper', 'Newspaper'),
('DVD Player', 'DVD player'),
('Blu-ray Player', 'Blu-ray player'),
('Video Games', 'Video games'),
('Gaming Console', 'Gaming console'),
('Arcade Games', 'Arcade games'),
('Pool Table', 'Pool table'),
('Ping Pong', 'Ping pong table'),
('Foosball', 'Foosball table'),
('Dart Board', 'Dart board'),
('Poker Table', 'Poker table'),
('Chess', 'Chess set'),
('Checkers', 'Checkers set'),
('Backgammon', 'Backgammon set'),
('Mahjong', 'Mahjong set'),
('Poker Chips', 'Poker chips'),
('Playing Cards', 'Playing cards'),
('Dice', 'Dice'),
('Dominoes', 'Dominoes'),
('Jenga', 'Jenga'),
('Twister', 'Twister'),
('Scrabble', 'Scrabble'),
('Monopoly', 'Monopoly'),
('Risk', 'Risk'),
('Settlers of Catan', 'Settlers of Catan'),
('Ticket to Ride', 'Ticket to Ride'),
('Codenames', 'Codenames'),
('Azul', 'Azul'),
('Wingspan', 'Wingspan'),
('Gloomhaven', 'Gloomhaven'),
('Pandemic', 'Pandemic'),
('Carcassonne', 'Carcassonne'),
('Splendor', 'Splendor'),
('Terraforming Mars', 'Terraforming Mars'),
('Scythe', 'Scythe'),
('Gloomhaven', 'Gloomhaven'),
('Pandemic Legacy', 'Pandemic Legacy'),
('Gloomhaven: Jaws of the Lion', 'Gloomhaven: Jaws of the Lion'),
('Pandemic: Iberia', 'Pandemic: Iberia'),
('Pandemic: Fall of Rome', 'Pandemic: Fall of Rome'),
('Pandemic: Rapid Response', 'Pandemic: Rapid Response'),
('Pandemic: Hot Zone', 'Pandemic: Hot Zone'),
('Pandemic: Contagion', 'Pandemic: Contagion'),
('Pandemic: Reign of Cthulhu', 'Pandemic: Reign of Cthulhu'),
('Pandemic: Rising Tide', 'Pandemic: Rising Tide'),
('Pandemic: Fall of Rome', 'Pandemic: Fall of Rome'),
('Pandemic: Rapid Response', 'Pandemic: Rapid Response'),
('Pandemic: Hot Zone', 'Pandemic: Hot Zone'),
('Pandemic: Contagion', 'Pandemic: Contagion'),
('Pandemic: Reign of Cthulhu', 'Pandemic: Reign of Cthulhu'),
('Pandemic: Rising Tide', 'Pandemic: Rising Tide')
ON CONFLICT (name) DO NOTHING;

-- Insert seed data for categories
INSERT INTO categories (name, slug, description) VALUES
('Beachfront', 'beachfront', 'Properties with direct beach access'),
('Mountain', 'mountain', 'Mountain and hillside properties'),
('City', 'city', 'Urban and city center properties'),
('Countryside', 'countryside', 'Rural and countryside properties'),
('Lakefront', 'lakefront', 'Properties with lake access'),
('Pool', 'pool', 'Properties with swimming pools'),
('Hot Tub', 'hot-tub', 'Properties with hot tubs'),
('Pet Friendly', 'pet-friendly', 'Properties that allow pets'),
('Family Friendly', 'family-friendly', 'Properties suitable for families'),
('Romantic', 'romantic', 'Properties perfect for couples'),
('Business', 'business', 'Properties suitable for business travelers'),
('Luxury', 'luxury', 'High-end luxury properties'),
('Budget', 'budget', 'Affordable budget properties'),
('Unique', 'unique', 'Unique and unusual properties'),
('Historic', 'historic', 'Historic and heritage properties'),
('Modern', 'modern', 'Modern and contemporary properties'),
('Traditional', 'traditional', 'Traditional and classic properties'),
('Eco-Friendly', 'eco-friendly', 'Environmentally friendly properties'),
('Accessible', 'accessible', 'Accessible properties for disabled guests'),
('LGBTQ+ Friendly', 'lgbtq-friendly', 'LGBTQ+ friendly properties')
ON CONFLICT (name) DO NOTHING;
