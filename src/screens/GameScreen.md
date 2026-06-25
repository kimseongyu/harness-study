# GameScreen 컴포넌트 명세서

`GameScreen`은 모바일 단말기 화면에 Chrome 공룡 게임을 렌더링하고 플레이 제어, 점수판 뱃지 노출, 환경설정 조작 시트 및 개발자 테스트 하네스 시뮬레이터를 하나의 뷰로 조율하는 핵심 메인 화면 컴포넌트입니다.

---

## 1. 역할 (Role)
- **게임 번들 로드 및 렌더링:** `DINO_HTML` 게임 에셋을 WebView에 주입하여 독립 구동.
- **양방향 통신 처리:** WebView에서 넘어오는 이벤트(스코어 증가, 충돌 게임오버)를 분석하여 로컬 스토리지(`AsyncStorage`)에 연동.
- **설정 동기화:** 소리 및 진동 On/Off 스위치 상태 값을 WebView의 게임 세션에 실시간 주입.
- **결함 내성(Fault Tolerance) 보장:** `react-native-webview` 라이브러리가 네이티브 링킹 혹은 패키지 누락으로 로드 실패할 경우에도 화면 크래시 없이 모의 디바이스 모드로 자동 폴백 구동.

---

## 2. Props 인터페이스

- **루트 화면 컴포넌트로, 입력받는 Props는 존재하지 않습니다.**

---

## 3. 하위 컴포넌트 구조

- **`GameScreen` (Screen Container)**
  - `View` (Header - Scoreboard Card)
    - `Text` (타이틀 명)
    - `View` (점수판 뱃지 그룹)
      - `Text` (최고 기록 뱃지 - HI 00000)
      - `Text` (실시간 획득 점수 뱃지 - SCORE 00000)
  - `View` (Game Frame Window)
    - **`WebView`** (dinoHtml 웹뷰 캔버스 렌더러) -> *동적 로드*
    - **`View`** (웹뷰 로드 실패 시 노출되는 가상 에뮬레이터 뷰) -> *폴백(Fallback)*
  - `View` (Settings Control Sheet)
    - `Switch` (사운드 제어 토글)
    - `Switch` (진동 피드백 제어 토글)
  - **`BridgeDebugPanel`** (하네스 디버그 패널)

---

## 4. 의존성 모듈 목록 (Dependencies)

- `react` (useState, useEffect, useRef 훅)
- `react-native` (View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity)
- `react-native-webview` (웹뷰 브라우저 렌더러 모듈 - *Optional*)
- `../services/storageService` (로컬 저장소 동기화 서비스)
- `../utils/bridgeValidator` (인입 메시지 정적 스키마 유효성 검사기)
- `../components/BridgeDebugPanel` (하네스 시뮬레이터 컴포넌트)
- `../assets/dinoHtml` (게임 원본 웹 리소스 파일)
