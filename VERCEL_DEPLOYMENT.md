# Deploying Ikigai Pathway to Vercel

This guide will walk you through deploying your Ikigai Pathway application on Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
- Git repository with your project (GitHub, GitLab, or Bitbucket)
- Supabase project (your existing one)

## Deployment Steps

### 1. Prepare Your Environment Variables

You'll need to set up the following environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_API_URL`: URL to your API (set this to `/api` for the integrated deployment)
- `SUPABASE_URL`: Same as NEXT_PUBLIC_SUPABASE_URL
- `SUPABASE_KEY`: Your Supabase service role key (keep this secret!)
- `GEMINI_API_KEY`: Your Google Gemini API key

### 2. Deploy Your Project to Vercel (Monorepo Approach)

1. Push your project to a Git repository if you haven't already
2. Log in to your Vercel account
3. Click "Add New" > "Project"
4. Import your Git repository
5. Configure the project:
   - Framework Preset: Other
   - Root Directory: `.` (the repository root)
   - Build Command: Leave empty (configured in vercel.json)
   - Output Directory: Leave empty (configured in vercel.json)
6. Add the environment variables from step 1
7. Click "Deploy"

The monorepo configuration in your `vercel.json` file will handle both the frontend and API deployment in a single project.

### 3. Verify Your Deployment

After deployment:

1. Visit your deployed URL to verify the frontend is working
2. Test API endpoints by accessing `https://your-vercel-app.vercel.app/api/health`
3. Ensure all functionality works correctly

## Troubleshooting

### "No such file or directory" Error

If you see an error like `cd: frontend: No such file or directory` during deployment:

1. Make sure you've selected the correct root directory in Vercel
2. Verify that your `vercel.json` file is correctly configured for your repository structure
3. Check that all paths in your configuration files are correct

### API Connection Issues

If your frontend can't connect to your API:

1. Check that `NEXT_PUBLIC_API_URL` is set to `/api` for the integrated deployment
2. Verify that the API routes in `vercel.json` are correctly configured
3. Check the Vercel deployment logs for any API-specific errors

### CORS Issues

If you encounter CORS errors:

1. Verify that your API's CORS settings include your Vercel domain
2. Check that the `origins` array in your API's CORS configuration includes all necessary domains

## Additional Resources

- [Vercel Monorepo Documentation](https://vercel.com/docs/concepts/monorepos)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
