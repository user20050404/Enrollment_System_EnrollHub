const fs = require('fs');
const path = require('path');

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created: ' + filePath);
}

// Reusable validation helper
write('src/utils/validate.js', `
export function validateLogin({ email, password }) {
  const errors = {};
  if (!email) errors.email = 'Email is required.';
  else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  return errors;
}

export function validateRegister(form) {
  const errors = {};
  if (!form.first_name.trim()) errors.first_name = 'First name is required.';
  if (!form.last_name.trim()) errors.last_name = 'Last name is required.';
  if (!form.email) errors.email = 'Email is required.';
  else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.password) errors.password = 'Password is required.';
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  else if (!/[A-Z]/.test(form.password)) errors.password = 'Password must contain at least one uppercase letter.';
  else if (!/[0-9]/.test(form.password)) errors.password = 'Password must contain at least one number.';
  if (!form.password2) errors.password2 = 'Please confirm your password.';
  else if (form.password !== form.password2) errors.password2 = 'Passwords do not match.';
  return errors;
}

export function validateStudent(form) {
  const errors = {};
  if (!form.student_id.trim()) errors.student_id = 'Student ID is required.';
  else if (!/^[A-Za-z0-9-]+$/.test(form.student_id)) errors.student_id = 'Student ID can only contain letters, numbers, and dashes.';
  if (!form.first_name.trim()) errors.first_name = 'First name is required.';
  if (!form.last_name.trim()) errors.last_name = 'Last name is required.';
  if (!form.email) errors.email = 'Email is required.';
  else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.course.trim()) errors.course = 'Course is required.';
  if (!form.year_level) errors.year_level = 'Year level is required.';
  if (form.contact_number && !/^[0-9+\\-\\s]{7,15}$/.test(form.contact_number)) errors.contact_number = 'Enter a valid contact number.';
  return errors;
}

export function validateEnrollment({ student, section }) {
  const errors = {};
  if (!student) errors.student = 'Please select a student.';
  if (!section) errors.section = 'Please select a section.';
  return errors;
}
`);

// Field component
write('src/components/FormField.js', `
import React from 'react';

export default function FormField({ label, error, required, children }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.4rem', color: '#374151' }}>
        {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
`);

// Input style helper
const inputStyle = `
const inp = (hasError) => ({
  width: '100%',
  padding: '0.6rem 0.75rem',
  border: '1px solid ' + (hasError ? '#DC2626' : '#D1D5DB'),
  borderRadius: 8,
  fontSize: '0.95rem',
  background: '#fff',
  boxSizing: 'border-box',
  outline: 'none',
});
`;

// Login page with validation
write('src/pages/Login.js', `
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import { validateLogin } from '../utils/validate';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  ${inputStyle}

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: 380 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Sign In</h1>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Student Enrollment System</p>

        {serverError && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.9rem' }}>
            {serverError}
          </div>
        )}

        <form onSubmit={submit} noValidate>
          <FormField label="Email" error={errors.email} required>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="you@example.com" style={inp(!!errors.email)} />
          </FormField>

          <FormField label="Password" error={errors.password} required>
            <input name="password" type="password" value={form.password} onChange={handle}
              placeholder="••••••••" style={inp(!!errors.password)} />
          </FormField>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.75rem', background: loading ? '#818CF8' : '#4F46E5',
            color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>
          No account? <a href="/register" style={{ color: '#4F46E5', fontWeight: 500 }}>Register here</a>
        </p>
      </div>
    </div>
  );
}
`);

// Register page with validation
write('src/pages/Register.js', `
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import { validateRegister } from '../utils/validate';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', first_name: '', last_name: '', password: '', password2: '', role: 'student' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  ${inputStyle}

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
      setSuccess('Registration successful! Check your email to verify your account.');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
        setErrors(mapped);
      } else {
        setServerError('Registration failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: 400, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Check your email!</h2>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>{success}</p>
        <a href="/login" style={{ padding: '0.75rem 2rem', background: '#4F46E5', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Go to Login</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6', padding: '2rem' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: 420 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Create Account</h1>

        {serverError && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.9rem' }}>
            {serverError}
          </div>
        )}

        <form onSubmit={submit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <FormField label="First Name" error={errors.first_name} required>
              <input name="first_name" value={form.first_name} onChange={handle}
                placeholder="Juan" style={inp(!!errors.first_name)} />
            </FormField>
            <FormField label="Last Name" error={errors.last_name} required>
              <input name="last_name" value={form.last_name} onChange={handle}
                placeholder="Dela Cruz" style={inp(!!errors.last_name)} />
            </FormField>
          </div>

          <FormField label="Email" error={errors.email} required>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="you@example.com" style={inp(!!errors.email)} />
          </FormField>

          <FormField label="Password" error={errors.password} required>
            <input name="password" type="password" value={form.password} onChange={handle}
              placeholder="Min. 8 chars, 1 uppercase, 1 number" style={inp(!!errors.password)} />
          </FormField>

          <FormField label="Confirm Password" error={errors.password2} required>
            <input name="password2" type="password" value={form.password2} onChange={handle}
              placeholder="Repeat password" style={inp(!!errors.password2)} />
          </FormField>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.75rem', background: loading ? '#818CF8' : '#4F46E5',
            color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>
          Have an account? <a href="/login" style={{ color: '#4F46E5', fontWeight: 500 }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
`);

