#!/bin/bash

CHECKLIST_PATH=".agents/checklist.yml"
if [ ! -f "$CHECKLIST_PATH" ]; then
    CHECKLIST_PATH="../.agents/checklist.yml"
fi

if [ ! -r "$CHECKLIST_PATH" ]; then
    echo "{}"
    exit 0
fi

CURRENT_TITLE=""
CURRENT_STATUS=""
CURRENT_AREA=""
CURRENT_REQ=""
CURRENT_API=""

# 1단계: 진행중 상태의 첫 번째 태스크 탐색
while IFS= read -r line || [ -n "$line" ]; do
    # 캐리지 리턴(\r) 제거로 개행 호환성 확보
    line="${line//$'\r'/}"
    
    [[ "$line" =~ ^# ]] && continue
    [[ -z "${line// }" ]] && continue

    # 태스크 명칭 매칭 ("태스크명":)
    if [[ "$line" =~ ^\"([^\"]+)\": ]]; then
        if [ "$CURRENT_STATUS" = "진행중" ]; then
            break
        fi
        CURRENT_TITLE="${BASH_REMATCH[1]}"
        CURRENT_STATUS=""
        CURRENT_AREA=""
        CURRENT_REQ=""
        CURRENT_API=""
    fi

    # 속성 매칭 (콜론 앞뒤 키-값 분석)
    if [[ "$line" =~ ^[[:space:]]+-[[:space:]]+([^:]+):[[:space:]]*\"([^\"]*)\" ]]; then
        KEY="${BASH_REMATCH[1]}"
        VALUE="${BASH_REMATCH[2]}"
        
        if [[ "$KEY" =~ "status" ]]; then
            CURRENT_STATUS="$VALUE"
        elif [[ "$KEY" =~ "영역" ]]; then
            CURRENT_AREA="$VALUE"
        elif [[ "$KEY" =~ "요구사항" ]]; then
            CURRENT_REQ="$VALUE"
        elif [[ "$KEY" =~ "api" ]]; then
            CURRENT_API="$VALUE"
        fi
    fi
done < "$CHECKLIST_PATH"

# 2단계: 진행중인 것이 없으면 진행전 상태의 첫 번째 태스크 탐색
if [ "$CURRENT_STATUS" != "진행중" ]; then
    CURRENT_TITLE=""
    CURRENT_STATUS=""
    CURRENT_AREA=""
    CURRENT_REQ=""
    CURRENT_API=""
    
    while IFS= read -r line || [ -n "$line" ]; do
        line="${line//$'\r'/}"
        
        [[ "$line" =~ ^# ]] && continue
        [[ -z "${line// }" ]] && continue

        if [[ "$line" =~ ^\"([^\"]+)\": ]]; then
            if [ "$CURRENT_STATUS" = "진행전" ]; then
                break
            fi
            CURRENT_TITLE="${BASH_REMATCH[1]}"
            CURRENT_STATUS=""
            CURRENT_AREA=""
            CURRENT_REQ=""
            CURRENT_API=""
        fi

        if [[ "$line" =~ ^[[:space:]]+-[[:space:]]+([^:]+):[[:space:]]*\"([^\"]*)\" ]]; then
            KEY="${BASH_REMATCH[1]}"
            VALUE="${BASH_REMATCH[2]}"
            
            if [[ "$KEY" =~ "status" ]]; then
                CURRENT_STATUS="$VALUE"
            elif [[ "$KEY" =~ "영역" ]]; then
                CURRENT_AREA="$VALUE"
            elif [[ "$KEY" =~ "요구사항" ]]; then
                CURRENT_REQ="$VALUE"
            elif [[ "$KEY" =~ "api" ]]; then
                CURRENT_API="$VALUE"
            fi
        fi
    done < "$CHECKLIST_PATH"
fi

if [ -n "$CURRENT_TITLE" ] && ( [ "$CURRENT_STATUS" = "진행중" ] || [ "$CURRENT_STATUS" = "진행전" ] ); then
    printf '{"title": "%s", "status": "%s", "area": "%s", "requirement": "%s", "api": "%s"}\n' \
        "$CURRENT_TITLE" "$CURRENT_STATUS" "$CURRENT_AREA" "$CURRENT_REQ" "$CURRENT_API"
else
    echo "{}"
fi
