import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';

export default function Footer({ onOpenAdminAuth, settings, viewMode, setViewMode }) {
  return (
    <footer className="app-footer">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        <p style={{ fontWeight: '800', color: '#ffffff', letterSpacing: '0.02em', fontSize: '0.95rem' }}>
          ALARMAS CHASCOMÚS · LÍDERES EN SEGURIDAD ELECTRÓNICA
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          Chascomús y Zona de Influencia · Asesoramiento e Instalaciones a Medida
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {viewMode === 'admin' ? (
          <button 
            className="hidden-admin-btn"
            onClick={() => setViewMode('home')}
            style={{ color: '#ef4444' }}
          >
            <ArrowLeft size={13} />
            <span>Salir del Modo Administración</span>
          </button>
        ) : (
          <button 
            className="hidden-admin-btn"
            onClick={onOpenAdminAuth}
            title="Acceso exclusivo para el administrador"
          >
            <Lock size={12} />
            <span>Acceso Administración IA</span>
          </button>
        )}
      </div>
    </footer>
  );
}
