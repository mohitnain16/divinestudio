import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'presets_v1';

export const DEFAULT_PRESETS = [
  { id: 'p10', label: '10s', seconds: 10 },
  { id: 'p15', label: '15s', seconds: 15 },
  { id: 'p20', label: '20s', seconds: 20 },
  { id: 'p25', label: '25s', seconds: 25 },
  { id: 'p30', label: '30s', seconds: 30 },
  { id: 'p45', label: '45s', seconds: 45 },
  { id: 'p60', label: '60s', seconds: 60 },
];

export async function loadPresets() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_PRESETS;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.length ? arr : DEFAULT_PRESETS;
  } catch {
    return DEFAULT_PRESETS;
  }
}

export async function savePresets(presets) {
  await AsyncStorage.setItem(KEY, JSON.stringify(presets));
}
