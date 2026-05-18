import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  enrolled: { bg: '#EEF2FF', color: '#4F46E5' },
  dropped: { bg: '#FEE2E2', color: '#DC2626' },
  completed: { bg: '#D1FAE5', color: '#065F46' },
  pending: { bg: '#FEF3C7', color: '#92400E' },
};

function EnrollmentList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  const canManage = user?.role === 'admin' || user?.role === 'staff';

  const load = () => {
    setLoading(true);
    const params = statusFilter ? `?status=${statusFilter}` : '';
    api.get(`/enrollments/${params}`)
      .then(({ data }) => setEnrollments(data.results ?? data))
      .catch(() => setError('Failed to load enrollments.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/enrollments/${id}/`, { status: newStatus });
      load();
    } catch { alert('Failed to update status.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enrollment?')) return;
    try { await api.delete(`/enrollments/${id}/`); load(); }
    catch { alert('Failed to delete enrollment.'); }
  };

  const filtered = enrollments.filter((e) => {
    const student = `${e.student_name ?? ''} ${e.student_id ?? ''}`.toLowerCase();
    const section = `${e.section_name ?? ''} ${e.subject_name ?? ''}`.toLowerCase();
    return `${student} ${section}`.includes(search.toLowerCase());
  });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Enrollments</h1>
          <p style={styles.subtitle}>{enrollments.length} total records</p>
        </div>
        <button onClick={() => navigate('/enrollments/new')} style={styles.btnPrimary}>+ Enroll Student</button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Search student or section…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...styles.search, marginBottom: 0 }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
          <option value="">All Statuses</option>
          <option value="enrolled">Enrolled</option>
          <option value="pending">Pending</option>
          <option value="dropped">Dropped</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? <p style={{ color: '#6B7280' }}>Loading…</p> : filtered.length === 0 ? (
        <div style={styles.empty}>No enrollments found.</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>{['Student', 'Section', 'Subject', 'Status', canManage ? 'Actions' : ''].filter(Boolean).map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const sc = STATUS_COLORS[e.status] ?? { bg: '#F3F4F6', color: '#374151' };
                return (
                  <tr key={e.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 500 }}>{e.student_name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{e.student_id}</div>
                    </td>
                    <td style={styles.td}>{e.section_name ?? e.section}</td>
                    <td style={styles.td}>{e.subject_name ?? '—'}</td>
                    <td style={styles.td}>
                      {canManage ? (
                        <select
                          value={e.status}
                          onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                          style={{ ...styles.statusSelect, background: sc.bg, color: sc.color }}
                        >
                          {Object.keys(STATUS_COLORS).map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      ) : (
                        <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                          {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                        </span>
                      )}
                    </td>
                    {canManage && (
                      <td style={styles.td}>
                        <button onClick={() => handleDelete(e.id)} style={{ ...styles.btnSm, ...styles.btnDanger }}>Remove</button>
                      </td>
                    )}
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

export default function Enrollments() {
  return (
    <Routes>
      <Route index element={<EnrollmentList />} />
    </Routes>
  );
}

const styles = {
  page: { padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title: { fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 },
  subtitle: { color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' },
  btnPrimary: { padding: '0.6rem 1.2rem', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnSm: { padding: '0.3rem 0.6rem', background: '#F5F3FF', color: '#7C3AED', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.4rem', fontWeight: 500 },
  btnDanger: { background: '#FEF2F2', color: '#DC2626' },
  search: { flex: 1, minWidth: '220px', padding: '0.6rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.9rem', background: '#F9FAFB', boxSizing: 'border-box' },
  select: { padding: '0.6rem 0.875rem', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.9rem', background: '#F9FAFB', color: '#374151' },
  statusSelect: { padding: '0.25rem 0.5rem', borderRadius: '6px', border: 'none', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' },
  statusBadge: { padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 500 },
  error: { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' },
  empty: { color: '#9CA3AF', padding: '2rem', textAlign: 'center' },
  tableWrap: { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', textTransform: 'uppercase', letterSpacing: '0.04em' },
  tr: { borderBottom: '1px solid #F3F4F6' },
  td: { padding: '0.85rem 1rem', fontSize: '0.9rem', color: '#374151' },
};
