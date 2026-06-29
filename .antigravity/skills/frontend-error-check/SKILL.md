---
name: frontend-error-check
description: Validate frontend component code for lint, runtime, and rendering errors.
---

# Frontend Error Check Rule

프론트엔드 컴포넌트(`coder.md`) 작성 완료 후, 빌드 검증 단계에서 에러를 감지하고 수정하는 자가 점검 규칙입니다.

## 1. 정적 분석 및 린트 검증 (Static Analysis)
- 컴포넌트 파일 저장 후 `npm run lint` 명령을 구동하고 IDE의 린트 에러 ID를 확인하여 정적 분석 오류를 해결합니다.
- 선언 후 사용하지 않은 변수(Unused variables), 정의되지 않은 Prop Types, 잘못된 임포트(Import) 경로는 발견 즉시 수정합니다.

## 2. 렌더링 결함 자가 진단 (Runtime Prevention)
코더 에이전트는 코드 작성 단계에서 아래의 다빈도 렌더링 에러 요소를 검사하여 예방합니다.
- **Null Safety**: API 응답 지연으로 인해 데이터가 비어 있는 상황(`null` 혹은 `undefined`)에서 UI 크래시가 발생하는 것을 방지하기 위해 옵셔널 체이닝(`?.`) 및 기본값을 적용합니다.
  - *예시*: `data?.imageUrl`을 사용합니다.
- **Key Attribute**: React에서 리스트 렌더링(`.map` 함수)을 처리할 때 고유한 `key` 속성을 제공합니다. 배열의 `index`를 키로 사용하는 것을 금지하고 데이터의 고유 ID를 사용합니다.
- **이벤트 핸들러 예외 처리**: `onClick` 이벤트 바인딩 시 비동기 함수 오류가 전체 UI 크래시로 전파되지 않도록 `try-catch`문으로 감싸 예외를 처리합니다.
