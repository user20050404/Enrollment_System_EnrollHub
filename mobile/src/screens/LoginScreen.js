import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
 KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

function validate(email, password) {
  const e = {};

  if (!email.trim()) {
    e.email = 'Email is required.';
  } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    e.email = 'Enter a valid email address.';
  }

  if (!password) {
    e.password = 'Password is required.';
  } else if (password.length < 6) {
    e.password = 'Password must be at least 6 characters.';
  }

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

    if (Object.keys(e).length) {
      return setErrors(e);
    }

    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      Alert.alert(
        'Login Failed',
        err.response?.data?.error || 'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
      />

      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Top Brand Panel */}
        <View style={s.brandPanel}>
          <View style={s.centerLogoContainer}>

            <View style={s.logoBox}>
              <Ionicons
                name="school"
                size={30}
                color="#fff"
              />
            </View>

            <Text style={s.logoName}>EnrollHub</Text>

            <Text style={s.logoSub}>
              Enrollment Management System
            </Text>

          </View>
        </View>

        {/* Form Panel */}
        <View style={s.formPanel}>

          <Text style={s.formTitle}>Welcome Back</Text>

          <Text style={s.formSubtitle}>
            Sign in to continue to your account
          </Text>

          {/* Email Field */}
          <View style={s.fieldGroup}>

            <Text style={s.label}>Email Address</Text>

            <View
              style={[
                s.inputWrap,
                emailFocused && s.inputFocused,
                errors.email && s.inputError,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={
                  errors.email
                    ? colors.danger
                    : emailFocused
                    ? colors.primary
                    : colors.gray400
                }
                style={s.inputIcon}
              />

              <TextInput
                style={s.input}
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setErrors((e) => ({ ...e, email: '' }));
                }}
                placeholder="Email"
                placeholderTextColor={colors.gray400}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                blurOnSubmit={false}
              />
            </View>

            {errors.email ? (
              <Text style={s.errText}>{errors.email}</Text>
            ) : null}

          </View>

          {/* Password Field */}
          <View style={s.fieldGroup}>

            <Text style={s.label}>Password</Text>

            <View
              style={[
                s.inputWrap,
                passFocused && s.inputFocused,
                errors.password && s.inputError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={
                  errors.password
                    ? colors.danger
                    : passFocused
                    ? colors.primary
                    : colors.gray400
                }
                style={s.inputIcon}
              />

              <TextInput
                style={[s.input, { flex: 1 }]}
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  setErrors((e) => ({ ...e, password: '' }));
                }}
                placeholder="Password"
                placeholderTextColor={colors.gray400}
                secureTextEntry={!showPass}
                autoCapitalize="none"
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                blurOnSubmit={false}
              />

              <TouchableOpacity
                onPress={() => setShowPass((p) => !p)}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.gray400}
                />
              </TouchableOpacity>

            </View>

            {errors.password ? (
              <Text style={s.errText}>{errors.password}</Text>
            ) : null}

          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[s.signInBtn, loading && { opacity: 0.7 }]}
            onPress={submit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator
                color="#fff"
                size="small"
              />
            ) : (
              <Text style={s.signInText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={s.registerRow}>
            <Text style={s.registerText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={s.registerLink}> Create one</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },

  content: {
    flexGrow: 1,
  },

  brandPanel: {
    backgroundColor: colors.primary,
    paddingTop: 70,
    paddingBottom: 55,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoBox: {
    width: 78,
    height: 78,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  logoName: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },

  logoSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center',
  },

  formPanel: {
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 34,
    paddingBottom: 48,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -22,
    flex: 1,
  },

  formTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.gray900,
    textAlign: 'center',
    marginBottom: 8,
  },

  formSubtitle: {
    fontSize: 14,
    color: colors.gray500,
    marginBottom: 30,
    textAlign: 'center',
  },

  fieldGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 7,
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  inputFocused: {
    borderColor: colors.primary,
  },

  inputError: {
    borderColor: colors.danger,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: colors.gray800,
  },

  errText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 5,
  },

  signInBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },

  signInText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerText: {
    fontSize: 14,
    color: colors.gray500,
  },

  registerLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
});