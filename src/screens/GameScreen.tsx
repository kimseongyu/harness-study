import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
  GestureResponderEvent,
} from 'react-native';
import { storageService } from '../services/storageService';
import { validateGameEvent } from '../utils/bridgeValidator';
import { GameDebugPanel } from '../components/GameDebugPanel';
import { useGameLoop } from '../hooks/useGameLoop';
import { Dino } from '../components/Dino/Dino';
import { Obstacle } from '../components/Obstacle/Obstacle';
import { Ground } from '../components/Ground/Ground';
import { Cloud } from '../components/Cloud/Cloud';

export function GameScreen() {
  const [highscore, setHighscore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Layout measurements for scaling
  const [containerWidth, setContainerWidth] = useState(0);
  const scale = containerWidth > 0 ? containerWidth / 600 : 1;

  // Touch start coordinates to detect swipe down
  const touchStartYRef = useRef(0);

  // Load highscore on mount
  useEffect(() => {
    async function loadHighscore() {
      const savedHigh = await storageService.getHighScore();
      setHighscore(savedHigh);
    }
    loadHighscore();
  }, []);

  const handleGameOver = useCallback(async (finalScore: number) => {
    // Save highscore
    const didUpdate = await storageService.saveHighScore(finalScore);
    if (didUpdate) {
      const newHigh = await storageService.getHighScore();
      setHighscore(newHigh);
    }
  }, []);

  const handleScoreCheckpoint = useCallback((checkpointScore: number) => {
    // Score checkpoint callback (vibration/logging)
    console.log(`Score Checkpoint reached: ${checkpointScore}`);
  }, []);

  // Connect native game loop
  const {
    score,
    gameStatus,
    dinoY,
    isDucking,
    legState,
    obstacles,
    currentFrame,
    speed,
    resetGame,
    triggerJump,
    setDucking,
  } = useGameLoop({
    soundEnabled,
    vibrationEnabled,
    highscore,
    onGameOver: handleGameOver,
    onScoreCheckpoint: handleScoreCheckpoint,
  });

  // Touch handlers for Native Gestures
  const handleTouchStart = (event: GestureResponderEvent) => {
    const touch = event.nativeEvent.touches[0];
    if (touch) {
      touchStartYRef.current = touch.pageY;
    }
    // Default action is jump (or start/restart game)
    triggerJump();
  };

  const handleTouchMove = (event: GestureResponderEvent) => {
    const touch = event.nativeEvent.touches[0];
    if (touch && gameStatus === 'PLAYING') {
      const diffY = touch.pageY - touchStartYRef.current;
      if (diffY > 30) {
        // Swipe Down -> Duck
        setDucking(true);
      }
    }
  };

  const handleTouchEnd = () => {
    // Stop ducking on release
    setDucking(false);
  };

  // Harness event simulation (Debug Panel interface support)
  const handleSimulateEvent = async (event: any) => {
    const validated = validateGameEvent(event);
    if (!validated) return;

    switch (validated.type) {
      case 'GAME_READY':
        resetGame();
        break;

      case 'SCORE_UPDATE':
        handleScoreCheckpoint(validated.payload.score);
        break;

      case 'GAME_OVER':
        handleGameOver(validated.payload.score);
        break;
    }
  };

  const onLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header (M3 Card style Scoreboard) */}
      <View style={styles.header}>
        <Text style={styles.title}>T-REX RUNNER (NATIVE)</Text>
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

      {/* 2. Native Play Window */}
      <View
        style={styles.gameWindow}
        onLayout={onLayout}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {containerWidth > 0 ? (
          <View style={styles.gameContainer}>
            {/* Background elements */}
            <Cloud currentFrame={currentFrame} scale={scale} containerWidth={containerWidth} />
            
            {/* Ground */}
            <Ground
              speed={gameStatus === 'PLAYING' ? speed : 0.2}
              currentFrame={currentFrame}
              scale={scale}
              containerWidth={containerWidth}
            />

            {/* Dino Character */}
            <Dino
              y={dinoY}
              isDucking={isDucking}
              legState={legState}
              isJumping={dinoY < 130}
              scale={scale}
            />

            {/* Dynamic Obstacles */}
            {obstacles.map((obs) => (
              <Obstacle
                key={obs.id}
                type={obs.type}
                x={obs.x}
                y={obs.y}
                width={obs.width}
                height={obs.height}
                wingState={obs.wingState}
                scale={scale}
              />
            ))}

            {/* Static UI States */}
            {gameStatus === 'GAMEOVER' && (
              <View style={styles.overlayContainer}>
                <Text style={styles.overlayTitle}>GAME OVER</Text>
                <Text style={styles.overlaySub}>TAP TO RESTART</Text>
              </View>
            )}

            {gameStatus === 'IDLE' && (
              <View style={styles.overlayContainer}>
                <Text style={styles.overlayTitle}>CHROME DINO</Text>
                <Text style={styles.overlaySub}>TAP TO START JUMP</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>Measuring Layout...</Text>
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
      <GameDebugPanel onSimulateEvent={handleSimulateEvent} />
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
    fontSize: 14,
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
  gameContainer: {
    flex: 1,
    position: 'relative',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#6c7784',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    pointerEvents: 'none',
  },
  overlayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#555555',
    marginBottom: 8,
  },
  overlaySub: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#6c7784',
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
