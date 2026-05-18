
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