// Student Form page with validation
write('src/pages/StudentForm.js', `
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FormField from '../components/FormField';
import { validateStudent } from '../utils/validate';

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    student_id: '', first_name: '', last_name: '', email: '',
    contact_number: '', address: '', course: '', year_level: '', is_active: true
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  ${inputStyle}

  useEffect(() => {
    if (isEdit) {
      api.get('/students/' + id + '/').then(({ data }) => {
        setForm({
          student_id: data.student_id || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          contact_number: data.contact_number || '',
          address: data.address || '',
          course: data.course || '',
          year_level: data.year_level || '',
          is_active: data.is_active,
        });
        if (data.photo) setPhotoPreview(data.photo);
      }).finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrors(er => ({ ...er, [name]: '' }));
  };

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(er => ({ ...er, photo: 'Image must be under 5MB.' }));
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors(er => ({ ...er, photo: 'Only JPG, PNG, or WEBP images allowed.' }));
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setErrors(er => ({ ...er, photo: '' }));
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validateStudent(form);
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true); setServerError('');

    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));
      if (photo) fd.append('photo', photo);

      if (isEdit) {
        await api.patch('/students/' + id + '/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/students/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/students');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
        setErrors(mapped);
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally { setLoading(false); }
  };

  if (fetchLoading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/students')} style={{ background: 'none', border: '1px solid #D1D5DB', padding: '0.4rem 0.75rem', borderRadius: 8, cursor: 'pointer' }}>← Back</button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{isEdit ? 'Edit Student' : 'Add New Student'}</h1>
      </div>

      {serverError && (
        <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem' }}>{serverError}</div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <form onSubmit={submit} noValidate>

          {/* Photo upload */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EEF2FF', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {photoPreview
                ? <img src={photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '2rem' }}>👤</span>}
            </div>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Student Photo</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} />
              <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: 4 }}>JPG, PNG or WEBP — max 5MB</p>
              {errors.photo && <p style={{ color: '#DC2626', fontSize: '0.8rem' }}>⚠ {errors.photo}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <FormField label="Student ID" error={errors.student_id} required>
              <input name="student_id" value={form.student_id} onChange={handle}
                placeholder="e.g. 2024-0001" style={inp(!!errors.student_id)} />
            </FormField>
            <FormField label="Year Level" error={errors.year_level} required>
              <select name="year_level" value={form.year_level} onChange={handle} style={inp(!!errors.year_level)}>
                <option value="">— Select —</option>
                {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </FormField>
            <FormField label="First Name" error={errors.first_name} required>
              <input name="first_name" value={form.first_name} onChange={handle}
                placeholder="Juan" style={inp(!!errors.first_name)} />
            </FormField>
            <FormField label="Last Name" error={errors.last_name} required>
              <input name="last_name" value={form.last_name} onChange={handle}
                placeholder="Dela Cruz" style={inp(!!errors.last_name)} />
            </FormField>
          </div>

          <FormField label="Email Address" error={errors.email} required>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="student@email.com" style={inp(!!errors.email)} />
          </FormField>

          <FormField label="Course" error={errors.course} required>
            <input name="course" value={form.course} onChange={handle}
              placeholder="e.g. BS Computer Science" style={inp(!!errors.course)} />
          </FormField>

          <FormField label="Contact Number" error={errors.contact_number}>
            <input name="contact_number" value={form.contact_number} onChange={handle}
              placeholder="e.g. 09171234567" style={inp(!!errors.contact_number)} />
          </FormField>

          <FormField label="Address" error={errors.address}>
            <textarea name="address" value={form.address} onChange={handle}
              placeholder="Complete address" rows={2}
              style={{ ...inp(false), resize: 'vertical' }} />
          </FormField>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handle} />
            <label htmlFor="is_active" style={{ fontWeight: 500 }}>Active student</label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={() => navigate('/students')}
              style={{ flex: 1, padding: '0.75rem', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ flex: 2, padding: '0.75rem', background: loading ? '#818CF8' : '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
`);

