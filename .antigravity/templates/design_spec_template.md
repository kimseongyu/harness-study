# [컴포넌트 ID] [컴포넌트명] Design Spec

> **[안내]** Frontend 컴포넌트 구현 시 일관성 있는 디자인과 인터랙션을 적용하기 위해 사용하는 템플릿입니다. 대괄호 `[...]`로 감싸진 영역을 알맞게 작성하세요.

## 1. 컴포넌트 개요
- **목적**: [이 컴포넌트가 화면에서 담당하는 역할과 목적을 간략하게 작성합니다.]
- **사용되는 페이지**: [이 컴포넌트가 배치될 상위 컨테이너나 페이지 경로]
- **관련 요구사항**: [[REQ-XX-FXX](link_to_requirement)와 같은 요구사항 식별자 링크]

## 2. 디자인 시스템 규칙 (Aesthetics & Theme)
*기본 브라우저 스타일이 아닌 세련되고 프리미엄한 테마가 적용되도록 제한합니다.*

- **색상 팔레트 (Color Palette)**:
  - Background: `[예: HSL 220 15% 10% ( Sleek Dark Mode )]`
  - Primary: `[예: HSL 260 85% 60% ( Vivid Violet )]`
  - Text: `[예: HSL 0 0% 100% ( Pure White )]`
- **타이포그래피 (Typography)**:
  - Font Family: `[예: Outfit, Inter, sans-serif (기본 브라우저 폰트 배제)]`
  - Font Size / Weight: `[예: Title: 1.5rem/700, Body: 0.95rem/400]`
- **시각 스타일**:
  - Border Radius: `[예: 12px (Smooth Rounded Corner)]`
  - Backdrop Effect: `[예: backdrop-filter: blur(10px) (Glassmorphism 적용 시)]`
  - Shadow: `[예: box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1)]`

## 3. 상태별 UI 스타일 (Component States)
에이전트가 각 상태를 명확히 구별하여 스타일링할 수 있도록 규정합니다.

1. **기본 상태 (Default)**:
   - [기본 상태의 컴포넌트 외형 정보]
2. **마우스 호버 상태 (Hover / Focus)**:
   - [호버 시의 미세 애니메이션 및 색상 변화]
   - *예시: `transform: translateY(-2px);` 및 보더 컬러 강조*
3. **비활성화 상태 (Disabled)**:
   - `opacity: 0.5; cursor: not-allowed;` 등의 처리 조건
4. **로딩 상태 (Loading)**:
   - 스켈레톤 UI 제공 여부 또는 스피너 표시 가이드
5. **에러 상태 (Error)**:
   - 입력 실패 시 테두리 색상(`[예: HSL 0 80% 60% (Crimson Red)]`) 및 경고 문구 표시 규칙

## 4. 반응형 레이아웃 가이드 (Responsive Layout)
- **Desktop (>= 1024px)**: [예: Grid 3열 구조]
- **Tablet (768px ~ 1023px)**: [예: Grid 2열 구조]
- **Mobile (< 768px)**: [예: Flex Column, 100% 너비 확장]

## 5. 접근성 (A11y) 및 웹 표준 제약
- **시맨틱 태그**: div만 사용하지 말고 `<button>`, `<nav>`, `<aside>` 등 목적에 부합하는 HTML5 태그 사용.
- **ARIA 속성**: 모달 팝업 시 `aria-modal="true"`, 아코디언 컴포넌트 시 `aria-expanded` 등 준수.
