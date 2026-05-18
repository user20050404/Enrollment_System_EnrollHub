
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

const variants = {
  primary: { bg: colors.primaryLight, text: '#4338CA' },
  success: { bg: colors.successLight, text: '#065F46' },
  danger: { bg: colors.dangerLight, text: '#991B1B' },
  warning: { bg: colors.warningLight, text: '#92400E' },
  gray: { bg: colors.gray100, text: colors.gray600 },
};

export default function Badge({ label, variant = 'gray' }) {
  const v = variants[variant] || variants.gray;
  return (
    <View style={[s.badge, { backgroundColor: v.bg }]}>
      <Text style={[s.text, { color: v.text }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '600' },
});
