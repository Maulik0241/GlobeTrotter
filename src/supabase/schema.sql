-- =======================================================
-- GlobeTrotter Supabase Reset & Table Creation Schema
-- Copy and paste this entire script into your Supabase SQL Editor and click 'RUN'
-- =======================================================

-- 1. Drop existing tables with outdated UUID constraints if any exist
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.stops CASCADE;
DROP TABLE IF EXISTS public.trips CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.cities CASCADE;

-- 2. Cities Table
CREATE TABLE public.cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  cost_index TEXT NOT NULL,
  popularity_score INT DEFAULT 80,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  avg_daily_cost NUMERIC(10,2) DEFAULT 150,
  tags TEXT[] DEFAULT '{}'
);

-- 3. Activities Catalog Table
CREATE TABLE public.activities (
  id TEXT PRIMARY KEY,
  city_id TEXT,
  city_name TEXT,
  stop_id TEXT,
  trip_id TEXT,
  title TEXT NOT NULL,
  category TEXT,
  cost NUMERIC(10,2) DEFAULT 0,
  duration_hours NUMERIC(4,1) DEFAULT 1,
  scheduled_time TEXT,
  day_number INT DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Profiles Table
CREATE TABLE public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  language_preference TEXT DEFAULT 'English',
  is_admin BOOLEAN DEFAULT FALSE,
  saved_destinations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Trips Table
CREATE TABLE public.trips (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_photo TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget NUMERIC(10,2) DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  share_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Stops Table
CREATE TABLE public.stops (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  city_name TEXT NOT NULL,
  country TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  notes TEXT,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) & Public Access Policies
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for public demo" ON public.cities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for public demo" ON public.activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for public demo" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for public demo" ON public.trips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for public demo" ON public.stops FOR ALL USING (true) WITH CHECK (true);
