import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function PrimaryButton({ children, onPress, disabled, variant = 'primary', style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' ? styles.secondary : styles.primary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: '#2563eb',
    boxShadow: '0px 10px 18px rgba(37, 99, 235, 0.28)',
    elevation: 6,
  },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    transform: [{ translateY: 1 }, { scale: 0.98 }],
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  textSecondary: {
    color: '#0f172a',
  },
});
