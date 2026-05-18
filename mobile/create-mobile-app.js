const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created: ' + filePath);
}

// API base - points to your computer's IP
write('src/api/axios.js', `
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.100.93:8000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = await AsyncStorage.getItem('refresh_token');
        const { data } = await axios.post(API_URL + '/token/refresh/', { refresh });
        await AsyncStorage.setItem('access_token', data.access);
        api.defaults.headers.common.Authorization = 'Bearer ' + data.access;
        return api(original);
      } catch {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
`);

// Auth Context
write('src/context/AuthContext.js', `
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          const { data } = await api.get('/auth/profile/');
          setUser(data);
        }
      } catch {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login/', { email, password });
    await AsyncStorage.setItem('access_token', data.access);
    await AsyncStorage.setItem('refresh_token', data.refresh);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    setUser(null);
  };

  const register = async (form) => {
    const { data } = await api.post('/auth/register/', form);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
`);

// Login Screen
write('src/screens/LoginScreen.js', `
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required.';
    else if (!/^[^@]+@[^@]+\\.[^@]+$/.test(email)) e.email = 'Enter a valid email.';
    if (!password) e.password = 'Password is required.';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.error || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.container}>
      <View style={s.card}>
        <Text style={s.emoji}>📚</Text>
        <Text style={s.title}>EnrollSys</Text>
        <Text style={s.subtitle}>Student Enrollment System</Text>

        <Text style={s.label}>Email</Text>
        <TextInput
          style={[s.input, errors.email && s.inputError]}
          value={email} onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: '' })); }}
          placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none"
        />
        {errors.email && <Text style={s.error}>{errors.email}</Text>}

        <Text style={s.label}>Password</Text>
        <TextInput
          style={[s.input, errors.password && s.inputError]}
          value={password} onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: '' })); }}
          placeholder="••••••••" secureTextEntry
        />
        {errors.password && <Text style={s.error}>{errors.password}</Text>}

        <TouchableOpacity style={s.btn} onPress={submit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={s.link}>Don't have an account? <Text style={s.linkBold}>Register</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F3F4F6' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  emoji: { fontSize: 40, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', color: '#4F46E5' },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 4, backgroundColor: '#fff' },
  inputError: { borderColor: '#DC2626' },
  error: { color: '#DC2626', fontSize: 12, marginBottom: 8 },
  btn: { backgroundColor: '#4F46E5', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16, marginBottom: 12 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', color: '#6B7280', fontSize: 14 },
  linkBold: { color: '#4F46E5', fontWeight: '600' },
});
`);

// Register Screen
write('src/screens/RegisterScreen.js', `
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', password2: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.first_name) e.first_name = 'First name is required.';
    if (!form.last_name) e.last_name = 'Last name is required.';
    if (!form.email) e.email = 'Email is required.';
    else if (!/^[^@]+@[^@]+\\.[^@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Min. 8 characters.';
    if (form.password !== form.password2) e.password2 = 'Passwords do not match.';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await register({ ...form, role: 'student' });
      Alert.alert('Success!', 'Check your email to verify your account.', [
        { text: 'Go to Login', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
        setErrors(mapped);
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  const Field = ({ label, k, placeholder, secure, keyboard }) => (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={[s.input, errors[k] && s.inputError]}
        value={form[k]} onChangeText={v => set(k, v)}
        placeholder={placeholder} secureTextEntry={!!secure}
        keyboardType={keyboard || 'default'} autoCapitalize="none"
      />
      {errors[k] && <Text style={s.error}>{errors[k]}</Text>}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={s.container}>
      <View style={s.card}>
        <Text style={s.title}>Create Account</Text>
        <Field label="First Name" k="first_name" placeholder="Juan" />
        <Field label="Last Name" k="last_name" placeholder="Dela Cruz" />
        <Field label="Email" k="email" placeholder="you@example.com" keyboard="email-address" />
        <Field label="Password" k="password" placeholder="Min. 8 characters" secure />
        <Field label="Confirm Password" k="password2" placeholder="Repeat password" secure />

        <TouchableOpacity style={s.btn} onPress={submit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={s.link}>Already have an account? <Text style={s.linkBold}>Sign in</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F3F4F6' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 4 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, color: '#111827' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 4 },
  inputError: { borderColor: '#DC2626' },
  error: { color: '#DC2626', fontSize: 12, marginBottom: 8 },
  btn: { backgroundColor: '#4F46E5', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16, marginBottom: 12 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', color: '#6B7280', fontSize: 14 },
  linkBold: { color: '#4F46E5', fontWeight: '600' },
});
`);

