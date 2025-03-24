-- Create a table for storing user responses to pillar questions
CREATE TABLE IF NOT EXISTS public.responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.simple_profiles(id) ON DELETE CASCADE,
  pillar TEXT NOT NULL,
  question_id TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Create a unique constraint to ensure we don't have duplicate responses
  -- for the same user and question
  UNIQUE(user_id, question_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous access (since we're not using authentication)
CREATE POLICY "Allow anonymous access to responses"
  ON public.responses
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create an index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS responses_user_id_idx ON public.responses(user_id);

-- Create an index for faster lookups by pillar
CREATE INDEX IF NOT EXISTS responses_pillar_idx ON public.responses(pillar);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_responses_updated_at
BEFORE UPDATE ON public.responses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
