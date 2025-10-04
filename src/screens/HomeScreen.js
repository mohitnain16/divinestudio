import React, { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import TimerCard from '../components/TimerCard';
import { loadTimers, saveTimers } from '../store/timer';
import { BELL_TYPES, playBell } from '../audio/bell';

const palette = [
  '#35d07f',
  '#ff5d5d',
  '#ffd166',
  '#4f7cff',
  '#ffe14d',
  '#00d1ff',
  '#9b87ff',
];

export default function HomeScreen() {
  const [timers, setTimers] = useState([]);
  const [open, setOpen] = useState(false);

  // form state
  const [label, setLabel] = useState('New Timer');
  const [min, setMin] = useState('0');
  const [sec, setSec] = useState('30');
  const [bellType, setBellType] = useState(BELL_TYPES[0]); // 'mandir'
  const [loop, setLoop] = useState(true);

  // preview UX state
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    (async () => setTimers(await loadTimers()))();
  }, []);
  useEffect(() => {
    saveTimers(timers);
  }, [timers]);

  const totalSeconds = useMemo(() => {
    const m = parseInt(min || '0', 10);
    const s = parseInt(sec || '0', 10);
    return isNaN(m) || isNaN(s) ? 0 : m * 60 + s;
  }, [min, sec]);

  const addTimer = () => {
    const seconds = totalSeconds;
    if (!label.trim()) return Alert.alert('Name required', 'Add a label.');
    if (seconds < 5)
      return Alert.alert('Too short', 'Choose at least 5 seconds.');
    if (!BELL_TYPES.includes(bellType))
      return Alert.alert('Bell not found', 'Pick a valid bell type.');

    const idx = timers.length % palette.length;
    const newTimer = {
      id: `t${Date.now()}`,
      label: label.trim(),
      seconds,
      color: palette[idx],
      loop,
      bellType,
    };
    setTimers([newTimer, ...timers]);
    setOpen(false);
  };

  const removeTimer = id => setTimers(arr => arr.filter(t => t.id !== id));

  // --- NEW: preview the selected bell
  const testSelectedBell = async () => {
    try {
      setTesting(true);
      // Optional: you can tweak preview volume here (0..1)
      playBell(bellType, { volume: 1 });
      // simple anti-spam delay (typical bell <= 2s)
      setTimeout(() => setTesting(false), 1200);
    } catch {
      setTesting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>🕉️ Divine Yoga Studio</Text>
        <Pressable onPress={() => setOpen(true)} style={styles.addBtn}>
          <Text style={styles.addTxt}>＋</Text>
        </Pressable>
      </View>

      {/* Timers list */}
      <FlatList
        data={timers}
        keyExtractor={i => i.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={
          timers.length > 1 ? { justifyContent: 'space-between' } : undefined
        }
        renderItem={({ item }) => (
          <TimerCard item={item} onDelete={removeTimer} />
        )}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text
              style={{ color: '#cfc9ff', opacity: 0.85, textAlign: 'center' }}
            >
              No timers yet. Tap ＋ to create one and choose its bell.
            </Text>
          </View>
        }
      />

      {/* Create Timer Modal */}
      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>Create Timer</Text>

            <TextInput
              placeholder="Label (e.g., Surya Namaskar)"
              placeholderTextColor="#b2abda"
              value={label}
              onChangeText={setLabel}
              style={styles.input}
            />

            <View style={styles.row}>
              <TextInput
                placeholder="Min"
                placeholderTextColor="#b2abda"
                keyboardType="number-pad"
                value={min}
                onChangeText={setMin}
                style={[styles.input, { flex: 1, marginRight: 8 }]}
              />
              <TextInput
                placeholder="Sec"
                placeholderTextColor="#b2abda"
                keyboardType="number-pad"
                value={sec}
                onChangeText={setSec}
                style={[styles.input, { flex: 1, marginLeft: 8 }]}
              />
            </View>

            {/* Bell picker */}
            <Text style={styles.sectionLabel}>Bell Type</Text>
            <View style={styles.chips}>
              {BELL_TYPES.map(b => (
                <Pressable
                  key={b}
                  onPress={() => setBellType(b)}
                  style={[
                    styles.chip,
                    bellType === b && {
                      backgroundColor: '#2b2143',
                      borderColor: '#6e64a8',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipTxt,
                      bellType === b && { color: '#fff' },
                    ]}
                  >
                    {b.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* NEW: Test Bell button */}
            <Pressable
              onPress={testSelectedBell}
              disabled={testing}
              style={[styles.testBtn, testing && { opacity: 0.6 }]}
            >
              {testing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.testTxt}>▶ Test Bell</Text>
              )}
            </Pressable>

            {/* Loop toggle */}
            <View style={[styles.row, { alignItems: 'center', marginTop: 10 }]}>
              <Text style={{ color: '#cfc9ff', fontWeight: '700' }}>Loop</Text>
              <Pressable
                onPress={() => setLoop(!loop)}
                style={[
                  styles.toggle,
                  loop ? styles.toggleOn : styles.toggleOff,
                ]}
              >
                <View
                  style={[
                    styles.knob,
                    loop
                      ? { alignSelf: 'flex-end' }
                      : { alignSelf: 'flex-start' },
                  ]}
                />
              </Pressable>
            </View>

            <Text style={styles.preview}>
              Preview: {String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:
              {String(totalSeconds % 60).padStart(2, '0')} •{' '}
              {bellType.toUpperCase()}
            </Text>

            <View style={styles.actions}>
              <Pressable
                onPress={() => setOpen(false)}
                style={[styles.btn, { backgroundColor: '#a79df8' }]}
              >
                <Text style={styles.btnTxt}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={addTimer}
                style={[styles.btn, { backgroundColor: '#33b679' }]}
              >
                <Text style={styles.btnTxt}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#120f1a' },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: { color: '#fff', fontWeight: '800', letterSpacing: 1, fontSize: 16 },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#221c2e',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#2b2540',
    borderWidth: 1,
  },
  addTxt: { color: '#bfb7ff', fontSize: 18, fontWeight: '700' },
  listContent: { padding: 10 },

  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '88%',
    backgroundColor: '#171326',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2b2540',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 10 },
  input: {
    backgroundColor: '#1d1830',
    borderWidth: 1,
    borderColor: '#2b2540',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginTop: 10,
  },
  row: { flexDirection: 'row', marginTop: 10 },

  sectionLabel: { color: '#cfc9ff', marginTop: 12, fontWeight: '800' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderColor: '#2b2540',
    borderWidth: 1,
    backgroundColor: '#1a1426',
  },
  chipTxt: { color: '#d9d6ff', fontWeight: '800', fontSize: 12 },

  testBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#2bd681',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  testTxt: { color: '#0b1720', fontWeight: '900' },

  toggle: {
    marginLeft: 12,
    width: 56,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleOn: { backgroundColor: '#2bd681' },
  toggleOff: { backgroundColor: '#4b445f' },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },

  preview: { color: '#cfc9ff', marginTop: 12, textAlign: 'center' },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    justifyContent: 'flex-end',
  },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  btnTxt: { color: '#fff', fontWeight: '800' },
});
