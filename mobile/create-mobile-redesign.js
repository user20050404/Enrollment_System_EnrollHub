const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created: ' + filePath);
}

// Design tokens matching web
write('src/theme.js', `
export const colors = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  primaryLight: '#EEF2FF',
  success: '#059669',
  successLight: '#D1FAE5',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  gray50: '#F8F9FC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  white: '#ffffff',
};

export const shadow = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 3 },
};
`);

// Reusable components
write('src/components/Card.js', `
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
`);

write('src/components/Badge.js', `
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
`);

write('src/components/Button.js', `
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Button({ label, onPress, variant = 'primary', loading, disabled, style }) {
  const v = variants[variant] || variants.primary;
  return (
    <TouchableOpacity
      style={[s.btn, { backgroundColor: v.bg, borderColor: v.border || v.bg }, (disabled || loading) && s.disabled, style]}
      onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading
        ? <ActivityIndicator color={v.text} size="small" />
        : <Text style={[s.text, { color: v.text }]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const variants = {
  primary: { bg: colors.primary, text: '#fff', border: colors.primary },
  secondary: { bg: '#fff', text: colors.gray600, border: colors.gray200 },
  danger: { bg: colors.dangerLight, text: colors.danger, border: colors.dangerLight },
  success: { bg: colors.successLight, text: colors.success, border: colors.successLight },
};

const s = StyleSheet.create({
  btn: { paddingVertical: 11, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  text: { fontWeight: '600', fontSize: 15 },
  disabled: { opacity: 0.6 },
});
`);

write('src/components/Input.js', `
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
`);

write('src/components/Avatar.js', `
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
`);

// Dashboard Screen
write('src/screens/DashboardScreen.js', `
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import { colors } from '../theme';
import api from '../api/axios';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/dashboard-stats/')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Students', value: stats.total_students, icon: 'people-outline', color: colors.primary, bg: colors.primaryLight },
    { label: 'Enrollments', value: stats.total_enrollments, icon: 'document-text-outline', color: colors.success, bg: colors.successLight },
    { label: 'Dropped', value: stats.dropped, icon: 'close-circle-outline', color: colors.danger, bg: colors.dangerLight },
    { label: 'Completed', value: stats.completed, icon: 'checkmark-circle-outline', color: colors.warning, bg: colors.warningLight },
  ] : [];

  const quickActions = [
    { label: 'Students', icon: 'people-outline', screen: 'Students', color: colors.primary },
    { label: 'Subjects', icon: 'book-outline', screen: 'Subjects', color: '#7C3AED' },
    { label: 'Sections', icon: 'school-outline', screen: 'Sections', color: '#0891B2' },
    { label: 'Enrollments', icon: 'list-outline', screen: 'Enrollments', color: colors.success },
    { label: 'Chatbot', icon: 'chatbubble-outline', screen: 'Chatbot', color: '#DB2777' },
    { label: 'Profile', icon: 'person-outline', screen: 'Profile', color: colors.warning },
  ];

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Avatar
            name={user?.first_name + ' ' + user?.last_name}
            photo={user?.profile_picture}
            size={44}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={s.greeting}>Good day,</Text>
            <Text style={s.name}>{user?.first_name} {user?.last_name}</Text>
            <View style={s.roleBadge}>
              <Text style={s.roleText}>{user?.role?.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={logout} style={s.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color={colors.dangerLight} />
        </TouchableOpacity>
      </View>

      <View style={s.content}>
        {/* Stats */}
        <Text style={s.sectionTitle}>Overview</Text>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <View style={s.statsGrid}>
            {statCards.map(card => (
              <View key={card.label} style={[s.statCard, { borderLeftColor: card.color }]}>
                <View style={[s.statIcon, { backgroundColor: card.bg }]}>
                  <Ionicons name={card.icon} size={18} color={card.color} />
                </View>
                <Text style={s.statValue}>{card.value}</Text>
                <Text style={s.statLabel}>{card.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <Text style={s.sectionTitle}>Quick Access</Text>
        <View style={s.actionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity key={action.label} style={s.actionCard} onPress={() => navigation.navigate(action.screen)} activeOpacity={0.7}>
              <View style={[s.actionIcon, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={s.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { backgroundColor: colors.primary, paddingTop: 52, paddingBottom: 24, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  name: { color: '#fff', fontSize: 17, fontWeight: '700', marginTop: 1 },
  roleBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, marginTop: 4, alignSelf: 'flex-start' },
  roleText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  logoutBtn: { width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.gray500, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { backgroundColor: '#fff', borderRadius: 10, padding: 14, width: '47.5%', borderLeftWidth: 3, borderWidth: 1, borderColor: colors.gray200, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  statIcon: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 26, fontWeight: '700', color: colors.gray900, letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: colors.gray500, marginTop: 2 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  actionCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, width: '47.5%', alignItems: 'center', borderWidth: 1, borderColor: colors.gray200, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  actionIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: colors.gray700 },
});
`);

