#!/bin/bash

# 실행 경로 기준 설정
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$DIR/../.."

# 프로젝트 루트로 이동 (파일 복사 및 쓰기 편의)
cd "$ROOT_DIR" || exit 1

# JSON에서 필드 값을 추출하는 헬퍼 함수
parse_json() {
    local json="$1"
    local key="$2"
    if [[ "$json" =~ \"$key\":[[:space:]]*\"([^\"]*)\" ]]; then
        echo "${BASH_REMATCH[1]}"
    fi
}

# 파일 내 특정 문자열을 치환하는 헬퍼 함수 (macOS/Linux 호환)
replace_in_file() {
    local target="$1"
    local replacement="$2"
    local file="$3"
    
    local tmp
    tmp=$(mktemp)
    while IFS= read -r line || [ -n "$line" ]; do
        # Bash 내장 문자열 치환 이용
        echo "${line//"$target"/$replacement}" >> "$tmp"
    done < "$file"
    mv "$tmp" "$file"
}

# 1. 현재 태스크 조회
TASK_JSON=$(bash "$DIR/get_current_task.sh")

TITLE=$(parse_json "$TASK_JSON" "title")
STATUS=$(parse_json "$TASK_JSON" "status")
AREA=$(parse_json "$TASK_JSON" "area")
REQUIREMENT=$(parse_json "$TASK_JSON" "requirement")
API=$(parse_json "$TASK_JSON" "api")

if [ -z "$TITLE" ]; then
    echo "Checklist 완료: 더 이상 진행할 태스크가 없습니다."
    exit 0
fi

echo "현재 활성화된 태스크: '$TITLE' (상태: $STATUS)"

# 2. 상태별 초기화 분기
if [ "$STATUS" = "진행전" ]; then
    echo ">> [초기화 실행] '$TITLE' 작업을 새로 시작합니다."
    
    # logs 비우기
    echo "" > log.md
    echo "log.md 초기화 완료."

    # progress.md 템플릿 복사 및 플레이스홀더 치환
    if [ -f ".antigravity/templates/progress_template.md" ]; then
        cp ".antigravity/templates/progress_template.md" progress.md
        
        # 순수 쉘 치환 함수를 사용하여 플레이스홀더 매핑 (파이썬/sed 우회)
        replace_in_file "[예: 상단 네비게이션 바 및 라우팅 UI 구현]" "$TITLE" "progress.md"
        replace_in_file "[예: REQ-01-F01]" "$REQUIREMENT" "progress.md"
        replace_in_file "[예: API-01 또는 없음]" "$API" "progress.md"
        replace_in_file "[frontend / ai-server]" "$AREA" "progress.md"
        replace_in_file "[진행전 / 기획중 / 개발중 / 검증중 / 완료]" "진행중" "progress.md"
        
        echo "progress.md 템플릿 적용 및 매핑 완료."
    else
        echo "Warning: progress_template.md가 존재하지 않습니다."
    fi

    # checklist.yml 상태를 '진행중'으로 변경
    bash "$DIR/update_current_task.sh" "$TITLE" "진행중"
    
elif [ "$STATUS" = "진행중" ]; then
    echo ">> [기존 작업 유지] 에이전트가 '$TITLE' 작업을 이어 수행합니다. 초기화를 건너뜁니다."
fi
