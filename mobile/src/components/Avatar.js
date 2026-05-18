
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Avatar({ name, photo, size = 36 }) {
  const initials = name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '?';
  return (
    <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      {photo
        ? <Image source={{ uri: photo }} style={{ width: size, height: size, borderRadius: size / 2 }} />
        : <Text style={[s.text, { fontSize: size * 0.33 }]}>{initials}</Text>
      }
    </View>
  );
}

const s = StyleSheet.create({
  avatar: { backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1.5, borderColor: colors.gray200 },
  text: { fontWeight: '700', color: colors.primary },
});
