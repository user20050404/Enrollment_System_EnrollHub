
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
