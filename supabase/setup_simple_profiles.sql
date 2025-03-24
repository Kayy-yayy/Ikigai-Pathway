-- Create a table for simple user profiles without authentication
CREATE TABLE IF NOT EXISTS public.simple_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  avatar_id TEXT,
  has_completed_questions BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.simple_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous access (since we're not using authentication)
CREATE POLICY "Allow anonymous access to simple_profiles"
  ON public.simple_profiles
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.simple_profiles TO anon, authenticated, service_role;
