
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
