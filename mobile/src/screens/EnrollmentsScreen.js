
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
