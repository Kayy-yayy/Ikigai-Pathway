-- SQL Script to refresh Ikigai-Pathway Supabase tables
-- Run this in your Supabase SQL Editor to ensure database structure matches the application

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS public.responses;
DROP TABLE IF EXISTS public.simple_profiles;

-- Create simple_profiles table
CREATE TABLE public.simple_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    avatar_id TEXT NOT NULL, -- Stores the avatar name (e.g., "Geisha", "Ninja", "Samurai Warrior")
    has_completed_questions BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to simple_profiles table
COMMENT ON TABLE public.simple_profiles IS 'Stores user profile information without authentication';

-- Create responses table
CREATE TABLE public.responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.simple_profiles(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    pillar TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- Add comment to responses table
COMMENT ON TABLE public.responses IS 'Stores user responses to pillar questions';

-- Create index for faster queries
CREATE INDEX responses_user_id_idx ON public.responses(user_id);
CREATE INDEX responses_pillar_idx ON public.responses(pillar);

-- Set up Row Level Security (RLS) policies
ALTER TABLE public.simple_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Create policies for simple_profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.simple_profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.simple_profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" 
ON public.simple_profiles FOR UPDATE USING (true);

-- Create policies for responses
CREATE POLICY "Responses are viewable by everyone" 
ON public.responses FOR SELECT USING (true);

CREATE POLICY "Users can insert their own responses" 
ON public.responses FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own responses" 
ON public.responses FOR UPDATE USING (true);

-- Grant access to authenticated and anon users
GRANT ALL ON public.simple_profiles TO anon, authenticated;
GRANT ALL ON public.responses TO anon, authenticated;
