import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

function SubjectList() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/subjects/')
      .then(({ data }) => setSubjects(data.results ?? data))
      .catch(() => setError('Failed to load subjects.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try { await api.delete(`/subjects/${id}/`); load(); }
    catch { alert('Failed to delete subject.'); }
  };

  const filtered = subjects.filter(s =>
    `${s.code} ${s.name} ${s.description ?? ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Subjects</h1>
          <p style={s.subtitle}>{subjects.length} total subjects</p>
        </div>
        <button onClick={() => navigate('/subjects/new')} style={s.btnPrimary}>+ Add Subject</button>
      </div>

      <input placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} style={s.search} />
      {error && <div style={s.error}>{error}</div>}

      <div style={s.tableWrap}>
        {loading ? <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Loading subjects...</div> : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>No subjects found.</div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr style={{ background: '#F8F9FC' }}>
                {['Code', 'Name', 'Units', 'Year', 'Semester', 'Status', 'Actions'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, idx) => (
                <tr key={sub.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F9FC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={s.td}><span style={s.codeBadge}>{sub.code}</span></td>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.875rem' }}>{sub.name}</div>
                    {sub.description && <div style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: 2 }}>{sub.description.substring(0, 50)}{sub.description.length > 50 ? '...' : ''}</div>}
                  </td>
                  <td style={s.td}><span style={{ fontWeight: 700 }}>{sub.units}</span> <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>units</span></td>
                  <td style={s.td}><span style={s.grayBadge}>Year {sub.year_level}</span></td>
                  <td style={s.td}>{sub.semester === 1 ? '1st Sem' : sub.semester === 2 ? '2nd Sem' : 'Summer'}</td>
                  <td style={s.td}><span style={{ ...s.statusBadge, background: sub.is_active ? '#D1FAE5' : '#F1F5F9', color: sub.is_active ? '#065F46' : '#64748B' }}>{sub.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td style={s.td}>
                    <button onClick={() => navigate(`/subjects/${sub.id}/edit`)} style={s.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(sub.id)} style={s.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SubjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ code: '', name: '', units: '', description: '', year_level: '1', semester: '1', is_active: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) api.get(`/subjects/${id}/`).then(({ data }) => setForm({ ...data, year_level: String(data.year_level), semester: String(data.semester) })).catch(() => setError('Failed to load.'));
  }, [id]);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = { ...form, units: Number(form.units), year_level: Number(form.year_level), semester: Number(form.semester) };
      if (id) await api.patch(`/subjects/${id}/`, payload);
      else await api.post('/subjects/', payload);
      navigate('/subjects');
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Failed to save.');
    } finally { setLoading(false); }
  };

  const inp = { padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.875rem', color: '#0F172A', background: '#fff', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };
  const lbl = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };

  return (
    <div style={{ maxWidth: 600 }}>
      <button onClick={() => navigate('/subjects')} style={s.backBtn}>← Back</button>
      <h1 style={{ ...s.title, marginBottom: '1.5rem' }}>{id ? 'Edit Subject' : 'Add New Subject'}</h1>
      {error && <div style={s.error}>{error}</div>}
      <div style={s.formCard}>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Subject Code *</label>
              <input name="code" value={form.code} onChange={handle} required placeholder="e.g. CS101" style={inp} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Units *</label>
              <input name="units" type="number" min="1" max="10" value={form.units} onChange={handle} required style={inp} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Subject Name *</label>
            <input name="name" value={form.name} onChange={handle} required placeholder="e.g. Introduction to Computing" style={inp} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Description</label>
            <textarea name="description" value={form.description} onChange={handle} rows={3} placeholder="Optional description..." style={{ ...inp, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Year Level *</label>
              <select name="year_level" value={form.year_level} onChange={handle} style={inp}>
                {[1,2,3,4,5].map(y => <option key={y} value={String(y)}>Year {y}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Semester *</label>
              <select name="semester" value={form.semester} onChange={handle} style={inp}>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">Summer</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handle} style={{ width: 16, height: 16, accentColor: '#4F46E5' }} />
            <label htmlFor="is_active" style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}>Active subject</label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={() => navigate('/subjects')} style={s.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={s.submitBtn}>{loading ? 'Saving...' : id ? 'Save Changes' : 'Add Subject'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Subjects() {
  return (
    <Routes>
      <Route index element={<SubjectList />} />
      <Route path="new" element={<SubjectForm />} />
      <Route path=":id/edit" element={<SubjectForm />} />
    </Routes>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title: { fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 },
  subtitle: { color: '#64748B', fontSize: '0.8rem', marginTop: 2 },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.55rem 1rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' },
  search: { width: '100%', maxWidth: 360, padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.875rem', marginBottom: '1rem', boxSizing: 'border-box', outline: 'none' },
  error: { background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' },
  tableWrap: { background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #E2E8F0' },
  td: { padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' },
  codeBadge: { fontFamily: 'monospace', fontSize: '0.8rem', background: '#EEF2FF', padding: '2px 8px', borderRadius: 4, color: '#4F46E5', fontWeight: 600 },
  grayBadge: { padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: '#F1F5F9', color: '#475569' },
  statusBadge: { padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600 },
  editBtn: { padding: '0.3rem 0.6rem', background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500, color: '#475569', cursor: 'pointer', marginRight: 6 },
  deleteBtn: { padding: '0.3rem 0.6rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500, color: '#DC2626', cursor: 'pointer' },
  formCard: { background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.5rem' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.4rem 0.75rem', background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#64748B', fontFamily: 'inherit', marginBottom: '1rem' },
  cancelBtn: { flex: 1, padding: '0.7rem', background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', color: '#475569', fontFamily: 'inherit' },
  submitBtn: { flex: 2, padding: '0.7rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' },
};