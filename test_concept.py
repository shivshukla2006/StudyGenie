import requests
import json

def test():
    payload = {
        "messages": [
            {"role": "user", "content": "Explain mole concept"}
        ]
    }
    try:
        response = requests.post("http://localhost:8000/chat", json=payload)
        print("Status Code:", response.status_code)
        data = response.json()
        print("\nAI Response:\n" + "="*40)
        print(data.get("response"))
        print("="*40)
    except Exception as e:
        print("Error connecting to server:", e)

if __name__ == "__main__":
    test()
