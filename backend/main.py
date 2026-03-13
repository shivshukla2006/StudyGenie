from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="../.env")

app = FastAPI(title="StudyGenie API", description="Backend for StudyGenie EdTech platform")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase Admin Client (for backend operations)
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY") # Consider using service_role key for backend admin tasks later

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    print("Warning: Supabase credentials not found in environment.")

@app.get("/")
def read_root():
    return {"message": "Welcome to StudyGenie API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}
