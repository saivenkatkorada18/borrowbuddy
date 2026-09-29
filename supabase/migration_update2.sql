-- ==============================================================================
-- BorrowBuddy Migration Script: Update 2 (Euro → Indian Rupee & Campuses)
-- Run this in the Supabase SQL Editor if you already applied the previous schema.
-- ==============================================================================

-- 1. Rename and convert currency columns on items table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'items' AND column_name = 'deposit_euros'
  ) THEN
    ALTER TABLE public.items RENAME COLUMN deposit_euros TO deposit_inr;
    ALTER TABLE public.items ALTER COLUMN deposit_inr TYPE INTEGER USING ROUND(deposit_inr)::integer;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'items' AND column_name = 'daily_rate_euros'
  ) THEN
    ALTER TABLE public.items RENAME COLUMN daily_rate_euros TO daily_rate_inr;
    ALTER TABLE public.items ALTER COLUMN daily_rate_inr TYPE INTEGER USING ROUND(daily_rate_inr)::integer;
  END IF;

  -- Add min_trust_required column if not present
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'items' AND column_name = 'min_trust_required'
  ) THEN
    ALTER TABLE public.items ADD COLUMN min_trust_required INTEGER DEFAULT 0 CHECK (min_trust_required >= 0 AND min_trust_required <= 100);
  END IF;
END $$;

-- 2. Update category check constraint for the 16 new categories
ALTER TABLE public.items DROP CONSTRAINT IF EXISTS items_category_check;
ALTER TABLE public.items ADD CONSTRAINT items_category_check CHECK (category IN (
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
));

-- 3. Update campus check constraint for the 8 Indian campus zones
ALTER TABLE public.items DROP CONSTRAINT IF EXISTS items_campus_check;
ALTER TABLE public.items ADD CONSTRAINT items_campus_check CHECK (campus IN (
  'Central Library',
  'Science Block',
  'Boys Hostel',
  'Girls Hostel',
  'Sports Complex',
  'Engineering Block',
  'Student Activity Centre',
  'Canteen Court'
));

-- 4. Update the automatic new user signup trigger for Indian educational domains
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

  -- Accept .edu, .edu.in, .ac.in, .ac.*, and domains containing university, college, institute
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
    'B.Tech Student',
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

  INSERT INTO public.activity (user_id, type, text)
  VALUES (NEW.id, 'join', raw_name || ' joined BorrowBuddy');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
