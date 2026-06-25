# BridgeDebugPanel 컴포넌트 명세서

`BridgeDebugPanel`은 개발 모드(`__DEV__ === true`) 환경에서 웹뷰의 실제 플레이 없이도 웹뷰에서 발생하는 통신 이벤트(메시지)를 인위적으로 트리거하여 React Native 네이티브 단의 반응과 상태 전이를 시뮬레이션할 수 있게 돕는 테스트 하네스용 UI 컴포넌트입니다.

---

## 1. 역할 (Role)
- WebView 컨텍스트의 동작(준비 완료, 점수 도달, 게임 오버 등)을 React Native 단독으로 가상 실행(Mocking).
- 모의 메시지 페이로드를 생성 및 직렬화하여 부모 컴포넌트의 메시지 리스너 핸들러로 라우팅.
- 프로덕션 릴리즈 빌드에서는 성능 및 보안을 위해 UI 렌더링 영역에서 완전히 자동 배제.

---

## 2. Props 인터페이스

```typescript
interface BridgeDebugPanelProps {
  /**
   * 가상의 WebView 메세지(JSON String)를 부모 수신기로 전달하는 시뮬레이터 콜백 함수
   */
  onSimulateMessage: (messageString: string) => void;
}
```

---

## 3. 하위 컴포넌트 구조

- **`BridgeDebugPanel` (Root)**
  - `TouchableOpacity` (헤더 토글 버튼 - 접기/열기 상태 관리)
  - `View` (이벤트 컨트롤 패널 바디 - 확장 시에만 표시)
    - `TouchableOpacity` (GAME_READY 시뮬레이션 버튼)
    - `TouchableOpacity` (SCORE_UPDATE 100점 시뮬레이션 버튼)
    - `TouchableOpacity` (SCORE_UPDATE 500점 시뮬레이션 버튼)
    - `TouchableOpacity` (GAME_OVER 750점 시뮬레이션 버튼)

---

## 4. 의존성 모듈 목록 (Dependencies)

- `react` (useState 훅을 통한 아코디언 상태 관리)
- `react-native` (View, Text, TouchableOpacity, StyleSheet)
