
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Input({ label, value, onChangeText, placeholder, secure, keyboard, error, required, multiline }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={s.group}>
      {label && (
        <Text style={s.label}>{label}{required && <Text style={s.req}> *</Text>}</Text>
      )}
      <TextInput
        style={[s.input, focused && s.focused, error && s.error, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value} onChangeText={onChangeText}
        placeholder={placeholder} placeholderTextColor={colors.gray400}
        secureTextEntry={!!secure} keyboardType={keyboard || 'default'}
        autoCapitalize="none" multiline={multiline}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        blurOnSubmit={false}
      />
      {error && <Text style={s.errText}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 5 },
  req: { color: colors.danger },
  input: { borderWidth: 1, borderColor: colors.gray200, borderRadius: 8, padding: 11, fontSize: 15, color: colors.gray800, backgroundColor: '#fff' },
  focused: { borderColor: colors.primary },
  error: { borderColor: colors.danger },
  errText: { color: colors.danger, fontSize: 12, marginTop: 3 },
});
