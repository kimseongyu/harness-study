import pytest

@pytest.fixture(autouse=True)
def mock_genai_client(mocker):
    """
    모든 pytest 실행 시 구글 GenAI 이미지 생성 API 호출을 강제로 모킹하여 
    실제 외부 API 호출과 과금 및 대기 레이턴시를 사전에 차단합니다.
    """
    # google-genai 패키지의 Client 클래스를 모킹 패치
    mock_client_class = mocker.patch('google.genai.Client')
    
    # Client 인스턴스 내부의 호출 모방 객체 생성
    mock_client_instance = mocker.MagicMock()
    mock_client_class.return_value = mock_client_instance
    
    # AI 이미지 생성 성공 시 Mock 이미지 바이트 데이터를 가지는 응답 반환 구성
    # 1. 구형 generate_images 모킹 대응
    mock_image = mocker.MagicMock()
    mock_image.image.image_bytes = b"fake_mocked_image_bytes_data"
    mock_client_instance.models.generate_images.return_value = mock_image
    
    # 2. 신형 generate_content 모킹 대응
    mock_part = mocker.MagicMock()
    mock_part.inline_data.data = b"fake_mocked_image_bytes_data"
    
    mock_content = mocker.MagicMock()
    mock_content.parts = [mock_part]
    
    mock_candidate = mocker.MagicMock()
    mock_candidate.content = mock_content
    
    mock_response = mocker.MagicMock()
    mock_response.candidates = [mock_candidate]
    
    mock_client_instance.models.generate_content.return_value = mock_response
    
    return mock_client_instance
