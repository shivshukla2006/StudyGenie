from fastapi.testclient import TestClient
import inspect

print("--- TestClient.__init__ signature ---")
try:
    print(inspect.signature(TestClient.__init__))
except Exception as e:
    print("Error inspecting TestClient:", e)