// Students Screen
write('src/screens/StudentsScreen.js', `
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import { colors } from '../theme';
import api from '../api/axios';

export default function StudentsScreen({ navigation }) {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  const load = useCallback(() => {
    setLoading(true);
    api.get('/students/?search=' + search)
      .then(({ data }) => setStudents(data.results || data))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const del = (id, name) => {
    Alert.alert('Delete Student', 'Delete ' + name + '? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await api.delete('/students/' + id + '/'); load(); } }
    ]);
  };

  return (
    <View style={s.container}>
      {/* Search */}
      <View style={s.searchBar}>
        <Ionicons name="search-outline" size={16} color={colors.gray400} style={{ marginRight: 8 }} />
        <TextInput style={s.searchInput} value={search} onChangeText={setSearch} placeholder="Search name, ID, email..." placeholderTextColor={colors.gray400} />
        {search ? <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={16} color={colors.gray400} /></TouchableOpacity> : null}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={i => i.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.empty}>
              <Ionicons name="people-outline" size={40} color={colors.gray300} />
              <Text style={s.emptyText}>No students found</Text>
            </View>
          }
          renderItem={({ item: st }) => (
            <View style={s.card}>
              <View style={s.cardLeft}>
                <Avatar name={st.first_name + ' ' + st.last_name} photo={st.photo} size={42} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={s.studentName}>{st.last_name}, {st.first_name}</Text>
                  <Text style={s.studentSub}>{st.student_id} · {st.course}</Text>
                  <View style={s.cardBadges}>
                    <Badge label={'Year ' + st.year_level} variant="gray" />
                    <View style={{ width: 6 }} />
                    <Badge label={st.total_enrolled_units + ' units'} variant="primary" />
                    <View style={{ width: 6 }} />
                    <Badge label={st.is_active ? 'Active' : 'Inactive'} variant={st.is_active ? 'success' : 'gray'} />
                  </View>
                </View>
              </View>
              {isAdminOrStaff && (
                <View style={s.cardActions}>
                  <TouchableOpacity style={s.editBtn} onPress={() => navigation.navigate('EditStudent', { id: st.id })}>
                    <Ionicons name="create-outline" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.deleteBtn} onPress={() => del(st.id, st.full_name)}>
                    <Ionicons name="trash-outline" size={16} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 12, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: colors.gray200 },
  searchInput: { flex: 1, fontSize: 14, color: colors.gray800 },
  list: { padding: 12, paddingTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.gray200, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  studentName: { fontSize: 14, fontWeight: '700', color: colors.gray800 },
  studentSub: { fontSize: 12, color: colors.gray500, marginTop: 2 },
  cardBadges: { flexDirection: 'row', marginTop: 6, flexWrap: 'wrap' },
  cardActions: { flexDirection: 'row', gap: 8 },
  editBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.dangerLight, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { color: colors.gray400, fontSize: 14 },
});
`);

