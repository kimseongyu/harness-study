"""
file: test_generate_image.py
description: 이미지 생성 API(/api/image/generate)의 입력 유효성 검사 및 응답 포맷, 이미지 저장 유닛 테스트
requirements: REQ-01-F05
api: API-01
author: Antigravity Agent
"""

import os
import shutil
import pytest
from fastapi.testclient import TestClient

# main.py에서 FastAPI app을 로드
try:
    from main import app
except ImportError:
    # app이 아직 선언되지 않았을 때를 위한 임시 껍데기 선언 (Import Error 우회용)
    from fastapi import FastAPI
    app = FastAPI()

client = TestClient(app)

@pytest.fixture(autouse=True)
def cleanup_images():
    yield
    # 테스트 종료 후 테스트 데이터용 생성 이미지 디렉토리 제거
    if os.path.exists("images"):
        shutil.rmtree("images")

def test_generate_image_success(mock_genai_client):
    payload = {
        "petType": "cat",
        "keyword": "cute"
    }
    response = client.post("/api/image/generate", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert data["data"]["petType"] == "cat"
    assert data["data"]["keyword"] == "cute"
    assert "imageUrl" in data["data"]
    assert "createdAt" in data["data"]
    
    # 로컬 파일이 실제로 생성되었는지 검증
    image_url = data["data"]["imageUrl"]
    file_path = image_url.lstrip("/")
    assert os.path.exists(file_path)
    with open(file_path, "rb") as f:
        assert f.read() == b"fake_mocked_image_bytes_data"

def test_generate_image_invalid_pet():
    payload = {
        "petType": "tiger",
        "keyword": "cute"
    }
    response = client.post("/api/image/generate", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_PET_TYPE"

def test_generate_image_missing_params():
    payload = {
        "petType": "cat"
    }
    response = client.post("/api/image/generate", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_PARAMETER"
