
import React from 'react';

export default function FormField({ label, error, required, children }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.4rem', color: '#374151' }}>
        {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
