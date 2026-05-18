
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/axios';

export default function AddStudentScreen({ navigation }) {
  const [form, setForm] = useState({
    student_id: '', first_name: '', last_name: '', email: '',
    contact_number: '', address: '', course: '', year_level: '1',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.student_id.trim()) e.student_id = 'Student ID is required.';
    if (!form.first_name.trim()) e.first_name = 'First name is required.';
    if (!form.last_name.trim()) e.last_name = 'Last name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.course.trim()) e.course = 'Course is required.';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await api.post('/students/', form);
      Alert.alert('Success', 'Student added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
        setErrors(mapped);
      } else {
        Alert.alert('Error', 'Failed to add student.');
      }
    } finally { setLoading(false); }
  };

  const Field = ({ label, k, placeholder, keyboard, required }) => (
    <View style={s.field}>
      <Text style={s.label}>{label}{required && <Text style={s.req}> *</Text>}</Text>
      <TextInput
        style={[s.input, errors[k] && s.inputErr]}
        value={form[k]} onChangeText={v => set(k, v)}
        placeholder={placeholder} keyboardType={keyboard || 'default'}
        autoCapitalize="none"
      />
      {errors[k] && <Text style={s.err}>{errors[k]}</Text>}
    </View>
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <Field label="Student ID" k="student_id" placeholder="e.g. 2024-0001" required />
      <View style={s.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Field label="First Name" k="first_name" placeholder="Juan" required />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Last Name" k="last_name" placeholder="Dela Cruz" required />
        </View>
      </View>
      <Field label="Email" k="email" placeholder="student@email.com" keyboard="email-address" required />
      <Field label="Course" k="course" placeholder="e.g. BS Computer Science" required />
      <Field label="Contact Number" k="contact_number" placeholder="e.g. 09171234567" keyboard="phone-pad" />
      <Field label="Address" k="address" placeholder="Complete address" />

      <View style={s.field}>
        <Text style={s.label}>Year Level <Text style={s.req}>*</Text></Text>
        <View style={[s.input, { padding: 0 }]}>
          <Picker selectedValue={form.year_level} onValueChange={v => set('year_level', v)}>
            {[1,2,3,4,5].map(y => <Picker.Item key={y} label={'Year ' + y} value={String(y)} />)}
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={s.btn} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Add Student</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={s.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={s.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  row: { flexDirection: 'row' },
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
