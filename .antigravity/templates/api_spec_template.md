# [API ID] [API 기능 요약]

> **[안내]** Frontend와 AI 간의 통신, 혹은 다른 서비스 모듈 간의 API 인터페이스를 설계하기 위한 템플릿입니다. 대괄호 `[...]`로 감싸진 영역을 입력하고 불필요한 섹션은 제거하세요.

## 1. 기본 정보
- **메서드 (Method)**: `GET` / `POST` / `PUT` / `DELETE` / `PATCH`
- **엔드포인트 (Endpoint)**: `/api/v1/[path]`
- **설명**: [이 API가 수행하는 기능과 주요 호출 시점에 대해 설명합니다.]
- **인증 필요 여부**: 있음 (Bearer Token 등) / 없음

## 2. 요청 스펙 (Request Specification)

### 2.1 Headers
```http
Authorization: Bearer <token>
Content-Type: application/json
```

### 2.2 Path Variables / Query Parameters
*사용하지 않을 경우 삭제 또는 N/A 표시*

| 파라미터명 | 타입 | 필수 여부 | 설명 |
| :--- | :--- | :--- | :--- |
| `[param_name]` | `string` / `number` | 필수 / 선택 | [파라미터 역할 및 허용 값 범위] |

### 2.3 Request Body (JSON)
*POST/PUT/PATCH 시 작성*

```json
{
  "[field_name]": "[value_type]"
}
```

- **필드 설명**:
  - `[field_name]`: [필드 설명 및 제약 조건 (예: 2자 이상 20자 이하)]

---

## 3. 응답 스펙 (Response Specification)

### 3.1 성공 응답 (200 OK / 201 Created)
```json
{
  "success": true,
  "data": {
    "[field_name]": "[value]"
  }
}
```

### 3.2 실패 응답 (400 Bad Request / 401 Unauthorized / 500 Server Error)
```json
{
  "success": false,
  "error": {
    "code": "[ERROR_CODE]",
    "message": "[에러 메시지 상세 내용]"
  }
}
```

---

## 4. AI 통신 관련 특이 사항 (Optional)
AI 에이전트 연동 시 필요한 네트워크 동작 사양입니다.

- **스트리밍 여부**: Streaming (SSE) 지원 / 단일 JSON 응답
- **예상 지연 시간 (Latency)**: 약 [X]초 (LLM 연동 특성상 타임아웃 설정을 여유 있게 지정해야 함)
- **Mock 데이터 예시**: Tester Agent가 하네스 테스트를 구성할 수 있도록 실제 Mock 응답 하나를 기술합니다.
  ```json
  [Mocking JSON 데이터 내용]
  ```
