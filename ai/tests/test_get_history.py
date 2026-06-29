"""
file: test_get_history.py
description: 이미지 이력 조회 API(/api/image/history)의 입력 유효성 검사 및 정렬 목록 반환 유닛 테스트
requirements: REQ-01-F05
api: API-02
author: Antigravity Agent
"""

import os
import shutil
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_history_files():
    # 테스트 전 폴더 생성 및 모의 파일 쓰기
    os.makedirs("images/cat", exist_ok=True)
    # 과거 파일 (1700000000)
    with open("images/cat/cat_cute_1700000000.jpg", "wb") as f:
        f.write(b"cute_cat")
    # 최신 파일 (1710000000)
    with open("images/cat/cat_sleepy_1710000000.jpg", "wb") as f:
        f.write(b"sleepy_cat")
        
    yield
    # 테스트 종료 후 클린업
    if os.path.exists("images"):
        shutil.rmtree("images")

def test_get_history_success():
    response = client.get("/api/image/history?petType=cat")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["petType"] == "cat"
    images = data["data"]["images"]
    
    assert len(images) == 2
    
    # 정렬 순서 검증 (최신 파일 1710000000 이 첫 번째여야 함)
    assert images[0]["keyword"] == "sleepy"
    assert images[0]["imageUrl"] == "/images/cat/cat_sleepy_1710000000.jpg"
    assert "createdAt" in images[0]
    
    assert images[1]["keyword"] == "cute"
    assert images[1]["imageUrl"] == "/images/cat/cat_cute_1700000000.jpg"

def test_get_history_empty():
    response = client.get("/api/image/history?petType=rabbit")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["petType"] == "rabbit"
    assert data["data"]["images"] == []

def test_get_history_missing_param():
    response = client.get("/api/image/history")
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "MISSING_QUERY_PARAMETER"

def test_get_history_invalid_pet():
    response = client.get("/api/image/history?petType=dragon")
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_PET_TYPE"
