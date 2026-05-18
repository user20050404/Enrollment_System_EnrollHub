import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  RiUserLine, RiFileListLine, RiCloseCircleLine, RiCheckboxCircleLine,
  RiAddLine, RiArrowRightLine, RiBuilding2Line, RiBookOpenLine,
} from 'react-icons/ri';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/dashboard-stats/')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Students', value: stats.total_students, icon: RiUserLine, bg: '#EEF2FF', color: '#4F46E5' },
    { label: 'Active Enrollments', value: stats.total_enrollments, icon: RiFileListLine, bg: '#D1FAE5', color: '#059669' },
    { label: 'Dropped', value: stats.dropped, icon: RiCloseCircleLine, bg: '#FEE2E2', color: '#DC2626' },
    { label: 'Completed', value: stats.completed, icon: RiCheckboxCircleLine, bg: '#FEF3C7', color: '#D97706' },
  ] : [];

  const quickActions = [
    { label: 'Enroll Student', href: '/enrollments/new', icon: RiFileListLine, desc: 'Add new enrollment' },
    { label: 'Add Student', href: '/students/new', icon: RiAddLine, desc: 'Register new student' },
    { label: 'View Sections', href: '/sections', icon: RiBuilding2Line, desc: 'Manage sections' },
    { label: 'View Subjects', href: '/subjects', icon: RiBookOpenLine, desc: 'Manage subjects' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
          Good day, {user?.first_name}
        </h1>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {loading ? (
          [1,2,3,4].map(i => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.25rem', height: 96 }} />
          ))
        ) : cards.map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{card.label}</div>
              <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>{card.value}</div>
            </div>
            <div style={{ width: 44, height: 44, background: card.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <card.icon style={{ fontSize: '1.25rem', color: card.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {quickActions.map(action => (
            <a key={action.label} href={action.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8F9FC', textDecoration: 'none', transition: 'all 0.12s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8F9FC'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <action.icon style={{ fontSize: '1rem', color: '#4F46E5' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }}>{action.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{action.desc}</div>
                </div>
              </div>
              <RiArrowRightLine style={{ fontSize: '1rem', color: '#CBD5E1', flexShrink: 0 }} />
            </a>
          ))}
        </div>
      </div>

      {/* Account card */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Avatar — shows photo if available */}
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: '#EEF2FF', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700,
          color: '#4F46E5', flexShrink: 0, overflow: 'hidden',
          border: '2px solid #E2E8F0',
        }}>
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <span>{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>{user?.full_name}</div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: 2 }}>{user?.email}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: '#EEF2FF', color: '#4338CA', textTransform: 'capitalize' }}>
            {user?.role}
          </span>
          {user?.is_verified && (
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: '#D1FAE5', color: '#065F46' }}>
              Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
}