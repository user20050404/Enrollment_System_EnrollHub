const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created: ' + filePath);
}

// App.js with sidebar using react-icons
write('src/App.js', `
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Chatbot from './components/Chatbot';
import Dashboard from './pages/Dashboard';
import {
  RiDashboardLine, RiUserLine, RiBookOpenLine,
  RiBuilding2Line, RiFileListLine, RiLogoutBoxLine,
  RiGraduationCapLine, RiMenuLine,
} from 'react-icons/ri';
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
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F8F9FC' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #EEF2FF', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <div style={{ color: '#64748B', fontSize: '0.875rem' }}>Loading...</div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function Sidebar() {
  const { user, logout } = useAuth();
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  const navItems = [
    { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
    { to: '/students', icon: RiUserLine, label: 'Students' },
    { to: '/subjects', icon: RiBookOpenLine, label: 'Subjects', adminOnly: true },
    { to: '/sections', icon: RiBuilding2Line, label: 'Sections', adminOnly: true },
    { to: '/enrollments', icon: RiFileListLine, label: 'Enrollments' },
  ];

  return (
    <aside style={{
      width: 240, background: '#fff',
      borderRight: '1px solid #E2E8F0',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'fixed',
      top: 0, left: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 34, height: 34, background: '#4F46E5',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <RiGraduationCapLine style={{ color: '#fff', fontSize: '1.1rem' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', letterSpacing: '-0.01em' }}>EnrollHub</div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 1 }}>Enrollment System</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.75rem', marginBottom: '0.25rem' }}>
          Main Menu
        </div>
        {navItems.filter(i => !i.adminOnly || isAdminOrStaff).map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.55rem 0.75rem', borderRadius: 7,
            fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
            color: isActive ? '#4F46E5' : '#475569',
            background: isActive ? '#EEF2FF' : 'transparent',
            transition: 'all 0.12s', textDecoration: 'none',
          })}>
            <item.icon style={{ fontSize: '1.05rem', flexShrink: 0 }} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
        <NavLink to="/profile" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          padding: '0.55rem 0.75rem', borderRadius: 7,
          background: isActive ? '#EEF2FF' : 'transparent',
          textDecoration: 'none', marginBottom: 2,
        })}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#EEF2FF', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
            color: '#4F46E5', flexShrink: 0,
          }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.first_name} {user?.last_name}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </NavLink>
        <button onClick={logout} style={{
          width: '100%', padding: '0.5rem 0.75rem',
          background: 'none', border: 'none', borderRadius: 7,
          fontSize: '0.8rem', color: '#DC2626', cursor: 'pointer',
          textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <RiLogoutBoxLine style={{ fontSize: '1rem' }} /> Sign out
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
        <React.Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div style={{ color: '#4F46E5' }}>Loading...</div>
          </div>
        }>
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

// Login page - clean split layout, no emojis
write('src/pages/Login.js', `
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validate';
import { RiGraduationCapLine, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiCheckLine } from 'react-icons/ri';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

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

  const features = [
    'Automated section assignment',
    'Section capacity control',
    'Real-time enrollment tracking',
    'Role-based access control',
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: '#4F46E5',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem', color: '#fff',
      }}>
        <div style={{ maxWidth: 380, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RiGraduationCapLine style={{ fontSize: '1.5rem', color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>EnrollHub</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Enrollment Management</div>
            </div>
          </div>

          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Manage enrollments with confidence
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            A complete system for student enrollment, section management, and academic administration.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 20, height: 20, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <RiCheckLine style={{ fontSize: '0.75rem', color: '#fff' }} />
                </div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>Welcome back</h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '2rem' }}>Sign in to your account to continue</p>

          {serverError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              {serverError}
            </div>
          )}

          <form onSubmit={submit} noValidate>
            <div style={{ marginBottom: '1.125rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <RiMailLine style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '1rem' }} />
                <input name="email" type="email" value={form.email} onChange={handle}
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.25rem', border: '1px solid ' + (errors.email ? '#DC2626' : '#E2E8F0'), borderRadius: 8, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', color: '#0F172A', background: '#fff' }}
                  onFocus={e => e.target.style.borderColor = errors.email ? '#DC2626' : '#4F46E5'}
                  onBlur={e => e.target.style.borderColor = errors.email ? '#DC2626' : '#E2E8F0'}
                />
              </div>
              {errors.email && <div style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.email}</div>}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.375rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <RiLockLine style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '1rem' }} />
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.55rem 2.5rem 0.55rem 2.25rem', border: '1px solid ' + (errors.password ? '#DC2626' : '#E2E8F0'), borderRadius: 8, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', color: '#0F172A', background: '#fff' }}
                  onFocus={e => e.target.style.borderColor = errors.password ? '#DC2626' : '#4F46E5'}
                  onBlur={e => e.target.style.borderColor = errors.password ? '#DC2626' : '#E2E8F0'}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <RiEyeOffLine style={{ fontSize: '1rem' }} /> : <RiEyeLine style={{ fontSize: '1rem' }} />}
                </button>
              </div>
              {errors.password && <div style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.password}</div>}
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.7rem', background: loading ? '#818CF8' : '#4F46E5',
              color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600,
              fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748B' }}>
            Don't have an account?{' '}
            <a href="/register" style={{ color: '#4F46E5', fontWeight: 600 }}>Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
}
`);

// Dashboard with react-icons
write('src/pages/Dashboard.js', `
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  RiUserLine, RiFileListLine, RiCloseCircleLine, RiCheckboxCircleLine,
  RiAddLine, RiArrowRightLine, RiBuilding2Line, RiBookOpenLine,
} from 'react-icons/ri';

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
    { label: 'Total Students', value: stats.total_students, icon: RiUserLine, bg: '#EEF2FF', color: '#4F46E5' },
    { label: 'Active Enrollments', value: stats.total_enrollments, icon: RiFileListLine, bg: '#D1FAE5', color: '#059669' },
    { label: 'Dropped', value: stats.dropped, icon: RiCloseCircleLine, bg: '#FEE2E2', color: '#DC2626' },
    { label: 'Completed', value: stats.completed, icon: RiCheckboxCircleLine, bg: '#FEF3C7', color: '#D97706' },
  ] : [];

  const quickActions = [
    { label: 'Enroll Student', href: '/enrollments/new', icon: RiFileListLine, desc: 'Add new enrollment' },
    { label: 'Add Student', href: '/students/new', icon: RiAddLine, desc: 'Register new student' },
    { label: 'View Sections', href: '/sections', icon: RiBuilding2Line, desc: 'Manage sections' },
    { label: 'View Subjects', href: '/subjects', icon: RiBookOpenLine, desc: 'Manage subjects' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
          Good day, {user?.first_name}
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Here's an overview of your enrollment system.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {loading ? (
          [1,2,3,4].map(i => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.25rem', height: 96 }} />
          ))
        ) : cards.map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{card.label}</div>
              <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>{card.value}</div>
            </div>
            <div style={{ width: 44, height: 44, background: card.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <card.icon style={{ fontSize: '1.25rem', color: card.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {quickActions.map(action => (
            <a key={action.label} href={action.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8F9FC', textDecoration: 'none', transition: 'all 0.12s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8F9FC'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <action.icon style={{ fontSize: '1rem', color: '#4F46E5' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>{action.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{action.desc}</div>
                </div>
              </div>
              <RiArrowRightLine style={{ fontSize: '1rem', color: '#CBD5E1', flexShrink: 0 }} />
            </a>
          ))}
        </div>
      </div>

      {/* Account card */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#4F46E5', flexShrink: 0 }}>
          {user?.first_name?.[0]}{user?.last_name?.[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>{user?.full_name}</div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: 2 }}>{user?.email}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: '#EEF2FF', color: '#4338CA', textTransform: 'capitalize' }}>{user?.role}</span>
          {user?.is_verified && <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: '#D1FAE5', color: '#065F46' }}>Verified</span>}
        </div>
      </div>
    </div>
  );
}
`);

// Students page with icons
write('src/pages/Students.js', `
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { RiAddLine, RiSearchLine, RiEditLine, RiDeleteBinLine, RiUserLine } from 'react-icons/ri';

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
    if (!window.confirm('Delete ' + name + '? This cannot be undone.')) return;
    await api.delete('/students/' + id + '/');
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>Students</h1>
          <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: 2 }}>{students.length} registered students</p>
        </div>
        {isAdminOrStaff && (
          <a href="/students/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.55rem 1rem', background: '#4F46E5', color: '#fff', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#3730A3'}
            onMouseLeave={e => e.currentTarget.style.background = '#4F46E5'}>
            <RiAddLine style={{ fontSize: '1rem' }} /> Add Student
          </a>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {/* Search bar */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
            <RiSearchLine style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.95rem' }} />
            <input type="search" placeholder="Search name, ID, email..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.25rem', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: '0.875rem', outline: 'none', color: '#1E293B', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#4F46E5'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>Loading students...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F9FC' }}>
                {['Student', 'ID Number', 'Course', 'Year', 'Units', 'Status', ...(isAdminOrStaff ? ['Actions'] : [])].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={s.id} style={{ borderBottom: idx < students.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F9FC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#4F46E5', flexShrink: 0 }}>
                        {s.first_name?.[0]}{s.last_name?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.875rem' }}>{s.last_name}, {s.first_name}</div>
                        <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#F1F5F9', padding: '2px 8px', borderRadius: 4, color: '#475569' }}>{s.student_id}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>{s.course}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: '#F1F5F9', color: '#475569' }}>Year {s.year_level}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600, color: '#1E293B' }}>{s.total_enrolled_units}</span>
                    <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}> units</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: s.is_active ? '#D1FAE5' : '#F1F5F9', color: s.is_active ? '#065F46' : '#64748B' }}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {isAdminOrStaff && (
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={"/students/" + s.id + "/edit"} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.3rem 0.6rem', background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500, color: '#475569', textDecoration: 'none' }}>
                          <RiEditLine style={{ fontSize: '0.85rem' }} /> Edit
                        </a>
                        <button onClick={() => del(s.id, s.full_name)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.3rem 0.6rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500, color: '#DC2626', cursor: 'pointer' }}>
                          <RiDeleteBinLine style={{ fontSize: '0.85rem' }} /> Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={isAdminOrStaff ? 7 : 6} style={{ padding: '4rem', textAlign: 'center' }}>
                    <RiUserLine style={{ fontSize: '2rem', color: '#E2E8F0', display: 'block', margin: '0 auto 0.75rem' }} />
                    <div style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No students found</div>
                  </td>
                </tr>
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
import { RiCameraLine, RiUserLine, RiMailLine, RiShieldLine, RiCalendarLine } from 'react-icons/ri';

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
      setSuccess('Profile photo updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch { setSuccess('Upload failed. Please try again.'); }
    finally { setUploading(false); }
  };

  const details = [
    { label: 'Full name', value: user?.full_name, icon: RiUserLine },
    { label: 'Email address', value: user?.email, icon: RiMailLine },
    { label: 'Role', value: user?.role, icon: RiShieldLine },
    { label: 'Member since', value: user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—', icon: RiCalendarLine },
  ];

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>Profile</h1>
        <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: 2 }}>Manage your account information</p>
      </div>

      {success && (
        <div style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', color: '#065F46', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {success}
        </div>
      )}

      {/* Profile card */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#4F46E5', overflow: 'hidden' }}>
              {user?.profile_picture
                ? <img src={user.profile_picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <>{user?.first_name?.[0]}{user?.last_name?.[0]}</>
              }
            </div>
            <label style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, background: '#4F46E5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff' }}>
              <RiCameraLine style={{ fontSize: '0.7rem', color: '#fff' }} />
              <input type="file" accept="image/*" onChange={uploadPhoto} style={{ display: 'none' }} />
            </label>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>{user?.full_name}</h2>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 2 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: '#EEF2FF', color: '#4338CA', textTransform: 'capitalize' }}>{user?.role}</span>
              {user?.is_verified && <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: '#D1FAE5', color: '#065F46' }}>Verified</span>}
            </div>
          </div>
          {uploading && <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Uploading...</div>}
        </div>
      </div>

      {/* Details card */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>Account Details</h3>
        </div>
        {details.map(({ label, value, icon: Icon }, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1.25rem', borderBottom: i < details.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
            <div style={{ width: 32, height: 32, background: '#F8F9FC', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.875rem', flexShrink: 0 }}>
              <Icon style={{ fontSize: '0.95rem', color: '#64748B' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500, marginBottom: 1 }}>{label}</div>
              <div style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: 500, textTransform: label === 'Role' ? 'capitalize' : 'none' }}>{value}</div>
            </div>
          </div>
        ))}
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
import { RiGraduationCapLine, RiArrowLeftLine, RiCheckLine } from 'react-icons/ri';

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
      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
        setErrors(mapped);
      } else { setServerError('Registration failed. Please try again.'); }
    } finally { setLoading(false); }
  };

  const inp = (name) => ({
    width: '100%', padding: '0.55rem 0.75rem',
    border: '1px solid ' + (errors[name] ? '#DC2626' : '#E2E8F0'),
    borderRadius: 8, fontSize: '0.875rem', outline: 'none',
    boxSizing: 'border-box', color: '#0F172A', background: '#fff',
    fontFamily: 'inherit',
  });

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FC' }}>
      <div style={{ textAlign: 'center', maxWidth: 400, padding: '2rem' }}>
        <div style={{ width: 64, height: 64, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <RiCheckLine style={{ fontSize: '1.75rem', color: '#059669' }} />
        </div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>Check your email</h2>
        <p style={{ color: '#64748B', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.875rem' }}>We sent a verification link to your email address. Click it to activate your account.</p>
        <a href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.7rem 1.5rem', background: '#4F46E5', color: '#fff', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
          Go to Login
        </a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FC', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '2.25rem', width: '100%', maxWidth: 460 }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <a href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#64748B', textDecoration: 'none', marginBottom: '1.25rem' }}>
            <RiArrowLeftLine style={{ fontSize: '0.9rem' }} /> Back to login
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <div style={{ width: 32, height: 32, background: '#4F46E5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RiGraduationCapLine style={{ color: '#fff', fontSize: '1rem' }} />
            </div>
            <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>EnrollHub</span>
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A' }}>Create your account</h2>
          <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.25rem' }}>Fill in your details to get started</p>
        </div>

        {serverError && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.875rem' }}>{serverError}</div>}

        <form onSubmit={submit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.875rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem' }}>First name <span style={{ color: '#DC2626' }}>*</span></label>
              <input name="first_name" value={form.first_name} onChange={handle} placeholder="Juan" style={inp('first_name')} />
              {errors.first_name && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.first_name}</div>}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem' }}>Last name <span style={{ color: '#DC2626' }}>*</span></label>
              <input name="last_name" value={form.last_name} onChange={handle} placeholder="Dela Cruz" style={inp('last_name')} />
              {errors.last_name && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.last_name}</div>}
            </div>
          </div>

          {[['email','Email address','you@example.com','email'],['password','Password','Min. 8 chars, 1 uppercase, 1 number','password'],['password2','Confirm password','Repeat password','password']].map(([name, label, placeholder, type]) => (
            <div key={name} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem' }}>{label} <span style={{ color: '#DC2626' }}>*</span></label>
              <input name={name} type={type} value={form[name]} onChange={handle} placeholder={placeholder} style={inp(name)} />
              {errors[name] && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors[name]}</div>}
            </div>
          ))}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.7rem', background: loading ? '#818CF8' : '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem', fontFamily: 'inherit' }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: '#64748B' }}>
          Already have an account? <a href="/login" style={{ color: '#4F46E5', fontWeight: 600 }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
`);

console.log('\nAll files created with professional icons!');
console.log('Run: npm start');
