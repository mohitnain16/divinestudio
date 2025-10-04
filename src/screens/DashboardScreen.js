import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
} from 'react-native';
import TimerCard from '../components/TimerCard';
import { DEFAULT_PRESETS } from '../store/presets';

// seed a few sample timers; you can make this dynamic later
const DEFAULT_TIMERS = [
  { id: 't1', label: 'Tea', seconds: 260, color: '#35d07f' }, // 04:20
  { id: 't2', label: 'Homemade Bread', seconds: 420, color: '#ff5d5d' }, // 07:00
  { id: 't3', label: 'Race Pace', seconds: 4940, color: '#ffd166' }, // 01:22:20
  { id: 't4', label: 'Laundry', seconds: 3549, color: '#4f7cff' }, // 59:09
  { id: 't5', label: 'Meditation', seconds: 900, color: '#ffe14d' }, // 15:00
];

export default function DashboardScreen({ onBack }) {
  const [timers, setTimers] = useState(DEFAULT_TIMERS);

  // quick add: create from your presets (10/15/20…)
  const addFromPreset = sec => {
    const id = `t${Date.now()}`;
    setTimers(arr => [
      ...arr,
      {
        id,
        label: `${sec}s Timer`,
        seconds: sec,
        color: pickColor(arr.length),
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TimerCard
      key={item.id}
      id={item.id}
      title={item.label}
      seconds={item.seconds}
      color={item.color}
      loop={true} // keep looping until Stop
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#120f1a' }}>
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.iconBtn}>
          <Text style={styles.iconTxt}>≡</Text>
        </Pressable>
        <Text style={styles.header}>MY TIMERS</Text>
        <Pressable
          onPress={() => addFromPreset(DEFAULT_PRESETS[0].seconds)}
          style={styles.iconBtn}
        >
          <Text style={styles.iconTxt}>＋</Text>
        </Pressable>
      </View>

      <FlatList
        data={timers}
        keyExtractor={i => i.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={renderItem}
      />

      <View style={styles.presetRow}>
        {DEFAULT_PRESETS.map(p => (
          <Pressable
            key={p.id}
            onPress={() => addFromPreset(p.seconds)}
            style={styles.presetChip}
          >
            <Text style={styles.presetTxt}>{p.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function pickColor(i) {
  const palette = [
    '#35d07f',
    '#ff5d5d',
    '#ffd166',
    '#4f7cff',
    '#ffe14d',
    '#00d1ff',
    '#ff8dd1',
    '#9b87ff',
  ];
  return palette[i % palette.length];
}

const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: { color: '#fff', fontWeight: '800', letterSpacing: 1, fontSize: 14 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#221c2e',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#2b2540',
    borderWidth: 1,
  },
  iconTxt: { color: '#bfb7ff', fontSize: 18, fontWeight: '700' },
  grid: { padding: 10, gap: 12 },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    justifyContent: 'center',
  },
  presetChip: {
    borderColor: '#2b2540',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1a1426',
  },
  presetTxt: { color: '#d9d6ff', fontWeight: '700' },
});
