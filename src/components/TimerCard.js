import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTimer } from '../logic/useTimer';
import IconCircleButton from './IconCircleButton';

// 🟣 Circular progress ring
function Ring({ size = 150, stroke = 10, progress = 0, color = '#35d07f' }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Number.isFinite(progress)
    ? Math.max(0, Math.min(1, progress))
    : 0;
  const dashOffset = circumference * (1 - pct);

  return (
    <Svg
      width={size}
      height={size}
      style={{ transform: [{ rotate: '-90deg' }] }}
    >
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#241f32"
        strokeWidth={stroke}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 🕉️ Timer Card Component
export default function TimerCard({ item }) {
  const { width } = useWindowDimensions();

  // Responsive sizes
  const ringSize = Math.round(Math.min(180, Math.max(120, width * 0.36)));
  const btnDiameter = Math.round(Math.min(56, Math.max(44, width * 0.12)));
  const iconSize = Math.round(btnDiameter * 0.45);

  const { id, label, seconds, color, loop = true } = item;

  const { running, remaining, cycles, start, pause, resume, reset, stop } =
    useTimer(seconds, { loop, label });

  // 👇 Attach to global for Notifee actions (Pause / Stop)
  global.__TIMER_CONTROL = { pause, stop };

  // Calculate progress %
  const progress = useMemo(() => {
    const v = (seconds - remaining) / seconds;
    return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0;
  }, [remaining, seconds]);

  // Format time mm:ss
  const mm = Math.floor(remaining / 60)
    .toString()
    .padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');

  const handlePlayPause = () => {
    if (running) pause();
    else remaining === seconds ? start() : resume();
  };

  return (
    <View style={[styles.card, { borderColor: '#2b2540' }]}>
      {/* Ring */}
      <View style={[styles.ringWrap, { shadowColor: color }]}>
        <Ring
          size={ringSize}
          stroke={Math.max(8, Math.round(ringSize * 0.065))}
          progress={progress}
          color={color}
        />
        <View style={styles.center}>
          <Text
            style={[styles.time, { fontSize: Math.round(ringSize * 0.15) }]}
          >
            {mm}:{ss}
          </Text>
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.iconRow}>
        <IconCircleButton
          name={running ? 'pause' : 'play'}
          onPress={handlePlayPause}
          color={running ? '#F59E0B' : '#10B981'}
          diameter={btnDiameter}
          size={iconSize}
        />
        {/* <IconCircleButton
          name="reload"
          onPress={reset}
          color="#6366F1"
          diameter={btnDiameter}
          size={iconSize}
        /> */}
        <IconCircleButton
          name="stop"
          onPress={(reset, stop)}
          color="#EF4444"
          diameter={btnDiameter}
          size={iconSize}
        />
      </View>

      {/* Cycles Counter */}
      <Text style={styles.cycleTxt}>Cycles: {cycles}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    margin: 6,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: '#171326',
    borderWidth: 1,
  },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: { fontWeight: '800', color: '#fff' },
  label: {
    color: '#c9c3ff',
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    maxWidth: 120,
    textAlign: 'center',
  },
  iconRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: 10,
  },
  cycleTxt: {
    color: '#9b96c7',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 11,
  },
});
