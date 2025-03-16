from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
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

# Profile models
class ProfileResponse(BaseModel):
    id: str
    email: str
    username: str
    avatar_url: str
    avatar_id: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    username: Optional[str] = None
    avatar_id: Optional[str] = None

@router.get("/{user_id}", response_model=ProfileResponse)
async def get_profile(user_id: str, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("profiles").select("*").eq("id", user_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        return response.data[0]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get profile: {str(e)}"
        )

@router.patch("/{user_id}", response_model=ProfileResponse)
async def update_profile(
    user_id: str, 
    request: ProfileUpdateRequest, 
    supabase: Client = Depends(get_supabase)
):
    try:
        # Prepare update data
        update_data = {}
        if request.username is not None:
            update_data["username"] = request.username
        
        if request.avatar_id is not None:
            update_data["avatar_id"] = request.avatar_id
            update_data["avatar_url"] = f"/images/avatar images/{request.avatar_id}.jpg"
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )
        
        # Update the profile
        update_data["updated_at"] = "now()"  # Use Supabase's now() function
        
        response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        return response.data[0]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )
