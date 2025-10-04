import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function IconCircleButton({
  name,
  size = 22, // icon size
  color = '#3B82F6',
  onPress,
  disabled = false,
  diameter = 52, // <— responsive
  bgColor = '#FFFFFF',
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: 'rgba(59,130,246,0.15)', borderless: true }}
      style={({ pressed }) => [
        styles.base,
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: bgColor,
        },
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.inner}>
        <MaterialCommunityIcons
          name={name}
          size={size}
          color={disabled ? '#9CA3AF' : color}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: { alignItems: 'center', justifyContent: 'center' },
  disabled: { backgroundColor: '#F3F4F6' },
  pressed: { transform: [{ scale: 0.98 }] },
});
