---
name: ai-test
description: Guidelines for writing unit tests for AI image generation services using pytest and uv.
---

# AI Test Rule

AI 이미지 생성 서비스와 관련 백엔드 API를 테스트할 때 적용하는 테스트 작성 규칙입니다.

## 1. 테스트 기술 스택 및 라이브러리
- **패키지 및 런타임 매니저**: uv (`uv run pytest` 명령어로 테스트 실행)
- **프레임워크**: pytest
- **모킹 유틸리티**: pytest-mock

## 2. 테스트 작성 원칙
- **네트워크 격리 (Isolation)**: 외부 이미지 생성 API로 직접 요청을 전송하지 않습니다. API 호출 함수를 모킹하여 지정된 Mock 응답이 반환되는지 확인합니다.
- **스키마 검증 (Schema Validation)**: AI가 리턴하는 JSON 응답 데이터가 지정된 규격(`imageUrl`, `petType`, `keyword` 필드가 포함되어 있는지)을 만족하는지 스키마 정합성을 테스트합니다.
- **파일 I/O 및 저장 경로 검증**: 이미지가 생성된 후 서버의 로컬 폴더인 `images/[petType]/` 하위에 올바른 파일명 규칙(`[petType]_[keyword]_[timestamp].jpg`)으로 정상 저장되는지 검증합니다.
- **예외 상황 테스트**: API 타임아웃, 모델 에러, 허용되지 않는 잘못된 파라미터가 들어왔을 때 적절히 에러 메시지(`code`, `message`)를 담아 400/500 에러를 반환하는지 테스트 케이스를 구축합니다.
