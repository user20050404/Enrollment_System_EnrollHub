import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { RiArrowLeftLine } from 'react-icons/ri';

export default function SectionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: '', subject: '', max_students: '40', room: '', schedule: '', instructor: '', school_year: '2024-2025', semester: '1', is_active: true });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    api.get('/subjects/').then(({ data }) => setSubjects(data.results || data));
    if (isEdit) {
      api.get('/sections/' + id + '/').then(({ data }) => {
        setForm({ name: data.name || '', subject: data.subject || '', max_students: String(data.max_students) || '40', room: data.room || '', schedule: data.schedule || '', instructor: data.instructor || '', school_year: data.school_year || '2024-2025', semester: String(data.semester) || '1', is_active: data.is_active });
      }).finally(() => setFetchLoading(false));
    } else { setFetchLoading(false); }
  }, [id, isEdit]);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrors(er => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Section name is required.';
    if (!form.subject) e.subject = 'Please select a subject.';
    if (!form.max_students || isNaN(form.max_students) || Number(form.max_students) < 1) e.max_students = 'Enter a valid capacity.';
    if (!form.school_year.trim()) e.school_year = 'School year is required.';
    return e;
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true); setServerError('');
    try {
      const payload = { ...form, max_students: Number(form.max_students), semester: Number(form.semester) };
      if (isEdit) await api.patch('/sections/' + id + '/', payload);
      else await api.post('/sections/', payload);
      navigate('/sections');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const mapped = {};
        Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
        setErrors(mapped);
      } else { setServerError('Something went wrong.'); }
    } finally { setLoading(false); }
  };

  const inp = (name) => ({ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid ' + (errors[name] ? '#DC2626' : '#E2E8F0'), borderRadius: 8, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', color: '#0F172A', background: '#fff', fontFamily: 'inherit' });
  const lbl = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };

  if (fetchLoading) return <div style={{ padding: '2rem', color: '#64748B' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/sections')} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.4rem 0.75rem', background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#64748B', fontFamily: 'inherit' }}>
          <RiArrowLeftLine /> Back
        </button>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A' }}>{isEdit ? 'Edit Section' : 'Create New Section'}</h1>
      </div>
      {serverError && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.875rem' }}>{serverError}</div>}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.5rem' }}>
        <form onSubmit={submit} noValidate>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Subject <span style={{ color: '#DC2626' }}>*</span></label>
            <select name="subject" value={form.subject} onChange={handle} style={inp('subject')}>
              <option value="">— Select Subject —</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
            </select>
            {errors.subject && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.subject}</div>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Section Name <span style={{ color: '#DC2626' }}>*</span></label>
              <input name="name" value={form.name} onChange={handle} placeholder="e.g. A, B, Section 1" style={inp('name')} />
              {errors.name && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Max Students <span style={{ color: '#DC2626' }}>*</span></label>
              <input name="max_students" type="number" value={form.max_students} onChange={handle} placeholder="e.g. 40" style={inp('max_students')} />
              {errors.max_students && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.max_students}</div>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Room</label>
              <input name="room" value={form.room} onChange={handle} placeholder="e.g. Room 101" style={inp('room')} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Schedule</label>
              <input name="schedule" value={form.schedule} onChange={handle} placeholder="e.g. MWF 7:30-9:00 AM" style={inp('schedule')} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Instructor</label>
            <input name="instructor" value={form.instructor} onChange={handle} placeholder="e.g. Prof. Santos" style={inp('instructor')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>School Year <span style={{ color: '#DC2626' }}>*</span></label>
              <input name="school_year" value={form.school_year} onChange={handle} placeholder="e.g. 2024-2025" style={inp('school_year')} />
              {errors.school_year && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.school_year}</div>}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Semester <span style={{ color: '#DC2626' }}>*</span></label>
              <select name="semester" value={form.semester} onChange={handle} style={inp('semester')}>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">Summer</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handle} style={{ width: 16, height: 16, accentColor: '#4F46E5' }} />
            <label htmlFor="is_active" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>Active section</label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={() => navigate('/sections')} style={{ flex: 1, padding: '0.7rem', background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', color: '#475569', fontFamily: 'inherit' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '0.7rem', background: loading ? '#818CF8' : '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}