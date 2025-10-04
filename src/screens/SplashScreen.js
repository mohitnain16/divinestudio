import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';

export default function SplashScreen({ onDone }) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 1800,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start(() => setTimeout(onDone, 700));
  }, [fade, slide, onDone]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Animated.View
        style={[
          styles.card,
          { opacity: fade, transform: [{ translateY: slide }] },
        ]}
      >
        <Text style={styles.title}>🕉️ Divine Yoga Studio</Text>
        <Text style={styles.sub}>by Yogratan Shri Jora Singh Arya</Text>
        <View style={{ height: 18 }} />
        <Text style={styles.foot}>Designed & Developed by</Text>
        <Text style={styles.name}>Mohit Nain</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b2143',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '84%',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  title: {
    color: '#ffd98b',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  sub: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 6,
  },
  foot: { color: '#fff', opacity: 0.8, textAlign: 'center', marginTop: 10 },
  name: {
    color: '#ffd98b',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
