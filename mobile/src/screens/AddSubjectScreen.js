
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/axios';

export default function AddSubjectScreen({ navigation }) {
  const [form, setForm] = useState({ code: '', name: '', description: '', units: '', year_level: '1', semester: '1' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Subject code is required.';
    if (!form.name.trim()) e.name = 'Subject name is required.';
    if (!form.units) e.units = 'Units is required.';
    else if (isNaN(form.units) || Number(form.units) < 1) e.units = 'Units must be a positive number.';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await api.post('/subjects/', { ...form, units: Number(form.units) });
      Alert.alert('Success', 'Subject added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
        setErrors(mapped);
      } else {
        Alert.alert('Error', 'Failed to add subject.');
      }
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <View style={s.field}>
        <Text style={s.label}>Subject Code <Text style={s.req}>*</Text></Text>
        <TextInput style={[s.input, errors.code && s.inputErr]} value={form.code}
          onChangeText={v => set('code', v)} placeholder="e.g. CS101" autoCapitalize="characters" />
        {errors.code && <Text style={s.err}>{errors.code}</Text>}
      </View>

      <View style={s.field}>
        <Text style={s.label}>Subject Name <Text style={s.req}>*</Text></Text>
        <TextInput style={[s.input, errors.name && s.inputErr]} value={form.name}
          onChangeText={v => set('name', v)} placeholder="e.g. Introduction to Computing" />
        {errors.name && <Text style={s.err}>{errors.name}</Text>}
      </View>

      <View style={s.field}>
        <Text style={s.label}>Units <Text style={s.req}>*</Text></Text>
        <TextInput style={[s.input, errors.units && s.inputErr]} value={form.units}
          onChangeText={v => set('units', v)} placeholder="e.g. 3" keyboardType="numeric" />
        {errors.units && <Text style={s.err}>{errors.units}</Text>}
      </View>

      <View style={s.field}>
        <Text style={s.label}>Description</Text>
        <TextInput style={[s.input, { height: 80 }]} value={form.description}
          onChangeText={v => set('description', v)} placeholder="Optional description"
          multiline numberOfLines={3} textAlignVertical="top" />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Year Level <Text style={s.req}>*</Text></Text>
        <View style={[s.input, { padding: 0 }]}>
          <Picker selectedValue={form.year_level} onValueChange={v => set('year_level', v)}>
            {[1,2,3,4,5].map(y => <Picker.Item key={y} label={'Year ' + y} value={String(y)} />)}
          </Picker>
        </View>
      </View>

      <View style={s.field}>
        <Text style={s.label}>Semester <Text style={s.req}>*</Text></Text>
        <View style={[s.input, { padding: 0 }]}>
          <Picker selectedValue={form.semester} onValueChange={v => set('semester', v)}>
            <Picker.Item label="1st Semester" value="1" />
            <Picker.Item label="2nd Semester" value="2" />
            <Picker.Item label="Summer" value="3" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={s.btn} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Add Subject</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={s.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={s.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  field: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  req: { color: '#DC2626' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 15, backgroundColor: '#fff' },
  inputErr: { borderColor: '#DC2626' },
  err: { color: '#DC2626', fontSize: 12, marginTop: 3 },
  btn: { backgroundColor: '#4F46E5', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8, marginBottom: 10 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 32 },
  cancelText: { color: '#6B7280', fontWeight: '600', fontSize: 16 },
});
