-- SQL Schema setup for GlobeTrotter on Supabase

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  language_preference TEXT DEFAULT 'English',
  is_admin BOOLEAN DEFAULT FALSE,
  saved_destinations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_photo TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget NUMERIC(10,2) DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  share_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Stops Table
CREATE TABLE IF NOT EXISTS public.stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  city_name TEXT NOT NULL,
  country TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  notes TEXT,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_id UUID REFERENCES public.stops(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('Sightseeing', 'Food', 'Adventure', 'Transport', 'Stay', 'Shopping')),
  cost NUMERIC(10,2) DEFAULT 0,
  duration_hours NUMERIC(4,1) DEFAULT 1,
  scheduled_time TEXT,
  day_number INT DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Cities Catalog Table
CREATE TABLE IF NOT EXISTS public.cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  cost_index TEXT NOT NULL,
  popularity_score INT DEFAULT 80,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  avg_daily_cost NUMERIC(10,2) DEFAULT 150
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- 7. Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Public trips viewable by anyone" ON public.trips FOR SELECT USING (is_public OR auth.uid() = user_id);
CREATE POLICY "Users can manage own trips" ON public.trips FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Stops viewable if trip public or owner" ON public.stops FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.trips WHERE trips.id = stops.trip_id AND (trips.is_public OR trips.user_id = auth.uid()))
);
CREATE POLICY "Users can manage stops for own trips" ON public.stops FOR ALL USING (
  EXISTS (SELECT 1 FROM public.trips WHERE trips.id = stops.trip_id AND trips.user_id = auth.uid())
);

CREATE POLICY "Activities viewable if trip public or owner" ON public.activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.trips WHERE trips.id = activities.trip_id AND (trips.is_public OR trips.user_id = auth.uid()))
);
CREATE POLICY "Users can manage activities for own trips" ON public.activities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.trips WHERE trips.id = activities.trip_id AND trips.user_id = auth.uid())
);

CREATE POLICY "Cities readable by all" ON public.cities FOR SELECT USING (true);
