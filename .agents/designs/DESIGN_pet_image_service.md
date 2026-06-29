# DESIGN-01 반려동물 이미지 서비스 글로벌 디자인 시스템 및 컴포넌트 명세

> **[안내]** 본 문서는 반려동물 사진 생성 및 보관 웹 서비스의 일관된 UI/UX 구현을 위한 디자인 명세서입니다. 모든 프론트엔드 에이전트(`coder.md`)는 컴포넌트 생성 시 본 명세를 엄격히 준수해야 합니다.

---

## 1. 글로벌 디자인 시스템 규칙 (Global Design Tokens)

전체 애플리케이션의 프리미엄 디자인 아이덴티티 유지를 위해 아래 토큰을 CSS 변수(`:root`)로 등록하여 사용합니다.

```css
:root {
  /* HSL Color Tokens */
  --color-bg-base: hsl(224, 25%, 8%);       /* Sleek Deep Space Dark */
  --color-bg-surface: hsl(224, 20%, 14%);   /* Card / Element Surface */
  --color-bg-glass: rgba(30, 41, 59, 0.4);   /* Glassmorphism Background */
  
  --color-primary: hsl(263, 70%, 50%);       /* Royal Indigo / Violet */
  --color-primary-hover: hsl(263, 80%, 60%);
  --color-accent: hsl(190, 90%, 50%);        /* Neon Cyan for Accents */
  
  --color-text-primary: hsl(210, 40%, 98%);  /* Soft White */
  --color-text-secondary: hsl(215, 20%, 65%);/* Muted Gray */
  --color-error: hsl(0, 85%, 60%);           /* Vivid Crimson Red */

  /* Visual Styles */
  --border-radius-sm: 8px;
  --border-radius-md: 16px;
  --border-radius-lg: 24px;
  
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --glass-blur: blur(12px);
  
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 2. 컴포넌트별 상세 명세

### 2.1 상단 네비게이션 바 (NavigationBar Component)
- **목적**: 서비스 상단에 고정되어 동물 탭(고양이, 강아지, 수달, 토끼) 전환을 지원하는 헤더 영역.
- **연관 요구사항**: [REQ-01-F01](file:///Users/sun925/Desktop/Git/harness-study/.agents/requirements/REQ_pet_image_service.md)
- **시각 스타일**:
  - `height: 70px; display: flex; align-items: center; justify-content: space-between;`
  - Glassmorphism 효과가 적용된 상단 고정 헤더 (`backdrop-filter: var(--glass-blur); border-bottom: var(--glass-border);`)
  - 로고 영역(Neon Cyan Accent)과 내비게이션 탭 메뉴(Soft White)로 구성.
- **상태별 스타일**:
  - **Default**: 동물 메뉴 항목은 Muted Gray 글씨색으로 표시.
  - **Hover**: 텍스트 색상이 Soft White로 부드럽게 밝아지며 하단에 2px의 Indigo Border 언더라인 노출 (`transition: var(--transition-smooth);`).
  - **Active (선택됨)**: Neon Cyan 색상의 하단 보더 및 볼드 텍스트 적용.
- **접근성**: `<header>`, `<nav>` 및 `<ul>`, `<li>` 시맨틱 태그 사용. 현재 선택된 탭에는 `aria-current="page"` 설정.

---

### 2.2 이미지 제너레이터 콘솔 (ImageGenerator Console)
- **목적**: 화면 중앙에 위치하여 이미지 생성 대기, 로딩, 렌더링을 담당하는 핵심 기능 컴포넌트.
- **연관 요구사항**: [REQ-01-F02](file:///Users/sun925/Desktop/Git/harness-study/.agents/requirements/REQ_pet_image_service.md), [REQ-01-F04](file:///Users/sun925/Desktop/Git/harness-study/.agents/requirements/REQ_pet_image_service.md)
- **시각 스타일**:
  - 중앙의 500px x 500px 정방형 이미지 뷰어 영역.
  - 모서리는 `var(--border-radius-lg)`로 둥글게 처리하고, 이미지 바깥 경계는 `var(--glass-border)`로 감쌈.
  - 뷰어 하단 좌우에 '다운로드(Download)' 및 '새로고침(Regenerate)' 버튼이 글래스 모피즘 버튼 형태로 배치됨.
- **상태별 스타일**:
  - **초기 대기 상태 (Empty)**: 뷰어 중앙에 "동물 이미지를 생성하기 위해 아래 키워드 버튼을 누르세요"라는 안내 텍스트와 동물 실루엣 아이콘 노출 (`color: var(--color-text-secondary);`).
  - **로딩 상태 (Loading)**: 뷰어 위에 스피너 및 Glassmorphism 오버레이(반투명)가 씌워지며 펄스(Pulse) 애니메이션 작동.
  - **다운로드/새로고침 버튼**:
    - Default: `background: var(--color-bg-glass); border: var(--glass-border);`
    - Hover: `background: var(--color-primary); color: white; transform: translateY(-2px);`
- **접근성**: 이미지 로딩 중일 때는 `aria-busy="true"`를 뷰어 영역에 부여. 생성 완료된 이미지에는 적절한 `alt` 속성 추가 (예: `alt="귀여운 고양이 이미지"`).

---

### 2.3 스타일 키워드 버튼 패널 (Keyword Button Panel)
- **목적**: 이미지 뷰어 하단에 배치된 10개의 스타일 정의 버튼들의 그리드 패널.
- **연관 요구사항**: [REQ-01-F03](file:///Users/sun925/Desktop/Git/harness-study/.agents/requirements/REQ_pet_image_service.md)
- **시각 스타일**:
  - 10개의 버튼이 일정한 그리드로 배열됨 (데스크톱 기준 5열 2행 구조).
  - 버튼 개별 스타일: `padding: 12px 24px; border-radius: var(--border-radius-sm); font-size: 0.95rem; font-weight: 500;`
- **상태별 스타일**:
  - **Default**: `background: var(--color-bg-surface); border: var(--glass-border); color: var(--color-text-primary); cursor: pointer;`
  - **Hover**: `background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); transform: scale(1.05); box-shadow: var(--glass-shadow); transition: var(--transition-smooth);`
  - **Disabled (이미지 생성 진행 중일 때)**: 모든 버튼 비활성화, `opacity: 0.4; cursor: not-allowed;`
- **접근성**: `<button>` 태그 사용, 고유한 `id` 값 적용 (예: `btn-keyword-cute`), 포커스 링(`outline`) 스타일 별도 정의.

---

### 2.4 이전 생성 이미지 갤러리 (History Gallery)
- **목적**: 화면 하단에 현재 동물의 이전 생성 이력 파일들을 격자 구조로 표현하는 갤러리.
- **연관 요구사항**: [REQ-01-F06](file:///Users/sun925/Desktop/Git/harness-study/.agents/requirements/REQ_pet_image_service.md)
- **시각 스타일**:
  - 갤러리 상단에 `<h2>` 타이틀("이전에 생성된 고양이 이미지") 배치.
  - 반응형 그리드 구조 (`grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px;`).
  - 개별 갤러리 아이템: 카드 형태로 둥근 모서리 적용. 카드의 하단 영역에 얇게 Glassmorphic 정보 띠가 표시되어 생성 시 사용한 키워드가 노출됨.
- **상태별 스타일**:
  - **Hover**: 카드가 `transform: translateY(-5px);` 만큼 들려 올려지며, 카드 테두리에 Neon Cyan (`var(--color-accent)`) 빛(Glow) 효과 적용.
- **접근성**: `<section>` 태그 활용, 격자 갤러리는 `role="feed"` 혹은 리스트 형태로 제공.

---

## 3. 반응형 레이아웃 가이드

- **Desktop (>= 1024px)**:
  - 뷰어 및 버튼 콘솔은 중앙에 `max-width: 800px;`로 고정 정렬.
  - 키워드 버튼 패널은 5열 2행 격자 구조.
  - 하단 갤러리는 최대 4~5열로 확장.
- **Tablet (768px ~ 1023px)**:
  - 콘솔 가로폭 `90%` 확장.
  - 키워드 버튼 패널은 4열 3행 혹은 3열 4행 구조로 가변 변환.
  - 갤러리는 3열로 유지.
- **Mobile (< 768px)**:
  - 상단 네비게이션 바는 스크롤이 가능한 가로 스크롤 형태(Overflow-x)로 변환.
  - 이미지 뷰어 크기 자동 반응 (`max-width: 100%; height: auto; aspect-ratio: 1/1;`).
  - 키워드 버튼 패널은 2열 5행 구조로 크게 변경하여 터치 영역 확보.
  - 갤러리는 2열 그리드로 정렬.
