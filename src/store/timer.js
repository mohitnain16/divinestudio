import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'user_timers_v2'; // new key since structure changed

export async function loadTimers() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function saveTimers(list) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}
