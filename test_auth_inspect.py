import inspect
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

client = create_client(url, key)

print("--- supabase.auth.get_user signature ---")
try:
    print(inspect.signature(client.auth.get_user))
except Exception as e:
    print("Error inspecting get_user:", e)

print("\n--- supabase.auth.set_session signature ---")
try:
    print(inspect.signature(client.auth.set_session))
except Exception as e:
    print("Error inspecting set_session:", e)
    
print("\n--- Available on auth ---")
print([m for m in dir(client.auth) if not m.startswith("_")])
