from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")
api_key = os.getenv("OPENROUTER_API_KEY")
print(f"API Key found: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")

try:
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key
    )
    print("Client initialized successfully")
except Exception as e:
    print(f"Error initializing client: {e}")
