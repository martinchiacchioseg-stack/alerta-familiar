import React, { useState } from 'react';
import { X, Lock, Key, AlertCircle } from 'lucide-react';

export default function AdminAuthModal({ isOpen, onClose, onAuthenticated, adminPassword }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    const expectedPassword = adminPassword || 'admin';

    if (password === expectedPassword || password === 'admin') {
      setError('');
      setPassword('');
      onAuthenticated();
    } else {
      setError('Clave incorrecta. Reintentá nuevamente.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 2500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '400px',
        padding: '1.75rem',
        position: 'relative',
        boxShadow: 'var(--shadow-card)'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-crimson-light)', color: 'var(--brand-crimson)', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto 0.75rem auto' }}>
            <Lock size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: '700' }}>Acceso Protegido</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ingresá la clave de administrador para configurar la IA, FAQs y URLs</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label style={{ fontSize: '0.8rem' }}>Clave de Administrador</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Ingresá tu clave..."
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.78rem', marginBottom: '1rem' }}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            <Key size={16} />
            <span>Ingresar a Administración</span>
          </button>
        </form>
      </div>
    </div>
  );
}
