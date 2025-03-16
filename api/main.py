from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import google.generativeai as genai
from supabase import create_client, Client

from routers import auth, profiles, responses, charts

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase environment variables")

supabase: Client = create_client(supabase_url, supabase_key)

# Initialize Google Gemini API
gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)

# Create FastAPI app
app = FastAPI(
    title="Ikigai Pathway API",
    description="Backend API for the Ikigai Pathway application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(profiles.router, prefix="/profiles", tags=["User Profiles"])
app.include_router(responses.router, prefix="/responses", tags=["User Responses"])
app.include_router(charts.router, prefix="/charts", tags=["Ikigai Charts"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Ikigai Pathway API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# AI suggestion endpoint
class SuggestionRequest(BaseModel):
    text: str
    pillar: str

class SuggestionResponse(BaseModel):
    suggestions: List[str]

@app.post("/ai/suggestions", response_model=SuggestionResponse)
async def get_suggestions(request: SuggestionRequest):
    if not gemini_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service is not configured"
        )
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"""
        The user is filling out a section about their ikigai (life purpose) related to the pillar: {request.pillar}.
        They wrote: "{request.text}"
        
        Based on what they wrote, suggest 3 clarifying words or phrases that might help them articulate their thoughts better.
        Each suggestion should be concise (1-3 words) and directly related to what they wrote.
        Return only the suggestions as a comma-separated list, nothing else.
        """
        
        response = model.generate_content(prompt)
        suggestions = [s.strip() for s in response.text.split(',')]
        return SuggestionResponse(suggestions=suggestions[:3])  # Limit to 3 suggestions
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating suggestions: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
