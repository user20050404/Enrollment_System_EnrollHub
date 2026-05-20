import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { RiArrowLeftLine } from 'react-icons/ri';

export default function SubjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [form, setForm] = useState({ code: '', name: '', description: '', units: '', year_level: '1', semester: '1', is_active: true });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      api.get('/subjects/' + id + '/').then(({ data }) => {
        setForm({ code: data.code || '', name: data.name || '', description: data.description || '', units: String(data.units) || '', year_level: String(data.year_level) || '1', semester: String(data.semester) || '1', is_active: data.is_active });
      }).finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrors(er => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Subject code is required.';
    if (!form.name.trim()) e.name = 'Subject name is required.';
    if (!form.units) e.units = 'Units is required.';
    else if (isNaN(form.units) || Number(form.units) < 1) e.units = 'Units must be a positive number.';
    return e;
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true); setServerError('');
    try {
      const payload = { ...form, units: Number(form.units), year_level: Number(form.year_level), semester: Number(form.semester) };
      if (isEdit) await api.patch('/subjects/' + id + '/', payload);
      else await api.post('/subjects/', payload);
      navigate('/subjects');
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
        <button onClick={() => navigate('/subjects')} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.4rem 0.75rem', background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#64748B', fontFamily: 'inherit' }}>
          <RiArrowLeftLine /> Back
        </button>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A' }}>{isEdit ? 'Edit Subject' : 'Add New Subject'}</h1>
      </div>
      {serverError && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.875rem' }}>{serverError}</div>}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.5rem' }}>
        <form onSubmit={submit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Subject Code <span style={{ color: '#DC2626' }}>*</span></label>
              <input name="code" value={form.code} onChange={handle} placeholder="e.g. CS101" style={inp('code')} />
              {errors.code && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.code}</div>}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Units <span style={{ color: '#DC2626' }}>*</span></label>
              <input name="units" type="number" value={form.units} onChange={handle} placeholder="e.g. 3" min="1" max="10" style={inp('units')} />
              {errors.units && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.units}</div>}
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Subject Name <span style={{ color: '#DC2626' }}>*</span></label>
            <input name="name" value={form.name} onChange={handle} placeholder="e.g. Introduction to Computing" style={inp('name')} />
            {errors.name && <div style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Description</label>
            <textarea name="description" value={form.description} onChange={handle} placeholder="Optional description" rows={3} style={{ ...inp('description'), resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Year Level <span style={{ color: '#DC2626' }}>*</span></label>
              <select name="year_level" value={form.year_level} onChange={handle} style={inp('year_level')}>
                {[1,2,3,4,5].map(y => <option key={y} value={String(y)}>Year {y}</option>)}
              </select>
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
            <label htmlFor="is_active" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>Active subject</label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={() => navigate('/subjects')} style={{ flex: 1, padding: '0.7rem', background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', color: '#475569', fontFamily: 'inherit' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '0.7rem', background: loading ? '#818CF8' : '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}