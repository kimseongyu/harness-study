# React Native Chrome Dino Game - Harness Engineering

이 디렉토리는 React Native 기반 크로스 플랫폼 환경에서 Chrome 공룡 게임(Chrome Dino Game)을 실행, 테스트 및 고도화하기 위한 **하네스 엔지니어링(Harness Engineering) 문서 체계**입니다. 

개발 단계에서 발생할 수 있는 WebView 렌더링 성능 문제, 터치 입력 지연, 네트워크 상태에 따른 오프라인 구동 오류 등을 사전에 시뮬레이션하고 검증할 수 있도록 테스트 하네스(Test Harness) 설계를 가이드합니다.

---

## 1. 하네스 엔지니어링(Harness Engineering)이란?

본 프로젝트에서 정의하는 하네스 엔지니어링은 **"WebView 내부의 HTML5 Canvas 게임을 모바일 OS(Android, iOS) 위에서 원활하게 구동하고, 독립적인 컴포넌트 단위로 입력·상태·성능을 모니터링 및 제어하기 위한 테스트 소프트웨어 환경 구축"**을 의미합니다.

주요 엔지니어링 대상은 다음과 같습니다:
- **성능 하네스(Performance Harness):** React Native와 WebView 렌더링 프레임(FPS) 측정 및 기기별 자원 사용량 분석.
- **통신 하네스(Communication Harness):** WebView 내부 스크립트와 React Native Native Realm 간의 양방향 Bridge 통신 데이터 정합성 검증.
- **환경 하네스(Environment Harness):** 비행기 모드(Offline) 등 네트워크 불안정 시나리오를 모사하는 웹 캐시 및 오프라인 구동 시뮬레이션.
- **입력 시뮬레이터(Input Simulator):** 모바일 터치 제스처(탭, 스와이프)를 게임 내부 이벤트(점프, 숙이기)로 고속 매핑하고 반응성 검증.

---

## 2. 문서 구조 (Directory Structure)

문서는 하네스 엔지니어링의 생명 주기에 따라 다음과 같이 구분됩니다:

```text
harness-study/
├── .agents/
│   └── AGENTS.md                          # 에이전트 개발 및 정적 분석(Lint/Test) 강제 규칙
└── docs/harness-engineering/
    ├── README.md                          # [본 문서] 전체 문서 개요 및 가이드맵
    ├── design.md                          # Google Material Design 3 기반 UI 규격 가이드라인
    ├── requirements/
    │   └── game_specifications.md        # 게임 물리 엔진 공식, 조작성 명세 및 요구사항
    ├── architecture/
    │   ├── system_architecture.md        # WebView Bridge 설계, 오프라인 동작 및 자원 격리
    │   └── agent_collaboration.md        # 기획·개발·평가 에이전트 상호 평가 프로토콜
    ├── development_harness/
    │   ├── test_environment.md           # 에뮬레이터 설정, 네트워크 제어 및 디버거 연동
    │   └── bridge_simulation.md          # Mock Bridge 구현 및 데이터 정합성 검사 프로토콜
    └── testing/
        └── test_scenarios.md             # 시나리오 기반 수동/자동화 테스트 케이스
```

---

## 3. 핵심 아키텍처 개요

Chrome 공룡 게임은 웹 기술(HTML5, JS Canvas)로 작성되며, React Native는 이를 렌더링하는 컨테이너 역할을 합니다. 하네스는 이 둘 사이의 결합부(Interface)를 격리 테스트하는 역할을 수행합니다.

```mermaid
graph TD
    subgraph React Native Realm
        App[App.tsx] --> Screen[GameScreen]
        Screen --> WV[react-native-webview]
        NativeState[로컬 저장소 / Highscore] <--> Screen
    end

    subgraph Bridge (Interface Harness)
        WV -- WebView.postMessage --> RNReceiver[Bridge Receiver]
        Screen -- injectJavaScript --> WVSender[Bridge Sender]
    end

    subgraph WebView Realm (Dino Game)
        HTML5[Dino Game Engine] <--> Canvas[Canvas Rendering]
        HTML5 <--> WebAudio[Game Sound]
    end

    RNReceiver -.-> TestHarness[Bridge Mock Harness]
    WVSender -.-> TestHarness
```

---

## 4. 문서 이용 방법

1. **에이전트 지침 확인:** [AGENTS.md](file:///Users/sun925/Desktop/Git/harness-study/.agents/AGENTS.md)를 통해 에이전트가 코드를 완성한 후 강제해야 하는 `npx lint` 및 `npx test` 작업 규칙과 컴포넌트 마크다운 기술 규칙을 숙지합니다.
2. **에이전트 협업 체계 파악:** [architecture/agent_collaboration.md](file:///Users/sun925/Desktop/Git/harness-study/docs/harness-engineering/architecture/agent_collaboration.md)에서 기획/개발/평가 에이전트가 어떤 라이프사이클로 상호 평가하는지 점검합니다.
3. **디자인 규격 일관성 확보:** [design.md](file:///Users/sun925/Desktop/Git/harness-study/docs/harness-engineering/design.md)에서 Google Material Design 3 기반으로 정의된 컴포넌트 크기, 마이크로 인터랙션 및 대비 비율을 확인합니다.
4. **요구사항 파악:** [requirements/game_specifications.md](file:///Users/sun925/Desktop/Git/harness-study/docs/harness-engineering/requirements/game_specifications.md)에서 게임의 기본 동작 원리와 터치 트리거를 확인합니다.
5. **시스템 인터페이스 이해:** [architecture/system_architecture.md](file:///Users/sun925/Desktop/Git/harness-study/docs/harness-engineering/architecture/system_architecture.md)에서 React Native와 WebView 간의 메시지 흐름과 설계 사상을 공부합니다.
6. **테스트 환경 설정:** [development_harness/test_environment.md](file:///Users/sun925/Desktop/Git/harness-study/docs/harness-engineering/development_harness/test_environment.md)에 기술된 가이드에 따라 개발용 에뮬레이터와 디버깅 툴을 연동합니다.
7. **시뮬레이션 수행:** [development_harness/bridge_simulation.md](file:///Users/sun925/Desktop/Git/harness-study/docs/harness-engineering/development_harness/bridge_simulation.md)를 바탕으로 데이터 송수신 유효성을 시뮬레이션합니다.
8. **검증 가이드라인 준수:** [testing/test_scenarios.md](file:///Users/sun925/Desktop/Git/harness-study/docs/harness-engineering/testing/test_scenarios.md)의 테스트 케이스를 모두 통과하는지 확인하며 릴리즈를 준비합니다.
