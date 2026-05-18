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

  const filtered = sections.filter((s) =>
    `${s.name} ${s.subject_name ?? ''} ${s.schedule ?? ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Sections</h1>
          <p style={styles.subtitle}>{sections.length} total sections</p>
        </div>
        <button onClick={() => navigate('/sections/new')} style={styles.btnPrimary}>+ Create Section</button>
      </div>

      <input placeholder="Search sections…" value={search} onChange={(e) => setSearch(e.target.value)} style={styles.search} />
      {error && <div style={styles.error}>{error}</div>}

      {loading ? <p style={{ color: '#6B7280' }}>Loading…</p> : filtered.length === 0 ? (
        <div style={styles.empty}>No sections found.</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>{['Section', 'Subject', 'Schedule', 'Room', 'Capacity', 'Enrolled', 'Actions'].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const pct = s.max_students > 0 ? Math.round((s.enrolled_count / s.max_students) * 100) : 0;
                const full = s.enrolled_count >= s.max_students;
                return (
                  <tr key={s.id} style={styles.tr}>
                    <td style={styles.td}><span style={styles.badge}>{s.name}</span></td>
                    <td style={styles.td}>{s.subject_name ?? s.subject}</td>
                    <td style={styles.td}>{s.schedule ?? '—'}</td>
                    <td style={styles.td}>{s.room ?? '—'}</td>
                    <td style={styles.td}>{s.max_students}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.capacityBadge, background: full ? '#FEE2E2' : '#EEF2FF', color: full ? '#DC2626' : '#4F46E5' }}>
                        {s.enrolled_count ?? 0}/{s.max_students} ({pct}%)
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => navigate(`/sections/${s.id}/edit`)} style={styles.btnSm}>Edit</button>
                      <button onClick={() => handleDelete(s.id)} style={{ ...styles.btnSm, ...styles.btnDanger }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', subject: '', schedule: '', room: '', max_students: '' });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/subjects/').then(({ data }) => setSubjects(data.results ?? data)).catch(() => {});
    if (id) api.get(`/sections/${id}/`).then(({ data }) => setForm(data)).catch(() => setError('Failed to load section.'));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (id) await api.put(`/sections/${id}/`, form);
      else await api.post('/sections/', form);
      navigate('/sections');
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Failed to save.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <button onClick={() => navigate('/sections')} style={styles.back}>← Back to Sections</button>
      <div style={styles.formCard}>
        <h2 style={styles.title}>{id ? 'Edit Section' : 'Create Section'}</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Section Name</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="CS101-A" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Max Students</label>
              <input name="max_students" type="number" min="1" value={form.max_students} onChange={handleChange} required style={styles.input} />
            </div>
          </div>
          <label style={styles.label}>Subject</label>
          <select name="subject" value={form.subject} onChange={handleChange} required style={styles.input}>
            <option value="">Select subject…</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
          </select>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Schedule</label>
              <input name="schedule" value={form.schedule} onChange={handleChange} placeholder="MWF 8:00-9:00 AM" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Room</label>
              <input name="room" value={form.room} onChange={handleChange} placeholder="Room 201" style={styles.input} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="submit" disabled={loading} style={styles.btnPrimary}>{loading ? 'Saving…' : 'Save Section'}</button>
            <button type="button" onClick={() => navigate('/sections')} style={styles.btnSecondary}>Cancel</button>
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

const styles = {
  page: { padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title: { fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 },
  subtitle: { color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' },
  btnPrimary: { padding: '0.6rem 1.2rem', background: '#D97706', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnSecondary: { padding: '0.6rem 1.2rem', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem' },
  btnSm: { padding: '0.3rem 0.6rem', background: '#FFFBEB', color: '#D97706', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.4rem', fontWeight: 500 },
  btnDanger: { background: '#FEF2F2', color: '#DC2626' },
  search: { width: '100%', maxWidth: '360px', padding: '0.6rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1.25rem', background: '#F9FAFB', boxSizing: 'border-box' },
  error: { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' },
  empty: { color: '#9CA3AF', padding: '2rem', textAlign: 'center' },
  tableWrap: { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', textTransform: 'uppercase', letterSpacing: '0.04em' },
  tr: { borderBottom: '1px solid #F3F4F6' },
  td: { padding: '0.85rem 1rem', fontSize: '0.9rem', color: '#374151' },
  badge: { background: '#FFFBEB', color: '#D97706', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 },
  capacityBadge: { padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 500 },
  formCard: { background: '#fff', borderRadius: '12px', padding: '2rem', maxWidth: '600px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  row: { display: 'flex', gap: '0.75rem' },
  field: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  label: { fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginTop: '0.5rem' },
  input: { padding: '0.65rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.95rem', color: '#111827', background: '#F9FAFB' },
  back: { background: 'none', border: 'none', color: '#D97706', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', marginBottom: '1.25rem', padding: 0 },
};
