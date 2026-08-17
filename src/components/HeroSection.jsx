import React from 'react';
import { MessageSquare, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';

export default function HeroSection({ onOpenChat, settings }) {
  const bgImage = '/hero-residential.jpg';

  return (
    <section className="hero-epic-section">
      {/* Capa de fondo animada */}
      <div 
        className="hero-bg-layer" 
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Degradado oscuro para legibilidad */}
      <div className="hero-overlay-dark" />

      {/* Pulso de radar de seguridad en segundo plano */}
      <div className="hero-radar-pulse" />

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge-tag">
            <ShieldCheck size={14} color="#ef4444" />
            <span>Alarmas Chascomús · Seguridad</span>
          </div>

          <h2 className="hero-main-title">
            Líderes en <span>Seguridad Electrónica</span>
          </h2>
          
          <p className="hero-lead-text">
            Protegemos lo que más querés. Sistemas de seguridad a medida: alarmas inteligentes, videovigilancia IP 4K de alta definición, control de accesos y protección perimetral integral para hogares, comercios y campos en Chascomús y la región.
          </p>

          <div className="hero-actions-wrap">
            <a 
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <PhoneCall size={16} />
              <span>Solicitar Asesoramiento</span>
            </a>

            <button className="btn-secondary" onClick={onOpenChat}>
              <MessageSquare size={16} color="#ef4444" />
              <span>Consultar al Asistente Virtual</span>
            </button>
          </div>

          {/* Sellos de Confianza Institucionales */}
          <div className="hero-stats-row">
            <div className="hero-stat-card">
              <h4>Chascomús</h4>
              <p>Atención Local</p>
            </div>
            <div className="hero-stat-card">
              <h4>Homologados</h4>
              <p>Equipos Oficiales</p>
            </div>
            <div className="hero-stat-card">
              <h4>A Medida</h4>
              <p>Instalación</p>
            </div>
          </div>
        </div>

        {/* Tarjeta Glassmorphic: Asistente Virtual Integrado */}
        <div>
          <div className="hero-glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #dc143c', background: '#000', flexShrink: 0, boxShadow: '0 0 15px rgba(220, 20, 60, 0.45)' }}>
                <img src={settings.logoUrl || '/logo.jpg'} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#ffffff' }}>{settings.businessName}</h4>
                <p style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '800', letterSpacing: '0.04em' }}>LÍDERES EN SEGURIDAD ELECTRÓNICA</p>
              </div>
            </div>

            <div style={{ background: 'rgba(5, 7, 10, 0.8)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.84rem', marginBottom: '1rem', textAlign: 'left' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.3rem', fontWeight: '600' }}>💡 Asesoramiento técnico en tiempo real:</p>
              <p style={{ fontStyle: 'italic', color: '#ffffff' }}>"¿Cuáles son las características de la sirena Garnet MP-1000?"</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.82rem', textAlign: 'left' }}>
              <p style={{ color: '#ef4444', fontWeight: '800', fontSize: '0.72rem', marginBottom: '0.25rem' }}>🤖 Respuesta de Ficha Técnica:</p>
              <p style={{ color: 'var(--text-main)', lineHeight: '1.45' }}>
                Potencia de <strong>120dB</strong>, baliza estroboscópica LED, doble tamper y gabinete con filtro UV e intemperie IP65.
              </p>
            </div>

            <button 
              onClick={onOpenChat}
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.7rem' }}
            >
              <MessageSquare size={15} />
              <span>Consultar al Asistente</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
