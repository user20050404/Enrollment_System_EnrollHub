const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created: ' + filePath);
}

// Login Screen - matches web split panel design adapted for mobile
write('src/screens/LoginScreen.js', `
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

function validate(email, password) {
  const e = {};
  if (!email.trim()) e.email = 'Email is required.';
  else if (!/^[^@]+@[^@]+\\.[^@]+$/.test(email)) e.email = 'Enter a valid email address.';
  if (!password) e.password = 'Password is required.';
  else if (password.length < 6) e.password = 'Password must be at least 6 characters.';
  return e;
}

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const submit = async () => {
    const e = validate(email, password);
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.error || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  const features = [
    'Automated section assignment',
    'Section capacity control',
    'Real-time enrollment tracking',
    'Role-based access control',
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Top brand panel — matches web left panel */}
        <View style={s.brandPanel}>
          <View style={s.logoRow}>
            <View style={s.logoBox}>
              <Ionicons name="school" size={22} color="#fff" />
            </View>
            <View>
              <Text style={s.logoName}>EnrollHub</Text>
              <Text style={s.logoSub}>Enrollment Management</Text>
            </View>
          </View>

          <Text style={s.headline}>Manage enrollments{'\n'}with confidence</Text>
          <Text style={s.tagline}>A complete system for student enrollment, section management, and academic administration.</Text>

          <View style={s.features}>
            {features.map(f => (
              <View key={f} style={s.featureRow}>
                <View style={s.featureIcon}>
                  <Ionicons name="checkmark" size={10} color="#fff" />
                </View>
                <Text style={s.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Form panel — matches web right panel */}
        <View style={s.formPanel}>
          <Text style={s.formTitle}>Welcome back</Text>
          <Text style={s.formSubtitle}>Sign in to your account to continue</Text>

          {/* Email field */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Email address</Text>
            <View style={[s.inputWrap, emailFocused && s.inputFocused, errors.email && s.inputError]}>
              <Ionicons name="mail-outline" size={16} color={errors.email ? colors.danger : emailFocused ? colors.primary : colors.gray400} style={s.inputIcon} />
              <TextInput
                style={s.input}
                value={email}
                onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: '' })); }}
                placeholder="you@example.com"
                placeholderTextColor={colors.gray400}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                blurOnSubmit={false}
              />
            </View>
            {errors.email && <Text style={s.errText}>{errors.email}</Text>}
          </View>

          {/* Password field */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Password</Text>
            <View style={[s.inputWrap, passFocused && s.inputFocused, errors.password && s.inputError]}>
              <Ionicons name="lock-closed-outline" size={16} color={errors.password ? colors.danger : passFocused ? colors.primary : colors.gray400} style={s.inputIcon} />
              <TextInput
                style={[s.input, { flex: 1 }]}
                value={password}
                onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: '' })); }}
                placeholder="••••••••"
                placeholderTextColor={colors.gray400}
                secureTextEntry={!showPass}
                autoCapitalize="none"
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                blurOnSubmit={false}
              />
              <TouchableOpacity onPress={() => setShowPass(s => !s)} style={{ padding: 4 }}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.gray400} />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={s.errText}>{errors.password}</Text>}
          </View>

          {/* Sign in button */}
          <TouchableOpacity style={[s.signInBtn, loading && { opacity: 0.7 }]} onPress={submit} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.signInText}>Sign in</Text>
            }
          </TouchableOpacity>

          {/* Register link */}
          <View style={s.registerRow}>
            <Text style={s.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={s.registerLink}>Create one</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  content: { flexGrow: 1 },

  // Brand panel
  brandPanel: { backgroundColor: colors.primary, paddingTop: 56, paddingBottom: 32, paddingHorizontal: 24 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  logoBox: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoName: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: -0.5 },
  logoSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 1 },
  headline: { color: '#fff', fontSize: 22, fontWeight: '700', lineHeight: 30, marginBottom: 10, letterSpacing: -0.5 },
  tagline: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, marginBottom: 20 },
  features: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureIcon: { width: 18, height: 18, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 99, alignItems: 'center', justifyContent: 'center' },
  featureText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },

  // Form panel
  formPanel: { backgroundColor: '#fff', padding: 24, paddingBottom: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -16, flex: 1 },
  formTitle: { fontSize: 22, fontWeight: '700', color: colors.gray900, letterSpacing: -0.5, marginBottom: 4 },
  formSubtitle: { fontSize: 13, color: colors.gray500, marginBottom: 24 },

  // Fields
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.gray700, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.gray200, borderRadius: 8, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 11 },
  inputFocused: { borderColor: colors.primary },
  inputError: { borderColor: colors.danger },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: colors.gray800 },
  errText: { color: colors.danger, fontSize: 12, marginTop: 4 },

  // Button
  signInBtn: { backgroundColor: colors.primary, borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  signInText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Register link
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: 14, color: colors.gray500 },
  registerLink: { fontSize: 14, color: colors.primary, fontWeight: '600' },
});
`);

