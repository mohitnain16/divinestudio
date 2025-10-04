import Sound from 'react-native-sound';
import { Vibration, Platform } from 'react-native';

// --- Use Playback so iOS ignores the silent switch (plays sound) ---
Sound.setCategory(Platform.OS === 'ios' ? 'Playback' : 'Ambient', true); // mixWithOthers=true

// Supported bell keys exported for the UI picker
export const BELL_TYPES = [
  'mandir',
  'big',
  'church',
  'evil',
  'gong',
  'temple',
  'school',
  'ship',
];

// Map bell type -> require(...) asset (bundled by Metro)
const SRC = {
  mandir: require('../../assets/audio/mandir_bell.mp3'),
  big: require('../../assets/audio/big_bell.mp3'),
  church: require('../../assets/audio/church_bell.mp3'),
  evil: require('../../assets/audio/evil_bell.mp3'),
  gong: require('../../assets/audio/gong_bell.mp3'),
  temple: require('../../assets/audio/mandir_bell.mp3'),
  school: require('../../assets/audio/school_bell.mp3'),
  ship: require('../../assets/audio/ship_bell_two_chimes.mp3'),
};

// In-memory cache of Sound instances
let sounds = {};
let initialized = false;

export function initBell() {
  if (initialized) return;
  initialized = true;

  BELL_TYPES.forEach(key => {
    const src = SRC[key];
    // Load using require(...) — cross-platform reliable
    const s = new Sound(src, err => {
      if (err) {
        console.warn(`[bell] Load failed for "${key}":`, err);
      }
    });
    s.setNumberOfLoops(0);
    s.setVolume(1.0);
    sounds[key] = s;
  });
}

export function releaseBell() {
  Object.values(sounds).forEach(s => s?.release());
  sounds = {};
  initialized = false;
}

export function playBell(type = 'mandir', { volume = 1 } = {}) {
  if (!initialized) {
    console.warn('[bell] Not initialized yet; calling initBell() now.');
    initBell();
  }

  const key = BELL_TYPES.includes(type) ? type : 'mandir';
  const s = sounds[key];

  if (s && s.isLoaded?.()) {
    try {
      s.setCurrentTime(0);
      s.setVolume(Math.max(0, Math.min(1, volume)));
      s.play(ok => {
        if (!ok) {
          console.warn(`[bell] Playback error for "${key}"`);
          Vibration.vibrate(60);
        }
      });
    } catch (e) {
      console.warn(`[bell] Exception during play "${key}":`, e);
      Vibration.vibrate(60);
    }
  } else {
    console.warn(`[bell] "${key}" not loaded (yet).`);
    Vibration.vibrate(60);
  }
}

// Optional: quick self-test you can call from anywhere
export function selfTestBells() {
  let i = 0;
  const order = [...BELL_TYPES];
  const next = () => {
    if (i >= order.length) return;
    const k = order[i++];
    console.log('Testing bell:', k);
    playBell(k);
    setTimeout(next, 1200);
  };
  next();
}
