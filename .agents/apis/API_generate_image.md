# API-01 반려동물 이미지 생성 API

> **[안내]** 사용자가 선택한 동물과 키워드를 기반으로 AI 이미지를 생성하고 서버에 저장하는 API 명세입니다.

## 1. 기본 정보
- **메서드 (Method)**: `POST`
- **엔드포인트 (Endpoint)**: `/api/image/generate`
- **설명**: 프론트엔드에서 전달받은 동물 종류(petType)와 스타일 키워드(keyword)를 활용하여 AI 이미지를 생성하고, 서버의 `images/[petType]/` 디렉토리에 저장한 뒤 저장된 이미지의 URL 정보를 반환합니다.
- **인증 필요 여부**: 없음

## 2. 요청 스펙 (Request Specification)

### 2.1 Headers
```http
Content-Type: application/json
```

### 2.2 Request Body (JSON)
```json
{
  "petType": "cat",
  "keyword": "cute"
}
```

- **필드 설명**:
  - `petType`: 생성할 동물 종류 (`cat`, `dog`, `otter`, `rabbit` 중 하나)
  - `keyword`: 스타일 키워드 ("귀여운", "하찮은", "용감한" 등의 영문 매핑 값 또는 한글 값. 예: `cute`, `dumb`, `brave`, `elegant`, `sleepy`, `happy`, `mysterious`, `sulky`, `playful`, `tough`)

---

## 3. 응답 스펙 (Response Specification)

### 3.1 성공 응답 (200 OK / 201 Created)
```json
{
  "success": true,
  "data": {
    "imageUrl": "/images/cat/cat_cute_1719660000.jpg",
    "petType": "cat",
    "keyword": "cute",
    "createdAt": "2026-06-29T20:15:00Z"
  }
}
```

### 3.2 실패 응답 (400 Bad Request / 500 Server Error)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PET_TYPE",
    "message": "지원하지 않는 동물 종류입니다."
  }
}
```

---

## 4. AI 통신 관련 특이 사항
- **예상 지연 시간 (Latency)**: 이미지 생성 모델(예: Imagen, Stable Diffusion 등) 연동으로 인해 응답시간이 약 3~7초 소요될 수 있습니다. 프론트엔드는 타임아웃을 15초 이상으로 넉넉하게 설정해야 합니다.
- **Mock 데이터 예시**:
  ```json
  {
    "success": true,
    "data": {
      "imageUrl": "https://placekitten.com/500/500",
      "petType": "cat",
      "keyword": "cute",
      "createdAt": "2026-06-29T20:15:00Z"
    }
  }
  ```
