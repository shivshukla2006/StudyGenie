import requests

url = "http://localhost:8000/chat"
payload = {
    "messages": [
        {"role": "user", "content": "Say 'Magic is happening!'"}
    ]
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
