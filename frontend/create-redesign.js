const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created: ' + filePath);
}

// Global CSS
write('src/index.css', `
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #F8F9FC;
  color: #1A1D23;
  line-height: 1.6;
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --primary: #4F46E5;
  --primary-light: #EEF2FF;
  --primary-dark: #3730A3;
  --success: #059669;
  --success-light: #D1FAE5;
  --danger: #DC2626;
  --danger-light: #FEE2E2;
  --warning: #D97706;
  --warning-light: #FEF3C7;
  --gray-50: #F8F9FC;
  --gray-100: #F1F3F9;
  --gray-200: #E2E8F0;
  --gray-300: #CBD5E1;
  --gray-400: #94A3B8;
  --gray-500: #64748B;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1E293B;
  --gray-900: #0F172A;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04);
  --radius-sm: 6px;
  --radius: 8px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}

a { text-decoration: none; color: inherit; }
button { font-family: inherit; }
input, select, textarea { font-family: inherit; }

.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0.5rem 1rem; border-radius: var(--radius);
  font-size: 0.875rem; font-weight: 500; cursor: pointer;
  border: 1px solid transparent; transition: all 0.15s ease;
}
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { background: var(--primary-dark); }
.btn-secondary { background: #fff; color: var(--gray-700); border-color: var(--gray-200); }
.btn-secondary:hover { background: var(--gray-50); }
.btn-danger { background: var(--danger-light); color: var(--danger); }
.btn-danger:hover { background: #FECACA; }
.btn-lg { padding: 0.75rem 1.5rem; font-size: 1rem; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.card {
  background: #fff; border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200); padding: 1.5rem;
  box-shadow: var(--shadow);
}

.badge {
  display: inline-flex; align-items: center;
  padding: 0.2rem 0.6rem; border-radius: 99px;
  font-size: 0.75rem; font-weight: 600;
}
.badge-success { background: var(--success-light); color: #065F46; }
.badge-danger { background: var(--danger-light); color: #991B1B; }
.badge-warning { background: var(--warning-light); color: #92400E; }
.badge-primary { background: var(--primary-light); color: var(--primary-dark); }
.badge-gray { background: var(--gray-100); color: var(--gray-600); }

table { width: 100%; border-collapse: collapse; }
th { font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.05em; color: var(--gray-500); padding: 0.75rem 1rem;
  text-align: left; border-bottom: 1px solid var(--gray-200); }
td { padding: 0.875rem 1rem; border-bottom: 1px solid var(--gray-100);
  font-size: 0.875rem; color: var(--gray-700); }
tr:last-child td { border-bottom: none; }
tr:hover td { background: var(--gray-50); }

.form-group { margin-bottom: 1.25rem; }
.form-label { display: block; font-size: 0.875rem; font-weight: 500;
  color: var(--gray-700); margin-bottom: 0.375rem; }
.form-label .req { color: var(--danger); margin-left: 2px; }
.form-control {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--gray-300); border-radius: var(--radius);
  font-size: 0.875rem; color: var(--gray-800); background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-control:focus { outline: none; border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
.form-control.error { border-color: var(--danger); }
.form-control.error:focus { box-shadow: 0 0 0 3px rgba(220,38,38,0.1); }
.form-error { font-size: 0.8rem; color: var(--danger); margin-top: 0.3rem; display: flex; align-items: center; gap: 4px; }

.page-header { margin-bottom: 1.5rem; }
.page-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--gray-900); }
.page-header p { color: var(--gray-500); font-size: 0.875rem; margin-top: 0.25rem; }

.alert { padding: 0.875rem 1rem; border-radius: var(--radius); margin-bottom: 1rem; font-size: 0.875rem; }
.alert-success { background: var(--success-light); color: #065F46; border: 1px solid #A7F3D0; }
.alert-danger { background: var(--danger-light); color: #991B1B; border: 1px solid #FECACA; }

.stat-card { background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--gray-200);
  padding: 1.25rem 1.5rem; box-shadow: var(--shadow); }
.stat-card .stat-label { font-size: 0.8rem; font-weight: 500; color: var(--gray-500);
  text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
.stat-card .stat-value { font-size: 2rem; font-weight: 700; color: var(--gray-900); }
.stat-card .stat-icon { width: 40px; height: 40px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
`);

