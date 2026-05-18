const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created: ' + filePath);
}

// Add Student Form
write('src/screens/AddStudentScreen.js', `
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
    else if (!/^[^@]+@[^@]+\\.[^@]+$/.test(form.email)) e.email = 'Enter a valid email.';
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
`);

// Add Subject Form
write('src/screens/AddSubjectScreen.js', `
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
`);

// Add Section Form
write('src/screens/AddSectionScreen.js', `
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
`);

// Add Enrollment Form
write('src/screens/AddEnrollmentScreen.js', `
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
`);

// Updated App.js with all form screens and role-based add buttons
write('App.js', `
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, TouchableOpacity } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import StudentsScreen from './src/screens/StudentsScreen';
import AddStudentScreen from './src/screens/AddStudentScreen';
import EnrollmentsScreen from './src/screens/EnrollmentsScreen';
import AddEnrollmentScreen from './src/screens/AddEnrollmentScreen';
import SectionsScreen from './src/screens/SectionsScreen';
import AddSectionScreen from './src/screens/AddSectionScreen';
import AddSubjectScreen from './src/screens/AddSubjectScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarActiveTintColor: '#4F46E5',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: { paddingBottom: 4, height: 60 },
      headerStyle: { backgroundColor: '#4F46E5' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '700' },
      tabBarIcon: ({ focused, color, size }) => {
        const icons = {
          Dashboard: focused ? 'grid' : 'grid-outline',
          Students: focused ? 'people' : 'people-outline',
          Enrollments: focused ? 'document-text' : 'document-text-outline',
          Sections: focused ? 'school' : 'school-outline',
          Chatbot: focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline',
          Profile: focused ? 'person' : 'person-outline',
        };
        return <Ionicons name={icons[route.name] || 'ellipse'} size={size} color={color} />;
      },
    })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: '📚 EnrollSys' }} />
      <Tab.Screen name="Students" component={StudentsScreen}
        options={({ navigation }) => ({
          headerRight: () => isAdminOrStaff ? (
            <TouchableOpacity onPress={() => navigation.navigate('AddStudent')} style={{ marginRight: 16 }}>
              <Ionicons name="add-circle" size={28} color="#fff" />
            </TouchableOpacity>
          ) : null,
        })}
      />
      <Tab.Screen name="Enrollments" component={EnrollmentsScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AddEnrollment')} style={{ marginRight: 16 }}>
              <Ionicons name="add-circle" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen name="Sections" component={SectionsScreen}
        options={({ navigation }) => ({
          headerRight: () => isAdminOrStaff ? (
            <TouchableOpacity onPress={() => navigation.navigate('AddSection')} style={{ marginRight: 16 }}>
              <Ionicons name="add-circle" size={28} color="#fff" />
            </TouchableOpacity>
          ) : null,
        })}
      />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} options={{ title: 'AI Assistant' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#4F46E5' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '700' },
    }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="AddStudent" component={AddStudentScreen} options={{ title: 'Add Student' }} />
          <Stack.Screen name="AddSubject" component={AddSubjectScreen} options={{ title: 'Add Subject' }} />
          <Stack.Screen name="AddSection" component={AddSectionScreen} options={{ title: 'Create Section' }} />
          <Stack.Screen name="AddEnrollment" component={AddEnrollmentScreen} options={{ title: 'Enroll Student' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
`);

console.log('\nAll mobile form screens created!');
console.log('Now run: npm install --legacy-peer-deps @react-native-picker/picker');
console.log('Then: npx expo start --clear');
