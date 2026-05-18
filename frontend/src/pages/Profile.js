import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { RiCameraLine, RiUserLine, RiMailLine, RiShieldLine, RiCalendarLine } from 'react-icons/ri';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchProfile = () => {
    api.get('/auth/profile/').then(({ data }) => setProfile(data));
  };

  useEffect(() => { fetchProfile(); }, []);

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Only JPG, PNG, or WEBP allowed.'); return; }

    setUploading(true); setError(''); setSuccess('');
    const form = new FormData();
    form.append('profile_picture', file);
    try {
      const { data } = await api.patch('/auth/profile/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(data);
      await refreshUser(); // Updates sidebar + dashboard photo too
      setSuccess('Profile photo updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Upload failed. Please try again.'); }
    finally { setUploading(false); }
  };

  const displayUser = profile || user;

  const details = [
    { label: 'Full name', value: displayUser?.full_name, icon: RiUserLine },
    { label: 'Email address', value: displayUser?.email, icon: RiMailLine },
    { label: 'Role', value: displayUser?.role, icon: RiShieldLine },
    { label: 'Member since', value: displayUser?.date_joined
        ? new Date(displayUser.date_joined).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—', icon: RiCalendarLine },
  ];

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>Profile</h1>
        <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: 2 }}>Manage your account information</p>
      </div>

      {success && <div style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', color: '#065F46', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.875rem' }}>{success}</div>}
      {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.875rem' }}>{error}</div>}

      {/* Profile card */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Avatar with upload */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EEF2FF', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#4F46E5', border: '2px solid #E2E8F0' }}>
              {displayUser?.profile_picture ? (
                <img src={displayUser.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              ) : (
                <span>{displayUser?.first_name?.[0]}{displayUser?.last_name?.[0]}</span>
              )}
            </div>
            <label style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, background: '#4F46E5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff' }}
              title="Change profile photo"
              onMouseEnter={e => e.currentTarget.style.background = '#3730A3'}
              onMouseLeave={e => e.currentTarget.style.background = '#4F46E5'}>
              <RiCameraLine style={{ fontSize: '0.75rem', color: '#fff' }} />
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>{displayUser?.full_name}</h2>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 2 }}>{displayUser?.email}</p>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: '#EEF2FF', color: '#4338CA', textTransform: 'capitalize' }}>{displayUser?.role}</span>
              {displayUser?.is_verified && <span style={{ padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: '#D1FAE5', color: '#065F46' }}>Verified</span>}
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {uploading ? (
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Uploading...</div>
            ) : (
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.45rem 0.875rem', background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: '0.8rem', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>
                <RiCameraLine style={{ fontSize: '0.9rem' }} /> Change photo
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} style={{ display: 'none' }} />
              </label>
            )}
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: 4 }}>JPG, PNG or WEBP · Max 5MB</div>
          </div>
        </div>
      </div>

      {/* Details card */}
      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>Account Details</h3>
        </div>
        {details.map(({ label, value, icon: Icon }, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1.25rem', borderBottom: i < details.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
            <div style={{ width: 32, height: 32, background: '#F8F9FC', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.875rem', flexShrink: 0 }}>
              <Icon style={{ fontSize: '0.95rem', color: '#64748B' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500, marginBottom: 1 }}>{label}</div>
              <div style={{ fontSize: '0.875rem', color: '#1E293B', fontWeight: 500, textTransform: label === 'Role' ? 'capitalize' : 'none' }}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}