// Subjects Screen
write('src/screens/SubjectsScreen.js', `
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../components/Badge';
import { colors } from '../theme';
import api from '../api/axios';

export default function SubjectsScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/subjects/').then(({ data }) => setSubjects(data.results || data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const del = (id, name) => {
    Alert.alert('Delete Subject', 'Delete ' + name + '?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await api.delete('/subjects/' + id + '/'); load(); } }
    ]);
  };

  const semLabel = (s) => s === 1 ? '1st Sem' : s === 2 ? '2nd Sem' : 'Summer';

  return (
    <View style={s.container}>
      {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} /> : (
        <FlatList
          data={subjects} keyExtractor={i => i.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={s.empty}><Ionicons name="book-outline" size={40} color={colors.gray300} /><Text style={s.emptyText}>No subjects found</Text></View>}
          renderItem={({ item: sub }) => (
            <View style={s.card}>
              <View style={s.codeBox}>
                <Text style={s.code}>{sub.code}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.name}>{sub.name}</Text>
                <View style={s.badges}>
                  <Badge label={sub.units + ' units'} variant="primary" />
                  <View style={{ width: 6 }} />
                  <Badge label={'Year ' + sub.year_level} variant="gray" />
                  <View style={{ width: 6 }} />
                  <Badge label={semLabel(sub.semester)} variant="warning" />
                </View>
              </View>
              <View style={s.actions}>
                <TouchableOpacity style={s.editBtn} onPress={() => navigation.navigate('EditSubject', { id: sub.id })}>
                  <Ionicons name="create-outline" size={16} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={s.deleteBtn} onPress={() => del(sub.id, sub.name)}>
                  <Ionicons name="trash-outline" size={16} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  list: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.gray200, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  codeBox: { backgroundColor: colors.primaryLight, borderRadius: 8, padding: 8, alignItems: 'center', justifyContent: 'center', minWidth: 52 },
  code: { fontSize: 12, fontWeight: '700', color: colors.primary },
  name: { fontSize: 14, fontWeight: '600', color: colors.gray800 },
  badges: { flexDirection: 'row', marginTop: 6, flexWrap: 'wrap' },
  actions: { flexDirection: 'row', gap: 8 },
  editBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.dangerLight, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { color: colors.gray400, fontSize: 14 },
});
`);

// Sections Screen
write('src/screens/SectionsScreen.js', `
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../components/Badge';
import { colors } from '../theme';
import api from '../api/axios';

export default function SectionsScreen() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/sections/').then(({ data }) => setSections(data.results || data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <View style={s.container}>
      {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} /> : (
        <FlatList
          data={sections} keyExtractor={i => i.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={s.empty}><Ionicons name="school-outline" size={40} color={colors.gray300} /><Text style={s.emptyText}>No sections found</Text></View>}
          renderItem={({ item: sec }) => (
            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.code}>{sec.subject_code} — Section {sec.name}</Text>
                  <Text style={s.subName}>{sec.subject_name}</Text>
                </View>
                <Badge label={sec.is_full ? 'FULL' : 'OPEN'} variant={sec.is_full ? 'danger' : 'success'} />
              </View>

              <View style={s.details}>
                {sec.schedule ? (
                  <View style={s.detailRow}>
                    <Ionicons name="time-outline" size={13} color={colors.gray400} />
                    <Text style={s.detailText}>{sec.schedule}</Text>
                  </View>
                ) : null}
                {sec.room ? (
                  <View style={s.detailRow}>
                    <Ionicons name="location-outline" size={13} color={colors.gray400} />
                    <Text style={s.detailText}>{sec.room}</Text>
                  </View>
                ) : null}
                {sec.instructor ? (
                  <View style={s.detailRow}>
                    <Ionicons name="person-outline" size={13} color={colors.gray400} />
                    <Text style={s.detailText}>{sec.instructor}</Text>
                  </View>
                ) : null}
              </View>

              {/* Capacity bar */}
              <View style={s.capRow}>
                <Text style={s.capText}>Enrolled: {sec.enrolled_count} / {sec.max_students}</Text>
                <Text style={[s.capText, { color: sec.is_full ? colors.danger : colors.success }]}>
                  {sec.available_slots} slots left
                </Text>
              </View>
              <View style={s.barBg}>
                <View style={[s.barFill, { width: (sec.enrolled_count / sec.max_students * 100) + '%', backgroundColor: sec.is_full ? colors.danger : colors.primary }]} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  list: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.gray200, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  code: { fontSize: 14, fontWeight: '700', color: colors.primary },
  subName: { fontSize: 13, color: colors.gray600, marginTop: 2 },
  details: { gap: 4, marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 12, color: colors.gray500 },
  capRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  capText: { fontSize: 12, color: colors.gray500 },
  barBg: { height: 5, backgroundColor: colors.gray100, borderRadius: 99, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 99 },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { color: colors.gray400, fontSize: 14 },
});
`);

