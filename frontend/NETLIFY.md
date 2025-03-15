# Deploying to Netlify

This Next.js application is configured for seamless deployment on Netlify. Follow these steps to deploy:

## Deployment Steps

1. **Connect to GitHub**
   - Push your repository to GitHub
   - Log in to Netlify and click "New site from Git"
   - Select your GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Base directory: `frontend`

3. **Environment Variables**
   - Add the following environment variables in the Netlify dashboard:
     - `NEXT_PUBLIC_API_URL`: URL of your deployed FastAPI backend
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. **Install Required Plugin**
   - Go to "Plugins" in your Netlify dashboard
   - Search for and install "@netlify/plugin-nextjs"

## Important Notes

- The `netlify.toml` file in the root directory contains the necessary configuration
- The `_redirects` file handles client-side routing
- The `.env.production` file contains production environment variables (update with your actual values)
- The `next.config.js` file is configured for Netlify deployment

## Testing Your Deployment

After deployment, verify that:
1. The frontend loads correctly
2. API calls to your backend work properly
3. Authentication with Supabase functions as expected
4. The Ikigai chart generation works
5. All pages render with the correct Japanese-inspired styling
