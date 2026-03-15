print("1. Loading imports...")
from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.dirname(__file__))

print("2. Importing app from main...")
from main import app

print("3. Initializing TestClient...")
client = TestClient(app)

print("4. Executing GET /...")
res = client.get("/")
print(f"5. Result: {res.status_code}")
print(res.json())