// App.js with new layout
write('src/App.js', `
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Chatbot from './components/Chatbot';
import Dashboard from './pages/Dashboard';
import './index.css';

const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail'));
const Students = React.lazy(() => import('./pages/Students'));
const StudentForm = React.lazy(() => import('./pages/StudentForm'));
const Subjects = React.lazy(() => import('./pages/Subjects'));
const Sections = React.lazy(() => import('./pages/Sections'));
const Enrollments = React.lazy(() => import('./pages/Enrollments'));
const EnrollmentForm = React.lazy(() => import('./pages/EnrollmentForm'));
const Profile = React.lazy(() => import('./pages/Profile'));

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div style={{ color: '#4F46E5', fontSize: '1rem' }}>Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function Sidebar() {
  const { user, logout } = useAuth();
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  const navItems = [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/students', icon: '👥', label: 'Students' },
    { to: '/subjects', icon: '📚', label: 'Subjects', adminOnly: true },
    { to: '/sections', icon: '🏫', label: 'Sections', adminOnly: true },
    { to: '/enrollments', icon: '📋', label: 'Enrollments' },
  ];

  const activeStyle = {
    background: '#EEF2FF', color: '#4F46E5', fontWeight: 600,
  };

  return (
    <aside style={{
      width: 240, background: '#fff', borderRight: '1px solid #E2E8F0',
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'fixed', top: 0, left: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, background: '#4F46E5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem' }}>📚</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1A1D23' }}>EnrollSys</div>
            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Management System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.5rem 0.75rem', marginBottom: 4 }}>Main Menu</div>
        {navItems.filter(i => !i.adminOnly || isAdminOrStaff).map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.75rem', borderRadius: 8,
            fontSize: '0.875rem', color: '#475569',
            transition: 'all 0.15s',
            ...(isActive ? activeStyle : {}),
          })}>
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
        <NavLink to="/profile" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.6rem 0.75rem', borderRadius: 8,
          ...(isActive ? activeStyle : {}),
        })}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5', flexShrink: 0 }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.first_name} {user?.last_name}</div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </NavLink>
        <button onClick={logout} style={{ width: '100%', marginTop: 4, padding: '0.5rem 0.75rem', background: 'none', border: 'none', borderRadius: 8, fontSize: '0.8rem', color: '#DC2626', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🚪</span> Sign out
        </button>
      </div>
    </aside>
  );
}

function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '2rem', minHeight: '100vh', background: '#F8F9FC' }}>
        {children}
      </main>
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <React.Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#4F46E5' }}>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute><AppLayout><Students /></AppLayout></ProtectedRoute>} />
            <Route path="/students/new" element={<ProtectedRoute roles={['admin','staff']}><AppLayout><StudentForm /></AppLayout></ProtectedRoute>} />
            <Route path="/students/:id/edit" element={<ProtectedRoute roles={['admin','staff']}><AppLayout><StudentForm /></AppLayout></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute roles={['admin','staff']}><AppLayout><Subjects /></AppLayout></ProtectedRoute>} />
            <Route path="/sections" element={<ProtectedRoute roles={['admin','staff']}><AppLayout><Sections /></AppLayout></ProtectedRoute>} />
            <Route path="/enrollments" element={<ProtectedRoute><AppLayout><Enrollments /></AppLayout></ProtectedRoute>} />
            <Route path="/enrollments/new" element={<ProtectedRoute><AppLayout><EnrollmentForm /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
`);

// Login page
write('src/pages/Login.js', `
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validate';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: '' }));
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validateLogin(form);
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true); setServerError('');
    try {
      await login(form.email, form.password);
      window.location.href = '/dashboard';
    } catch (err) {
      setServerError(err.response?.data?.error || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8F9FC' }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: '#4F46E5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#fff' }}>
        <div style={{ maxWidth: 380 }}>
          <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.5rem' }}>📚</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>Student Enrollment & Sectioning System</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.7 }}>Manage student enrollments, sections, and subjects efficiently in one place.</p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Automated section assignment', 'Capacity control', 'Real-time enrollment tracking', 'Role-based access control'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)' }}>
                <span style={{ width: 20, height: 20, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.375rem' }}>Welcome back</h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '2rem' }}>Sign in to your account to continue</p>

          {serverError && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              {serverError}
            </div>
          )}

          <form onSubmit={submit} noValidate>
            <div className="form-group">
              <label className="form-label">Email address <span className="req">*</span></label>
              <input name="email" type="email" value={form.email} onChange={handle}
                className={"form-control" + (errors.email ? ' error' : '')}
                placeholder="you@example.com" />
              {errors.email && <div className="form-error">⚠ {errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password <span className="req">*</span></label>
              <input name="password" type="password" value={form.password} onChange={handle}
                className={"form-control" + (errors.password ? ' error' : '')}
                placeholder="••••••••" />
              {errors.password && <div className="form-error">⚠ {errors.password}</div>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748B' }}>
            Don't have an account?{' '}
            <a href="/register" style={{ color: '#4F46E5', fontWeight: 500 }}>Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
}
`);

