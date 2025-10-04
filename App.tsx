import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import { initBell, releaseBell } from './src/audio/bell';
import {
  attachNotificationHandlers,
  stopForegroundService,
} from './src/services/foregroundService';

async function requestNotifPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initBell();
    requestNotifPermission();
    const t = setTimeout(() => setReady(true), 1500);
    return () => {
      clearTimeout(t);
      releaseBell();
      stopForegroundService();
    };
  }, []);

  // Wire notification actions to your current timer (exposed globally)
  useEffect(() => {
    const sub = attachNotificationHandlers({
      onPause: () => global.__TIMER_CONTROL?.pause?.(),
      onStop: () => global.__TIMER_CONTROL?.stop?.(),
    });
    return () => sub();
  }, []);

  if (!ready) return <SplashScreen onDone={() => setReady(true)} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#120f1a' }}>
      <StatusBar barStyle="light-content" backgroundColor="#120f1a" />
      <HomeScreen />
    </SafeAreaView>
  );
}
