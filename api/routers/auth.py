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

# Auth models
class SignUpRequest(BaseModel):
    email: str
    password: str
    username: str
    avatar_id: str

class SignInRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user_id: str

@router.post("/signup", response_model=AuthResponse)
async def sign_up(request: SignUpRequest, supabase: Client = Depends(get_supabase)):
    try:
        # Sign up user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )
        
        user_id = auth_response.user.id
        
        # Create profile in the profiles table
        avatar_filename = request.avatar_id
        avatar_url = f"/images/avatar images/{avatar_filename}.jpg"
        
        profile_data = {
            "id": user_id,
            "email": request.email,
            "username": request.username,
            "avatar_url": avatar_url,
            "avatar_id": request.avatar_id
        }
        
        profile_response = supabase.table("profiles").insert(profile_data).execute()
        
        if hasattr(profile_response, 'error') and profile_response.error:
            # If profile creation fails, we should delete the auth user
            supabase.auth.admin.delete_user(user_id)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create profile: {profile_response.error.message}"
            )
        
        return AuthResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            user_id=user_id
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sign up failed: {str(e)}"
        )

@router.post("/signin", response_model=AuthResponse)
async def sign_in(request: SignInRequest, supabase: Client = Depends(get_supabase)):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        return AuthResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            user_id=auth_response.user.id
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Sign in failed: {str(e)}"
        )

@router.post("/signout")
async def sign_out(supabase: Client = Depends(get_supabase)):
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully signed out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sign out failed: {str(e)}"
        )
