import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DinoProps {
  y: number; // Virtual Y coordinate
  isDucking: boolean;
  legState: number;
  isJumping: boolean;
  scale: number;
}

export function Dino({ y, isDucking, legState, isJumping, scale }: DinoProps) {
  // Convert virtual coordinates to scale-adjusted pixels
  const left = 50 * scale;
  const top = y * scale;

  if (isDucking) {
    // Ducking T-Rex: Virtual container width: 30, height: 18
    const heightVal = 18 * scale;
    const widthVal = 30 * scale;

    return (
      <View style={[styles.container, { left, top, width: widthVal, height: heightVal + 2 * scale }]}>
        {/* Body (0, 4, 30, 14) */}
        <View
          style={[
            styles.pixel,
            {
              left: 0 * scale,
              top: 4 * scale,
              width: 30 * scale,
              height: 14 * scale,
            },
          ]}
        />
        {/* Head (22, 0, 10, 8) */}
        <View
          style={[
            styles.pixel,
            {
              left: 22 * scale,
              top: 0 * scale,
              width: 10 * scale,
              height: 8 * scale,
            },
          ]}
        />
        {/* Left Leg (6, 18, 4, 2) */}
        <View
          style={[
            styles.pixel,
            {
              left: 6 * scale,
              top: 18 * scale,
              width: 4 * scale,
              height: 2 * scale,
            },
          ]}
        />
        {/* Right Leg (18, 18, 4, 2) */}
        <View
          style={[
            styles.pixel,
            {
              left: 18 * scale,
              top: 18 * scale,
              width: 4 * scale,
              height: 2 * scale,
            },
          ]}
        />
      </View>
    );
  } else {
    // Standing T-Rex: Virtual container width: 24, height: 30
    // Note: snout starts at y - 6 relative to container top (y)
    const containerTop = top - 6 * scale;
    const heightVal = 36 * scale; // snout top (-6) to legs bottom (30)
    const widthVal = 26 * scale;  // tail (0) to snout end (26)

    // Leg heights based on animation state
    const leftLegHeight = isJumping ? 4 : legState === 1 ? 4 : 2;
    const rightLegHeight = isJumping ? 4 : legState === 1 ? 2 : 4;

    return (
      <View style={[styles.container, { left, top: containerTop, width: widthVal, height: heightVal }]}>
        {/* Snout (14, 0 (y-6), 12, 8) */}
        <View
          style={[
            styles.pixel,
            {
              left: 14 * scale,
              top: 0 * scale,
              width: 12 * scale,
              height: 8 * scale,
            },
          ]}
        />
        {/* Head & Chest (6, 6 (y), 14, 18) */}
        <View
          style={[
            styles.pixel,
            {
              left: 6 * scale,
              top: 6 * scale,
              width: 14 * scale,
              height: 18 * scale,
            },
          ]}
        />
        {/* Chest/Body Lower (4, 18 (y+12), 14, 14) */}
        <View
          style={[
            styles.pixel,
            {
              left: 4 * scale,
              top: 18 * scale,
              width: 14 * scale,
              height: 14 * scale,
            },
          ]}
        />
        {/* Tail (0, 14 (y+8), 8, 12) */}
        <View
          style={[
            styles.pixel,
            {
              left: 0 * scale,
              top: 14 * scale,
              width: 8 * scale,
              height: 12 * scale,
            },
          ]}
        />
        {/* Eye (White) (16, 2 (y-4), 2, 2) */}
        <View
          style={[
            styles.eyePixel,
            {
              left: 16 * scale,
              top: 2 * scale,
              width: 2 * scale,
              height: 2 * scale,
            },
          ]}
        />
        {/* Left Leg (6, 32 (y+26), 3, leftLegHeight) */}
        <View
          style={[
            styles.pixel,
            {
              left: 6 * scale,
              top: 32 * scale,
              width: 3 * scale,
              height: leftLegHeight * scale,
            },
          ]}
        />
        {/* Right Leg (14, 32 (y+26), 3, rightLegHeight) */}
        <View
          style={[
            styles.pixel,
            {
              left: 14 * scale,
              top: 32 * scale,
              width: 3 * scale,
              height: rightLegHeight * scale,
            },
          ]}
        />
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
  eyePixel: {
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
});
