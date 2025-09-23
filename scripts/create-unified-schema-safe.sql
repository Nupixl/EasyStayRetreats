-- Safe Unified Properties Schema Creation
-- This script handles existing tables and creates the unified schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS property_hosts CASCADE;
DROP TABLE IF EXISTS property_amenities CASCADE;
DROP TABLE IF EXISTS property_categories CASCADE;
DROP TABLE IF EXISTS property_reviews CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS hosts CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- Create the unified properties table (based on App-Properties structure)
CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  rating DECIMAL(2,1),
  review_count INTEGER DEFAULT 0,
  location TEXT,
  price DECIMAL(10,2),
  about TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional fields from App-Properties
  name TEXT,
  city TEXT,
  price_starts_at DECIMAL(10,2),
  body_description TEXT,
  card_image TEXT,
  whalesync_postgres_id TEXT,
  property_rating DECIMAL(2,1),
  total_reviews INTEGER DEFAULT 0,
  created TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_images table
CREATE TABLE property_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hosts table
CREATE TABLE hosts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  profile_image_url TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_hosts (junction table for properties and hosts)
CREATE TABLE property_hosts (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  host_id UUID REFERENCES hosts(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, host_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_profile_image_url TEXT,
  review_text TEXT NOT NULL,
  rating DECIMAL(2,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create amenities table
CREATE TABLE amenities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_amenities (junction table for properties and amenities)
CREATE TABLE property_amenities (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_categories (junction table for properties and categories)
CREATE TABLE property_categories (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, category_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_reviews table (for the relationship that was causing issues)
CREATE TABLE property_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_profile_image_url TEXT,
  review_text TEXT NOT NULL,
  rating DECIMAL(2,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) for properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON properties FOR SELECT USING (TRUE);

-- RLS for property_images table
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_images FOR SELECT USING (TRUE);

-- RLS for hosts table
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON hosts FOR SELECT USING (TRUE);

-- RLS for property_hosts table
ALTER TABLE property_hosts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_hosts FOR SELECT USING (TRUE);

-- RLS for reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON reviews FOR SELECT USING (TRUE);

-- RLS for property_reviews table
ALTER TABLE property_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_reviews FOR SELECT USING (TRUE);

-- RLS for amenities table
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON amenities FOR SELECT USING (TRUE);

-- RLS for property_amenities table
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_amenities FOR SELECT USING (TRUE);

-- RLS for categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (TRUE);

-- RLS for property_categories table
ALTER TABLE property_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON property_categories FOR SELECT USING (TRUE);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for properties table
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_rating ON properties(rating);
CREATE INDEX IF NOT EXISTS idx_properties_coordinates ON properties(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_property_id ON property_reviews(property_id);
