// src/screens/PlayerScreen.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import CircularProgress from '../components/CircularProgress';
import { useTimer } from '../logic/useTimer';

export default function PlayerScreen({ seconds, onExit }) {
  const validSeconds =
    Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : null;

  if (!validSeconds) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#b00020',
            textAlign: 'center',
          }}
        >
          Invalid preset duration
        </Text>
        <Text style={{ marginTop: 8, textAlign: 'center' }}>
          Please go back and pick a preset (e.g., 10s, 15s, 30s).
        </Text>
        <Pressable
          onPress={onExit}
          style={[styles.btn, styles.btnBack, { marginTop: 16 }]}
        >
          <Text style={styles.btnTxt}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const { running, remaining, cycles, start, pause, resume, reset, stop } =
    useTimer(validSeconds, { loop: true });

  const progress = useMemo(() => {
    const num = (validSeconds - remaining) / validSeconds;
    if (!Number.isFinite(num)) return 0;
    return Math.min(1, Math.max(0, num));
  }, [remaining, validSeconds]);

  const timeStr = useMemo(
    () => `0:${remaining.toString().padStart(2, '0')}`,
    [remaining],
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <CircularProgress size={240} stroke={14} progress={progress} />
        <Text style={styles.time}>{timeStr}</Text>
        <Text style={styles.sub}>
          of 0:{String(validSeconds).padStart(2, '0')}
        </Text>
        <Text style={styles.cycles}>Cycles completed: {cycles}</Text>
      </View>

      <View style={styles.controlsRow}>
        <Pressable
          onPress={() =>
            running
              ? undefined
              : remaining === validSeconds
              ? start()
              : resume()
          }
          disabled={running}
          style={[styles.btn, running ? styles.btnDisabled : styles.btnPlay]}
        >
          <Text style={styles.btnTxt}>Play</Text>
        </Pressable>

        <Pressable
          onPress={pause}
          disabled={!running}
          style={[styles.btn, !running ? styles.btnDisabled : styles.btnPause]}
        >
          <Text style={styles.btnTxt}>Pause</Text>
        </Pressable>
      </View>

      <View style={styles.controlsRow}>
        <Pressable onPress={reset} style={[styles.btn, styles.btnGhost]}>
          <Text style={styles.btnTxt}>Reset</Text>
        </Pressable>
        <Pressable onPress={stop} style={[styles.btn, styles.btnStop]}>
          <Text style={styles.btnTxt}>Stop</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            stop();
            onExit();
          }}
          style={[styles.btn, styles.btnBack]}
        >
          <Text style={styles.btnTxt}>Back</Text>
        </Pressable>
      </View>

      <Text style={styles.tip}>
        Auto-loop ON: Mandir “ting” every 10s and at completion. Press Stop or
        Back to end.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f6ff',
  },
  card: {
    marginTop: 30,
    width: '92%',
    alignItems: 'center',
    paddingVertical: 22,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  time: { fontSize: 56, fontWeight: '800', marginTop: 14, color: '#1e1b2e' },
  sub: { fontSize: 14, opacity: 0.6, marginTop: 4 },
  cycles: { fontSize: 13, opacity: 0.7, marginTop: 6 },
  controlsRow: { marginTop: 16, flexDirection: 'row', gap: 10 },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 1,
    marginHorizontal: 5,
    minWidth: 96,
    alignItems: 'center',
  },
  btnTxt: { color: '#fff', fontWeight: '700' },
  btnPlay: { backgroundColor: '#33b679' },
  btnPause: { backgroundColor: '#2b2143' },
  btnGhost: { backgroundColor: '#a79df8' },
  btnStop: { backgroundColor: '#e35b5b' },
  btnBack: { backgroundColor: '#6e59ff' },
  btnDisabled: { backgroundColor: '#cbc7ec' },
  tip: { marginTop: 14, opacity: 0.7, textAlign: 'center' },
});
