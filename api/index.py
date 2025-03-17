from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from mangum import Mangum
import sys

# Add the current directory to the path so that local modules can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import from the main app
from api.main import app

# Create handler for Vercel serverless function
handler = Mangum(app)
