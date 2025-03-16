from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import os
from supabase import Client, create_client

router = APIRouter()

# Get Supabase client
def get_supabase() -> Client:
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase configuration missing"
        )
    
    return create_client(supabase_url, supabase_key)

# Response models
class ResponseCreate(BaseModel):
    user_id: str
    pillar: str
    question_id: str
    response: str

class ResponseResponse(BaseModel):
    id: str
    user_id: str
    pillar: str
    question_id: str
    response: str
    created_at: Optional[str] = None

class ResponsesRequest(BaseModel):
    user_id: str
    pillar: Optional[str] = None

@router.post("/", response_model=ResponseResponse)
async def create_response(request: ResponseCreate, supabase: Client = Depends(get_supabase)):
    try:
        # Check if response already exists
        existing = supabase.table("responses").select("*").eq("user_id", request.user_id).eq("pillar", request.pillar).eq("question_id", request.question_id).execute()
        
        if existing.data and len(existing.data) > 0:
            # Update existing response
            response = supabase.table("responses").update({"response": request.response}).eq("id", existing.data[0]["id"]).execute()
        else:
            # Create new response
            response = supabase.table("responses").insert({
                "user_id": request.user_id,
                "pillar": request.pillar,
                "question_id": request.question_id,
                "response": request.response
            }).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save response"
            )
        
        return response.data[0]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save response: {str(e)}"
        )

@router.get("/", response_model=List[ResponseResponse])
async def get_responses(user_id: str, pillar: Optional[str] = None, supabase: Client = Depends(get_supabase)):
    try:
        query = supabase.table("responses").select("*").eq("user_id", user_id)
        
        if pillar:
            query = query.eq("pillar", pillar)
        
        response = query.execute()
        
        return response.data
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get responses: {str(e)}"
        )

@router.delete("/{response_id}")
async def delete_response(response_id: str, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("responses").delete().eq("id", response_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Response not found"
            )
        
        return {"message": "Response deleted successfully"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete response: {str(e)}"
        )
