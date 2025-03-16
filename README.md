# Ikigai Pathway

A calming, visually engaging web application that guides users through a self-discovery journey to find their ikigai (life purpose) using AI-guidance.

## Core Vision

The experience mimics a mindful walk through a Zen garden, blending traditional Japanese aesthetics with playful interactivity, leaving users with clarity, actionable insights, and a downloadable ikigai chart, personalized workplace growth tips, and a sense of calm empowerment.

## Features

- **User Authentication**: Sign up/login with email, username, and avatar selection
- **Interactive Journey**: Guided exploration of the four ikigai pillars
- **AI-Powered Suggestions**: Smart recommendations using Google Gemini API
- **Personalized Ikigai Chart**: Dynamic Venn diagram visualization
- **Downloadable Resources**: High-resolution PNG/PDF of your ikigai chart
- **Workplace Growth Tips**: Actionable insights based on your ikigai profile

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database & Authentication**: Supabase
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ikigai-pathway.git
   cd ikigai-pathway
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../api
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Create `.env.local` in the frontend directory with:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```
   - Create `.env` in the api directory with:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_anon_key
     GEMINI_API_KEY=your_gemini_api_key
     ```

5. Set up Supabase:
   - Create tables using the SQL in `supabase_setup.sql`
   - Configure authentication providers and RLS policies

6. Run the development servers:
   - Frontend: `npm run dev` in the frontend directory
   - Backend: `uvicorn main:app --reload` in the api directory

## Project Structure

- `frontend/`: Next.js application with TypeScript and Tailwind CSS
  - `src/pages/`: Application pages including pillar modules
  - `src/components/`: Reusable UI components
  - `src/context/`: React context providers
  - `src/styles/`: Global CSS and Tailwind configuration
- `api/`: FastAPI backend
  - `main.py`: Application entry point
  - `routers/`: API route handlers
- `assets/`: Images and sounds for the application

## Deployment

This application is configured for deployment on Vercel:

1. Push the repository to GitHub
2. Connect the repository to Vercel
3. Configure the environment variables in Vercel
4. Deploy the application
