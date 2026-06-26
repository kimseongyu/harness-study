import React from 'react';
import { View, StyleSheet } from 'react-native';

interface GroundProps {
  speed: number;
  currentFrame: number;
  scale: number;
  containerWidth: number;
}

export function Ground({ speed, currentFrame, scale, containerWidth }: GroundProps) {
  const GROUND_Y = 160;
  const VIRTUAL_WIDTH = 600;

  // Calculate scrolling offset
  // Accumulate distance over frames (simulated using frame index * speed)
  const totalOffset = (currentFrame * speed) % VIRTUAL_WIDTH;
  const leftOffset1 = -totalOffset * scale;
  const leftOffset2 = (-totalOffset + VIRTUAL_WIDTH) * scale;

  // Static dot positions (virtual X, virtual Y offset below ground line)
  const staticDots = [
    { x: 15, y: 5 },
    { x: 45, y: 10 },
    { x: 110, y: 4 },
    { x: 175, y: 8 },
    { x: 230, y: 5 },
    { x: 290, y: 12 },
    { x: 350, y: 4 },
    { x: 420, y: 9 },
    { x: 490, y: 6 },
    { x: 550, y: 11 },
  ];

  // Helper to render one 600px section of ground with line and dots
  const renderGroundSection = (left: number) => {
    return (
      <View style={[styles.groundSection, { left, width: VIRTUAL_WIDTH * scale, height: 20 * scale }]}>
        {/* Ground Line */}
        <View style={[styles.groundLine, { height: 1 * scale }]} />

        {/* Ground Dotted Details */}
        {staticDots.map((dot, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                left: dot.x * scale,
                top: dot.y * scale,
                width: 2 * scale,
                height: 2 * scale,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const top = GROUND_Y * scale;

  return (
    <View style={[styles.outerContainer, { top, width: containerWidth, height: 20 * scale }]}>
      {renderGroundSection(leftOffset1)}
      {renderGroundSection(leftOffset2)}
      {/* If the screen is wider than 600 * scale, render a third section to prevent gaps */}
      {containerWidth > VIRTUAL_WIDTH * scale && renderGroundSection(leftOffset2 + VIRTUAL_WIDTH * scale)}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  groundSection: {
    position: 'absolute',
    top: 0,
  },
  groundLine: {
    width: '100%',
    backgroundColor: '#cccccc',
  },
  dot: {
    position: 'absolute',
    backgroundColor: '#dddddd',
  },
});
