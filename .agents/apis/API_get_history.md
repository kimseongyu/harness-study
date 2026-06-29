# API-02 반려동물 이전 생성 이미지 목록 조회 API

> **[안내]** 특정 동물의 생성 이력 이미지들을 불러오는 API 명세입니다.

## 1. 기본 정보
- **메서드 (Method)**: `GET`
- **엔드포인트 (Endpoint)**: `/api/image/history`
- **설명**: 특정 동물 종류(petType)에 해당하는 서버 내 저장된 과거 이미지 목록을 가져옵니다.
- **인증 필요 여부**: 없음

## 2. 요청 스펙 (Request Specification)

### 2.1 Query Parameters
| 파라미터명 | 타입 | 필수 여부 | 설명 |
| :--- | :--- | :--- | :--- |
| `petType` | `string` | 필수 | 조회할 동물 종류 (`cat`, `dog`, `otter`, `rabbit`) |

- **요청 URL 예시**: `/api/image/history?petType=cat`

---

## 3. 응답 스펙 (Response Specification)

### 3.1 성공 응답 (200 OK)
```json
{
  "success": true,
  "data": {
    "petType": "cat",
    "images": [
      {
        "imageUrl": "/images/cat/cat_cute_1719660000.jpg",
        "keyword": "cute",
        "createdAt": "2026-06-29T20:15:00Z"
      },
      {
        "imageUrl": "/images/cat/cat_sleepy_1719659000.jpg",
        "keyword": "sleepy",
        "createdAt": "2026-06-29T19:58:20Z"
      }
    ]
  }
}
```

### 3.2 실패 응답 (400 Bad Request / 500 Server Error)
```json
{
  "success": false,
  "error": {
    "code": "MISSING_QUERY_PARAMETER",
    "message": "petType 파라미터가 누락되었습니다."
  }
}
```

---

## 4. 특이 사항
- **디렉토리 스캔**: 백엔드 또는 하네스 환경에서 `images/[petType]/` 디렉토리 내의 파일 목록을 읽어 생성 시간 역순으로 정렬하여 반환합니다.
- **Mock 데이터 예시**:
  ```json
  {
    "success": true,
    "data": {
      "petType": "cat",
      "images": [
        {
          "imageUrl": "https://placekitten.com/200/200",
          "keyword": "cute",
          "createdAt": "2026-06-29T20:15:00Z"
        }
      ]
    }
  }
  ```
