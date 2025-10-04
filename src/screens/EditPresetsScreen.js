import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';

export default function EditPresetsScreen({ presets, onSave, onCancel }) {
  const [list, setList] = useState(presets);
  const [seconds, setSeconds] = useState('');

  const add = () => {
    const s = parseInt(seconds, 10);
    if (isNaN(s) || s < 5 || s > 600) {
      Alert.alert('Invalid', 'Enter seconds between 5 and 600.');
      return;
    }
    setList([...list, { id: `p${Date.now()}`, label: `${s}s`, seconds: s }]);
    setSeconds('');
  };

  const remove = id => setList(list.filter(x => x.id !== id));
  const sorted = useMemo(
    () => [...list].sort((a, b) => a.seconds - b.seconds),
    [list],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Presets</Text>

      <FlatList
        data={sorted}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.label}</Text>
            <Pressable onPress={() => remove(item.id)} style={styles.del}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Delete</Text>
            </Pressable>
          </View>
        )}
        ListFooterComponent={
          <View>
            <View style={styles.addRow}>
              <TextInput
                value={seconds}
                onChangeText={setSeconds}
                placeholder="Add seconds (5–600)"
                keyboardType="number-pad"
                style={styles.input}
              />
              <Pressable onPress={add} style={styles.addBtn}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Add</Text>
              </Pressable>
            </View>
            <View style={{ height: 14 }} />
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'center',
              }}
            >
              <Pressable
                onPress={() => onSave(sorted)}
                style={[styles.bottomBtn, { backgroundColor: '#2b2143' }]}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
              </Pressable>
              <Pressable
                onPress={onCancel}
                style={[styles.bottomBtn, { backgroundColor: '#a79df8' }]}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
    color: '#1e1b2e',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f5f4ff',
    marginVertical: 6,
  },
  rowText: { fontSize: 16, fontWeight: '700', color: '#2b2143' },
  del: {
    backgroundColor: '#e35b5b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addBtn: {
    backgroundColor: '#6e59ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bottomBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
});
