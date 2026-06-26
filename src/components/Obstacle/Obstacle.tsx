import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ObstacleType } from '../../hooks/useGameLoop';

interface ObstacleProps {
  type: ObstacleType;
  x: number; // Virtual X coordinate
  y: number; // Virtual Y coordinate
  width: number; // Virtual width
  height: number; // Virtual height
  wingState: number;
  scale: number;
}

export function Obstacle({ type, x, y, width, height, wingState, scale }: ObstacleProps) {
  const left = x * scale;

  if (type === 'CACTUS') {
    const top = y * scale;
    const widthVal = width * scale;
    const heightVal = height * scale;

    const w3 = width / 3;
    const h3 = height / 3;
    const h2 = height / 2;

    return (
      <View style={[styles.container, { left, top, width: widthVal, height: heightVal }]}>
        {/* Main Stem (width/3, 0, width/3, height) */}
        <View
          style={[
            styles.pixel,
            {
              left: w3 * scale,
              top: 0,
              width: w3 * scale,
              height: heightVal,
            },
          ]}
        />
        {/* Left Arm Horizontal (0, height/3, width/3, 5) */}
        <View
          style={[
            styles.pixel,
            {
              left: 0,
              top: h3 * scale,
              width: w3 * scale,
              height: 5 * scale,
            },
          ]}
        />
        {/* Left Arm Vertical Branch (0, height/3 - 6, 4, 6) */}
        <View
          style={[
            styles.pixel,
            {
              left: 0,
              top: (h3 - 6) * scale,
              width: 4 * scale,
              height: 6 * scale,
            },
          ]}
        />
        {/* Right Arm Horizontal ((width/3)*2, height/2, width/3, 5) */}
        <View
          style={[
            styles.pixel,
            {
              left: w3 * 2 * scale,
              top: h2 * scale,
              width: w3 * scale,
              height: 5 * scale,
            },
          ]}
        />
        {/* Right Arm Vertical Branch (width - 4, height/2 - 6, 4, 6) */}
        <View
          style={[
            styles.pixel,
            {
              left: (width - 4) * scale,
              top: (h2 - 6) * scale,
              width: 4 * scale,
              height: 6 * scale,
            },
          ]}
        />
      </View>
    );
  } else {
    // Pterodactyl Bird: width = 24, height = 18.
    // Note: y ranges from y - 10 (wing up) to y + 18 (wing down).
    // Let's position the container's top at (y - 10) * scale.
    // Total height will be 28 * scale.
    const top = (y - 10) * scale;
    const widthVal = width * scale;
    const heightVal = 28 * scale;

    return (
      <View style={[styles.container, { left, top, width: widthVal, height: heightVal }]}>
        {/* Body (0, 10 (y), 24, 8) */}
        <View
          style={[
            styles.pixel,
            {
              left: 0,
              top: 10 * scale,
              width: width * scale,
              height: 8 * scale,
            },
          ]}
        />
        {/* Beak (18, 7 (y-3), 6, 6) */}
        <View
          style={[
            styles.pixel,
            {
              left: 18 * scale,
              top: 7 * scale,
              width: 6 * scale,
              height: 6 * scale,
            },
          ]}
        />
        {/* Wing (6, 0 (y-10) [Up] or 18 (y+8) [Down], 4, 10) */}
        {wingState === 0 ? (
          <View
            style={[
              styles.pixel,
              {
                left: 6 * scale,
                top: 0 * scale,
                width: 4 * scale,
                height: 10 * scale,
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.pixel,
              {
                left: 6 * scale,
                top: 18 * scale,
                width: 4 * scale,
                height: 10 * scale,
              },
            ]}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  pixel: {
    position: 'absolute',
    backgroundColor: '#555555',
  },
});
