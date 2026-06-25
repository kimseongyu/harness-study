# 브릿지 시뮬레이션 및 데이터 검증 가이드

이 문서는 WebView와 Native 간의 통신 결합도를 낮추고, 실제 게임을 플레이하지 않고도 메시지 송수신이 원활히 동작하는지 검증하기 위한 **브릿지 시뮬레이션(Bridge Simulation) 하네스** 구축 기법을 정의합니다.

---

## 1. 브릿지 시뮬레이션의 필요성

React Native 애플리케이션의 비즈니스 로직(최고 점수 저장, 네이티브 설정)과 웹 내부 게임 루프는 고도로 분리되어 있어야 합니다. 
- 게임 도중 장애물 충돌 없이 임의로 999점을 보냈을 때 최고 점수가 기록되는지 테스트해야 합니다.
- 네이티브 진동 기능(Vibration) 활성화 설정이 웹 엔진에 제대로 주입되는지 게임 밖에서 점검해야 합니다.
이를 위해 **Mock Bridge** 환경을 구축합니다.

---

## 2. 웹 영역 (WebView) Mock Bridge 시뮬레이션

웹 뷰 코드를 모바일 앱 내부가 아닌 일반 웹 브라우저(Chrome/Safari)에서 독립적으로 실행하고 테스트할 때, `window.ReactNativeWebView` 객체가 존재하지 않아 에러가 나는 현상을 방지하고 입출력을 로깅하는 모의 스크립트(Mock Script)를 주입합니다.

### 2.1 HTML/JS Mock Bridge 구현
게임 엔진의 초기 로딩 스크립트 상단에 아래와 같이 Mocking 코드를 적용합니다:

```javascript
// mock-bridge.js
if (!window.ReactNativeWebView) {
  console.warn("⚠️ ReactNativeWebView가 존재하지 않아 Mock Bridge를 활성화합니다. (Browser Mode)");
  
  window.ReactNativeWebView = {
    postMessage: function(messageString) {
      try {
        const parsed = JSON.parse(messageString);
        console.log("%c[Mock Bridge -> Native 전송 성공]", "color: #4CAF50; font-weight: bold;", parsed);
        
        // 시뮬레이터 응답 자동화 매핑 예시
        if (parsed.type === "GAME_READY") {
          // 게임 준비 응답에 대해 0.5초 후 네이티브 설정 데이터 수신 모사
          setTimeout(() => {
            console.log("%c[Mock Bridge -> Web 수신 모사]", "color: #2196F3; font-weight: bold;");
            const mockEvent = new CustomEvent("SYNC_SETTINGS", {
              detail: { soundEnabled: true, vibrationEnabled: true }
            });
            window.dispatchEvent(mockEvent);
          }, 500);
        }
      } catch (e) {
        console.error("❌ Mock Bridge 전송 메시지 포맷 에러:", e);
      }
    }
  };
}
```

---

## 3. 네이티브 영역 (React Native) Bridge Simulator

React Native 코드 안에서 게임 오버 시나리오나 스코어 획득 이벤트를 에뮬레이터에서 인위적으로 발생시키는 "디버그 패널(Debug Controller Harness)"을 구현합니다.

### 3.1 디버그 시뮬레이터 UI 컴포넌트 설계
개발 모드(`__DEV__ === true`)일 때만 스크린 하단에 숨김식/플로팅 디버그 패널을 렌더링하여, 버튼 클릭만으로 특정 메시지를 수신한 것처럼 네이티브 상태를 변경합니다.

```tsx
// src/components/BridgeDebugPanel.tsx
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

interface DebugPanelProps {
  onSimulateMessage: (message: string) => void;
}

export function BridgeDebugPanel({ onSimulateMessage }: DebugPanelProps) {
  if (!__DEV__) return null; // 프로덕션 빌드에서는 완전 제외

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>🛠️ Bridge Test Harness Panel</Text>
      <View style={styles.buttonRow}>
        <Button 
          title="점수 200점 도달 모사" 
          onPress={() => onSimulateMessage(JSON.stringify({ type: 'SCORE_UPDATE', payload: { score: 200 } }))} 
        />
        <Button 
          title="게임 오버 모사" 
          onPress={() => onSimulateMessage(JSON.stringify({ type: 'GAME_OVER', payload: { score: 850 } }))} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { backgroundColor: '#eaeaea', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  title: { fontSize: 12, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around' }
});
```

---

## 4. 데이터 페이로드 검증 스키마 (Validation Rules)

메시지 수신 시 유효하지 않은 포맷으로 인해 앱이 크래시 나지 않도록 방어 코드(Validator)를 설계합니다.

```typescript
// src/utils/bridgeValidator.ts
export interface BridgeMessage {
  type: string;
  payload?: any;
}

export function validateBridgeMessage(jsonString: string): BridgeMessage | null {
  try {
    const data = JSON.parse(jsonString);
    
    // 1. 필수 필드 존재성 검사
    if (!data || typeof data.type !== 'string') {
      console.warn("validation failed: 'type' string field is missing.");
      return null;
    }
    
    // 2. 타입별 페이로드 스키마 매핑 체크
    switch (data.type) {
      case 'SCORE_UPDATE':
        if (typeof data.payload?.score !== 'number') return null;
        break;
      case 'GAME_OVER':
        if (typeof data.payload?.score !== 'number') return null;
        break;
      case 'GAME_READY':
        break;
      default:
        console.warn(`Unknown event type: ${data.type}`);
        return null;
    }
    
    return data;
  } catch (error) {
    console.error("Invalid JSON format in message bridge:", error);
    return null;
  }
}
```

---

## 5. 시뮬레이션 환경 테스트 절차

1. 앱 실행 후 터미널 로그에서 `react-native start` 콘솔을 준비합니다.
2. 디버그 패널의 `게임 오버 모사` 버튼을 눌러 디바이스 스토리지(`AsyncStorage`)에 최고 점수 850점이 정상적으로 등록되는지 로그를 모니터링합니다.
3. 웹 디버거(Chrome DevTools) 콘솔 창에 `[Mock Bridge -> Native 전송 성공]` 라벨과 객체가 유실 없이 표기되는지 대조 확인합니다.
