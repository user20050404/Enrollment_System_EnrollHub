
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Button({ label, onPress, variant = 'primary', loading, disabled, style }) {
  const v = variants[variant] || variants.primary;
  return (
    <TouchableOpacity
      style={[s.btn, { backgroundColor: v.bg, borderColor: v.border || v.bg }, (disabled || loading) && s.disabled, style]}
      onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading
        ? <ActivityIndicator color={v.text} size="small" />
        : <Text style={[s.text, { color: v.text }]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const variants = {
  primary: { bg: colors.primary, text: '#fff', border: colors.primary },
  secondary: { bg: '#fff', text: colors.gray600, border: colors.gray200 },
  danger: { bg: colors.dangerLight, text: colors.danger, border: colors.dangerLight },
  success: { bg: colors.successLight, text: colors.success, border: colors.successLight },
};

const s = StyleSheet.create({
  btn: { paddingVertical: 11, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  text: { fontWeight: '600', fontSize: 15 },
  disabled: { opacity: 0.6 },
});
