import requests
import json
import time

def test_rate_limit():
    url = "http://localhost:8001/chat"
    payload = {
        "messages": [
            {"role": "user", "content": "Hello"}
        ]
    }
    
    print("Testing Rate Limit (5/minute)...")
    success_count = 0
    trigger_count = 0
    for i in range(7):
        try:
            response = requests.post(url, json=payload)
            print(f"Request {i+1}: Status {response.status_code}")
            if response.status_code == 200:
                success_count += 1
            elif response.status_code == 429:
                trigger_count += 1
                print("🚨 Rate limit triggered (429)")
        except Exception as e:
            print(f"Request {i+1} failed: {e}")
        time.sleep(0.5)
    
    print(f"\nSummary: {success_count} Successes, {trigger_count} Rate Limits")

if __name__ == "__main__":
    test_rate_limit()
