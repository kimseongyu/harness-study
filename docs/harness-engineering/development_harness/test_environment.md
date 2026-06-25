# 개발 및 테스트 환경 구축 가이드

이 문서는 모바일 에뮬레이터 및 실기기 상에서 React Native 및 WebView의 실행 환경을 셋업하고, 성능 모니터링 및 로컬 웹뷰 디버깅을 하기 위한 환경 구축 과정을 안내합니다.

---

## 1. 모바일 에뮬레이터 및 개발 장비 설정

### 1.1 Android (AVD) 설정
1. **Android Studio** 실행 후 `Device Manager`에서 가상 기기(AVD)를 생성합니다.
   - **권장 사양:** Pixel 6 Pro 혹은 최근 디바이스, API 34+ (Android 14)
2. **GPU 가속 설정:** 하이브리드 Canvas 렌더링 검증을 위해 하드웨어 그래픽 가속(`Graphics: Hardware - GLES L3.0`)을 반드시 활성화합니다.
3. **ADB 연결 확인:** 터미널에서 `adb devices` 명령어를 수행하여 시뮬레이터가 정상 인식되는지 검증합니다.

### 1.2 iOS Simulator 설정 (macOS 전용)
1. **Xcode** 설치 후 Command Line Tools 설정 확인: `Xcode -> Settings -> Locations -> Command Line Tools`.
2. CocoaPods 의존성을 빌드하기 위해 아래 명령어를 실행합니다:
   ```bash
   bundle install
   bundle exec pod install --project-directory=ios
   ```
3. `Simulator` 앱을 실행하고 테스트할 iOS 기기(iPhone 15 이상)를 구동합니다.

---

## 2. WebView 실시간 원격 디버깅 (Remote Debugging)

웹뷰 내부는 React Native 메인 로그 터미널(`react-native start`)에 잡히지 않으므로, 별도의 브라우저 디버거 연결이 필수적입니다.

### 2.1 Webview 디버깅 코드 활성화 (중요)
Native 단에서 WebView 인스턴스를 선언할 때 디버깅이 가능하도록 옵션을 켜줍니다.
```tsx
import { WebView } from 'react-native-webview';

<WebView
  ref={webViewRef}
  source={{ uri: 'file:///android_asset/dino/index.html' }} // Android 로컬 경로 예시
  originWhitelist={['*']}
  allowingReadAccessToURL="file://"
  domStorageEnabled={true}
  javaScriptEnabled={true}
  // iOS용 사파리 디버깅 활성화
  allowFileAccess={true}
  style={{ flex: 1 }}
/>
```

### 2.2 Android Chrome DevTools 연동
1. 에뮬레이터나 실기기를 USB로 연결하고 앱을 실행합니다.
2. PC의 Google Chrome 브라우저를 열고 주소창에 `chrome://inspect`를 입력합니다.
3. **Devices** 목록에 모바일 기기와 실행 중인 WebView의 패키지명(예: `com.harnessstudy`) 및 로컬 주소가 노출됩니다.
4. **`inspect`** 버튼을 클릭하여 웹 뷰 내부 DOM, JS Console, Network 탭을 실시간으로 분석합니다.

### 2.3 iOS Safari Web Inspector 연동
1. iOS 시뮬레이터 또는 USB 연결된 iPhone에서 앱을 실행합니다.
2. 모바일 설정에서 `설정 -> Safari -> 고급 -> 웹 검사기(Web Inspector)`가 켜져 있는지 확인합니다.
3. PC에서 **Safari 브라우저**를 실행하고 `개발자용 -> [기기 이름] -> [웹 페이지 이름 또는 index.html]`을 선택합니다.
4. Safari 개발자 프레임워크가 열리며 캔버스 오브젝트 및 브릿지 스크립트를 디버깅할 수 있습니다.

---

## 3. 네트워크 및 오프라인 시뮬레이션

공룡 게임은 인터넷 연결이 해제되었을 때 동작하는 것이 기본 기획이므로, 로컬 웹 에셋이 캐시 및 로컬 파일 시스템에서 정상 동작하는지 테스트해야 합니다.

### 3.1 Network Throttling 및 Offline 제어
- **Android Emulator:** Extended Controls 패널(우측 점 3개 단추) -> `Cellular` -> `Network type`을 `Offline`으로 변경하여 테스트합니다.
- **Chrome DevTools:** 디버거 Inspect 패널의 `Network` 탭에서 Throttle 프리셋을 `Offline` 또는 `Slow 3G`로 구성하여 초기 리소스 지연 구동 테스트를 진행합니다.
- **macOS Network Link Conditioner:** Xcode 부가 도구인 Network Link Conditioner를 활성화하여 시스템 전반의 네트워크 패킷 무손실 단절을 실험합니다.

---

## 4. 모바일 환경에서의 성능 모니터링 (Performance Logging)

성능 하네스(Performance Harness) 구축을 위해 필수적인 측정 포인트입니다.

1. **FPS(Frames Per Second) 로깅:**
   - React Native 인앱 개발자 메뉴(Cmd + M 혹은 Ctrl + M)에서 `Show Perf Monitor`를 실행하여 UI 및 JS 스레드의 FPS 저하 여부를 트래킹합니다.
   - WebView 내부 Canvas 상에서는 `requestAnimationFrame` 루프 내부에 프레임 카운터를 구현하여 모니터링 툴에 1초마다 출력합니다.
2. **콘솔 로그 수집:**
   - 개발 환경에서 WebView 내부의 에러 메시지나 경고를 포착하기 위해 WebView의 `onMessage` 프로프에 `console.log` 감지 로직을 삽입하여 디버깅 편의성을 극대화합니다.
