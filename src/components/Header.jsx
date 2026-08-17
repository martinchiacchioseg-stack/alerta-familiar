import React from 'react';
import { Home, Shield, Grid, PhoneCall } from 'lucide-react';

export default function Header({ settings, viewMode, setViewMode }) {
  const logoPath = settings.logoUrl || '/logo.jpg';

  return (
    <header className="app-header">
      <div 
        className="brand-container" 
        style={{ cursor: 'pointer' }}
        onClick={() => setViewMode('home')}
      >
        <div className="brand-logo-wrap">
          <img 
            src={logoPath} 
            alt="Alarmas Chascomús Logotipo" 
            className="brand-logo-img"
          />
        </div>
        <div className="brand-info">
          <h1>ALARMAS CHASCOMÚS</h1>
          <p>Líderes en Seguridad Electrónica</p>
        </div>
      </div>

      <nav className="nav-links">
        <button 
          onClick={() => setViewMode('home')} 
          className={`nav-btn-link ${viewMode === 'home' ? 'active' : ''}`}
        >
          Inicio
        </button>

        <button 
          onClick={() => setViewMode('products')} 
          className={`nav-btn-link ${viewMode === 'products' ? 'active' : ''}`}
        >
          Equipamiento & Productos
        </button>

        <a href="#servicios" onClick={() => { setViewMode('home'); }} className="nav-item">
          Servicios
        </a>

        <a href="#nosotros" onClick={() => { setViewMode('home'); }} className="nav-item">
          Quiénes Somos
        </a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button 
          onClick={() => setViewMode('products')}
          className="btn-secondary"
          style={{ padding: '0.55rem 1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <Grid size={14} color="#ef4444" />
          <span>Ver Equipos</span>
        </button>

        <a 
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem' }}
        >
          <PhoneCall size={14} />
          <span>Contactar Asesor</span>
        </a>
      </div>
    </header>
  );
}
