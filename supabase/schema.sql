-- ==============================================================================
-- BorrowBuddy Database Schema — UPDATE 2: Indian Rupee (₹) & Campus Localisation
-- Supabase (PostgreSQL) Schema with Row Level Security & Triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
-- Permits seed profiles and links automatically with Supabase auth users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  initials TEXT,
  avatar_color TEXT DEFAULT '#4338CA',
  course TEXT DEFAULT 'B.Tech Student',
  university_email TEXT NOT NULL,
  verified_email BOOLEAN DEFAULT false,
  trust_score INTEGER DEFAULT 85 CHECK (trust_score >= 0 AND trust_score <= 100),
  on_time_returns INTEGER DEFAULT 0,
  avg_condition NUMERIC DEFAULT 5.0,
  completed_borrows INTEGER DEFAULT 0,
  completed_lends INTEGER DEFAULT 0,
  member_since TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ITEMS TABLE (with 16 Indian student categories & 8 campus zones)
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'calculators',
    'lab-coats',
    'books',
    'chargers',
    'adapters',
    'power-banks',
    'laptops',
    'headphones',
    'electronics',
    'umbrellas',
    'sports',
    'tools',
    'kitchen',
    'stationery',
    'hostel-essentials',
    'cameras'
  )),
  condition TEXT NOT NULL CHECK (condition IN ('Excellent', 'Good', 'Fair')),
  description TEXT NOT NULL,
  rules TEXT[] DEFAULT '{}',
  campus TEXT NOT NULL CHECK (campus IN (
    'Central Library',
    'Science Block',
    'Boys Hostel',
    'Girls Hostel',
    'Sports Complex',
    'Engineering Block',
    'Student Activity Centre',
    'Canteen Court'
  )),
  distance_km NUMERIC DEFAULT 0.5,
  max_duration_days INTEGER DEFAULT 7,
  suggested_duration_days INTEGER DEFAULT 3,
  deposit_inr INTEGER DEFAULT 0 CHECK (deposit_inr >= 0),
  daily_rate_inr INTEGER DEFAULT 0 CHECK (daily_rate_inr >= 0),
  min_trust_required INTEGER DEFAULT 0 CHECK (min_trust_required >= 0 AND min_trust_required <= 100),
  available BOOLEAN DEFAULT true,
  available_from TIMESTAMPTZ DEFAULT NOW(),
  pickup_method TEXT DEFAULT 'Campus meetup',
  rating NUMERIC DEFAULT 5.0,
  borrow_count INTEGER DEFAULT 0,
  image_seed INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BORROW_REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.borrow_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  borrower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  borrow_date TEXT NOT NULL,
  return_date TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'pickup_arranged', 'returned', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS public.activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  issue_type TEXT NOT NULL,
  item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrow_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ITEMS POLICIES
DROP POLICY IF EXISTS "Items are viewable by everyone" ON public.items;
CREATE POLICY "Items are viewable by everyone"
  ON public.items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own items" ON public.items;
CREATE POLICY "Users can insert own items"
  ON public.items FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own items" ON public.items;
CREATE POLICY "Users can update own items"
  ON public.items FOR UPDATE
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own items" ON public.items;
CREATE POLICY "Users can delete own items"
  ON public.items FOR DELETE
  USING (auth.uid() = owner_id);

-- BORROW REQUESTS POLICIES
DROP POLICY IF EXISTS "Users can view requests they are involved in" ON public.borrow_requests;
CREATE POLICY "Users can view requests they are involved in"
  ON public.borrow_requests FOR SELECT
  USING (auth.uid() = borrower_id OR auth.uid() = lender_id);

DROP POLICY IF EXISTS "Borrowers can create requests" ON public.borrow_requests;
CREATE POLICY "Borrowers can create requests"
  ON public.borrow_requests FOR INSERT
  WITH CHECK (auth.uid() = borrower_id);

DROP POLICY IF EXISTS "Involved users can update requests" ON public.borrow_requests;
CREATE POLICY "Involved users can update requests"
  ON public.borrow_requests FOR UPDATE
  USING (auth.uid() = lender_id OR auth.uid() = borrower_id);

-- ACTIVITY POLICIES
DROP POLICY IF EXISTS "Activity viewable by everyone" ON public.activity;
CREATE POLICY "Activity viewable by everyone"
  ON public.activity FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert activity" ON public.activity;
CREATE POLICY "Users can insert activity"
  ON public.activity FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- REPORTS POLICIES
DROP POLICY IF EXISTS "Anyone can submit a report" ON public.reports;
CREATE POLICY "Anyone can submit a report"
  ON public.reports FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  raw_name TEXT;
  user_initials TEXT;
  is_verified BOOLEAN;
  chosen_color TEXT;
  colors TEXT[] := ARRAY['#4338CA', '#0D9488', '#FF6B4A', '#7C3AED', '#2563EB', '#059669', '#D97706'];
BEGIN
  raw_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  user_initials := UPPER(substring(raw_name FROM 1 FOR 1) || COALESCE(substring(split_part(raw_name, ' ', 2) FROM 1 FOR 1), ''));

  -- University / College domain check (.edu, .edu.in, .ac.in, .ac.*, university, college, institute)
  is_verified := (NEW.email ~* '(\.edu|\.edu\.in|\.ac\.in|\.ac\.[a-z]+|university|college|institute)');
  chosen_color := colors[1 + floor(random() * array_length(colors, 1))::integer];

  INSERT INTO public.profiles (
    id,
    name,
    initials,
    avatar_color,
    course,
    university_email,
    verified_email,
    trust_score,
    on_time_returns,
    avg_condition,
    completed_borrows,
    completed_lends,
    member_since
  ) VALUES (
    NEW.id,
    raw_name,
    user_initials,
    chosen_color,
    'Student Member',
    NEW.email,
    is_verified,
    CASE WHEN is_verified THEN 90 ELSE 85 END,
    0,
    5.0,
    0,
    0,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    university_email = EXCLUDED.university_email;

  -- Log initial activity
  INSERT INTO public.activity (user_id, type, text)
  VALUES (NEW.id, 'join', raw_name || ' joined BorrowBuddy');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