// Enrollments Screen
write('src/screens/EnrollmentsScreen.js', `
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../components/Badge';
import { colors } from '../theme';
import api from '../api/axios';

export default function EnrollmentsScreen() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/enrollments/').then(({ data }) => setEnrollments(data.results || data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const statusVariant = (status) => status === 'enrolled' ? 'success' : status === 'dropped' ? 'danger' : 'warning';

  return (
    <View style={s.container}>
      {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} /> : (
        <FlatList
          data={enrollments} keyExtractor={i => i.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={s.empty}><Ionicons name="document-text-outline" size={40} color={colors.gray300} /><Text style={s.emptyText}>No enrollments yet</Text></View>}
          renderItem={({ item: e }) => (
            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.section}>{e.section}</Text>
                  <Text style={s.student}>Student: {e.student}</Text>
                </View>
                <Badge label={e.status} variant={statusVariant(e.status)} />
              </View>
              <View style={s.detailRow}>
                <Ionicons name="calendar-outline" size={12} color={colors.gray400} />
                <Text style={s.date}>{new Date(e.enrolled_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  list: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.gray200, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  section: { fontSize: 14, fontWeight: '700', color: colors.gray800 },
  student: { fontSize: 12, color: colors.gray500, marginTop: 2 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  date: { fontSize: 12, color: colors.gray400 },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { color: colors.gray400, fontSize: 14 },
});
`);

// Profile Screen
write('src/screens/ProfileScreen.js', `
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import { colors } from '../theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const confirmLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout }
    ]);
  };

  const details = [
    { label: 'Email', value: user?.email, icon: 'mail-outline' },
    { label: 'Role', value: user?.role, icon: 'shield-outline' },
    { label: 'Status', value: user?.is_verified ? 'Verified' : 'Not Verified', icon: 'checkmark-circle-outline' },
    { label: 'Member Since', value: user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—', icon: 'calendar-outline' },
  ];

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* Profile header */}
      <View style={s.header}>
        <Avatar name={user?.first_name + ' ' + user?.last_name} photo={user?.profile_picture} size={72} />
        <Text style={s.name}>{user?.first_name} {user?.last_name}</Text>
        <Text style={s.email}>{user?.email}</Text>
        <View style={s.badges}>
          <Badge label={user?.role?.toUpperCase()} variant="primary" />
          {user?.is_verified && <><View style={{ width: 6 }} /><Badge label="Verified" variant="success" /></>}
        </View>
      </View>

      {/* Details */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Account Details</Text>
        <View style={s.card}>
          {details.map(({ label, value, icon }, i) => (
            <View key={label} style={[s.row, i < details.length - 1 && s.rowBorder]}>
              <View style={s.rowIcon}>
                <Ionicons name={icon} size={16} color={colors.gray500} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>{label}</Text>
                <Text style={s.rowValue}>{value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Sign out */}
      <View style={s.section}>
        <TouchableOpacity style={s.logoutBtn} onPress={confirmLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={s.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { backgroundColor: colors.primary, paddingTop: 48, paddingBottom: 28, alignItems: 'center', gap: 8 },
  name: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 4 },
  email: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  badges: { flexDirection: 'row', marginTop: 4 },
  section: { padding: 16, paddingBottom: 0 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.gray500, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: colors.gray200, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  rowIcon: { width: 32, height: 32, backgroundColor: colors.gray50, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLabel: { fontSize: 11, color: colors.gray400, fontWeight: '500', marginBottom: 1 },
  rowValue: { fontSize: 14, color: colors.gray800, fontWeight: '500', textTransform: 'capitalize' },
  logoutBtn: { backgroundColor: colors.dangerLight, borderRadius: 10, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32, borderWidth: 1, borderColor: '#FECACA' },
  logoutText: { color: colors.danger, fontWeight: '700', fontSize: 15 },
});
`);

