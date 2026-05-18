import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/auth/verify/${token}/`)
      .then(({ data }) => {
        setStatus('success');
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Invalid or expired verification link.');
      });
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: 400 }}>
        {status === 'verifying' && (
          <>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <h2 style={{ fontWeight: 700 }}>Verifying your email...</h2>
            <p style={{ color: '#6B7280' }}>Please wait a moment.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Email Verified!</h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>{message}</p>
            <a href="/login" style={{ padding: '0.75rem 2rem', background: '#4F46E5', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              Go to Login
            </a>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Verification Failed</h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>{message}</p>
            <a href="/register" style={{ padding: '0.75rem 2rem', background: '#4F46E5', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              Back to Register
            </a>
          </>
        )}
      </div>
    </div>
  );
}