# Ikigai Pathway

A calming, visually engaging web application that guides users through a self-discovery journey to find their ikigai (life purpose) using AI-guidance. The experience mimics a mindful walk through a Zen garden, blending traditional Japanese aesthetics with playful interactivity.

## Tech Stack

- **Frontend**: Next.js with Tailwind CSS
- **Backend API**: FastAPI (Python)
- **Database & Authentication**: Supabase
- **AI Integration**: Google Gemini API
- **Deployment**: Netlify (Frontend), Vercel/Heroku/Railway (Backend)

## Features

- **User Authentication**: Sign up with email and avatar selection
- **Ikigai Journey**: Four interactive pillar modules with AI-powered suggestions
- **Dynamic Visualization**: Interactive Ikigai chart generation
- **Personalized Insights**: AI-generated workplace growth tips
- **Japanese-Inspired Design**: Calming aesthetic with traditional elements

## Project Structure

```
Ikigai-Pathway/
├── frontend/               # Next.js frontend application
│   ├── components/         # Reusable React components
│   ├── pages/              # Next.js pages
│   ├── public/             # Static assets
│   └── styles/             # CSS and Tailwind styles
├── api/                    # FastAPI backend API
│   ├── routes/             # API route definitions
│   ├── main.py             # FastAPI application entry point
│   └── utils/              # Utility functions
└── assets/                 # Shared assets
```

## Setup Instructions

### Prerequisites

- Node.js and npm (for Next.js frontend)
- Python 3.8+ (for FastAPI backend)
- Supabase account
- Google Gemini API key

### Environment Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Ikigai-Pathway.git
   cd Ikigai-Pathway
   ```

2. Create environment variables:
   - Copy `.env.example` to `.env` in the root directory
   - Fill in your Supabase and Gemini API credentials

### Frontend Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Create a virtual environment and activate it:
   ```
   cd api
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the FastAPI server with Uvicorn:
   ```
   uvicorn main:app --host 0.0.0.0 --port 5000 --reload
   ```

4. The API will be available at `http://localhost:5000`
5. Interactive API documentation is available at `http://localhost:5000/docs`

## Supabase Setup

1. Create a new Supabase project
2. Set up the following tables:

### ikigai_responses Table
```sql
CREATE TABLE ikigai_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  pillar TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pillar, question_id)
);

-- Enable RLS
ALTER TABLE ikigai_responses ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can only access their own responses"
  ON ikigai_responses
  FOR ALL
  USING (auth.uid() = user_id);
```

## Deployment

### Frontend (Netlify)

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/.next`
3. Add environment variables in the Netlify dashboard

### Backend (Heroku/Railway/Vercel)

1. Deploy the FastAPI API to your preferred platform
2. Set the environment variables
3. Update the API URL in the frontend configuration

## License

MIT

## Acknowledgements

- Inspired by the Japanese concept of Ikigai
- Built with love and mindfulness
