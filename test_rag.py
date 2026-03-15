import requests
import uuid
import os
import time
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def run_test():
    email = f"test_rag_{uuid.uuid4().hex[:4]}@example.com"
    password = "password123"
    
    print(f"1. Creating test user: {email}")
    try:
        user_res = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        user_id = user_res.user.id
        print(f"   User created with ID: {user_id}")
    except Exception as e:
        print(f"Failed to create user: {e}")
        return

    # Use authenticated client for standard inserts
    auth_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    auth_client.auth.sign_in_with_password({"email": email, "password": password})
    
    # 2. Upload file via /upload (Mocked as text)
    upload_url = "http://localhost:8000/upload"
    unique_fact = "StudyGenie's highly classified main server core is located inside a secure bunker buried deep beneath Mount Everest."
    
    print("2. Uploading content to /upload...")
    files = {'file': ('rag_secrets.txt', unique_fact.encode('utf-8'))}
    data = {'user_id': user_id}
    
    try:
        up_res = requests.post(upload_url, files=files, data=data)
        print(f"   Status: {up_res.status_code}")
        up_data = up_res.json()
        print(f"   Response Success: {up_data.get('success')}")
        
        # 3. Insert Row into documents table
        print("3. Inserting document row...")
        doc_res = auth_client.table("documents").insert({
            "user_id": user_id,
            "name": "rag_secrets.txt",
            "file_url": up_data["url"],
            "file_type": "txt",
            "size_bytes": len(unique_fact.encode('utf-8'))
        }).execute()
        document_id = doc_res.data[0]["id"]
        print(f"   Document ID: {document_id}")
        
        # 4. Trigger /embed index creation
        print("4. Triggering /embed coordinate indexing...")
        embed_url = "http://localhost:8000/embed"
        embed_res = requests.post(embed_url, json={
            "document_id": document_id,
            "content": unique_fact
        })
        print(f"   Embedding Response: {embed_res.text}")
        
        # 5. Call /chat with absolute contextual question
        print("5. Querying /chat with related prompt...")
        chat_url = "http://localhost:8000/chat"
        # Since standard structure requires matching history, pass a single message
        chat_payload = {
            "messages": [
                {"role": "user", "content": "Where is the secret classified server core of StudyGenie located?"}
            ]
        }
        chat_res = requests.post(chat_url, json=chat_payload)
        print("\n=== AI RESPONSE OVER RAG context ===")
        print(chat_res.json().get("response"))
        print("=====================================")
        
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    run_test()
