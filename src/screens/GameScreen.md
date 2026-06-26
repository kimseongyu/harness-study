# GameScreen 컴포넌트 명세서 (Native)

`GameScreen`은 모바일 단말기 화면에 크롬 공룡 게임(T-Rex Runner)을 WebView 없이 렌더링하고, 네이티브 터치 입력, 햅틱 피드백 설정, 스코어보드 연동 및 개발자용 하네스 디버그 패널을 조율하는 핵심 메인 화면 컴포넌트입니다.

---

## 1. 역할 (Role)
- **네이티브 렌더링 조율:** `Dino`, `Obstacle`, `Ground`, `Cloud` 등 분리된 각 개별 그래픽 요소들을 하나의 절대 좌표 가상 해상도 계계에 맞춰 바인딩 및 렌더링합니다.
- **저지연 제스처 입력 처리:** `onTouchStart`, `onTouchMove`, `onTouchEnd` 이벤트를 네이티브 뷰 단에서 감지하여 입력 오버헤드를 30ms 이하로 단축하고 공룡의 점프 및 숙이기 행동을 통제합니다.
- **비동기 영구 저장 동기화:** 게임 오버 또는 시뮬레이션 상태 변경 시 로컬 저장소(`AsyncStorage`) 서비스를 비동기 호출하여 하이스코어를 안전하게 영구 저장합니다.
- **디버그 패널 인터페이스 중재:** `GameDebugPanel`에서 주입되는 모의 테스트용 게임 생명주기 이벤트(RESET, SCORE_UPDATE, GAME_OVER)를 네이티브 게임 루프에 연결합니다.

---

## 2. Props 인터페이스

- **최상위 루트 화면 컴포넌트로, 외부에서 입력받는 Props는 존재하지 않습니다.**

---

## 3. 하위 컴포넌트 구조

- **`GameScreen` (Screen Container)**
  - `View` (Header - Scoreboard Card)
    - `Text` (타이틀 명)
    - `View` (점수판 뱃지 그룹)
      - `Text` (최고 기록 뱃지 - HI 00000)
      - `Text` (실시간 획득 점수 뱃지 - SCORE 00000)
  - `View` (Game Frame Window - Native layout with onLayout)
    - **`Cloud`** (하늘 구름 데코레이션 요소)
    - **`Ground`** (무한 횡스크롤 최적화형 지면)
    - **`Dino`** (absolute View 픽셀 T-Rex 캐릭터)
    - **`Obstacle`** (선인장 및 익룡 배열 렌더러)
    - `View` (IDLE / GAMEOVER 상태 시 노출되는 모달 오버레이 안내판)
  - `View` (Settings Control Sheet)
    - `Switch` (효과음 가상 스위치)
    - `Switch` (게임오버 진동 햅틱 제어 스위치)
  - **`GameDebugPanel`** (하네스 테스트 제어 패널)

---

## 4. 의존성 모듈 목록 (Dependencies)
- `react` (useState, useEffect, useRef, useCallback 훅)
- `react-native` (View, Text, StyleSheet, SafeAreaView, Switch, GestureResponderEvent)
- `../hooks/useGameLoop` (통합 물리 연산 및 프레임 제어 엔진)
- `../components/Dino/Dino` (T-Rex 픽셀 컴포넌트)
- `../components/Obstacle/Obstacle` (선인장/익룡 픽셀 컴포넌트)
- `../components/Ground/Ground` (지면 수평선 컴포넌트)
- `../components/Cloud/Cloud` (구름 배경 컴포넌트)
- `../components/GameDebugPanel` (하네스 모의 시뮬레이터 패널)
- `../services/storageService` (로컬 AsyncStorage 영구 저장 서비스)
- `../utils/bridgeValidator` (게임 상태 이벤트 정합성 검증 유틸)
