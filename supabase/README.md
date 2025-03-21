# Supabase Email-Only Authentication Setup

This directory contains SQL scripts to set up your Supabase database for the new email-only authentication system.

## How to Apply the Database Changes

1. Log in to your Supabase dashboard: https://app.supabase.com/
2. Navigate to your project: "pmmwlizpeouugdznnmas"
3. Go to the SQL Editor (in the left sidebar)
4. Create a new query
5. Copy the contents of `setup_email_auth.sql` and paste it into the SQL editor
6. Run the query

## What This Script Does

The SQL script performs the following actions:

1. Adds avatar-related columns to the auth.users table
2. Creates or updates the profiles table to store user information
3. Sets up a trigger to automatically create a profile when a new user signs up
4. Configures Row Level Security (RLS) for the profiles table
5. Ensures email confirmation is disabled for all users (since we're using OTP)
6. Updates any existing profiles to match the new structure
7. Grants necessary permissions for authenticated users

## Verifying the Setup

After running the script, you can verify the setup by:

1. Going to the "Authentication" section in your Supabase dashboard
2. Checking the "Users" tab to see if existing users have avatar fields
3. Going to the "Table Editor" and checking if the "profiles" table exists with the correct structure

## Email Settings

For the email-only authentication to work properly, ensure your Supabase project has email configured:

1. Go to "Authentication" > "Providers" in your Supabase dashboard
2. Make sure "Email" is enabled
3. Configure the "Site URL" to match your frontend URL
4. Set up a custom email template for the OTP emails (optional)

## Testing

You can test the email authentication by:

1. Running your frontend application
2. Clicking "Begin Your Journey" on the home page
3. Entering an email address
4. Checking for the OTP email
5. Completing the authentication flow

## Troubleshooting

If you encounter issues:

- Check the browser console for error messages
- Verify that your Supabase URL and anon key are correctly set in your environment variables
- Ensure the SQL script ran without errors
- Check if your email provider is correctly set up in Supabase
