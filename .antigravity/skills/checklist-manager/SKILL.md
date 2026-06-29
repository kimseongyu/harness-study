---
name: checklist-manager
description: Manage and transition tasks within the checklist.yml file during the agent cycle.
---

# Checklist Manager Rule

이 스킬은 `planner.md` 및 오케스트레이션 러너가 `.agents/checklist.yml` 파일의 태스크 상태를 일관되게 업데이트하도록 제어하는 규칙입니다.

## 1. 태스크 가져오기 (Fetch Task)
- `checklist.yml`을 상단부터 검색하여 `status`가 `"진행전"`인 첫 번째 태스크를 추출합니다.
- 추출한 태스크의 `status`를 `"진행중"`으로 변경하고 파일에 저장합니다.
- **동시 작업 제약**: 한 번에 오직 단 하나의 태스크만 `"진행중"` 상태여야 합니다. 기존에 `"진행중"`인 태스크가 남아 있다면, 해당 태스크가 `"완료"`로 바뀌기 전에는 다른 태스크를 진행할 수 없습니다.

## 2. 상태 전환 흐름 (Transition Flow)
태스크의 상태는 반드시 다음의 상태 전이 경로만을 따릅니다.
- `진행전` ➔ `진행중` (개발 시작 시)
- `진행중` ➔ `완료` (테스트 통과 및 코드 리뷰 승인 완료 시)
- `진행중` ➔ `진행전` (작업 취소 및 롤백 필요 시)

## 3. 업데이트 무결성
- 파일을 쓸 때 YAML 포맷이 깨지지 않도록 구조를 유지해야 합니다.
- 각 태스크의 `요구사항 번호`, `api 번호`, `영역` 속성이 누락되거나 변경되지 않도록 본래 값을 완벽히 보존해야 합니다.
