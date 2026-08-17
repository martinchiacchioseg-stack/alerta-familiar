import React from 'react';

export default function Header({ settings, catalogCount }) {
  const logoPath = settings.logoUrl || '/logo.jpg';

  return (
    <header className="app-header">
      <div className="brand-container">
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
        <a href="#servicios" className="nav-item">Servicios</a>
        <a href="#catalogo" className="nav-item">Equipamiento</a>
        <a href="#nosotros" className="nav-item">Quiénes Somos</a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a 
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ padding: '0.6rem 1.25rem', fontSize: '0.84rem' }}
        >
          <span>Contactar Asesor</span>
        </a>
      </div>
    </header>
  );
}
