import { useState, useEffect, useRef, useCallback } from 'react';
import { Vibration, AppState, AppStateStatus } from 'react-native';

export type GameStatus = 'IDLE' | 'PLAYING' | 'GAMEOVER';
export type ObstacleType = 'CACTUS' | 'BIRD';

export interface ObstacleData {
  id: number;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  wingState: number;
}

export interface UseGameLoopProps {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  highscore: number;
  onGameOver: (score: number) => void;
  onScoreCheckpoint: (score: number) => void;
}

export function useGameLoop({
  soundEnabled,
  vibrationEnabled,
  highscore,
  onGameOver,
  onScoreCheckpoint,
}: UseGameLoopProps) {
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('IDLE');
  const [dinoY, setDinoY] = useState(130); // Ground (160) - DinoHeight (30) = 130
  const [isDucking, setIsDucking] = useState(false);
  const [legState, setLegState] = useState(0);
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);

  // Physics engine parameters (using Virtual Coordinate System 600x200)
  const GROUND_Y = 160;
  const GRAVITY = 0.6;
  const JUMP_FORCE = 12;
  const INITIAL_SPEED = 6.0;
  const MAX_SPEED = 13.0;
  const ACCELERATION = 0.001;

  // Use ref to keep callbacks and settings up to date without re-triggering requestAnimationFrame
  const callbacksRef = useRef({
    soundEnabled,
    vibrationEnabled,
    onGameOver,
    onScoreCheckpoint,
  });

  // Keep references updated
  useEffect(() => {
    callbacksRef.current = {
      soundEnabled,
      vibrationEnabled,
      onGameOver,
      onScoreCheckpoint,
    };
  }, [soundEnabled, vibrationEnabled, onGameOver, onScoreCheckpoint]);

  // AppState management to optimize battery and pause loop in background
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      appStateRef.current = nextAppState;
      if (nextAppState === 'active') {
        // Clear delta time marker on active return to prevent sudden teleport issues
        lastTimeRef.current = null;
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  // Internal mutable states to run physics smoothly in requestAnimationFrame
  const stateRef = useRef({
    score: 0,
    gameStatus: 'IDLE' as GameStatus,
    speed: INITIAL_SPEED,
    currentFrame: 0,
    dino: {
      x: 50,
      y: 130,
      width: 24,
      height: 30,
      vy: 0,
      isJumping: false,
      isDucking: false,
      legState: 0,
    },
    obstacles: [] as ObstacleData[],
    obstacleIdCounter: 0,
    gameOverTriggered: false, // Prevent duplicate gameover callback triggers
  });

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Sync React state updates (throttled to UI updates)
  const syncReactState = useCallback(() => {
    const internal = stateRef.current;
    setScore(Math.floor(internal.score));
    setGameStatus(internal.gameStatus);
    setDinoY(internal.dino.y);
    setIsDucking(internal.dino.isDucking);
    setLegState(internal.dino.legState);
    setObstacles([...internal.obstacles]);
  }, []);

  const triggerVibration = useCallback((duration: number) => {
    if (callbacksRef.current.vibrationEnabled) {
      Vibration.vibrate(duration);
    }
  }, []);

  // Main Loop logic - dependency array is empty, ensuring this is created only once
  const updatePhysics = useCallback((time: number) => {
    // 0. Hold execution if app is not active (background / inactive)
    if (appStateRef.current !== 'active') {
      lastTimeRef.current = null;
      requestRef.current = requestAnimationFrame(updatePhysics);
      return;
    }

    if (lastTimeRef.current !== null) {
      const internal = stateRef.current;

      if (internal.gameStatus === 'PLAYING') {
        internal.currentFrame++;

        // 1. Difficulty Speed Scaling
        internal.speed = Math.min(MAX_SPEED, internal.speed + ACCELERATION);

        // 2. Score calculation (0.2 points per frame)
        const prevScoreFloor = Math.floor(internal.score);
        internal.score += 0.2;
        const currentScoreFloor = Math.floor(internal.score);

        // Checkpoint every 100 points
        if (currentScoreFloor > prevScoreFloor && currentScoreFloor % 100 === 0) {
          if (callbacksRef.current.soundEnabled) {
            console.log(`[Sound Synth Placeholder] Checkpoint sound at score ${currentScoreFloor}`);
          }
          callbacksRef.current.onScoreCheckpoint(currentScoreFloor);
        }

        // 3. Dino Physics
        const dino = internal.dino;
        if (dino.isJumping) {
          dino.y += dino.vy;
          dino.vy += GRAVITY;
          
          const curDinoHeight = dino.isDucking ? 18 : 30;
          if (dino.y >= GROUND_Y - curDinoHeight) {
            dino.y = GROUND_Y - curDinoHeight;
            dino.vy = 0;
            dino.isJumping = false;
          }
        } else {
          const curDinoHeight = dino.isDucking ? 18 : 30;
          dino.y = GROUND_Y - curDinoHeight;
        }

        // Leg animation state update every 8 frames
        if (internal.currentFrame % 8 === 0) {
          dino.legState = 1 - dino.legState;
        }

        // 4. Obstacle management
        // Update position
        internal.obstacles.forEach((obs) => {
          obs.x -= internal.speed;
          if (obs.type === 'BIRD' && internal.currentFrame % 10 === 0) {
            obs.wingState = 1 - obs.wingState;
          }
        });

        // Spawn obstacles
        if (
          internal.obstacles.length === 0 ||
          internal.obstacles[internal.obstacles.length - 1].x < 600 - 200 - Math.random() * 150
        ) {
          const type: ObstacleType = Math.random() > 0.75 ? 'BIRD' : 'CACTUS';
          let obsWidth = 24;
          let obsHeight = 18;
          let obsY = GROUND_Y - obsHeight;

          if (type === 'CACTUS') {
            obsWidth = 15 + Math.random() * 15;
            obsHeight = 24 + Math.random() * 16;
            obsY = GROUND_Y - obsHeight;
          } else {
            // Bird heights: Low (115), Mid (130), High (145)
            const heights = [GROUND_Y - 45, GROUND_Y - 30, GROUND_Y - 15];
            obsY = heights[Math.floor(Math.random() * heights.length)];
          }

          internal.obstacleIdCounter++;
          internal.obstacles.push({
            id: internal.obstacleIdCounter,
            type,
            x: 620,
            y: obsY,
            width: obsWidth,
            height: obsHeight,
            wingState: 0,
          });
        }

        // Filter out off-screen obstacles
        internal.obstacles = internal.obstacles.filter((obs) => obs.x > -40);

        // 5. Collision checking
        const shrinkDinoW = dino.width * 0.15;
        const shrinkDinoH = dino.height * 0.15;
        const dinoLeft = dino.x + shrinkDinoW / 2;
        const dinoRight = dino.x + dino.width - shrinkDinoW / 2;
        const dinoTop = dino.y + shrinkDinoH / 2;
        const dinoBottom = dino.y + dino.height - shrinkDinoH / 2;

        let collisionOccurred = false;
        for (let i = 0; i < internal.obstacles.length; i++) {
          const obs = internal.obstacles[i];
          const shrinkObsW = obs.width * 0.15;
          const shrinkObsH = obs.height * 0.15;
          const obsLeft = obs.x + shrinkObsW / 2;
          const obsRight = obs.x + obs.width - shrinkObsW / 2;
          const obsTop = obs.y + shrinkObsH / 2;
          const obsBottom = obs.y + obs.height - shrinkObsH / 2;

          // AABB overlap check
          if (
            dinoLeft < obsRight &&
            dinoRight > obsLeft &&
            dinoTop < obsBottom &&
            dinoBottom > obsTop
          ) {
            collisionOccurred = true;
            break;
          }
        }

        if (collisionOccurred && !internal.gameOverTriggered) {
          internal.gameStatus = 'GAMEOVER';
          internal.gameOverTriggered = true;
          if (callbacksRef.current.soundEnabled) {
            console.log('[Sound Synth Placeholder] Game Over sound (100Hz, 0.3s)');
          }
          triggerVibration(200);
          callbacksRef.current.onGameOver(Math.floor(internal.score));
        }
      }

      // Sync refs with React state to trigger UI rendering
      syncReactState();
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(updatePhysics);
  }, [syncReactState, triggerVibration]);

  // Handle Touch Inputs
  const triggerJump = useCallback(() => {
    const internal = stateRef.current;
    if (internal.gameStatus === 'PLAYING') {
      const dino = internal.dino;
      if (!dino.isJumping && !dino.isDucking) {
        dino.vy = -JUMP_FORCE;
        dino.isJumping = true;
        if (callbacksRef.current.soundEnabled) {
          console.log('[Sound Synth Placeholder] Jump sound (250Hz, 0.1s)');
        }
      }
    } else {
      // Start or restart game from IDLE / GAMEOVER
      resetGame();
    }
  }, [resetGame]);

  const setDucking = useCallback((ducking: boolean) => {
    const internal = stateRef.current;
    if (internal.gameStatus === 'PLAYING') {
      const dino = internal.dino;
      if (!dino.isJumping) {
        dino.isDucking = ducking;
        dino.height = ducking ? 18 : 30;
        dino.y = GROUND_Y - dino.height;
      }
    }
  }, []);

  const resetGame = useCallback(() => {
    const internal = stateRef.current;
    internal.score = 0;
    internal.speed = INITIAL_SPEED;
    internal.obstacles = [];
    internal.gameStatus = 'PLAYING';
    internal.dino.isJumping = false;
    internal.dino.isDucking = false;
    internal.dino.vy = 0;
    internal.dino.height = 30;
    internal.dino.y = GROUND_Y - internal.dino.height;
    internal.obstacleIdCounter = 0;
    internal.gameOverTriggered = false; // Reset gameover lock
    lastTimeRef.current = null;
    syncReactState();
  }, [syncReactState]);

  // Start Animation Loop on Mount
  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [updatePhysics]);

  return {
    score,
    gameStatus,
    dinoY,
    isDucking,
    legState,
    obstacles,
    currentFrame: stateRef.current.currentFrame,
    speed: stateRef.current.speed,
    resetGame,
    triggerJump,
    setDucking,
  };
}
