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
- `NEXT_PUBLIC_API_URL`: URL to your API (we'll set this after initial deployment)
- `SUPABASE_URL`: Same as NEXT_PUBLIC_SUPABASE_URL
- `SUPABASE_KEY`: Your Supabase service role key (keep this secret!)
- `GEMINI_API_KEY`: Your Google Gemini API key

### 2. Deploy Your Frontend to Vercel

1. Push your project to a Git repository if you haven't already
2. Log in to your Vercel account
3. Click "Add New" > "Project"
4. Import your Git repository
5. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add the environment variables from step 1
7. Click "Deploy"

### 3. Deploy Your API as a Separate Service

#### Option 1: Deploy API to Vercel Serverless Functions

1. Create a new Vercel project for your API
2. Configure the project:
   - Root Directory: `api`
   - Build Command: `pip install -r requirements.txt`
   - Output Directory: `.`
3. Add all the required environment variables
4. Click "Deploy"
5. After deployment, update the `NEXT_PUBLIC_API_URL` in your frontend project to point to this API URL

#### Option 2: Deploy API to a Separate Service (Railway, Render, etc.)

1. Deploy your FastAPI application to your preferred hosting service
2. Make sure to set all the required environment variables
3. Update the `NEXT_PUBLIC_API_URL` in your frontend project to point to this API URL

### 4. Update CORS Settings

Make sure to update the CORS settings in your API to allow requests from your Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-vercel-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 5. Test Your Deployment

1. Visit your deployed frontend URL
2. Test all functionality to ensure everything works correctly
3. Check that API requests are being properly routed

## Troubleshooting

- If you encounter CORS issues, make sure your API's CORS settings include your Vercel domain
- If API requests fail, check that your `NEXT_PUBLIC_API_URL` is correctly set
- For Supabase authentication issues, verify your Supabase URL and keys are correct

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
