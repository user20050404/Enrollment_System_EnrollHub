
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
          <center><h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>ENROLLHUB</h2></center>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '2rem' }}></p>

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
                  placeholder="Email"
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
                  placeholder="Password"
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
