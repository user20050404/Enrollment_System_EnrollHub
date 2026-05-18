
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, shadow } from '../theme';

export default function Card({ children, style }) {
  return <View style={[s.card, style]}>{children}</View>;
}

const s = StyleSheet.create({
  card: {
    background: colors.white,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: 16,
    ...shadow.md,
  },
});
