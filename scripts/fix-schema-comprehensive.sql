-- Comprehensive Schema Fix
-- This script addresses all the issues identified in the migration

-- 1. Fix duplicate timestamp columns and remove gallery_images
-- First, let's create a clean properties table (not unified_properties to avoid confusion)

-- Drop existing tables if they exist
DROP TABLE IF EXISTS property_categories CASCADE;
DROP TABLE IF EXISTS property_amenities CASCADE;
DROP TABLE IF EXISTS property_hosts CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS hosts CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP VIEW IF EXISTS properties_with_details CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clean properties table (single timestamp convention)
CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  rating DECIMAL(2,1),
  review_count INTEGER DEFAULT 0,
  location TEXT,
  price DECIMAL(10,2),
  about TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_images table (no gallery_images JSON field)
CREATE TABLE property_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hosts table
CREATE TABLE hosts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  profile_image_url TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_hosts junction table
CREATE TABLE property_hosts (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  host_id UUID REFERENCES hosts(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (property_id, host_id)
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to ALL tables that have the column
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_images_updated_at
    BEFORE UPDATE ON property_images
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

-- Row Level Security (RLS) - READ policies for all users
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

-- RLS - WRITE policies for authenticated users
CREATE POLICY "Enable insert for authenticated users" ON properties FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON properties FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Enable delete for authenticated users" ON properties FOR DELETE TO authenticated USING (TRUE);

CREATE POLICY "Enable insert for authenticated users" ON property_images FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON property_images FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Enable delete for authenticated users" ON property_images FOR DELETE TO authenticated USING (TRUE);

CREATE POLICY "Enable insert for authenticated users" ON hosts FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON hosts FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Enable delete for authenticated users" ON hosts FOR DELETE TO authenticated USING (TRUE);

CREATE POLICY "Enable insert for authenticated users" ON property_hosts FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON property_hosts FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Enable delete for authenticated users" ON property_hosts FOR DELETE TO authenticated USING (TRUE);

CREATE POLICY "Enable insert for authenticated users" ON reviews FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON reviews FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Enable delete for authenticated users" ON reviews FOR DELETE TO authenticated USING (TRUE);

CREATE POLICY "Enable insert for authenticated users" ON amenities FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON amenities FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Enable delete for authenticated users" ON amenities FOR DELETE TO authenticated USING (TRUE);

CREATE POLICY "Enable insert for authenticated users" ON property_amenities FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON property_amenities FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Enable delete for authenticated users" ON property_amenities FOR DELETE TO authenticated USING (TRUE);

CREATE POLICY "Enable insert for authenticated users" ON categories FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON categories FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Enable delete for authenticated users" ON categories FOR DELETE TO authenticated USING (TRUE);

CREATE POLICY "Enable insert for authenticated users" ON property_categories FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON property_categories FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Enable delete for authenticated users" ON property_categories FOR DELETE TO authenticated USING (TRUE);

-- Create indexes for performance
CREATE INDEX idx_properties_location ON properties (location);
CREATE INDEX idx_properties_latitude_longitude ON properties (latitude, longitude);
CREATE INDEX idx_property_images_property_id ON property_images (property_id);
CREATE INDEX idx_reviews_property_id ON reviews (property_id);
CREATE INDEX idx_property_hosts_property_id ON property_hosts (property_id);
CREATE INDEX idx_property_hosts_host_id ON property_hosts (host_id);
CREATE INDEX idx_property_amenities_property_id ON property_amenities (property_id);
CREATE INDEX idx_property_amenities_amenity_id ON property_amenities (amenity_id);
CREATE INDEX idx_property_categories_property_id ON property_categories (property_id);
CREATE INDEX idx_property_categories_category_id ON property_categories (category_id);

-- Create the properties_with_details view (fixed to reference correct fields)
CREATE OR REPLACE VIEW properties_with_details AS
SELECT
    p.id,
    p.title,
    p.description,
    p.rating,
    p.review_count,
    p.location,
    p.price,
    p.about,
    p.latitude,
    p.longitude,
    p.created_at,
    p.updated_at,
    (
        SELECT JSON_AGG(json_build_object('url', pi.url, 'alt_text', pi.alt_text))
        FROM property_images pi
        WHERE pi.property_id = p.id
    ) AS images,
    (
        SELECT JSON_AGG(json_build_object('id', h.id, 'name', h.name, 'profile_image_url', h.profile_image_url))
        FROM hosts h
        JOIN property_hosts ph ON h.id = ph.host_id
        WHERE ph.property_id = p.id AND ph.is_primary = TRUE
    ) AS primary_host,
    (
        SELECT JSON_AGG(json_build_object('user_name', r.user_name, 'review_text', r.review_text, 'rating', r.rating, 'created_at', r.created_at))
        FROM reviews r
        WHERE r.property_id = p.id
    ) AS property_reviews,
    (
        SELECT JSON_AGG(json_build_object('id', a.id, 'name', a.name))
        FROM amenities a
        JOIN property_amenities pa ON a.id = pa.amenity_id
        WHERE pa.property_id = p.id
    ) AS amenities,
    (
        SELECT JSON_AGG(json_build_object('id', c.id, 'name', c.name))
        FROM categories c
        JOIN property_categories pc ON c.id = pc.category_id
        WHERE pc.property_id = p.id
    ) AS categories
FROM
    properties p;
