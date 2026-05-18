
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
