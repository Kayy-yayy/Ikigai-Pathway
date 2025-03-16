import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def test_connection():
    try:
        # Try to get a single row from the profiles table
        response = supabase.table('profiles').select('*').limit(1).execute()
        print("Connection successful!")
        print(f"Response: {response}")
        return True
    except Exception as e:
        print(f"Connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing Supabase connection...")
    print(f"Supabase URL: {supabase_url}")
    print(f"Supabase Key: {supabase_key[:10]}...")  # Only print first 10 chars for security
    
    test_connection()
