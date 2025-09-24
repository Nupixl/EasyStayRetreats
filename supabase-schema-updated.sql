-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create properties table
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create images table
CREATE TABLE property_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create app_hosts table (renamed from hosts, matching Webflow App Hosts collection)
CREATE TABLE app_hosts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  card_image_url TEXT,
  hero_image_url TEXT,
  agent_location TEXT,
  short_bio TEXT,
  vacation_image_first_url TEXT,
  vacation_image_second_url TEXT,
  email TEXT,
  phone TEXT,
  instagram_link TEXT,
  facebook_link TEXT,
  linkedin_link TEXT,
  youtube_link TEXT,
  -- Host-related fields moved from App Properties
  super_host BOOLEAN DEFAULT FALSE,
  plus_host BOOLEAN DEFAULT FALSE,
  premium_host BOOLEAN DEFAULT FALSE,
  verified_host BOOLEAN DEFAULT FALSE,
  accolade_icon_url TEXT,
  host_accolades_switch BOOLEAN DEFAULT FALSE,
  host_accolade_image_switch BOOLEAN DEFAULT FALSE,
  account_owner TEXT,
  whalesync_postgres_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_hosts junction table (updated to reference app_hosts)
CREATE TABLE property_hosts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  host_id UUID REFERENCES app_hosts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_profile_image_url TEXT,
  review_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create amenities table
CREATE TABLE amenities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_amenities junction table
CREATE TABLE property_amenities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_categories junction table
CREATE TABLE property_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_location ON properties(latitude, longitude);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_rating ON properties(rating);
CREATE INDEX idx_property_images_property_id ON property_images(property_id);
CREATE INDEX idx_reviews_property_id ON reviews(property_id);
CREATE INDEX idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX idx_property_categories_property_id ON property_categories(property_id);
CREATE INDEX idx_app_hosts_slug ON app_hosts(slug);
CREATE INDEX idx_property_hosts_property_id ON property_hosts(property_id);
CREATE INDEX idx_property_hosts_host_id ON property_hosts(host_id);

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public read access for property_images" ON property_images FOR SELECT USING (true);
CREATE POLICY "Public read access for app_hosts" ON app_hosts FOR SELECT USING (true);
CREATE POLICY "Public read access for property_hosts" ON property_hosts FOR SELECT USING (true);
CREATE POLICY "Public read access for reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read access for amenities" ON amenities FOR SELECT USING (true);
CREATE POLICY "Public read access for property_amenities" ON property_amenities FOR SELECT USING (true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for property_categories" ON property_categories FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_hosts_updated_at BEFORE UPDATE ON app_hosts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

