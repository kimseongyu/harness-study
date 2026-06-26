# Dino 컴포넌트 명세서 (Dino Component Specifications)

## 1. 역할
Dino 컴포넌트는 Chrome 공룡 게임의 메인 캐릭터인 T-Rex를 렌더링하고 애니메이션 상태를 표출하는 역할을 담당합니다. 외부 그래픽 파일(PNG 등)을 불러오지 않고, 순수 React Native의 `<View>` 컴포넌트를 조각 형태로 조합하여 선명한 픽셀 아트를 화면에 렌더링합니다.

---

## 2. Props 인터페이스

```typescript
interface DinoProps {
  y: number;          // 가상 좌표계 상의 Y 좌표 (물리 엔진 계산 결과)
  isDucking: boolean;  // 머리를 숙인 상태 여부
  legState: number;    // 다리 뛰기 애니메이션의 상태 (0 또는 1)
  isJumping: boolean;  // 공중에 점프한 상태 여부
  scale: number;       // 디바이스 가로 해상도에 맞춰 화면 비율을 늘려주는 스케일 팩터
}
```

---

## 3. 내부 구조 및 드로잉 사양

- **Standing State (서 있는 상태):**
  - 가상 크기: `width: 24, height: 30` (스케일 조정 전)
  - 구성 요소:
    - 머리 & 주둥이 (`Snout`)
    - 몸통 (`Head & Chest`, `Chest/Body Lower`)
    - 꼬리 (`Tail`)
    - 눈 (`Eye` - 흰색 픽셀)
    - 다리 2개 (`Left Leg`, `Right Leg`)
  - 점프 시에는 다리 높이가 최대로 고정되며, 달릴 때에는 `legState`에 따라 다리 높이가 교차로 움직여 움직이는 효과를 제공합니다.

- **Ducking State (엎드린 상태):**
  - 가상 크기: `width: 30, height: 18` (스케일 조정 전)
  - 구성 요소:
    - 숙인 몸통 (`Body`)
    - 길게 뺀 머리 (`Head`)
    - 굽힌 다리 2개 (`Left Leg`, `Right Leg`)

---

## 4. 의존성 모듈 목록
- **React**: 컴포넌트 상태 정의 및 라이프사이클 처리
- **React Native**: 레이아웃 배치를 위한 `View`, `StyleSheet` 내장 컴포넌트
