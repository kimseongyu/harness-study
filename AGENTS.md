# Harness Engineering Project Map (AGENTS.md)

이 문서는 반려동물 사진 생성 웹 서비스 프로젝트의 아키텍처, 의존성, 다중 에이전트 협업 파이프라인 및 규율을 정의한 **공통 지침서**입니다. 프로젝트에 참여하는 모든 에이전트와 개발자는 작업을 시작하기 전 본 문서를 숙독하고 반드시 준수해야 합니다.

---

## 1. 프로젝트 개요 및 목적

- **명칭**: 반려동물 AI 이미지 생성 및 보관 서비스
- **목적**: 고양이, 강아지, 수달, 토끼 등 다양한 반려동물의 이미지를 사용자가 선택한 키워드 스타일에 맞춰 AI 생성하고, 생성된 이미지를 분류 저장하며, 과거 생성 이력을 바둑판 배열로 확인할 수 있는 웹 서비스를 구축합니다.
- **하네스 엔지니어링 지향점**: Frontend와 AI 서버 간의 결합 품질을 검증하기 위해 테스트 러너와 모킹(MSW, pytest-mock) 기술을 적극 도입하여 자율 TDD 루프 하에 검증을 가속화합니다.

---

## 2. 프로젝트 폴더 구조 (Directory Structure)

```directory
.
├── .agents/                      # 기획/설계 산출물 및 작업 제어 정보 저장소
│   ├── apis/                     # Frontend와 AI 간 통신을 위한 API 명세서
│   ├── designs/                  # UI 컴포넌트 디자인 가이드라인 및 스타일 규칙
│   ├── requirements/             # 사용자 스토리 및 기능 요구사항 명세서
│   └── checklist.yml             # 에이전트 자율 루프 구동을 위한 전체 테스크 체크리스트
│
├── .antigravity/                 # 에이전트 오케스트레이션 엔진 및 규칙 정의
│   ├── agents/                   # 다중 에이전트(Planner, Tester, Coder, Reviewer) 역할 프롬프트
│   ├── hooks/                    # 태스크 초기화 및 상태 관리를 위한 자동화 훅 스크립트
│   ├── skills/                   # 정적 분석, 테스트 가이드, 커밋 등 개별 실행 규칙
│   ├── templates/                # 기획서, API 명세서, 디자인 명세서, progress.md 작성용 템플릿
│   ├── config.json               # 프로젝트 환경 및 TDD 최대 루프 제한 설정 파일
│   └── system.md                 # 전역 에이전트 절대 제약 가이드라인 (System Rules)
│
├── frontend/                     # Next.js 기반 프론트엔드 애플리케이션
├── ai/                           # Python/FastAPI 기반 AI 이미지 생성 서버
├── log.md                        # 현재 태스크 검증 도중 발생한 에러 로그 및 리뷰 결과 파일
└── progress.md                   # 현재 태스크의 TDD 루프 진척 현황 보고서
```

---

## 3. 개발 환경 및 기술 스택 (Environments & Dependencies)

### 3.1 서비스 포트 및 네트워크 설정 (Port Layout)

- **Frontend App**: `http://localhost:3000`
- **AI Server (FastAPI)**: `http://localhost:3001`
- **CORS 허용**: AI 서버는 프론트엔드 포트(`localhost:3000`)의 API 호출 및 자원 요청을 허용해야 합니다.

### 3.2 Frontend 영역 (`frontend/`)

- **포트 번호**: `3000` (개발: `npm run dev`)
- **런타임 및 패키지 매니저**: Node.js / `npm` (실행: `npm run dev`)
- **프레임워크**: Next.js (TypeScript)
- **테스트 러너**: Jest
- **테스트 유틸리티**: React Testing Library (RTL)
- **API 모킹**: Mock Service Worker (MSW)
- **테스트 명령어**: `npm run test` (경로: `frontend/`)

### 3.3 AI Server 영역 (`ai/`)

- **포트 번호**: `3001` (개발/실행: `uv run main.py`)
- **런타임 및 패키지 매니저**: Python >= 3.14 / `uv`
- **프레임워크**: FastAPI
- **테스트 러너**: pytest
- **모킹 유틸리티**: pytest-mock
- **테스트 명령어**: `uv run pytest` (경로: `ai/`)
- **API Key 관리 규칙**:
  - Google Gemini API 호출을 위한 API 인증 키는 `ai/.env` 파일 내에 **`GEMINI_API_KEY`**라는 변수명으로 저장됩니다.
  - 소스 코드 개발 시 `ai/.env`에서 이 값을 안전하게 로드(예: `python-dotenv` 패키지 또는 `os.getenv`)하여 AI 모델 클라이언트를 생성해야 합니다.
  - 테스트 환경(`pytest`) 구동 시에는 과금 및 외부 통신 지연을 방지하기 위해 이 키 호출부가 반드시 `conftest.py` 모킹에 의해 강제 무력화되어 동작함을 보장해야 합니다.

