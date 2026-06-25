import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { storageService } from '../services/storageService';
import { validateBridgeMessage } from '../utils/bridgeValidator';
import { BridgeDebugPanel } from '../components/BridgeDebugPanel';
import { DINO_HTML } from '../assets/dinoHtml';

// Dynamic import to prevent crash if react-native-webview is not installed
let WebView: any = null;
try {
  WebView = require('react-native-webview').WebView;
} catch (e) {
  // Webview not installed yet
}

export function GameScreen() {
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');
  
  const webViewRef = useRef<any>(null);

  // Load highscore on mount
  useEffect(() => {
    async function loadHighscore() {
      const savedHigh = await storageService.getHighScore();
      setHighscore(savedHigh);
    }
    loadHighscore();
  }, []);

  // Sync settings and highscore to WebView
  const syncToWebView = () => {
    if (!webViewRef.current) return;
    
    // 1. Sync settings
    const settingsCode = `
      window.dispatchEvent(new CustomEvent('SYNC_SETTINGS', {
        detail: {
          soundEnabled: ${soundEnabled},
          vibrationEnabled: ${vibrationEnabled}
        }
      }));
      true;
    `;
    webViewRef.current.injectJavaScript(settingsCode);

    // 2. Sync highscore
    const highscoreCode = `
      window.dispatchEvent(new CustomEvent('UPDATE_HIGHSCORE', {
        detail: {
          highscore: ${highscore}
        }
      }));
      true;
    `;
    webViewRef.current.injectJavaScript(highscoreCode);
  };

  // Sync settings whenever they change
  useEffect(() => {
    syncToWebView();
  }, [soundEnabled, vibrationEnabled, highscore]);

  // Handle incoming bridge messages
  const handleBridgeMessage = async (messageString: string) => {
    const validated = validateBridgeMessage(messageString);
    if (!validated) return;

    switch (validated.type) {
      case 'GAME_READY':
        setGameStatus('IDLE');
        syncToWebView();
        break;

      case 'SCORE_UPDATE':
        setScore(validated.payload.score);
        setGameStatus('PLAYING');
        break;

      case 'GAME_OVER':
        setScore(validated.payload.score);
        setGameStatus('GAMEOVER');
        
        // Save highscore
        const didUpdate = await storageService.saveHighScore(validated.payload.score);
        if (didUpdate) {
          const newHigh = await storageService.getHighScore();
          setHighscore(newHigh);
        }
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header (M3 Card style Scoreboard) */}
      <View style={styles.header}>
        <Text style={styles.title}>T-REX RUNNER</Text>
        <View style={styles.scoreContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>HI {String(highscore).padStart(5, '0')}</Text>
          </View>
          <View style={[styles.badge, styles.activeBadge]}>
            <Text style={[styles.badgeText, styles.activeBadgeText]}>
              SCORE {String(score).padStart(5, '0')}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Webview / Mockup Render Window */}
      <View style={styles.gameWindow}>
        {WebView ? (
          <WebView
            ref={webViewRef}
            source={{ html: DINO_HTML }}
            onMessage={(event: any) => handleBridgeMessage(event.nativeEvent.data)}
            style={styles.webview}
            scrollEnabled={false}
            bounces={false}
            overScrollMode="never"
            originWhitelist={['*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            allowingReadAccessToURL="file://"
          />
        ) : (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>⚠️ WebView Not Mounted</Text>
            <Text style={styles.fallbackText}>
              react-native-webview 모듈이 설치되어 있지 않습니다.
              하단 시뮬레이터 패널을 사용해 브릿지 수신 이벤트를 테스트해보세요.
            </Text>
            <View style={styles.mockupStatus}>
              <Text style={styles.mockupStatusText}>게임 상태: {gameStatus}</Text>
              <Text style={styles.mockupStatusText}>최근 점수: {score}</Text>
            </View>
          </View>
        )}
      </View>

      {/* 3. Settings Control Sheet (M3 Style Rounded Sheet) */}
      <View style={styles.settingsSheet}>
        <Text style={styles.sheetTitle}>게임 설정</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>효과음 활성화</Text>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#cbd2d9', true: '#005faf' }}
            thumbColor={soundEnabled ? '#ffffff' : '#f5f5f5'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>게임오버 진동 피드백</Text>
          <Switch
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            trackColor={{ false: '#cbd2d9', true: '#005faf' }}
            thumbColor={vibrationEnabled ? '#ffffff' : '#f5f5f5'}
          />
        </View>
      </View>

      {/* 4. Harness Debug Simulation Controller */}
      <BridgeDebugPanel onSimulateMessage={handleBridgeMessage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa', // Material Background
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#1a1a1a',
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#f0f4f8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#6c7784',
  },
  activeBadge: {
    backgroundColor: 'rgba(0, 95, 175, 0.1)', // Primary tint
  },
  activeBadgeText: {
    color: '#005faf', // Primary
  },
  gameWindow: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd2d9',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c53929',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  fallbackText: {
    fontSize: 12,
    color: '#6c7784',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  mockupStatus: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  mockupStatusText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333333',
    lineHeight: 18,
  },
  settingsSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 3,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  settingText: {
    fontSize: 13,
    color: '#333333',
  },
});
