---
name: code-review-formatter
description: Define standardized checklist and reporting format for the code reviewer agent.
---

# Code Review Formatter Rule

리뷰어 에이전트(`reviewer.md`)가 개발 에이전트(`coder.md`)가 작성한 코드를 검토하고 피드백을 기록할 때 사용하는 코드 리뷰 가이드라인 및 서식입니다.

## 1. 코드 리뷰 통과 기준 (Acceptance Checklist)
리뷰어 에이전트는 다음 사항을 엄격히 검토한 뒤 리뷰 결과를 작성해야 합니다.
- **기능 요구사항 일치도**: 개발된 코드가 요구사항 명세서(`REQ-XX`)와 기획 의도에 완전히 부합하는가?
- **디자인 명세 준수**: 컴포넌트가 글로벌 디자인 시스템의 토큰(CSS 변수)과 상태별 디자인 스타일(`DESIGN-XX`)을 그대로 따르고 있는가?
- **웹 표준 및 접근성**: 시맨틱 마크업을 사용했는가? `alt` 속성과 주요 ARIA 태그가 올바르게 주입되었는가?
- **테스트 통과 여부**: Tester Agent가 추가한 모든 테스트가 성공(`exit 0`)했는가?
- **코드 복잡도 및 린트**: 린트 경고가 없으며, 불필요하게 복잡하거나 가독성이 떨어지는 안티패턴이 없는가?

## 2. 코드 리뷰 작성 양식 (Review Report Template)
리뷰어는 검토 결과를 반드시 아래 Markdown 양식에 맞추어 작성하고 로그(`log.md`) 또는 결과 컨텍스트에 저장해야 합니다. (결과 상태는 `승인`과 `반려` 중 해당하는 한 가지만 기록합니다.)

```markdown
### 🔍 Code Review Report

- **대상 태스크**: [태스크 이름] (요구사항: [요구사항 ID])
- **리뷰 결과**: [승인 또는 반려 중 해당되는 상태 한 가지만 기입]

#### 1. 검증 체크리스트
- [ ] 요구사항 부합 여부
- [ ] 디자인 시스템 준수 여부
- [ ] 테스트 코드 전체 통과 여부
- [ ] 정적 분석(린트) 경고 없음

#### 2. 피드백 및 제안 사항 (Feedbacks)
- **잘된 점 (Good Point)**:
  - [템플릿 준수 내용 작성]
- **개선 필요 사항 (Improvements)**:
  - [반려 시에만 기재하며, 수정해야 하는 사항 작성]
```
