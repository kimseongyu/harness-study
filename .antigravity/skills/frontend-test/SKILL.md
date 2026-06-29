---
name: frontend-test
description: Guidelines for writing robust frontend unit and integration tests using Jest and MSW.
---

# Frontend Test Rule

프론트엔드 테스트 에이전트(`tester.md`)가 컴포넌트 구현 전에 실패하는 테스트 코드를 작성하고, 구현 완료 후 이를 검증할 때 지켜야 할 기술적 규칙입니다.

## 1. 테스트 기술 스택 및 라이브러리
- **테스트 러너**: Jest
- **렌더링 유틸리티**: React Testing Library (RTL)
- **API 모킹**: Mock Service Worker (MSW)
- **패키지 매니저**: npm

## 2. 테스트 코드 작성 제약 (TDD Rule)
- **Data-TestId 지향**: UI 템플릿 구조와 스타일 클래스 변경에 테스트가 영향을 받지 않도록 DOM 요소를 조회할 때는 `data-testid` 또는 `getByRole` 사용을 원칙으로 삼습니다.
  - *예시*: `screen.getByTestId('keyword-button-cute')`를 사용합니다.
- **로딩 및 비동기 상태 테스트**: 이미지가 생성 중일 때 로딩 인디케이터가 화면에 표시되고 키워드 버튼들이 비활성화(`disabled`)되는지 여부를 검증하는 케이스를 포함합니다.
- **네트워크 모킹**: 외부 API 연동 시 실제 네트워크 호출을 차단하고, MSW를 활용해 `api_spec_template`에 정의된 Mock JSON 데이터를 반환하도록 Mocking을 구성합니다.

## 3. 테스트 성공 판정
- 에이전트는 작성된 테스트 파일이 `npm run test` 명령을 통해 정상적으로 성공(`exit 0`)하는 것을 확인하고 해당 태스크를 완료 처리합니다.
