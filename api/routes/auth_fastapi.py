from fastapi import APIRouter, HTTPException
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
class TokenRequest(BaseModel):
    token: str

class UpdateProfileRequest(BaseModel):
    token: str
    username: str
    avatar_url: str

class UserResponse(BaseModel):
    success: bool
    user: Optional[Dict[str, Any]] = None
    message: Optional[str] = None

@router.post("/validate-token", response_model=UserResponse)
async def validate_token(request: TokenRequest):
    """Validate a Supabase JWT token"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        # Get user data from token
        user = supabase.auth.get_user(request.token)
        
        if not user:
            return {"success": False, "message": "Invalid token"}
        
        return {"success": True, "user": user.dict()}
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.post("/update-profile", response_model=UserResponse)
async def update_profile(request: UpdateProfileRequest):
    """Update user profile information"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        # Get user data from token
        user = supabase.auth.get_user(request.token)
        
        if not user:
            return {"success": False, "message": "Invalid token"}
        
        # Update user profile in Supabase
        result = supabase.from_('profiles').update({
            'username': request.username,
            'avatar_url': request.avatar_url
        }).eq('id', user.user.id).execute()
        
        return {"success": True, "user": user.dict()}
    except Exception as e:
        return {"success": False, "message": str(e)}
