from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import os
from supabase import create_client, Client

# Configure Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

router = APIRouter()

# Define Pydantic models
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

@router.post("/save-response", response_model=BaseResponse)
async def save_response(request: SaveResponseRequest):
    """Save a user's response to an ikigai question"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    if not all([request.user_id, request.pillar, request.question_id, request.response]):
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    try:
        # Check if response already exists
        existing = supabase.table('ikigai_responses').select('*').eq('user_id', request.user_id).eq('pillar', request.pillar).eq('question_id', request.question_id).execute()
        
        if existing.data:
            # Update existing response
            result = supabase.table('ikigai_responses').update({'response': request.response}).eq('id', existing.data[0]['id']).execute()
        else:
            # Insert new response
            result = supabase.table('ikigai_responses').insert({
                'user_id': request.user_id,
                'pillar': request.pillar,
                'question_id': request.question_id,
                'response': request.response
            }).execute()
        
        return {"success": True}
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.get("/get-responses", response_model=GetResponsesResponse)
async def get_responses(user_id: str = Query(..., description="User ID to get responses for")):
    """Get all ikigai responses for a user"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    try:
        result = supabase.table('ikigai_responses').select('*').eq('user_id', user_id).execute()
        
        # Group responses by pillar
        grouped_responses = {}
        for item in result.data:
            pillar = item['pillar']
            if pillar not in grouped_responses:
                grouped_responses[pillar] = []
            
            grouped_responses[pillar].append(item['response'])
        
        return {
            "success": True,
            "responses": grouped_responses
        }
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.get("/get-pillar-responses", response_model=GetPillarResponsesResponse)
async def get_pillar_responses(
    user_id: str = Query(..., description="User ID to get responses for"),
    pillar: str = Query(..., description="Pillar to get responses for")
):
    """Get responses for a specific pillar for a user"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    if not user_id or not pillar:
        raise HTTPException(status_code=400, detail="User ID and pillar are required")
    
    try:
        result = supabase.table('ikigai_responses').select('*').eq('user_id', user_id).eq('pillar', pillar).execute()
        
        return {
            "success": True,
            "responses": [item['response'] for item in result.data]
        }
    except Exception as e:
        return {"success": False, "message": str(e)}
