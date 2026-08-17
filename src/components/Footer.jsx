import React from 'react';
import { Lock, Shield } from 'lucide-react';

export default function Footer({ onOpenAdminAuth, settings, viewMode, setViewMode }) {
  return (
    <footer className="app-footer">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Shield size={18} color="var(--brand-crimson)" />
        <span style={{ fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
          {settings.businessName}
        </span>
        <span>© {new Date().getFullYear()} — Seguridad Electrónica & Monitoreo</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {viewMode === 'admin' ? (
          <button 
            className="hidden-admin-btn"
            onClick={() => setViewMode('client')}
            style={{ color: '#f87171' }}
          >
            <span>← Salir de Modo Administración</span>
          </button>
        ) : (
          <button 
            className="hidden-admin-btn"
            onClick={onOpenAdminAuth}
            title="Acceso restringido para el administrador del sitio"
          >
            <Lock size={12} />
            <span>Acceso Administración IA</span>
          </button>
        )}
      </div>
    </footer>
  );
}
