from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from mangum import Mangum

# Import main app
from main import app as main_app

# Create handler for AWS Lambda / Vercel serverless function
handler = Mangum(main_app)

# This is required for Vercel serverless deployment
app = main_app
