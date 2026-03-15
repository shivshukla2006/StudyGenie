import pytest
from fastapi.testclient import TestClient
import os
import sys

# Append backend to path for imports
sys.path.append(os.path.dirname(__file__))

from main import app

client = TestClient(app)

def test_read_root():
    """Test standard fallback root metadata."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to StudyGenie API"}

def test_health_check():
    """Test health status loader endpoints."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_analytics_requires_auth():
    """Test that protected analytics endpoints return 401 WITHOUT headers."""
    response = client.get("/analytics/weak-topics")
    assert response.status_code == 401

def test_create_checkout_requires_auth():
    """Test that billing redirects require auth."""
    response = client.post("/create-checkout-session", json={"price_id": "test_price"})
    assert response.status_code == 401
