from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from mangum import Mangum
import sys

# Add the current directory to the path so we can import from the local modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import your existing app
from api.main import app

# Configure CORS for Vercel deployment
origins = [
    "https://*.vercel.app",  # Allow all Vercel domains
    "https://*.now.sh",      # Legacy Vercel domains
    "http://localhost:3000", # Local development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create handler for serverless
handler = Mangum(app)
