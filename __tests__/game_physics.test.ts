describe('Chrome Dino Game Physics & Collision Specs', () => {
  // Specs defined in game_specifications.md
  const GROUND_Y = 160;
  const GRAVITY = 0.6;
  const JUMP_FORCE = 12;

  test('Jump Physics: should calculate correct Y and Velocity over frames', () => {
    let dinoY = 130; // 160 - 30 (Dino standing height)
    let vy = -JUMP_FORCE; // Initial jump force upwards
    let isJumping = true;

    // Simulate 1 frame
    dinoY += vy;
    vy += GRAVITY;

    expect(dinoY).toBe(118); // 130 - 12
    expect(vy).toBe(-11.4); // -12 + 0.6

    // Simulate 20 frames (near apex of jump)
    for (let frame = 2; frame <= 20; frame++) {
      dinoY += vy;
      vy += GRAVITY;
    }

    // Apex should be reached when vy is close to 0
    // Theoretically: vy_t = -12 + 0.6 * t = 0 => t = 20 frames
    expect(vy).toBeCloseTo(0, 5);
    expect(dinoY).toBeLessThan(130); // Higher up (smaller Y value)

    // Simulate to landing
    let frames = 20;
    while (isJumping && frames < 100) {
      dinoY += vy;
      vy += GRAVITY;
      frames++;

      if (dinoY >= GROUND_Y - 30) {
        dinoY = GROUND_Y - 30;
        vy = 0;
        isJumping = false;
      }
    }

    expect(isJumping).toBe(false);
    expect(dinoY).toBe(130); // Landed back on ground
    expect(vy).toBe(0);
    expect(frames).toBeCloseTo(41, 0); // Hang time approx 40 frames
  });

  test('AABB Inner Box Collision: should detect overlap with 85% shrink rate', () => {
    // Collision detection algorithm helper (same as implemented in useGameLoop)
    const checkCollision = (dino: any, obs: any) => {
      const shrinkDinoW = dino.width * 0.15;
      const shrinkDinoH = dino.height * 0.15;
      const dinoLeft = dino.x + shrinkDinoW / 2;
      const dinoRight = dino.x + dino.width - shrinkDinoW / 2;
      const dinoTop = dino.y + shrinkDinoH / 2;
      const dinoBottom = dino.y + dino.height - shrinkDinoH / 2;

      const shrinkObsW = obs.width * 0.15;
      const shrinkObsH = obs.height * 0.15;
      const obsLeft = obs.x + shrinkObsW / 2;
      const obsRight = obs.x + obs.width - shrinkObsW / 2;
      const obsTop = obs.y + shrinkObsH / 2;
      const obsBottom = obs.y + obs.height - shrinkObsH / 2;

      return (
        dinoLeft < obsRight &&
        dinoRight > obsLeft &&
        dinoTop < obsBottom &&
        dinoBottom > obsTop
      );
    };

    const dino = { x: 50, y: 130, width: 24, height: 30 }; // Dino standing

    // Case 1: Obstacle clearly overlapping (same coordinates)
    const collidingObs = { x: 50, y: 130, width: 20, height: 30 };
    expect(checkCollision(dino, collidingObs)).toBe(true);

    // Case 2: Obstacle far away
    const farObs = { x: 200, y: 130, width: 20, height: 30 };
    expect(checkCollision(dino, farObs)).toBe(false);

    // Case 3: Edge Case - Marginally overlapping on the outer bounding box
    // But due to 85% Inner Box shrink, it should NOT trigger collision
    // Dino range: x in [50, 74]
    // Dino Inner Box range: left = 50 + 1.8 = 51.8, right = 74 - 1.8 = 72.2
    // Place obstacle at x = 73, width = 20.
    // Obstacle range: x in [73, 93].
    // Outer bounding boxes overlap (dino right 74 > obs left 73).
    // Obstacle Inner Box range: left = 73 + 1.5 = 74.5, right = 93 - 1.5 = 91.5
    // Inner boxes do NOT overlap (dino Inner right 72.2 < obs Inner left 74.5).
    const edgeObs = { x: 73, y: 130, width: 20, height: 30 };
    expect(checkCollision(dino, edgeObs)).toBe(false); // No collision due to inner shrink!
  });
});
