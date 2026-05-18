
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { RiAddLine, RiSearchLine, RiEditLine, RiDeleteBinLine, RiUserLine } from 'react-icons/ri';

export default function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  const load = () => {
    setLoading(true);
    api.get('/students/?search=' + search)
      .then(({ data }) => setStudents(data.results || data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const del = async (id, name) => {
    if (!window.confirm('Delete ' + name + '? This cannot be undone.')) return;
    await api.delete('/students/' + id + '/');
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>Students</h1>
          <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: 2 }}>{students.length} registered students</p>
        </div>
        {isAdminOrStaff && (
          <a href="/students/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.55rem 1rem', background: '#4F46E5', color: '#fff', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#3730A3'}
            onMouseLeave={e => e.currentTarget.style.background = '#4F46E5'}>
            <RiAddLine style={{ fontSize: '1rem' }} /> Add Student
          </a>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {/* Search bar */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
            <RiSearchLine style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.95rem' }} />
            <input type="search" placeholder="Search name, ID, email..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.25rem', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: '0.875rem', outline: 'none', color: '#1E293B', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#4F46E5'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>Loading students...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F9FC' }}>
                {['Student', 'ID Number', 'Course', 'Year', 'Units', 'Status', ...(isAdminOrStaff ? ['Actions'] : [])].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={s.id} style={{ borderBottom: idx < students.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F9FC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#4F46E5', flexShrink: 0 }}>
                        {s.first_name?.[0]}{s.last_name?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.875rem' }}>{s.last_name}, {s.first_name}</div>
                        <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#F1F5F9', padding: '2px 8px', borderRadius: 4, color: '#475569' }}>{s.student_id}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>{s.course}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: '#F1F5F9', color: '#475569' }}>Year {s.year_level}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600, color: '#1E293B' }}>{s.total_enrolled_units}</span>
                    <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}> units</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: s.is_active ? '#D1FAE5' : '#F1F5F9', color: s.is_active ? '#065F46' : '#64748B' }}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {isAdminOrStaff && (
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={"/students/" + s.id + "/edit"} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.3rem 0.6rem', background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500, color: '#475569', textDecoration: 'none' }}>
                          <RiEditLine style={{ fontSize: '0.85rem' }} /> Edit
                        </a>
                        <button onClick={() => del(s.id, s.full_name)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.3rem 0.6rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500, color: '#DC2626', cursor: 'pointer' }}>
                          <RiDeleteBinLine style={{ fontSize: '0.85rem' }} /> Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={isAdminOrStaff ? 7 : 6} style={{ padding: '4rem', textAlign: 'center' }}>
                    <RiUserLine style={{ fontSize: '2rem', color: '#E2E8F0', display: 'block', margin: '0 auto 0.75rem' }} />
                    <div style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No students found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
