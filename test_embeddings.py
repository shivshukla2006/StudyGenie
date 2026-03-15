import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def test_embed():
    try:
        print("Testing OpenRouter embeddings...")
        response = client.embeddings.create(
            model="openai/text-embedding-3-small", 
            input="Optimal studying involves breaking down concepts"
        )
        print("Success! Dimensions:", len(response.data[0].embedding))
    except Exception as e:
        print("Failed:", e)

if __name__ == "__main__":
    test_embed()