// Register Screen - matches web register page
write('src/screens/RegisterScreen.js', `
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

// Validate outside component to avoid re-render issues
function validate(form) {
  const e = {};
  if (!form.first_name.trim()) e.first_name = 'First name is required.';
  if (!form.last_name.trim()) e.last_name = 'Last name is required.';
  if (!form.email.trim()) e.email = 'Email is required.';
  else if (!/^[^@]+@[^@]+\\.[^@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
  if (!form.password) e.password = 'Password is required.';
  else if (form.password.length < 8) e.password = 'Min. 8 characters.';
  else if (!/[A-Z]/.test(form.password)) e.password = 'Must contain at least 1 uppercase letter.';
  else if (!/[0-9]/.test(form.password)) e.password = 'Must contain at least 1 number.';
  if (!form.password2) e.password2 = 'Please confirm your password.';
  else if (form.password !== form.password2) e.password2 = 'Passwords do not match.';
  return e;
}

// Field component defined OUTSIDE to avoid keyboard dismissal
function Field({ label, value, onChangeText, placeholder, secure, keyboard, error, required, rightIcon }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={f.group}>
      <Text style={f.label}>{label}{required && <Text style={f.req}> *</Text>}</Text>
      <View style={[f.wrap, focused && f.focused, error && f.error]}>
        <TextInput
          style={[f.input, rightIcon && { paddingRight: 40 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray400}
          secureTextEntry={!!secure}
          keyboardType={keyboard || 'default'}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          blurOnSubmit={false}
        />
        {rightIcon}
      </View>
      {error && <Text style={f.errText}>{error}</Text>}
    </View>
  );
}

const f = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: colors.gray700, marginBottom: 5 },
  req: { color: colors.danger },
  wrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.gray200, borderRadius: 8, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 11 },
  focused: { borderColor: colors.primary },
  error: { borderColor: colors.danger },
  input: { flex: 1, fontSize: 15, color: colors.gray800 },
  errText: { color: colors.danger, fontSize: 12, marginTop: 4 },
});

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const clearErr = (k) => setErrors(e => ({ ...e, [k]: '' }));

  const submit = async () => {
    const form = { first_name: firstName, last_name: lastName, email, password, password2 };
    const e = validate(form);
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await register({ ...form, role: 'student' });
      setSuccess(true);
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

  if (success) return (
    <View style={s.successContainer}>
      <View style={s.successIcon}>
        <Ionicons name="checkmark" size={36} color={colors.success} />
      </View>
      <Text style={s.successTitle}>Check your email!</Text>
      <Text style={s.successText}>We sent a verification link to your email address. Click it to activate your account.</Text>
      <TouchableOpacity style={s.goLoginBtn} onPress={() => navigation.navigate('Login')}>
        <Text style={s.goLoginText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Top header panel */}
        <View style={s.headerPanel}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.navigate('Login')}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={s.logoRow}>
            <View style={s.logoBox}>
              <Ionicons name="school" size={20} color="#fff" />
            </View>
            <Text style={s.logoName}>EnrollHub</Text>
          </View>
          <Text style={s.headerTitle}>Create your account</Text>
          <Text style={s.headerSub}>Fill in your details to get started</Text>
        </View>

        {/* Form */}
        <View style={s.formPanel}>

          {/* Name row */}
          <View style={s.nameRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Field
                label="First name" value={firstName}
                onChangeText={v => { setFirstName(v); clearErr('first_name'); }}
                placeholder="Juan" error={errors.first_name} required
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="Last name" value={lastName}
                onChangeText={v => { setLastName(v); clearErr('last_name'); }}
                placeholder="Dela Cruz" error={errors.last_name} required
              />
            </View>
          </View>

          <Field
            label="Email address" value={email}
            onChangeText={v => { setEmail(v); clearErr('email'); }}
            placeholder="you@example.com" keyboard="email-address"
            error={errors.email} required
          />

          <Field
            label="Password" value={password}
            onChangeText={v => { setPassword(v); clearErr('password'); }}
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            secure={!showPass} error={errors.password} required
            rightIcon={
              <TouchableOpacity onPress={() => setShowPass(s => !s)} style={{ padding: 4 }}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.gray400} />
              </TouchableOpacity>
            }
          />

          <Field
            label="Confirm password" value={password2}
            onChangeText={v => { setPassword2(v); clearErr('password2'); }}
            placeholder="Repeat your password"
            secure={!showPass2} error={errors.password2} required
            rightIcon={
              <TouchableOpacity onPress={() => setShowPass2(s => !s)} style={{ padding: 4 }}>
                <Ionicons name={showPass2 ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.gray400} />
              </TouchableOpacity>
            }
          />

          {/* Password hints */}
          <View style={s.hints}>
            {[
              { label: 'At least 8 characters', met: password.length >= 8 },
              { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
              { label: 'One number', met: /[0-9]/.test(password) },
            ].map(h => (
              <View key={h.label} style={s.hintRow}>
                <Ionicons name={h.met ? 'checkmark-circle' : 'ellipse-outline'} size={13} color={h.met ? colors.success : colors.gray300} />
                <Text style={[s.hintText, h.met && { color: colors.success }]}>{h.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[s.submitBtn, loading && { opacity: 0.7 }]} onPress={submit} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.submitText}>Create account</Text>
            }
          </TouchableOpacity>

          <View style={s.loginRow}>
            <Text style={s.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={s.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  content: { flexGrow: 1 },

  // Success state
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: colors.gray50 },
  successIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.successLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: '700', color: colors.gray900, marginBottom: 10 },
  successText: { fontSize: 14, color: colors.gray500, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  goLoginBtn: { backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 14, paddingHorizontal: 32 },
  goLoginText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Header panel
  headerPanel: { backgroundColor: colors.primary, paddingTop: 52, paddingBottom: 28, paddingHorizontal: 20 },
  backBtn: { width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  logoBox: { width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  logoName: { color: '#fff', fontSize: 17, fontWeight: '700' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700', letterSpacing: -0.5, marginBottom: 4 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },

  // Form panel
  formPanel: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40, marginTop: -16, flex: 1 },
  nameRow: { flexDirection: 'row' },

  // Password hints
  hints: { backgroundColor: colors.gray50, borderRadius: 8, padding: 12, marginBottom: 16, gap: 6, borderWidth: 1, borderColor: colors.gray100 },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hintText: { fontSize: 12, color: colors.gray400 },

  // Submit
  submitBtn: { backgroundColor: colors.primary, borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 20 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Login link
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: 14, color: colors.gray500 },
  loginLink: { fontSize: 14, color: colors.primary, fontWeight: '600' },
});
`);

console.log('\nLogin and Register screens created!');
console.log('Run: npx expo start --clear');
