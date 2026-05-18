
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
