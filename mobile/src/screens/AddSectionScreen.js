
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/axios';

export default function AddSectionScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: '', subject: '', max_students: '40', room: '', schedule: '', instructor: '', school_year: '2024-2025', semester: '1' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/subjects/').then(({ data }) => setSubjects(data.results || data));
  }, []);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Section name is required.';
    if (!form.subject) e.subject = 'Please select a subject.';
    if (!form.max_students || isNaN(form.max_students) || Number(form.max_students) < 1) e.max_students = 'Enter a valid capacity.';
    if (!form.school_year.trim()) e.school_year = 'School year is required.';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await api.post('/sections/', { ...form, max_students: Number(form.max_students), semester: Number(form.semester) });
      Alert.alert('Success', 'Section created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
        setErrors(mapped);
      } else {
        Alert.alert('Error', 'Failed to create section.');
      }
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <View style={s.field}>
        <Text style={s.label}>Subject <Text style={s.req}>*</Text></Text>
        <View style={[s.input, { padding: 0 }, errors.subject && s.inputErr]}>
          <Picker selectedValue={form.subject} onValueChange={v => set('subject', v)}>
            <Picker.Item label="— Select Subject —" value="" />
            {subjects.map(sub => <Picker.Item key={sub.id} label={sub.code + ' - ' + sub.name} value={sub.id} />)}
          </Picker>
        </View>
        {errors.subject && <Text style={s.err}>{errors.subject}</Text>}
      </View>

      <View style={s.field}>
        <Text style={s.label}>Section Name <Text style={s.req}>*</Text></Text>
        <TextInput style={[s.input, errors.name && s.inputErr]} value={form.name}
          onChangeText={v => set('name', v)} placeholder="e.g. A, B, Section 1" />
        {errors.name && <Text style={s.err}>{errors.name}</Text>}
      </View>

      <View style={s.field}>
        <Text style={s.label}>Max Students <Text style={s.req}>*</Text></Text>
        <TextInput style={[s.input, errors.max_students && s.inputErr]} value={form.max_students}
          onChangeText={v => set('max_students', v)} keyboardType="numeric" placeholder="e.g. 40" />
        {errors.max_students && <Text style={s.err}>{errors.max_students}</Text>}
      </View>

      <View style={s.field}>
        <Text style={s.label}>Room</Text>
        <TextInput style={s.input} value={form.room}
          onChangeText={v => set('room', v)} placeholder="e.g. Room 101" />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Schedule</Text>
        <TextInput style={s.input} value={form.schedule}
          onChangeText={v => set('schedule', v)} placeholder="e.g. MWF 7:30-9:00 AM" />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Instructor</Text>
        <TextInput style={s.input} value={form.instructor}
          onChangeText={v => set('instructor', v)} placeholder="e.g. Prof. Santos" />
      </View>

      <View style={s.field}>
        <Text style={s.label}>School Year <Text style={s.req}>*</Text></Text>
        <TextInput style={[s.input, errors.school_year && s.inputErr]} value={form.school_year}
          onChangeText={v => set('school_year', v)} placeholder="e.g. 2024-2025" />
        {errors.school_year && <Text style={s.err}>{errors.school_year}</Text>}
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
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Create Section</Text>}
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
