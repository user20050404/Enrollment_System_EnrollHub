import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Chatbot from './components/Chatbot';
import Dashboard from './pages/Dashboard';
import {
  RiDashboardLine, RiUserLine, RiBookOpenLine,
  RiBuilding2Line, RiFileListLine, RiLogoutBoxLine,
  RiGraduationCapLine,
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
        <div style={{ width: 36, height: 36, border: '3px solid #EEF2FF', borderTopColor: '#4F46E5', borderRadius: '50%', margin: '0 auto 1rem' }} />
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
          <div style={{ width: 34, height: 34, background: '#4F46E5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
          {/* Avatar — shows photo if available, initials if not */}
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#EEF2FF', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
            color: '#4F46E5', flexShrink: 0, overflow: 'hidden',
            border: '1.5px solid #E2E8F0',
          }}>
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span>{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
            )}
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
          transition: 'background 0.12s', fontFamily: 'inherit',
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
            {/* subjects/* allows nested routes inside Subjects.js */}
            <Route path="/subjects/*" element={<ProtectedRoute roles={['admin','staff']}><AppLayout><Subjects /></AppLayout></ProtectedRoute>} />

            {/* sections/* allows nested routes inside Sections.js */}
            <Route path="/sections/*" element={<ProtectedRoute roles={['admin','staff']}><AppLayout><Sections /></AppLayout></ProtectedRoute>} />

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