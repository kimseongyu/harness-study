#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: bash update_current_task.sh \"Task Title\" \"new_status\""
    exit 1
fi

TITLE="$1"
STATUS="$2"

CHECKLIST_PATH=".agents/checklist.yml"
if [ ! -f "$CHECKLIST_PATH" ]; then
    CHECKLIST_PATH="../.agents/checklist.yml"
fi

if [ ! -w "$CHECKLIST_PATH" ]; then
    echo "Error: checklist.yml is not writable."
    exit 1
fi

TEMP_FILE=$(mktemp)
IN_TARGET=false
UPDATED=false

while IFS= read -r line || [ -n "$line" ]; do
    # 캐리지 리턴 제거
    line="${line//$'\r'/}"
    
    if [[ "$line" =~ ^\"([^\"]+)\": ]]; then
        if [ "${BASH_REMATCH[1]}" = "$TITLE" ]; then
            IN_TARGET=true
        else
            IN_TARGET=false
        fi
    fi
    
    if [ "$IN_TARGET" = true ] && [[ "$line" =~ -[[:space:]]status: ]]; then
        # status 치환 및 인덴트 유지
        if [[ "$line" =~ ^([[:space:]]*)- ]]; then
            echo "${BASH_REMATCH[1]}- status: \"$STATUS\"" >> "$TEMP_FILE"
        else
            echo "  - status: \"$STATUS\"" >> "$TEMP_FILE"
        fi
        IN_TARGET=false
        UPDATED=true
    else
        echo "$line" >> "$TEMP_FILE"
    fi
done < "$CHECKLIST_PATH"

mv "$TEMP_FILE" "$CHECKLIST_PATH"

if [ "$UPDATED" = true ]; then
    echo "Success: Updated task '$TITLE' status to '$STATUS'"
    exit 0
else
    echo "Error: Task '$TITLE' not found."
    exit 1
fi
