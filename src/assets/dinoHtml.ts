export const DINO_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>Chrome Dino Game</title>
  <style>
    * {
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
      margin: 0;
      padding: 0;
    }
    body, html {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #fafafa; /* Material 3 Background */
      font-family: monospace;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #gameContainer {
      position: relative;
      width: 100%;
      height: 100%;
      max-width: 600px;
      max-height: 300px;
      background-color: #ffffff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      border-radius: 12px;
      overflow: hidden;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
    }
    #touchArea {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
    }
  </style>
</head>
<body>
  <div id="gameContainer">
    <canvas id="gameCanvas" width="600" height="200"></canvas>
    <div id="touchArea"></div>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Web Audio Synthesizer (Zero external dependencies)
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let soundEnabled = true;
    let vibrationEnabled = true;

    function playSound(freq, duration) {
      if (!soundEnabled) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        console.error('Audio play failed:', e);
      }
    }

    function triggerVibration(duration) {
      if (!vibrationEnabled) return;
      if (navigator.vibrate) {
        navigator.vibrate(duration);
      }
    }

    // Game Constants & Settings
    const GROUND_Y = 160;
    const GRAVITY = 0.6;
    const INITIAL_SPEED = 6.0;
    const MAX_SPEED = 13.0;
    const ACCELERATION = 0.001;

    let score = 0;
    let highscore = 0;
    let speed = INITIAL_SPEED;
    let isGameOver = false;
    let gameStarted = false;
    let currentFrame = 0;

    // Dino State & Shape
    const dino = {
      x: 50,
      y: GROUND_Y,
      width: 24,
      height: 30,
      vy: 0,
      isJumping: false,
      isDucking: false,
      legState: 0,
      jump(force) {
        if (!this.isJumping && !this.isDucking) {
          this.vy = -force;
          this.isJumping = true;
          playSound(250, 0.1);
        }
      },
      duck(ducking) {
        if (!this.isJumping) {
          this.isDucking = ducking;
          this.height = ducking ? 18 : 30;
          this.y = GROUND_Y - this.height;
        }
      },
      update() {
        if (this.isJumping) {
          this.y += this.vy;
          this.vy += GRAVITY;
          if (this.y >= GROUND_Y - this.height) {
            this.y = GROUND_Y - this.height;
            this.vy = 0;
            this.isJumping = false;
          }
        } else {
          this.y = GROUND_Y - this.height;
        }
        
        // Leg animation state
        if (currentFrame % 8 === 0) {
          this.legState = 1 - this.legState;
        }
      },
      draw() {
        ctx.fillStyle = '#555555';
        
        // T-Rex Drawing (Pixel art vectors)
        if (this.isDucking) {
          // Ducking T-Rex
          ctx.fillRect(this.x, this.y + 4, 30, 14); // Body
          ctx.fillRect(this.x + 22, this.y, 10, 8);  // Head
          // Legs
          ctx.fillRect(this.x + 6, this.y + 18, 4, 2);
          ctx.fillRect(this.x + 18, this.y + 18, 4, 2);
        } else {
          // Standing T-Rex
          ctx.fillRect(this.x + 6, this.y, 14, 18);   // Head & Chest
          ctx.fillRect(this.x + 14, this.y - 6, 12, 8); // Snout
          ctx.fillRect(this.x, this.y + 8, 8, 12);    // Tail
          // Body
          ctx.fillRect(this.x + 4, this.y + 12, 14, 14);
          // Eye
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(this.x + 16, this.y - 4, 2, 2);
          
          // Legs
          ctx.fillStyle = '#555555';
          if (this.isJumping) {
            ctx.fillRect(this.x + 6, this.y + 26, 3, 4);
            ctx.fillRect(this.x + 14, this.y + 26, 3, 4);
          } else {
            ctx.fillRect(this.x + 6, this.y + 26, 3, this.legState ? 4 : 2);
            ctx.fillRect(this.x + 14, this.y + 26, 3, this.legState ? 2 : 4);
          }
        }
      }
    };

    // Obstacles Pool
    const obstacles = [];
    class Obstacle {
      constructor(type) {
        this.type = type; // 'CACTUS' or 'BIRD'
        this.x = 620;
        this.width = type === 'CACTUS' ? 15 + Math.random() * 15 : 24;
        this.height = type === 'CACTUS' ? 24 + Math.random() * 16 : 18;
        
        if (type === 'CACTUS') {
          this.y = GROUND_Y - this.height;
        } else {
          // Bird heights: Low, Mid, High
          const heights = [GROUND_Y - 45, GROUND_Y - 30, GROUND_Y - 15];
          this.y = heights[Math.floor(Math.random() * heights.length)];
          this.wingState = 0;
        }
      }
      update() {
        this.x -= speed;
        if (this.type === 'BIRD' && currentFrame % 10 === 0) {
          this.wingState = 1 - this.wingState;
        }
      }
      draw() {
        ctx.fillStyle = '#555555';
        if (this.type === 'CACTUS') {
          // Main stem
          ctx.fillRect(this.x + this.width/3, this.y, this.width/3, this.height);
          // Left arm
          ctx.fillRect(this.x, this.y + this.height/3, this.width/3, 5);
          ctx.fillRect(this.x, this.y + this.height/3 - 6, 4, 6);
          // Right arm
          ctx.fillRect(this.x + (this.width/3)*2, this.y + this.height/2, this.width/3, 5);
          ctx.fillRect(this.x + this.width - 4, this.y + this.height/2 - 6, 4, 6);
        } else {
          // Pterodactyl Bird
          ctx.fillRect(this.x, this.y, this.width, 8); // Body
          ctx.fillRect(this.x + 18, this.y - 3, 6, 6); // Beak
          if (this.wingState === 0) {
            ctx.fillRect(this.x + 6, this.y - 10, 4, 10); // Wing Up
          } else {
            ctx.fillRect(this.x + 6, this.y + 8, 4, 10);  // Wing Down
          }
        }
      }
      getBounds() {
        // Inner Collision Box (85% size) for fairer gameplay
        const shrinkW = this.width * 0.15;
        const shrinkH = this.height * 0.15;
        return {
          x: this.x + shrinkW / 2,
          y: this.y + shrinkH / 2,
          width: this.width - shrinkW,
          height: this.height - shrinkH
        };
      }
    }

    // Helper for collision checking
    function isColliding(a, b) {
      // Dino Bounds shrink slightly as well
      const shrinkDinoW = dino.width * 0.15;
      const shrinkDinoH = dino.height * 0.15;
      const dinoBounds = {
        x: dino.x + shrinkDinoW / 2,
        y: dino.y + shrinkDinoH / 2,
        width: dino.width - shrinkDinoW,
        height: dino.height - shrinkDinoH
      };

      const bBounds = b.getBounds();
      return dinoBounds.x < bBounds.x + bBounds.width &&
             dinoBounds.x + dinoBounds.width > bBounds.x &&
             dinoBounds.y < bBounds.y + bBounds.height &&
             dinoBounds.y + dinoBounds.height > bBounds.y;
    }

    // Score Board rendering helper
    function drawScore() {
      ctx.fillStyle = '#555555';
      ctx.font = '12px monospace';
      
      const scoreStr = String(Math.floor(score)).padStart(5, '0');
      const highStr = String(Math.floor(highscore)).padStart(5, '0');
      
      ctx.fillText('HI ' + highStr + '  ' + scoreStr, canvas.width - 120, 20);
    }

    // Reset Game State
    function resetGame() {
      score = 0;
      speed = INITIAL_SPEED;
      obstacles.length = 0;
      isGameOver = false;
      dino.isJumping = false;
      dino.isDucking = false;
      dino.vy = 0;
      dino.height = 30;
      dino.y = GROUND_Y - dino.height;
      gameStarted = true;
    }

    // Webview postMessage Communication Helper
    function sendBridgeMessage(type, payload) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
      }
    }

    // Main Game Loop
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      currentFrame++;

      // Draw Ground
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(canvas.width, GROUND_Y);
      ctx.stroke();

      // Dotted details on ground
      ctx.fillStyle = '#dddddd';
      for (let i = 0; i < canvas.width; i += 30) {
        const dotOffset = (i - Math.floor(currentFrame * (gameStarted && !isGameOver ? speed : 0.2))) % canvas.width;
        ctx.fillRect(dotOffset < 0 ? dotOffset + canvas.width : dotOffset, GROUND_Y + 5, 2, 2);
      }

      if (gameStarted && !isGameOver) {
        // Increase speed
        speed = Math.min(MAX_SPEED, speed + ACCELERATION);

        // Update score
        score += 0.2;
        if (Math.floor(score) > 0 && Math.floor(score) % 100 === 0 && (score - Math.floor(score)) < 0.21) {
          playSound(500, 0.15); // Checkpoint sound
          sendBridgeMessage('SCORE_UPDATE', { score: Math.floor(score) });
        }

        // Spawning obstacles
        if (obstacles.length === 0 || (obstacles[obstacles.length - 1].x < canvas.width - 200 - Math.random() * 150)) {
          const type = Math.random() > 0.75 ? 'BIRD' : 'CACTUS';
          obstacles.push(new Obstacle(type));
        }

        dino.update();

        // Update & check obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obs = obstacles[i];
          obs.update();
          
          if (isColliding(dino, obs)) {
            // Collision occurred!
            isGameOver = true;
            playSound(100, 0.3); // Game Over buzzer
            triggerVibration(200);
            sendBridgeMessage('GAME_OVER', { score: Math.floor(score) });
          }

          if (obs.x < -40) {
            obstacles.splice(i, 1);
          }
        }
      }

      // Draw T-Rex & Obstacles
      dino.draw();
      obstacles.forEach(o => o.draw());
      drawScore();

      if (isGameOver) {
        ctx.fillStyle = '#555555';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '10px monospace';
        ctx.fillText('TAP TO RESTART', canvas.width / 2, canvas.height / 2 + 15);
        ctx.textAlign = 'left';
      } else if (!gameStarted) {
        ctx.fillStyle = '#555555';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CHROME DINO', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '10px monospace';
        ctx.fillText('TAP TO START JUMP', canvas.width / 2, canvas.height / 2 + 15);
        ctx.textAlign = 'left';
      }

      requestAnimationFrame(loop);
    }

    // Touch Gestures & Input Triggers
    const touchArea = document.getElementById('touchArea');
    let startY = 0;
    let startX = 0;

    touchArea.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (isGameOver) {
        resetGame();
        return;
      }
      if (!gameStarted) {
        resetGame();
        return;
      }

      const touch = e.touches[0];
      startY = touch.clientY;
      startX = touch.clientX;
      
      // Tap default triggers a standard jump
      dino.jump(12);
    });

    touchArea.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!gameStarted || isGameOver) return;
      const touch = e.touches[0];
      const diffY = touch.clientY - startY;
      
      if (diffY > 30) {
        // Swipe Down -> Duck
        dino.duck(true);
      }
    });

    touchArea.addEventListener('touchend', (e) => {
      e.preventDefault();
      // Release ducking
      dino.duck(false);
    });

    // React Native Bridge Message Listeners
    window.addEventListener('SYNC_SETTINGS', (e) => {
      if (e.detail) {
        soundEnabled = e.detail.soundEnabled !== undefined ? e.detail.soundEnabled : soundEnabled;
        vibrationEnabled = e.detail.vibrationEnabled !== undefined ? e.detail.vibrationEnabled : vibrationEnabled;
      }
    });

    window.addEventListener('UPDATE_HIGHSCORE', (e) => {
      if (e.detail && typeof e.detail.highscore === 'number') {
        highscore = e.detail.highscore;
      }
    });

    // Notify Native Realm we are loaded and ready
    sendBridgeMessage('GAME_READY');

    // Run engine loop
    loop();
  </script>
</body>
</html>
`;