// Dashboard Screen
write('src/screens/DashboardScreen.js', `
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/dashboard-stats/')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Students', value: stats.total_students, color: '#4F46E5' },
    { label: 'Enrollments', value: stats.total_enrollments, color: '#059669' },
    { label: 'Dropped', value: stats.dropped, color: '#DC2626' },
    { label: 'Completed', value: stats.completed, color: '#D97706' },
  ] : [];

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.welcome}>Welcome back,</Text>
          <Text style={s.name}>{user?.first_name} {user?.last_name}</Text>
          <Text style={s.role}>{user?.role?.toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={s.logoutBtn} onPress={logout}>
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color="#4F46E5" style={{ marginTop: 40 }} /> : (
        <View style={s.grid}>
          {cards.map(c => (
            <View key={c.label} style={[s.card, { borderLeftColor: c.color }]}>
              <Text style={[s.cardValue, { color: c.color }]}>{c.value}</Text>
              <Text style={s.cardLabel}>{c.label}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={s.sectionTitle}>Quick Actions</Text>
      <View style={s.actions}>
        <TouchableOpacity style={s.actionBtn} onPress={() => navigation.navigate('Students')}>
          <Text style={s.actionEmoji}>👥</Text>
          <Text style={s.actionText}>Students</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={() => navigation.navigate('Enrollments')}>
          <Text style={s.actionEmoji}>📋</Text>
          <Text style={s.actionText}>Enrollments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={() => navigation.navigate('Sections')}>
          <Text style={s.actionEmoji}>🏫</Text>
          <Text style={s.actionText}>Sections</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={s.actionEmoji}>👤</Text>
          <Text style={s.actionText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#4F46E5', padding: 24, paddingTop: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  welcome: { color: '#C7D2FE', fontSize: 14 },
  name: { color: '#fff', fontSize: 22, fontWeight: '700' },
  role: { color: '#A5B4FC', fontSize: 12, marginTop: 2 },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderLeftWidth: 4, width: '47%', elevation: 2 },
  cardValue: { fontSize: 28, fontWeight: '700' },
  cardLabel: { color: '#6B7280', fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', paddingHorizontal: 16, marginTop: 8, marginBottom: 12, color: '#111827' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, paddingBottom: 32 },
  actionBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', width: '47%', elevation: 2 },
  actionEmoji: { fontSize: 28, marginBottom: 8 },
  actionText: { fontWeight: '600', color: '#374151', fontSize: 14 },
});
`);

