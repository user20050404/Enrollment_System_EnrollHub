
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
          <center><h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A' }}>Create your account</h2>
          <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.25rem' }}>Fill in your details to get started</p></center>
        </div>

        {serverError && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.875rem' }}>{serverError}</div>}

        <form onSubmit={submit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.875rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem' }}>First name <span style={{ color: '#DC2626' }}>*</span></label>
              <input name="first_name" value={form.first_name} onChange={handle} placeholder="" style={inp('first_name')} />
              {errors.first_name && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.first_name}</div>}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#374151', marginBottom: '0.3rem' }}>Last name <span style={{ color: '#DC2626' }}>*</span></label>
              <input name="last_name" value={form.last_name} onChange={handle} placeholder="" style={inp('last_name')} />
              {errors.last_name && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.last_name}</div>}
            </div>
          </div>

          {[['email','Email address','','email'],['password','Password','Min. 8 chars, 1 uppercase, 1 number','password'],['password2','Confirm password','Repeat password','password']].map(([name, label, placeholder, type]) => (
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
