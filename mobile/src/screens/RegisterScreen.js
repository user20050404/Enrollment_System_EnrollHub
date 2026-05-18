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

// Validation
function validate(form) {
  const e = {};

  if (!form.first_name.trim()) {
    e.first_name = 'First name is required.';
  }

  if (!form.last_name.trim()) {
    e.last_name = 'Last name is required.';
  }

  if (!form.email.trim()) {
    e.email = 'Email is required.';
  } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) {
    e.email = 'Enter a valid email address.';
  }

  if (!form.password) {
    e.password = 'Password is required.';
  } else if (form.password.length < 8) {
    e.password = 'Minimum 8 characters.';
  } else if (!/[A-Z]/.test(form.password)) {
    e.password = 'Must contain uppercase letter.';
  } else if (!/[0-9]/.test(form.password)) {
    e.password = 'Must contain a number.';
  }

  if (!form.password2) {
    e.password2 = 'Please confirm password.';
  } else if (form.password !== form.password2) {
    e.password2 = 'Passwords do not match.';
  }

  return e;
}

// Reusable Field Component
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  keyboard,
  error,
  required,
  rightIcon,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={f.group}>

      <Text style={f.label}>
        {label}
        {required && <Text style={f.req}> *</Text>}
      </Text>

      <View
        style={[
          f.wrap,
          focused && f.focused,
          error && f.error,
        ]}
      >
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
  group: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 7,
  },

  req: {
    color: colors.danger,
  },

  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  focused: {
    borderColor: colors.primary,
  },

  error: {
    borderColor: colors.danger,
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

  const clearErr = (k) =>
    setErrors((e) => ({ ...e, [k]: '' }));

  const submit = async () => {
    const form = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      password2,
    };

    const e = validate(form);

    if (Object.keys(e).length) {
      return setErrors(e);
    }

    setLoading(true);

    try {
      await register({
        ...form,
        role: 'student',
      });

      setSuccess(true);

    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === 'object') {
        const mapped = {};

        Object.keys(data).forEach((k) => {
          mapped[k] = Array.isArray(data[k])
            ? data[k][0]
            : data[k];
        });

        setErrors(mapped);

      } else {
        Alert.alert(
          'Error',
          'Registration failed. Please try again.'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (success) {
    return (
      <View style={s.successContainer}>

        <View style={s.successIcon}>
          <Ionicons
            name="checkmark"
            size={38}
            color={colors.success}
          />
        </View>

        <Text style={s.successTitle}>
          Check your email!
        </Text>

        <Text style={s.successText}>
          We sent a verification link to your email address.
          Click the link to activate your account.
        </Text>

        <TouchableOpacity
          style={s.goLoginBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={s.goLoginText}>
            Go to Login
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

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

        {/* Header */}
        <View style={s.headerPanel}>

          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>

          <View style={s.centerLogoContainer}>

            <View style={s.logoBox}>
              <Ionicons
                name="school"
                size={30}
                color="#fff"
              />
            </View>

            <Text style={s.logoName}>
              EnrollHub
            </Text>

            <Text style={s.logoSub}>
              Enrollment Management System
            </Text>

          </View>

        </View>

        {/* Form */}
        <View style={s.formPanel}>

          <Text style={s.formTitle}>
            Create Account
          </Text>

          <Text style={s.formSubtitle}>
            Fill in your details to get started
          </Text>

          {/* Name Row */}
          <View style={s.nameRow}>

            <View style={{ flex: 1, marginRight: 8 }}>
              <Field
                label="First Name"
                value={firstName}
                onChangeText={(v) => {
                  setFirstName(v);
                  clearErr('first_name');
                }}
                placeholder="First Name"
                error={errors.first_name}
                required
              />
            </View>

            <View style={{ flex: 1 }}>
              <Field
                label="Last Name"
                value={lastName}
                onChangeText={(v) => {
                  setLastName(v);
                  clearErr('last_name');
                }}
                placeholder="Last Name"
                error={errors.last_name}
                required
              />
            </View>

          </View>

          <Field
            label="Email Address"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              clearErr('email');
            }}
            placeholder="Email"
            keyboard="email-address"
            error={errors.email}
            required
          />

          <Field
            label="Password"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              clearErr('password');
            }}
            placeholder="Minimum 8 characters"
            secure={!showPass}
            error={errors.password}
            required
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowPass((s) => !s)}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={
                    showPass
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color={colors.gray400}
                />
              </TouchableOpacity>
            }
          />

          <Field
            label="Confirm Password"
            value={password2}
            onChangeText={(v) => {
              setPassword2(v);
              clearErr('password2');
            }}
            placeholder="Repeat your password"
            secure={!showPass2}
            error={errors.password2}
            required
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowPass2((s) => !s)}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={
                    showPass2
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color={colors.gray400}
                />
              </TouchableOpacity>
            }
          />

          {/* Password Hints */}
          <View style={s.hints}>

            {[
              {
                label: 'At least 8 characters',
                met: password.length >= 8,
              },
              {
                label: 'One uppercase letter',
                met: /[A-Z]/.test(password),
              },
              {
                label: 'One number',
                met: /[0-9]/.test(password),
              },
            ].map((h) => (
              <View
                key={h.label}
                style={s.hintRow}
              >
                <Ionicons
                  name={
                    h.met
                      ? 'checkmark-circle'
                      : 'ellipse-outline'
                  }
                  size={14}
                  color={
                    h.met
                      ? colors.success
                      : colors.gray300
                  }
                />

                <Text
                  style={[
                    s.hintText,
                    h.met && { color: colors.success },
                  ]}
                >
                  {h.label}
                </Text>
              </View>
            ))}

          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              s.submitBtn,
              loading && { opacity: 0.7 },
            ]}
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
              <Text style={s.submitText}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={s.loginRow}>
            <Text style={s.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={s.loginLink}>
                {' '}Sign In
              </Text>
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

  // Success
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.gray50,
  },

  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 10,
  },

  successText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },

  goLoginBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 34,
  },

  goLoginText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  // Header
  headerPanel: {
    backgroundColor: colors.primary,
    paddingTop: 58,
    paddingBottom: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  backBtn: {
    position: 'absolute',
    left: 24,
    top: 58,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
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
    textAlign: 'center',
  },

  logoSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center',
  },

  // Form
  formPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingTop: 34,
    paddingBottom: 50,
    marginTop: -22,
    flex: 1,
  },

  formTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray900,
    textAlign: 'center',
    marginBottom: 8,
  },

  formSubtitle: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: 30,
  },

  nameRow: {
    flexDirection: 'row',
  },

  // Hints
  hints: {
    backgroundColor: colors.gray50,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.gray100,
  },

  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  hintText: {
    fontSize: 12,
    color: colors.gray400,
  },

  // Submit
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 24,
  },

  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  // Login Link
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginText: {
    fontSize: 14,
    color: colors.gray500,
  },

  loginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
});