// Register page
write('src/pages/Register.js', `
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateRegister } from '../utils/validate';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', first_name: '', last_name: '', password: '', password2: '', role: 'student' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: '' }));
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validateRegister(form);
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true); setServerError('');
    try {
      await register(form);
      setSuccess('Account created! Check your email to verify your account.');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
        setErrors(mapped);
      } else { setServerError('Registration failed. Please try again.'); }
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FC' }}>
      <div style={{ textAlign: 'center', maxWidth: 420, padding: '2rem' }}>
        <div style={{ width: 72, height: 72, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>✅</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0F172A' }}>Check your email</h2>
        <p style={{ color: '#64748B', marginBottom: '2rem', lineHeight: 1.7 }}>{success}</p>
        <a href="/login" className="btn btn-primary btn-lg">Go to Login</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FC', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '2.5rem', width: '100%', maxWidth: 460, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <a href="/login" style={{ fontSize: '0.875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '1.5rem' }}>← Back to login</a>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>Create your account</h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.25rem' }}>Fill in your details to get started</p>
        </div>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <form onSubmit={submit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="form-group">
              <label className="form-label">First name <span className="req">*</span></label>
              <input name="first_name" value={form.first_name} onChange={handle}
                className={"form-control" + (errors.first_name ? ' error' : '')} placeholder="Juan" />
              {errors.first_name && <div className="form-error">⚠ {errors.first_name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Last name <span className="req">*</span></label>
              <input name="last_name" value={form.last_name} onChange={handle}
                className={"form-control" + (errors.last_name ? ' error' : '')} placeholder="Dela Cruz" />
              {errors.last_name && <div className="form-error">⚠ {errors.last_name}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email address <span className="req">*</span></label>
            <input name="email" type="email" value={form.email} onChange={handle}
              className={"form-control" + (errors.email ? ' error' : '')} placeholder="you@example.com" />
            {errors.email && <div className="form-error">⚠ {errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password <span className="req">*</span></label>
            <input name="password" type="password" value={form.password} onChange={handle}
              className={"form-control" + (errors.password ? ' error' : '')} placeholder="Min. 8 chars, 1 uppercase, 1 number" />
            {errors.password && <div className="form-error">⚠ {errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm password <span className="req">*</span></label>
            <input name="password2" type="password" value={form.password2} onChange={handle}
              className={"form-control" + (errors.password2 ? ' error' : '')} placeholder="Repeat password" />
            {errors.password2 && <div className="form-error">⚠ {errors.password2}</div>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#64748B' }}>
          Already have an account? <a href="/login" style={{ color: '#4F46E5', fontWeight: 500 }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
`);

