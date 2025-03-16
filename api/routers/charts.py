from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
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

# Chart models
class ChartCreate(BaseModel):
    user_id: str
    chart_data: Dict[str, Any]

class ChartResponse(BaseModel):
    id: str
    user_id: str
    chart_data: Dict[str, Any]
    created_at: Optional[str] = None

class WorkplaceTip(BaseModel):
    tip: str
    category: str

@router.post("/", response_model=ChartResponse)
async def create_chart(request: ChartCreate, supabase: Client = Depends(get_supabase)):
    try:
        # Check if chart already exists for user
        existing = supabase.table("charts").select("*").eq("user_id", request.user_id).execute()
        
        if existing.data and len(existing.data) > 0:
            # Update existing chart
            response = supabase.table("charts").update({"chart_data": request.chart_data}).eq("id", existing.data[0]["id"]).execute()
        else:
            # Create new chart
            response = supabase.table("charts").insert({
                "user_id": request.user_id,
                "chart_data": request.chart_data
            }).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save chart"
            )
        
        return response.data[0]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save chart: {str(e)}"
        )

@router.get("/{user_id}", response_model=ChartResponse)
async def get_chart(user_id: str, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("charts").select("*").eq("user_id", user_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chart not found"
            )
        
        return response.data[0]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get chart: {str(e)}"
        )

@router.get("/{user_id}/tips", response_model=List[WorkplaceTip])
async def get_workplace_tips(user_id: str, supabase: Client = Depends(get_supabase)):
    try:
        # First get the user's chart
        chart_response = supabase.table("charts").select("*").eq("user_id", user_id).execute()
        
        if not chart_response.data or len(chart_response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chart not found"
            )
        
        chart_data = chart_response.data[0]["chart_data"]
        
        # Generate tips based on chart data
        # This is a simplified version - in a real app, you might use more sophisticated logic
        # or even call an AI service to generate personalized tips
        tips = [
            WorkplaceTip(
                tip="Set aside time each week to engage in activities you're passionate about",
                category="passion"
            ),
            WorkplaceTip(
                tip="Look for opportunities to apply your strongest skills in new contexts",
                category="profession"
            ),
            WorkplaceTip(
                tip="Connect your daily work to its broader impact on others",
                category="mission"
            ),
            WorkplaceTip(
                tip="Identify ways to monetize skills you enjoy using",
                category="vocation"
            ),
            WorkplaceTip(
                tip="Share your ikigai insights with your team to foster better collaboration",
                category="teamwork"
            ),
        ]
        
        return tips
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get workplace tips: {str(e)}"
        )
