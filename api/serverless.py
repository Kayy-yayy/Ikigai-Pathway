from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from mangum import Mangum

# Import your existing app modules
from main import app as main_app

# Create handler for serverless
handler = Mangum(main_app)