// Dashboard
write('src/pages/Dashboard.js', `
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/dashboard-stats/')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Students', value: stats.total_students, icon: '👥', color: '#EEF2FF', iconColor: '#4F46E5' },
    { label: 'Active Enrollments', value: stats.total_enrollments, icon: '📋', color: '#D1FAE5', iconColor: '#059669' },
    { label: 'Dropped', value: stats.dropped, icon: '❌', color: '#FEE2E2', iconColor: '#DC2626' },
    { label: 'Completed', value: stats.completed, icon: '✅', color: '#FEF3C7', iconColor: '#D97706' },
  ] : [];

  const quickActions = [
    { label: 'Enroll Student', href: '/enrollments/new', icon: '📋', desc: 'Add new enrollment' },
    { label: 'Add Student', href: '/students/new', icon: '👤', desc: 'Register new student' },
    { label: 'View Sections', href: '/sections', icon: '🏫', desc: 'Manage sections' },
    { label: 'View Subjects', href: '/subjects', icon: '📚', desc: 'Manage subjects' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>
          Good day, {user?.first_name}! 👋
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Here's what's happening in your enrollment system today.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {loading ? (
          [1,2,3,4].map(i => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '1.25rem 1.5rem', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>Loading...</div>
          ))
        ) : cards.map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{card.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0F172A' }}>{card.value}</div>
              </div>
              <div style={{ width: 42, height: 42, background: card.color, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {quickActions.map(action => (
            <a key={action.label} href={action.href} style={{
              display: 'flex', alignItems: 'center', gap: '0.875rem',
              padding: '0.875rem 1rem', borderRadius: 10,
              border: '1px solid #E2E8F0', background: '#F8F9FC',
              transition: 'all 0.15s', color: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8F9FC'; }}>
              <div style={{ width: 38, height: 38, background: '#EEF2FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{action.icon}</div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>{action.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{action.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Role badge */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ width: 44, height: 44, background: '#EEF2FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#4F46E5', flexShrink: 0 }}>
          {user?.first_name?.[0]}{user?.last_name?.[0]}
        </div>
        <div>
          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.9rem' }}>{user?.full_name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span className={"badge badge-" + (user?.role === 'admin' ? 'danger' : user?.role === 'staff' ? 'warning' : 'primary')} style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            {user?.is_verified && <span className="badge badge-success">Verified</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
`);

// Students page
write('src/pages/Students.js', `
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  const load = () => {
    setLoading(true);
    api.get('/students/?search=' + search)
      .then(({ data }) => setStudents(data.results || data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const del = async (id, name) => {
    if (!window.confirm('Delete ' + name + '?')) return;
    await api.delete('/students/' + id + '/');
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>Students</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 2 }}>{students.length} total students</p>
        </div>
        {isAdminOrStaff && (
          <a href="/students/new" className="btn btn-primary">+ Add Student</a>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0' }}>
          <input
            type="search" placeholder="Search by name, ID, or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="form-control" style={{ maxWidth: 360 }}
          />
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Loading students...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Course</th>
                <th>Year</th>
                <th>Units</th>
                <th>Status</th>
                {isAdminOrStaff && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5', flexShrink: 0 }}>
                        {s.first_name?.[0]}{s.last_name?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.875rem' }}>{s.last_name}, {s.first_name}</div>
                        <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#F1F5F9', padding: '2px 8px', borderRadius: 4, color: '#475569' }}>{s.student_id}</span></td>
                  <td style={{ color: '#475569' }}>{s.course}</td>
                  <td><span className="badge badge-gray">Year {s.year_level}</span></td>
                  <td><span style={{ fontWeight: 600, color: '#1E293B' }}>{s.total_enrolled_units}</span> <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>units</span></td>
                  <td><span className={"badge " + (s.is_active ? 'badge-success' : 'badge-gray')}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                  {isAdminOrStaff && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={"/students/" + s.id + "/edit"} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Edit</a>
                        <button onClick={() => del(s.id, s.full_name)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>No students found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
`);

// Profile page
write('src/pages/Profile.js', `
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user } = useAuth();
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('profile_picture', file);
    try {
      await api.patch('/auth/profile/', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Profile photo updated!');
    } catch { setSuccess('Upload failed.'); }
    finally { setUploading(false); }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700, color: '#4F46E5', flexShrink: 0 }}>
            {user?.profile_picture
              ? <img src={user.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : <>{user?.first_name?.[0]}{user?.last_name?.[0]}</>
            }
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>{user?.full_name}</h2>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 2 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <span className={"badge badge-" + (user?.role === 'admin' ? 'danger' : user?.role === 'staff' ? 'warning' : 'primary')} style={{ textTransform: 'capitalize' }}>{user?.role}</span>
              {user?.is_verified && <span className="badge badge-success">✓ Verified</span>}
            </div>
          </div>
          <label style={{ cursor: 'pointer' }}>
            <span className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>{uploading ? 'Uploading...' : '📷 Change photo'}</span>
            <input type="file" accept="image/*" onChange={uploadPhoto} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '1rem' }}>Account Details</h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {[
            ['Full Name', user?.full_name],
            ['Email Address', user?.email],
            ['Role', user?.role],
            ['Account Status', user?.is_verified ? 'Verified' : 'Not Verified'],
            ['Member Since', user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: 500, textTransform: label === 'Role' ? 'capitalize' : 'none' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`);

console.log('\nAll redesigned pages created!');
console.log('Next: npm install react-router-dom (if not already installed)');
console.log('Then: npm start');
