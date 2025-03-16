-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    username TEXT,
    avatar_url TEXT,
    avatar_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Create responses table
CREATE TABLE IF NOT EXISTS public.responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    pillar TEXT NOT NULL,
    question_id TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security for responses
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Create policies for responses
CREATE POLICY "Users can view their own responses" 
    ON public.responses 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses" 
    ON public.responses 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create charts table
CREATE TABLE IF NOT EXISTS public.charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    chart_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security for charts
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;

-- Create policies for charts
CREATE POLICY "Users can view their own charts" 
    ON public.charts 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own charts" 
    ON public.charts 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'username', '');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
