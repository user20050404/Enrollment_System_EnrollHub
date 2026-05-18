
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
