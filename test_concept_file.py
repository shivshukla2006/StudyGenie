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
        data = response.json()
        with open("d:\\StudyGenie\\test_output.txt", "w", encoding="utf-8") as f:
            f.write(data.get("response", ""))
        print("Done writing response to test_output.txt")
    except Exception as e:
        print("Error connecting to server:", e)

if __name__ == "__main__":
    test()
