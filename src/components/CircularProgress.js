// src/components/CircularProgress.js
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function CircularProgress({
  size,
  stroke,
  progress,
  bgColor = '#eee',
  fgColor = '#7a64ff',
}) {
  const radius = Math.max(1, (size - stroke) / 2); // avoid 0/negative
  const circumference = 2 * Math.PI * radius;

  const safeProgress = Number.isFinite(progress)
    ? Math.min(1, Math.max(0, progress))
    : 0;

  // Use dashoffset pattern (more robust than building "dash, circumference" strings)
  const dashOffset = circumference * (1 - safeProgress);

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={fgColor}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
