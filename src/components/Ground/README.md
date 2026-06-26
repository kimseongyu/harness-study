# Ground 컴포넌트 명세서 (Ground Component Specifications)

## 1. 역할
Ground 컴포넌트는 Chrome 공룡 게임의 바닥 지면 수평선 및 왼쪽으로 흐르는 무한 횡스크롤 도트 패턴을 표현하는 역할을 수행합니다.

---

## 2. Props 인터페이스

```typescript
interface GroundProps {
  speed: number;           // 현재 게임 스크롤 속도
  currentFrame: number;    // 누적 게임 루프 프레임 수
  scale: number;           // 디바이스 비율 스케일 인자
  containerWidth: number;  // 실제 모바일 화면의 가로 넓이
}
```

---

## 3. 구현 세부사항 및 성능 최적화
- **렌더링 오버헤드 최소화:**
  - 매 프레임 수십 개의 닷(dot) 좌표들을 새로 상태(State)로 생성하고 렌더링하면 성능이 급격히 저하됩니다.
  - 이를 방지하기 위해 가상 너비 `600px` 규격의 고정 지면 조각(`Ground Section`) 2~3개를 템플릿 형태로 미리 렌더링해 둔 뒤, `left` 오프셋만을 계산하여 전체 레이아웃을 통째로 횡스크롤(Translation)시키는 무한 순환 스크롤링 기법을 적용하였습니다.
- **수평선 및 점 배치:**
  - 수평 지면선은 `#cccccc` 컬러의 실선으로 그립니다.
  - 수평선 하단의 불규칙한 땅 무늬 도트들은 `#dddddd` 컬러로 사전에 계산된 고정 가상 좌표(`staticDots` 배열)에 배치되어 지면 조각과 함께 자연스럽게 흘러갑니다.

---

## 4. 의존성 모듈 목록
- **React**: 컴포넌트 생성 및 렌더링
- **React Native**: 스크롤 가속을 위한 `View`, `StyleSheet`
