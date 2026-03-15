import requests
import os
from dotenv import load_dotenv
from supabase import create_client

# Try loading from backend/.env and root .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "backend", ".env"))

def test_phase6():
    url = os.getenv("VITE_SUPABASE_URL")
    key = os.getenv("VITE_SUPABASE_ANON_KEY")
    if not url or not key:
        print("Missing Supabase credentials in .env")
        return
        
    supabase = create_client(url, key)
    
    try:
        # 1. Create a test user for auth triggers
        import random
        test_email = f"test_{random.randint(1000,9999)}@example.com"
        print(f"Creating test user: {test_email}")
        auth = supabase.auth.sign_up({
            "email": test_email,
            "password": "testpassword123"
        })
        
        if not auth.user:
            print("Failed to create test user.")
            return
            
        user_id = auth.user.id
        print(f"User created with ID: {user_id}")
        
        # 2. Test /upload Endpoint
        upload_url = "http://localhost:8000/upload"
        files = {'file': ('test_material.txt', b'Optimal studying involves breaking down concepts into small, digestable notes.')}
        data = {'user_id': user_id}
        
        print("\nUploading test file...")
        response = requests.post(upload_url, files=files, data=data)
        print(f"[POST /upload] Status: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_phase6()
