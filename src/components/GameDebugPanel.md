# GameDebugPanel 컴포넌트 명세서 (GameDebugPanel Component Specifications)

## 1. 역할
GameDebugPanel 컴포넌트는 개발 모드(`__DEV__`)에서 실행 중인 네이티브 공룡 게임의 생명주기와 핵심 이벤트를 수동으로 강제 트리거하여 기능 무결성을 점검할 수 있도록 지원하는 하네스 시뮬레이터 UI입니다.

---

## 2. Props 인터페이스

```typescript
interface GameDebugPanelProps {
  onSimulateEvent: (event: {
    type: 'GAME_READY' | 'SCORE_UPDATE' | 'GAME_OVER';
    payload?: any;
  }) => void;
}
```

---

## 3. 기능 구성
- **접기/펼치기 토글:** 헤더를 터치하면 패널이 위아래로 토글되어 실시간 테스트 화면에 영향이 덜 가도록 제어합니다.
- **모의 이벤트 시뮬레이터:**
  - `RESET / READY`: 게임 상태를 다시 초기화하여 대기 상태로 되돌립니다.
  - `SCORE (100) / (500)`: 100점 돌파, 500점 돌파 체크포인트 햅틱 반응성과 최고기록 저장 작동 여부를 강제 점검합니다.
  - `GAME_OVER (999)`: 장애물에 정면 충돌한 상태를 가상으로 시뮬레이션하여 최고 스코어 갱신 팝업 및 게임 종료 모달 전이를 테스트합니다.

---

## 4. 의존성 모듈 목록
- **React**: 컴포넌트 내부 접기/펼치기 토글 상태 관리 (`useState`)
- **React Native**: 터치 트리거 및 컨테이너 레이아웃 구성을 위한 `View`, `Text`, `TouchableOpacity`, `StyleSheet`
