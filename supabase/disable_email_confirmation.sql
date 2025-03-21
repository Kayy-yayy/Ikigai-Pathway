-- Disable email confirmation requirement in Supabase Auth
-- For Supabase version 2.x+
UPDATE auth.identities
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Mark all existing users as confirmed
UPDATE auth.users
SET confirmed_at = NOW()
WHERE confirmed_at IS NULL;

-- For any users with email_change_token, confirm those as well
UPDATE auth.users
SET email_change_confirm_status = 0,
    email_confirmed_at = NOW()
WHERE email_change_token IS NOT NULL;