// Chatbot Screen
write('src/screens/ChatbotScreen.js', `
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const RESPONSES = [
  { keywords: ['enroll', 'how to enroll'], answer: 'To enroll a student:\\n1. Go to Enrollments tab\\n2. Tap + button\\n3. Select student and section\\n4. Tap Enroll Student\\n\\nFull sections cannot be selected.' },
  { keywords: ['full', 'capacity', 'no slots'], answer: 'Each section has a max student capacity. When full, it shows FULL and no more enrollments are accepted. Choose a different section.' },
  { keywords: ['drop', 'dropped', 'cancel'], answer: 'Admin or staff must update enrollment status to Dropped from the Enrollments page.' },
  { keywords: ['units', 'total units'], answer: 'Total units are calculated automatically from enrolled subjects. Check the Students page to see a student\\'s total units.' },
  { keywords: ['section', 'what is section'], answer: 'A section is a class schedule for a subject with a room, schedule, instructor, and max capacity.' },
  { keywords: ['subject', 'subjects', 'courses'], answer: 'Subjects are courses offered each semester with a code, name, units, year level, and semester.' },
  { keywords: ['student id', 'id number'], answer: 'Student ID is a unique identifier (e.g. 2024-0001). It\\'s required when adding a student.' },
  { keywords: ['login', 'sign in', 'password'], answer: 'Enter your email and password on the login screen. Contact admin if you forgot your password.' },
  { keywords: ['register', 'sign up', 'account'], answer: '1. Tap Register\\n2. Fill in your details\\n3. Check email for verification link\\n4. Click link to activate\\n5. Login!' },
  { keywords: ['verify', 'verification', 'email'], answer: 'Check your email inbox for a verification link after registering. Check spam if not found.' },
  { keywords: ['admin', 'role', 'staff', 'permission'], answer: 'Roles:\\n- Admin: Full access\\n- Staff: Manage students, subjects, sections, enrollments\\n- Student: View own info' },
  { keywords: ['hello', 'hi', 'hey'], answer: 'Hello! I\\'m your EnrollHub assistant. Ask me about enrollment, sections, subjects, or your account!' },
  { keywords: ['thanks', 'thank you', 'salamat'], answer: 'You\\'re welcome! Feel free to ask anything else.' },
  { keywords: ['help', 'what can you do'], answer: 'I can help with:\\n📋 Enrollment process\\n🏫 Sections & capacity\\n📚 Subjects & units\\n👥 Student management\\n🔐 Login & registration' },
];

const QUICK = ['How do I enroll?', 'Section is full?', 'What are roles?', 'How to register?'];

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const item of RESPONSES) {
    if (item.keywords.some(k => lower.includes(k))) return item.answer;
  }
  return "I\\'m not sure about that. Try asking about enrollment, sections, subjects, or your account. Or contact your administrator.";
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: '0', role: 'assistant', content: "Hi! I\\'m your EnrollHub assistant. How can I help you?" }
  ]);
  const [input, setInput] = useState('');
  const [showQuick, setShowQuick] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const send = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages(m => [
      ...m,
      { id: Date.now().toString(), role: 'user', content: msg },
      { id: (Date.now() + 1).toString(), role: 'assistant', content: getResponse(msg) }
    ]);
    setInput('');
    setShowQuick(false);
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={i => i.id}
        contentContainerStyle={s.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item: m }) => (
          <View style={[s.bubble, m.role === 'user' ? s.userBubble : s.botBubble]}>
            <Text style={[s.bubbleText, m.role === 'user' ? s.userText : s.botText]}>{m.content}</Text>
          </View>
        )}
        ListFooterComponent={showQuick ? (
          <View style={s.quickWrap}>
            <Text style={s.quickLabel}>Quick questions:</Text>
            <View style={s.quickRow}>
              {QUICK.map(q => (
                <TouchableOpacity key={q} style={s.quickBtn} onPress={() => send(q)}>
                  <Text style={s.quickText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}
      />
      <View style={s.inputRow}>
        <TextInput style={s.input} value={input} onChangeText={setInput} placeholder="Ask anything..." placeholderTextColor={colors.gray400} onSubmitEditing={() => send()} returnKeyType="send" blurOnSubmit={false} />
        <TouchableOpacity style={[s.sendBtn, !input.trim() && { opacity: 0.5 }]} onPress={() => send()} disabled={!input.trim()}>
          <Ionicons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  list: { padding: 14, paddingBottom: 8 },
  bubble: { maxWidth: '82%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userBubble: { backgroundColor: colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.gray200 },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  userText: { color: '#fff' },
  botText: { color: colors.gray800 },
  quickWrap: { marginTop: 8 },
  quickLabel: { fontSize: 11, color: colors.gray400, marginBottom: 6 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  quickBtn: { backgroundColor: colors.primaryLight, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 },
  quickText: { color: colors.primary, fontSize: 12, fontWeight: '500' },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.gray200, gap: 8 },
  input: { flex: 1, backgroundColor: colors.gray50, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: colors.gray200, color: colors.gray800 },
  sendBtn: { width: 42, height: 42, backgroundColor: colors.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
`);