// Students Screen
write('src/screens/StudentsScreen.js', `
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import api from '../api/axios';

export default function StudentsScreen() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/students/?search=' + search)
      .then(({ data }) => setStudents(data.results || data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const deleteStudent = (id, name) => {
    Alert.alert('Delete Student', 'Are you sure you want to delete ' + name + '?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await api.delete('/students/' + id + '/');
        load();
      }}
    ]);
  };

  return (
    <View style={s.container}>
      <TextInput
        style={s.search} placeholder="🔍 Search students..."
        value={search} onChangeText={setSearch}
      />
      {loading ? <ActivityIndicator color="#4F46E5" style={{ marginTop: 40 }} /> : (
        <FlatList
          data={students}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={s.empty}>No students found.</Text>}
          renderItem={({ item: s }) => (
            <View style={st.card}>
              <View style={st.avatar}>
                <Text style={st.avatarText}>{s.first_name[0]}{s.last_name[0]}</Text>
              </View>
              <View style={st.info}>
                <Text style={st.name}>{s.last_name}, {s.first_name}</Text>
                <Text style={st.sub}>{s.student_id} • {s.course}</Text>
                <Text style={st.sub}>Year {s.year_level} • {s.total_enrolled_units} units</Text>
              </View>
              <TouchableOpacity onPress={() => deleteStudent(s.id, s.full_name)}>
                <Text style={st.del}>🗑</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  search: { margin: 16, backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 15, elevation: 2 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
});
const st = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#4F46E5', fontWeight: '700', fontSize: 16 },
  info: { flex: 1 },
  name: { fontWeight: '700', fontSize: 15, color: '#111827' },
  sub: { color: '#6B7280', fontSize: 13, marginTop: 2 },
  del: { fontSize: 20, padding: 4 },
});
`);

// Enrollments Screen
write('src/screens/EnrollmentsScreen.js', `
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../api/axios';

export default function EnrollmentsScreen({ navigation }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/')
      .then(({ data }) => setEnrollments(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status) => status === 'enrolled' ? '#059669' : status === 'dropped' ? '#DC2626' : '#D97706';

  return (
    <View style={s.container}>
      {loading ? <ActivityIndicator color="#4F46E5" style={{ marginTop: 40 }} /> : (
        <FlatList
          data={enrollments}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={s.empty}>No enrollments yet.</Text>}
          renderItem={({ item: e }) => (
            <View style={s.card}>
              <View style={s.row}>
                <Text style={s.subject}>{e.section}</Text>
                <View style={[s.badge, { backgroundColor: statusColor(e.status) + '20' }]}>
                  <Text style={[s.badgeText, { color: statusColor(e.status) }]}>{e.status}</Text>
                </View>
              </View>
              <Text style={s.student}>Student: {e.student}</Text>
              <Text style={s.date}>{new Date(e.enrolled_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  subject: { fontWeight: '700', fontSize: 15, color: '#111827', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  student: { color: '#6B7280', fontSize: 13 },
  date: { color: '#9CA3AF', fontSize: 12, marginTop: 4 },
});
`);

// Sections Screen
write('src/screens/SectionsScreen.js', `
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../api/axios';

export default function SectionsScreen() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/sections/')
      .then(({ data }) => setSections(data.results || data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={s.container}>
      {loading ? <ActivityIndicator color="#4F46E5" style={{ marginTop: 40 }} /> : (
        <FlatList
          data={sections}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={s.empty}>No sections found.</Text>}
          renderItem={({ item: sec }) => (
            <View style={s.card}>
              <View style={s.row}>
                <Text style={s.code}>{sec.subject_code} — {sec.name}</Text>
                <View style={[s.badge, { backgroundColor: sec.is_full ? '#FEE2E2' : '#D1FAE5' }]}>
                  <Text style={[s.badgeText, { color: sec.is_full ? '#DC2626' : '#059669' }]}>
                    {sec.is_full ? 'FULL' : 'OPEN'}
                  </Text>
                </View>
              </View>
              <Text style={s.name}>{sec.subject_name}</Text>
              {sec.schedule ? <Text style={s.detail}>🕐 {sec.schedule}</Text> : null}
              {sec.room ? <Text style={s.detail}>🏫 {sec.room}</Text> : null}
              <View style={s.slots}>
                <Text style={s.slotText}>Enrolled: {sec.enrolled_count} / {sec.max_students}</Text>
                <View style={s.bar}>
                  <View style={[s.fill, { width: (sec.enrolled_count / sec.max_students * 100) + '%', backgroundColor: sec.is_full ? '#DC2626' : '#4F46E5' }]} />
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { fontWeight: '700', fontSize: 15, color: '#4F46E5' },
  name: { color: '#374151', fontSize: 14, marginTop: 4 },
  detail: { color: '#6B7280', fontSize: 13, marginTop: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  slots: { marginTop: 10 },
  slotText: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  bar: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
});
`);

