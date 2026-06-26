import React from 'react';
import { View, StyleSheet } from 'react-native';

interface CloudProps {
  currentFrame: number;
  scale: number;
  containerWidth: number;
}

export function Cloud({ currentFrame, scale, containerWidth }: CloudProps) {
  const VIRTUAL_WIDTH = 600;

  // Render 3 clouds at different heights and speeds
  const clouds = [
    { id: 1, baseSpeed: 0.3, initialX: 100, y: 30, w: 32, h: 10 },
    { id: 2, baseSpeed: 0.2, initialX: 350, y: 50, w: 26, h: 8 },
    { id: 3, baseSpeed: 0.15, initialX: 550, y: 20, w: 40, h: 12 },
  ];

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {clouds.map((c) => {
        // Calculate scroll offset based on frame and base speed
        const offset = (currentFrame * c.baseSpeed) % (VIRTUAL_WIDTH + 60);
        // Virtual scroll coordinate
        let virtualX = c.initialX - offset;
        if (virtualX < -60) {
          virtualX += (VIRTUAL_WIDTH + 60);
        }

        const left = virtualX * scale;
        const top = c.y * scale;
        const widthVal = c.w * scale;
        const heightVal = c.h * scale;

        return (
          <View
            key={c.id}
            style={[
              styles.cloudContainer,
              {
                left,
                top,
                width: widthVal,
                height: heightVal,
              },
            ]}
          >
            {/* Cloud shape (pixelated bars overlapping) */}
            {/* Top Bar */}
            <View
              style={[
                styles.pixel,
                {
                  left: 4 * scale,
                  top: 0,
                  width: (c.w - 12) * scale,
                  height: 3 * scale,
                },
              ]}
            />
            {/* Mid Bar */}
            <View
              style={[
                styles.pixel,
                {
                  left: 2 * scale,
                  top: 3 * scale,
                  width: (c.w - 4) * scale,
                  height: 4 * scale,
                },
              ]}
            />
            {/* Bottom Bar */}
            <View
              style={[
                styles.pixel,
                {
                  left: 0,
                  top: 7 * scale,
                  width: c.w * scale,
                  height: (c.h - 7) * scale,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  cloudContainer: {
    position: 'absolute',
    opacity: 0.35, // Soft background blend
  },
  pixel: {
    position: 'absolute',
    backgroundColor: '#9e9e9e', // Material 3 neutral tone
    borderRadius: 1,
  },
});