---

## 4. 다중 에이전트 협업 워크플로우 (Multi-Agent Workflow)

본 프로젝트는 4개 에이전트가 역할을 교대하며 `checklist.yml`의 테스크를 하나씩 완수해 나가는 자율 TDD 이중 루프(Double-Loop)로 진행됩니다.

### 4.1 에이전트별 역할 및 구동 파일

1.  **[Planner](file:///Users/sun925/Desktop/Git/harness-study/.antigravity/agents/planner.md)**: 요구사항/디자인/API 세부 명세 작성 및 템플릿 기반 문서 업데이트 담당.
2.  **[Tester](file:///Users/sun925/Desktop/Git/harness-study/.antigravity/agents/tester.md)**: 소스 코드 구현 전, 기능 명세를 검증하는 실패하는 단위 테스트 코드 선제 작성 담당.
3.  **[Coder](file:///Users/sun925/Desktop/Git/harness-study/.antigravity/agents/coder.md)**: 작성된 단위 테스트를 통과시키는 소스 코드 개발 및 렌더링 결함 자가 검증 담당.
4.  **[Reviewer](file:///Users/sun925/Desktop/Git/harness-study/.antigravity/agents/reviewer.md)**: 실제 테스트 명령어를 돌려 성공 여부를 판단하고 코드 품질 리뷰 및 태스크 상태 업데이트 담당.

---

## 5. 필수로 준수해야 하는 공통 규칙 (Global Rules)

1.  **System.md의 절대 준수**:
    - [system.md](file:///Users/sun925/Desktop/Git/harness-study/.antigravity/system.md)에 기술된 제약 조건을 위반하지 않습니다. (테스트 없이 코드 작성 금지, 임의의 빌드 툴 변경 금지 등)
2.  **테스트 격리 및 모킹 의무화**:
    - AI 이미지 생성 API 호출부는 테스트 시 비용 및 레이턴시를 최소화하기 위해 **반드시 MSW 또는 pytest-mock을 활용해 모킹**합니다. 실제 외부 API 직접 호출은 금지합니다.
3.  **디자인 일관성 (Sleek Dark Mode & HSL)**:
    - [DESIGN_pet_image_service.md](file:///Users/sun925/Desktop/Git/harness-study/.agents/designs/DESIGN_pet_image_service.md)에 등록된 CSS 변수를 철저히 사용하여 컴포넌트를 코딩합니다.
4.  **문서 주석 규격화**:
    - 모든 소스 코드 생성 및 수정 시 파일 헤더에 [module-explain-formatter](file:///Users/sun925/Desktop/Git/harness-study/.antigravity/skills/module-explain-formatter/SKILL.md) 지침에 명시된 JSDoc/Python docstring을 필수로 포함합니다.
5.  **커밋 메시지 표준**:
    - Git 커밋 시 반드시 [git-commit-formatter](file:///Users/sun925/Desktop/Git/harness-study/.antigravity/skills/git-commit-formatter/SKILL.md) 템플릿(예: `feat(frontend): 기능 요약 REQ-XX-FXX`)을 준수합니다.

---

## 6. 에러 상황 및 예외 처리 (Error Handling & Escalation)

- **TDD 최대 루프 초과 시 대처**:
  - `max_tdd_loops`(기본 5회)를 초과하여 최종 실패 종료(`exit 1`)되는 경우, 에이전트는 마지막 실패 정보가 담긴 `log.md`와 `progress.md`를 훼손하지 않은 채 **즉시 작업을 멈추고 사람(Human) 개발자에게 중단 상태를 보고**해야 합니다.
  - 이 경우, 에이전트가 스스로 동일 코드를 맹목적으로 반복 작성하여 토큰을 낭비하지 않도록 강하게 통제해야 합니다.
- **구문 오류 및 빌드 중단**:
  - 컴파일 오류나 타입 에러(`TypeScript compiler error` 등)로 인해 린트 또는 빌드가 실패한 경우, 즉시 실패로 판정하고 `reviewer.md` 단계에서 이전 개발 단계로 프로세스를 복귀시킵니다.

---

## 7. 상태 모니터링 가이드 (State Monitoring)

- **진행 상황 실시간 추적**:
  - 에이전트들은 `progress.md`에 정의된 진행 상황 표 및 세부 내역을 자신의 단계(Planner ➜ Tester ➜ Coder ➜ Reviewer)가 완료될 때마다 실시간으로 갱신해 주어야 합니다.
  - 이를 통해 사람 개발자 및 다른 에이전트가 현재 파이프라인의 병목 구간과 실패 원인을 명확하게 추적할 수 있도록 돕습니다.