// Profile Screen
write('src/screens/ProfileScreen.js', `
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{user?.first_name?.[0]}{user?.last_name?.[0]}</Text>
        </View>
        <Text style={s.name}>{user?.first_name} {user?.last_name}</Text>
        <Text style={s.email}>{user?.email}</Text>
        <View style={s.roleBadge}>
          <Text style={s.roleText}>{user?.role?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Account Details</Text>
        {[
          ['Email', user?.email],
          ['Role', user?.role],
          ['Status', user?.is_verified ? 'Verified ✅' : 'Not Verified ❌'],
          ['Member Since', user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'],
        ].map(([label, value]) => (
          <View key={label} style={s.row}>
            <Text style={s.rowLabel}>{label}</Text>
            <Text style={s.rowValue}>{value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={s.logoutBtn} onPress={confirmLogout}>
        <Text style={s.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#4F46E5', padding: 32, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  name: { color: '#fff', fontSize: 22, fontWeight: '700' },
  email: { color: '#C7D2FE', fontSize: 14, marginTop: 4 },
  roleBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 99, marginTop: 8 },
  roleText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  card: { margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2 },
  cardTitle: { fontWeight: '700', fontSize: 16, marginBottom: 12, color: '#111827' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  rowLabel: { color: '#6B7280', fontSize: 14 },
  rowValue: { color: '#111827', fontSize: 14, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  logoutBtn: { margin: 16, backgroundColor: '#FEE2E2', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 40 },
  logoutText: { color: '#DC2626', fontWeight: '700', fontSize: 16 },
});
`);

// Chatbot Screen
write('src/screens/ChatbotScreen.js', `
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';

const SYSTEM = 'You are an enrollment assistant for a Student Enrollment & Sectioning System. Help students and staff with questions about enrolling in subjects, section availability, capacity, units, and the enrollment process. Be concise and friendly.';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: "Hi! I'm your enrollment assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (messages.length > 1) listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: SYSTEM,
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Sorry, I could not respond.';
      setMessages(m => [...m, { id: Date.now().toString(), role: 'assistant', content: reply }]);
    } catch {
      setMessages(m => [...m, { id: Date.now().toString(), role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={i => i.id}
        contentContainerStyle={s.list}
        renderItem={({ item: m }) => (
          <View style={[s.bubble, m.role === 'user' ? s.userBubble : s.botBubble]}>
            <Text style={[s.bubbleText, m.role === 'user' ? s.userText : s.botText]}>{m.content}</Text>
          </View>
        )}
      />
      {loading && <ActivityIndicator color="#4F46E5" style={{ marginBottom: 8 }} />}
      <View style={s.inputRow}>
        <TextInput
          style={s.input} value={input} onChangeText={setInput}
          placeholder="Ask about enrollment..." onSubmitEditing={send}
        />
        <TouchableOpacity style={s.sendBtn} onPress={send} disabled={loading || !input.trim()}>
          <Text style={s.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  list: { padding: 16, paddingBottom: 8 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userBubble: { backgroundColor: '#4F46E5', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 4, elevation: 1 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#fff' },
  botText: { color: '#111827' },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 8 },
  input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  sendBtn: { backgroundColor: '#4F46E5', borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: '700' },
});
`);

// Main App.js for mobile
write('App.js', `
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import StudentsScreen from './src/screens/StudentsScreen';
import EnrollmentsScreen from './src/screens/EnrollmentsScreen';
import SectionsScreen from './src/screens/SectionsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
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
      <Tab.Screen name="Students" component={StudentsScreen} />
      <Tab.Screen name="Enrollments" component={EnrollmentsScreen} />
      <Tab.Screen name="Sections" component={SectionsScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
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

console.log('\nAll mobile files created successfully!');