// Main App.js
write('App.js', `
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, TouchableOpacity } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { colors } from './src/theme';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import StudentsScreen from './src/screens/StudentsScreen';
import AddStudentScreen from './src/screens/AddStudentScreen';
import SubjectsScreen from './src/screens/SubjectsScreen';
import AddSubjectScreen from './src/screens/AddSubjectScreen';
import SectionsScreen from './src/screens/SectionsScreen';
import AddSectionScreen from './src/screens/AddSectionScreen';
import EnrollmentsScreen from './src/screens/EnrollmentsScreen';
import AddEnrollmentScreen from './src/screens/AddEnrollmentScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerStyle = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700', fontSize: 16 },
  headerBackTitleVisible: false,
};

function MainTabs() {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      ...headerStyle,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.gray400,
      tabBarStyle: { borderTopColor: colors.gray200, paddingBottom: 4, height: 58 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarIcon: ({ focused, color, size }) => {
        const icons = {
          Dashboard: focused ? 'grid' : 'grid-outline',
          Students: focused ? 'people' : 'people-outline',
          Subjects: focused ? 'book' : 'book-outline',
          Sections: focused ? 'school' : 'school-outline',
          Enrollments: focused ? 'document-text' : 'document-text-outline',
          Chatbot: focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline',
          Profile: focused ? 'person' : 'person-outline',
        };
        return <Ionicons name={icons[route.name] || 'ellipse'} size={22} color={color} />;
      },
    })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'EnrollHub', headerTitle: 'EnrollHub' }} />
      <Tab.Screen name="Students" component={StudentsScreen}
        options={({ navigation }) => ({
          headerRight: () => isAdminOrStaff ? (
            <TouchableOpacity onPress={() => navigation.navigate('AddStudent')} style={{ marginRight: 16 }}>
              <Ionicons name="add-circle-outline" size={26} color="#fff" />
            </TouchableOpacity>
          ) : null,
        })}
      />
      {isAdminOrStaff && (
        <Tab.Screen name="Subjects" component={SubjectsScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('AddSubject')} style={{ marginRight: 16 }}>
                <Ionicons name="add-circle-outline" size={26} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        />
      )}
      {isAdminOrStaff && (
        <Tab.Screen name="Sections" component={SectionsScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('AddSection')} style={{ marginRight: 16 }}>
                <Ionicons name="add-circle-outline" size={26} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        />
      )}
      <Tab.Screen name="Enrollments" component={EnrollmentsScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AddEnrollment')} style={{ marginRight: 16 }}>
              <Ionicons name="add-circle-outline" size={26} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} options={{ title: 'Assistant', headerTitle: 'AI Assistant' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gray50 }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <Stack.Navigator screenOptions={{ ...headerStyle }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="AddStudent" component={AddStudentScreen} options={{ title: 'Add Student' }} />
          <Stack.Screen name="EditStudent" component={AddStudentScreen} options={{ title: 'Edit Student' }} />
          <Stack.Screen name="AddSubject" component={AddSubjectScreen} options={{ title: 'Add Subject' }} />
          <Stack.Screen name="EditSubject" component={AddSubjectScreen} options={{ title: 'Edit Subject' }} />
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

console.log('\nAll mobile files created successfully!');
console.log('Run: npx expo start --clear');
