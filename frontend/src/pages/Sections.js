import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

function SectionList() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/sections/')
      .then(({ data }) => setSections(data.results ?? data))
      .catch(() => setError('Failed to load sections.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this section?')) return;
    try { await api.delete(`/sections/${id}/`); load(); }
    catch { alert('Failed to delete section.'); }
  };

  const filtered = sections.filter(sec =>
    `${sec.name} ${sec.subject_name ?? ''} ${sec.schedule ?? ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Sections</h1>
          <p style={s.subtitle}>{sections.length} total sections</p>
        </div>
        <button onClick={() => navigate('/sections/new')} style={s.btnPrimary}>+ Create Section</button>
      </div>

      <input placeholder="Search sections..." value={search} onChange={e => setSearch(e.target.value)} style={s.search} />
      {error && <div style={s.error}>{error}</div>}

      <div style={s.tableWrap}>
        {loading ? <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Loading sections...</div> : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>No sections found.</div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr style={{ background: '#F8F9FC' }}>
                {['Subject', 'Section', 'Schedule', 'Room', 'Instructor', 'Capacity', 'Status', 'Actions'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sec, idx) => (
                <tr key={sec.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F9FC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600, color: '#4F46E5', fontSize: '0.875rem' }}>{sec.subject_code}</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{sec.subject_name}</div>
                  </td>
                  <td style={s.td}><span style={{ fontWeight: 600, color: '#1E293B' }}>Section {sec.name}</span></td>
                  <td style={s.td}>{sec.schedule || '—'}</td>
                  <td style={s.td}>{sec.room || '—'}</td>
                  <td style={s.td}>{sec.instructor || '—'}</td>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.875rem' }}>{sec.enrolled_count}/{sec.max_students}</div>
                    <div style={{ marginTop: 4, height: 4, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden', width: 80 }}>
                      <div style={{ height: 4, borderRadius: 99, background: sec.is_full ? '#DC2626' : '#4F46E5', width: (sec.enrolled_count / sec.max_students * 100) + '%' }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: 2 }}>{sec.available_slots} slots left</div>
                  </td>
                  <td style={s.td}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: sec.is_full ? '#FEE2E2' : '#D1FAE5', color: sec.is_full ? '#991B1B' : '#065F46' }}>
                      {sec.is_full ? 'Full' : 'Open'}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button onClick={() => navigate(`/sections/${sec.id}/edit`)} style={s.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(sec.id)} style={s.deleteBtn}>Delete</button>
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

function SectionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: '', subject: '', max_students: '40', room: '', schedule: '', instructor: '', school_year: '2024-2025', semester: '1', is_active: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    api.get('/subjects/').then(({ data }) => setSubjects(data.results ?? data)).catch(() => {});
    if (id) {
      api.get(`/sections/${id}/`).then(({ data }) => setForm({ ...data, max_students: String(data.max_students), semester: String(data.semester) })).finally(() => setFetchLoading(false));
    } else { setFetchLoading(false); }
  }, [id]);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = { ...form, max_students: Number(form.max_students), semester: Number(form.semester) };
      if (id) await api.patch(`/sections/${id}/`, payload);
      else await api.post('/sections/', payload);
      navigate('/sections');
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Failed to save.');
    } finally { setLoading(false); }
  };

  const inp = { padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.875rem', color: '#0F172A', background: '#fff', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };
  const lbl = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' };

  if (fetchLoading) return <div style={{ padding: '2rem', color: '#64748B' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 600 }}>
      <button onClick={() => navigate('/sections')} style={s.backBtn}>← Back</button>
      <h1 style={{ ...s.title, marginBottom: '1.5rem' }}>{id ? 'Edit Section' : 'Create New Section'}</h1>
      {error && <div style={s.error}>{error}</div>}
      <div style={s.formCard}>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Subject *</label>
            <select name="subject" value={form.subject} onChange={handle} required style={inp}>
              <option value="">— Select Subject —</option>
              {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Section Name *</label>
              <input name="name" value={form.name} onChange={handle} required placeholder="e.g. A, B, Section 1" style={inp} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Max Students *</label>
              <input name="max_students" type="number" min="1" value={form.max_students} onChange={handle} required style={inp} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Room</label>
              <input name="room" value={form.room} onChange={handle} placeholder="e.g. Room 101" style={inp} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>Schedule</label>
              <input name="schedule" value={form.schedule} onChange={handle} placeholder="e.g. MWF 7:30-9:00 AM" style={inp} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Instructor</label>
            <input name="instructor" value={form.instructor} onChange={handle} placeholder="e.g. Prof. Santos" style={inp} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={lbl}>School Year *</label>
              <input name="school_year" value={form.school_year} onChange={handle} placeholder="e.g. 2024-2025" style={inp} />
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
            <label htmlFor="is_active" style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}>Active section</label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={() => navigate('/sections')} style={s.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={s.submitBtn}>{loading ? 'Saving...' : id ? 'Save Changes' : 'Create Section'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Sections() {
  return (
    <Routes>
      <Route index element={<SectionList />} />
      <Route path="new" element={<SectionForm />} />
      <Route path=":id/edit" element={<SectionForm />} />
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
  editBtn: { padding: '0.3rem 0.6rem', background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500, color: '#475569', cursor: 'pointer', marginRight: 6 },
  deleteBtn: { padding: '0.3rem 0.6rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500, color: '#DC2626', cursor: 'pointer' },
  formCard: { background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.5rem' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.4rem 0.75rem', background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#64748B', fontFamily: 'inherit', marginBottom: '1rem' },
  cancelBtn: { flex: 1, padding: '0.7rem', background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', color: '#475569', fontFamily: 'inherit' },
  submitBtn: { flex: 2, padding: '0.7rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' },
};