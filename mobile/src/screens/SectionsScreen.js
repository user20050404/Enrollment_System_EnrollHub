
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