// Enrollment form with validation
write('src/pages/EnrollmentForm.js', `
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FormField from '../components/FormField';
import { validateEnrollment } from '../utils/validate';

export default function EnrollmentForm() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({ student: '', section: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');

  const inp = (hasError) => ({
    width: '100%', padding: '0.6rem 0.75rem',
    border: '1px solid ' + (hasError ? '#DC2626' : '#D1D5DB'),
    borderRadius: 8, fontSize: '0.95rem', background: '#fff', boxSizing: 'border-box',
  });

  useEffect(() => {
    api.get('/students/?is_active=true').then(({ data }) => setStudents(data.results || data));
    api.get('/sections/?is_active=true').then(({ data }) => setSections(data.results || data));
  }, []);

  const handle = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: '' }));
    if (name === 'section') setSelectedSection(sections.find(s => s.id === value) || null);
  };

  const filteredStudents = students.filter(s =>
    s.student_id.toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.last_name + ' ' + s.first_name).toLowerCase().includes(studentSearch.toLowerCase())
  );

  const submit = async e => {
    e.preventDefault();
    const errs = validateEnrollment(form);
    if (selectedSection?.is_full) errs.section = 'This section is full. Please choose another.';
    if (Object.keys(errs).length) return setErrors(errs);
    setSubmitting(true); setServerError('');
    try {
      await api.post('/enrollments/', form);
      setSuccess('Student enrolled successfully!');
      setForm({ student: '', section: '' });
      setSelectedSection(null);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
        setErrors(mapped);
      } else {
        setServerError('Enrollment failed. Please try again.');
      }
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/enrollments')} style={{ background: 'none', border: '1px solid #D1D5DB', padding: '0.4rem 0.75rem', borderRadius: 8, cursor: 'pointer' }}>← Back</button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Enroll Student</h1>
      </div>

      {success && (
        <div style={{ background: '#D1FAE5', color: '#065F46', padding: '1rem', borderRadius: 8, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>✅ {success}</span>
          <button onClick={() => navigate('/enrollments')} style={{ background: '#059669', color: '#fff', border: 'none', padding: '0.4rem 0.75rem', borderRadius: 6, cursor: 'pointer' }}>View All</button>
        </div>
      )}

      {serverError && (
        <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem' }}>{serverError}</div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <form onSubmit={submit} noValidate>

          <FormField label="Search Student" error={errors.student} required>
            <input
              placeholder="Type name or student ID to filter..."
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
              style={inp(false)}
            />
            <select name="student" value={form.student} onChange={handle}
              style={{ ...inp(!!errors.student), marginTop: 6 }}>
              <option value="">— Select Student —</option>
              {filteredStudents.map(s => (
                <option key={s.id} value={s.id}>
                  {s.student_id} — {s.last_name}, {s.first_name} ({s.course})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Section" error={errors.section} required>
            <select name="section" value={form.section} onChange={handle} style={inp(!!errors.section)}>
              <option value="">— Select Section —</option>
              {sections.map(s => (
                <option key={s.id} value={s.id} disabled={s.is_full}>
                  {s.subject_code} - {s.subject_name} | Sec {s.name} | {s.enrolled_count}/{s.max_students} slots {s.is_full ? '(FULL)' : ''}
                </option>
              ))}
            </select>
          </FormField>

          {selectedSection && (
            <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '1rem', marginBottom: '1.25rem', borderLeft: '4px solid ' + (selectedSection.is_full ? '#DC2626' : '#059669') }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{selectedSection.subject_name} ({selectedSection.subject_code})</div>
              <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                {selectedSection.schedule && <span>🕐 {selectedSection.schedule} &nbsp;</span>}
                {selectedSection.room && <span>🏫 {selectedSection.room} &nbsp;</span>}
                {selectedSection.instructor && <span>👨‍🏫 {selectedSection.instructor}</span>}
              </div>
              <div style={{ marginTop: 8, fontSize: '0.9rem' }}>
                Available slots: <strong style={{ color: selectedSection.available_slots > 0 ? '#059669' : '#DC2626' }}>
                  {selectedSection.available_slots} / {selectedSection.max_students}
                </strong>
                {selectedSection.is_full && <span style={{ color: '#DC2626', marginLeft: 8 }}>⚠ Section is full!</span>}
              </div>
            </div>
          )}

          <button type="submit" disabled={submitting || selectedSection?.is_full} style={{
            width: '100%', padding: '0.75rem',
            background: (submitting || selectedSection?.is_full) ? '#9CA3AF' : '#4F46E5',
            color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem',
            cursor: (submitting || selectedSection?.is_full) ? 'not-allowed' : 'pointer'
          }}>
            {submitting ? 'Enrolling...' : 'Enroll Student'}
          </button>
        </form>
      </div>
    </div>
  );
}
`);

console.log('\nAll validated forms created successfully!');
