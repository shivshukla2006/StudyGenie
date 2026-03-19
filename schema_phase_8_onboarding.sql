-- StudyGenie Database Migration: Onboarding Fields

-- Add new columns to the `profiles` table for onboarding data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT,
ADD COLUMN IF NOT EXISTS academic_path TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS subjects JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS weak_subjects JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Note: Because RLS policies on `profiles` are already set up to allow the user to 
-- UPDATE their own profile (USING auth.uid() = id), they will inherently have permission 
-- to update these newly added columns.
