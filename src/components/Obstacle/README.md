# Obstacle 컴포넌트 명세서 (Obstacle Component Specifications)

## 1. 역할
Obstacle 컴포넌트는 Chrome 공룡 게임에서 등장하는 두 가지 종류의 장애물인 **선인장(Cactus)**과 **익룡(Pterodactyl)**을 실시간 위치에 따라 화면에 네이티브 픽셀 아트로 그리는 컴포넌트입니다.

---

## 2. Props 인터페이스

```typescript
import { ObstacleType } from '../../hooks/useGameLoop';

interface ObstacleProps {
  type: ObstacleType; // 장애물 타입 ('CACTUS' | 'BIRD')
  x: number;          // 가상 좌표계 상의 X 좌표 (물리 엔진 계산 결과)
  y: number;          // 가상 좌표계 상의 Y 좌표 (물리 엔진 계산 결과)
  width: number;      // 가상 좌표계 상의 가로 폭
  height: number;     // 가상 좌표계 상의 세로 높이
  wingState: number;  // 익룡인 경우 날개 짓 애니메이션 상태 (0: 위, 1: 아래)
  scale: number;      // 디바이스 해상도 대응을 위한 스케일 팩터
}
```

---

## 3. 세부 렌더링 명세

- **선인장 (Cactus):**
  - 단일, 이중, 삼중 스폰에 따라 가변 가로 폭(`width`)과 높이(`height`)를 가집니다.
  - 구성 요소:
    - 중앙 기둥 (`Main Stem`)
    - 왼쪽 팔 가지 (`Left Arm Horizontal`, `Left Arm Vertical`)
    - 오른쪽 팔 가지 (`Right Arm Horizontal`, `Right Arm Vertical`)
  - 각 가지의 시작 위치와 두께는 프롭으로 전달된 가상 크기를 기반으로 일정 비율(`width/3`, `height/2` 등)로 계산되어 스케일링됩니다.

- **익룡 (Pterodactyl Bird):**
  - 가상 고정 크기: `width: 24, height: 18`
  - 날개짓으로 인해 위/아래 영역이 흔들리는 것을 감안하여 컨테이너 높이를 `28 * scale`로 확장하여 설정합니다.
  - 구성 요소:
    - 몸체 (`Body`)
    - 부리 (`Beak`)
    - 날개 (`Wing` - `wingState`가 0일 때는 몸체 위쪽에 수직 배치, 1일 때는 몸체 아래쪽에 수직 배치)

---

## 4. 의존성 모듈 목록
- **React**: 컴포넌트 정의
- **React Native**: 절대 좌표 기반 조각 그리기를 위한 `View`, `StyleSheet`
- **UseGameLoop Types**: `ObstacleType` 파일 결합 관리
