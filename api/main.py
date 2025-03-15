import os
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv
import google.generativeai as genai
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Configure Google Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Configure Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Initialize FastAPI app with docs URL at root level
app = FastAPI(
    title="Ikigai Pathway API", 
    description="Backend API for the Ikigai Pathway application",
    version="1.0.0",
    docs_url="/docs",  # Explicitly set docs URL
    redoc_url="/redoc",  # Explicitly set redoc URL
    openapi_url="/openapi.json"  # Explicitly set OpenAPI URL
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Define Pydantic models for request/response validation
class SuggestionRequest(BaseModel):
    input: str
    pillar: str

class SuggestionResponse(BaseModel):
    success: bool
    suggestions: List[str]
    message: Optional[str] = None

class SaveResponseRequest(BaseModel):
    user_id: str
    pillar: str
    question_id: int
    response: str

class BaseResponse(BaseModel):
    success: bool
    message: Optional[str] = None

class GetResponsesResponse(BaseModel):
    success: bool
    responses: Dict[str, List[str]]
    message: Optional[str] = None

class GetPillarResponsesResponse(BaseModel):
    success: bool
    responses: List[str]
    message: Optional[str] = None

class WorkplaceTipsRequest(BaseModel):
    responses: Dict[str, List[str]]

class WorkplaceTipsResponse(BaseModel):
    success: bool
    tips: List[str]
    message: Optional[str] = None

# API Routes
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.post("/api/suggestions", response_model=SuggestionResponse)
async def get_suggestions(request: SuggestionRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    try:
        model = genai.GenerativeModel('gemini-1.5-pro')
        prompt = f"""
        The user is exploring their ikigai (life purpose) and is answering questions about what they {request.pillar}.
        They wrote: "{request.input}"
        
        Suggest 2-3 clarifying words or phrases that might help them explore this aspect more deeply.
        Format your response as a JSON array of strings. Example: ["community building", "mentorship"]
        Keep suggestions concise (1-3 words each) and directly related to their input.
        """
        
        response = model.generate_content(prompt)
        suggestions = response.text.strip()
        
        # Clean up the response to ensure it's valid JSON
        if suggestions.startswith('```json'):
            suggestions = suggestions[7:-3]  # Remove ```json and ``` markers
        
        # Handle case where response might be a string representation of a list
        if suggestions.startswith('[') and suggestions.endswith(']'):
            import json
            suggestions = json.loads(suggestions)
        else:
            suggestions = [suggestions]
        
        return {"success": True, "suggestions": suggestions}
    except Exception as e:
        return {"success": False, "message": str(e)}

@app.post("/api/workplace-tips", response_model=WorkplaceTipsResponse)
async def get_workplace_tips(request: WorkplaceTipsRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    try:
        # Flatten responses for the prompt
        flattened_responses = {}
        for pillar, resp_list in request.responses.items():
            flattened_responses[pillar] = ", ".join(resp_list)
        
        model = genai.GenerativeModel('gemini-1.5-pro')
        prompt = f"""
        Based on the user's ikigai (life purpose) responses, generate 5-7 personalized workplace growth tips.
        
        User's responses:
        - What they love (passion): {flattened_responses.get('passion', 'N/A')}
        - What the world needs (mission): {flattened_responses.get('mission', 'N/A')}
        - What they're good at (vocation): {flattened_responses.get('vocation', 'N/A')}
        - What they can be paid for (profession): {flattened_responses.get('profession', 'N/A')}
        
        Create actionable, specific tips that help the user bring more purpose to their work life.
        Format your response as a JSON array of strings. Each tip should be 1-2 sentences.
        """
        
        response = model.generate_content(prompt)
        tips = response.text.strip()
        
        # Clean up the response to ensure it's valid JSON
        if tips.startswith('```json'):
            tips = tips[7:-3]  # Remove ```json and ``` markers
        
        # Handle case where response might be a string representation of a list
        if tips.startswith('[') and tips.endswith(']'):
            import json
            tips = json.loads(tips)
        else:
            # Fallback tips if parsing fails
            tips = [
                "Schedule time for activities you're passionate about each week.",
                "Look for opportunities to apply your natural talents in your current role.",
                "Connect with mentors who share your mission and values.",
                "Identify one small way to bring more of your ikigai into your daily work.",
                "Consider how you might create a side project that combines your passions and skills."
            ]
        
        return {"success": True, "tips": tips}
    except Exception as e:
        return {"success": False, "message": str(e)}

# Import and include Ikigai routes
try:
    from routes.ikigai_fastapi import router as ikigai_router
    app.include_router(ikigai_router, prefix="/api/ikigai")
except ImportError:
    print("Warning: ikigai_fastapi router not found")

# Import and include Auth routes
try:
    from routes.auth_fastapi import router as auth_router
    app.include_router(auth_router, prefix="/api/auth")
except ImportError:
    print("Warning: auth_fastapi router not found")

# For Vercel serverless deployment
app_handler = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
