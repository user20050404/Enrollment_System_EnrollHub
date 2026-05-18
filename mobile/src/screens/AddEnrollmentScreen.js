
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/axios';

export default function AddEnrollmentScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ student: '', section: '' });
  const [selectedSection, setSelectedSection] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/students/?is_active=true').then(({ data }) => {
      const list = data.results || data;
      setStudents(list);
      setFilteredStudents(list);
    });
    api.get('/sections/?is_active=true').then(({ data }) => setSections(data.results || data));
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredStudents(students);
    } else {
      const q = search.toLowerCase();
      setFilteredStudents(students.filter(s =>
        s.student_id.toLowerCase().includes(q) ||
        (s.last_name + ' ' + s.first_name).toLowerCase().includes(q)
      ));
    }
  }, [search, students]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
    if (k === 'section') setSelectedSection(sections.find(s => s.id === v) || null);
  };

  const validate = () => {
    const e = {};
    if (!form.student) e.student = 'Please select a student.';
    if (!form.section) e.section = 'Please select a section.';
    if (selectedSection?.is_full) e.section = 'This section is full!';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await api.post('/enrollments/', form);
      Alert.alert('Success', 'Student enrolled successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
        setErrors(mapped);
      } else {
        Alert.alert('Error', 'Enrollment failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <View style={s.field}>
        <Text style={s.label}>Search Student</Text>
        <TextInput style={s.input} value={search} onChangeText={setSearch}
          placeholder="Type name or student ID..." />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Student <Text style={s.req}>*</Text></Text>
        <View style={[s.input, { padding: 0 }, errors.student && s.inputErr]}>
          <Picker selectedValue={form.student} onValueChange={v => set('student', v)}>
            <Picker.Item label="— Select Student —" value="" />
            {filteredStudents.map(st => (
              <Picker.Item key={st.id} label={st.student_id + ' — ' + st.last_name + ', ' + st.first_name} value={st.id} />
            ))}
          </Picker>
        </View>
        {errors.student && <Text style={s.err}>{errors.student}</Text>}
      </View>

      <View style={s.field}>
        <Text style={s.label}>Section <Text style={s.req}>*</Text></Text>
        <View style={[s.input, { padding: 0 }, errors.section && s.inputErr]}>
          <Picker selectedValue={form.section} onValueChange={v => set('section', v)}>
            <Picker.Item label="— Select Section —" value="" />
            {sections.map(sec => (
              <Picker.Item
                key={sec.id}
                label={sec.subject_code + ' - ' + sec.name + ' (' + sec.enrolled_count + '/' + sec.max_students + ')' + (sec.is_full ? ' FULL' : '')}
                value={sec.id}
              />
            ))}
          </Picker>
        </View>
        {errors.section && <Text style={s.err}>{errors.section}</Text>}
      </View>

      {selectedSection && (
        <View style={[s.infoBox, { borderLeftColor: selectedSection.is_full ? '#DC2626' : '#059669' }]}>
          <Text style={s.infoTitle}>{selectedSection.subject_name}</Text>
          {selectedSection.schedule ? <Text style={s.infoText}>🕐 {selectedSection.schedule}</Text> : null}
          {selectedSection.room ? <Text style={s.infoText}>🏫 {selectedSection.room}</Text> : null}
          <Text style={[s.infoText, { color: selectedSection.is_full ? '#DC2626' : '#059669', fontWeight: '700' }]}>
            Slots: {selectedSection.available_slots}/{selectedSection.max_students}
            {selectedSection.is_full ? ' — FULL ⚠' : ' — Available ✅'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[s.btn, (selectedSection?.is_full) && { backgroundColor: '#9CA3AF' }]}
        onPress={submit} disabled={loading || selectedSection?.is_full}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Enroll Student</Text>}
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
  infoBox: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 14, borderLeftWidth: 4 },
  infoTitle: { fontWeight: '700', fontSize: 15, color: '#111827', marginBottom: 4 },
  infoText: { color: '#6B7280', fontSize: 13, marginTop: 2 },
  btn: { backgroundColor: '#4F46E5', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8, marginBottom: 10 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 32 },
  cancelText: { color: '#6B7280', fontWeight: '600', fontSize: 16 },
});
