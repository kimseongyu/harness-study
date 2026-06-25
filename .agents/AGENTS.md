# AGENTS.md (에이전트 개발 지침 및 약속)

이 문서는 이 저장소에서 협업하는 모든 AI 에이전트(기획, 개발, 평가)가 프로젝트를 수정, 확장 또는 검증할 때 반드시 준수해야 하는 **개발 지침서 및 사전 지식 정의 파일**입니다.

---

## 1. 프로젝트 프로필 (Project Profile)

### 1.1 주제
- **주제:** React Native 모바일 화면에서 Chrome 공룡 게임(Chrome Dino Game)을 렌더링하고 원활하게 조작 및 플레이할 수 있는 크로스 플랫폼 어플리케이션 구축.

### 1.2 핵심 기술 스택 및 의존성 버전 (package.json 기준)
- **React:** `19.2.3`
- **React Native:** `0.86.0`
- **Safe Area:** `react-native-safe-area-context` (`^5.5.2`)
- **Developer Tools:**
  - TypeScript: `^5.8.3`
  - ESLint: `^8.19.0`
  - Jest (테스트 러너): `^29.6.3`
  - Metro (번들러): `0.86.0`

### 1.3 표준 폴더 구조 (Standard Directory Structure)
에이전트는 코드 및 컴포넌트를 추가할 때 아래의 구조를 반드시 준수해야 합니다.
```text
harness-study/
├── .agents/
│   └── AGENTS.md                       # [본 문서] 에이전트 개발 및 검증 규칙
├── src/
│   ├── assets/                         # 스프라이트 이미지, 오디오 파일 등 게임 리소스
│   ├── components/                     # 공통 UI 컴포넌트 (버튼, 점수판, 모달 등)
│   ├── hooks/                          # 게임 루프 및 센서 입력 제어용 Custom Hooks
│   ├── navigation/                     # 스크린 내비게이션 구성
│   ├── screens/                        # 주요 화면 (GameScreen, MenuScreen 등)
│   ├── services/                       # 로컬 저장소(AsyncStorage) 및 네트워크 통신 서비스
│   ├── store/                          # 상태 관리 (Highscore 등 전역 상태)
│   └── utils/                          # 유틸리티 (물리 연산 보정, 검증 헬퍼)
└── docs/
    └── harness-engineering/             # 하네스 설계 및 테스트 명세 문서 디렉토리
```

---

## 2. 에이전트 핵심 행동 지침 (Behavior Rules)

### Rule 2.1: 컴포넌트 추가 시 자체 명세서 작성 의무
개발 과정에서 `src/components/` 또는 `src/screens/` 폴더에 새로운 컴포넌트를 생성하거나 수정/삭제할 때, **해당 컴포넌트 폴더 내부에 모듈의 정보와 인터페이스가 담긴 마크다운 파일**을 생성, 수정 또는 삭제해야 합니다.

- **컴포넌트 문서화 규칙:**
  1. 컴포넌트가 위치한 경로와 동일한 폴더(또는 컴포넌트명과 매핑되는 폴더) 내에 `README.md` 또는 `[ComponentName].md` 형식으로 작성합니다.
  2. 문서에는 컴포넌트의 **역할, Props 인터페이스, 하위 컴포넌트 구조, 의존성 모듈 목록**이 포함되어야 합니다.
  3. 만약 컴포넌트가 삭제되면 매핑된 마크다운 파일도 반드시 함께 삭제해야 합니다.

### Rule 2.2: 코드 일관성 및 검증 강제화 (Lint & Test)
에이전트가 코드 생성, 변경 또는 버그 수정을 완료한 직후에는 **반드시 검증 스크립트를 실행**하여 코드 일관성과 동작 무결성을 점검해야 합니다.

- **실행해야 할 명령어:**
  1. **코드 스타일 및 린트 검사:** `npm run lint` (또는 `npx eslint .`)
  2. **단위 테스트 실행:** `npm run test` (또는 `npx jest`)
- **조치 요령:**
  - 린트 에러나 테스트 실패가 발생하는 경우, 작업을 마무리하기 전에 해당 오류를 해결하는 수정 코드를 작성 및 반영해야 합니다.

---

## 3. 에이전트 협업 모델 (Multi-Agent Protocol)
- 에이전트는 기획, 개발, 평가 에이전트의 역할로 나뉘어 있으며 상호작용합니다. 자세한 협업 규격은 [docs/harness-engineering/architecture/agent_collaboration.md](file:///Users/sun925/Desktop/Git/harness-study/docs/harness-engineering/architecture/agent_collaboration.md) 문서를 참고하십시오.
