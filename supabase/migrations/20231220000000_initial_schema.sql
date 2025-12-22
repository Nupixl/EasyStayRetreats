-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'affiliate')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Affiliates table
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    total_earnings NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('active', 'pending', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Affiliate Links table
CREATE TABLE IF NOT EXISTS public.affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    clicks INTEGER DEFAULT 0 NOT NULL,
    referrals_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_link_id UUID REFERENCES public.affiliate_links(id) ON DELETE SET NULL,
    owner_name TEXT NOT NULL,
    owner_email TEXT NOT NULL,
    property_location TEXT NOT NULL,
    property_size TEXT NOT NULL,
    existing_links TEXT,
    ghl_opportunity_id TEXT,
    status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'contacted', 'pipeline', 'signed', 'completed', 'paid')),
    deal_amount NUMERIC(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Affiliates Policies
CREATE POLICY "Affiliates are viewable by owners and admins." ON public.affiliates FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Affiliate Links Policies
CREATE POLICY "Affiliates can manage own links." ON public.affiliate_links FOR ALL USING (affiliate_id = auth.uid());
CREATE POLICY "Links are viewable by everyone (for tracking)." ON public.affiliate_links FOR SELECT USING (true);

-- Referrals Policies
CREATE POLICY "Admins can view all referrals." ON public.referrals FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Affiliates can view own referrals." ON public.referrals FOR SELECT USING (EXISTS (SELECT 1 FROM public.affiliate_links WHERE id = referrals.affiliate_link_id AND affiliate_id = auth.uid()));

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'affiliate');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
