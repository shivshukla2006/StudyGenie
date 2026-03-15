import requests

BASE_URL = "http://localhost:8000"

def test_endpoint(path: str, method="GET", json_payload=None):
    print(f"Testing {method} {path}...")
    try:
        url = f"{BASE_URL}{path}"
        if method == "GET":
            res = requests.get(url)
        else:
            res = requests.post(url, json=json_payload)
            
        print(f"   -> Status: {res.status_code}")
        return res
    except Exception as e:
        print(f"   -> Error connection: {e}")
        return None

def run_suite():
    print("\n=== STARTING ENDPOINT SECURITY VERIFICATION ===")
    
    # 1. Test Root
    res = test_endpoint("/")
    assert res and res.status_code == 200, "Root failed"
    
    # 2. Test Health
    res = test_endpoint("/health")
    assert res and res.status_code == 200, "Health Check failed"
    
    # 3. Test Protected Endpoint Without Token (MUST BE 401)
    res = test_endpoint("/analytics/weak-topics?user_id=123")
    assert res is not None and res.status_code == 401, "Security Lock Failed: /analytics/weak-topics was allowed"
    
    # 4. Test Protected Checkout Without Token (MUST BE 401)
    res = test_endpoint("/create-checkout-session", method="POST", json_payload={"price_id": "premium"})
    assert res is not None and res.status_code == 401, "Security Lock Failed: /create-checkout-session was allowed"

    print("\n🎉 SECURITY AUDIT SUCCESSFUL: All endpoint locks are active and enforcing token authorization correctly.")

if __name__ == "__main__":
    run_suite()
