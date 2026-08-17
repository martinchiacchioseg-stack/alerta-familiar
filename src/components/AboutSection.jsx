import React from 'react';
import { Shield, Lock, Eye, Award } from 'lucide-react';

export default function AboutSection({ settings }) {
  const logoPath = settings.logoUrl || '/logo.jpg';

  return (
    <section id="nosotros" style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3.5rem', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(220, 20, 60, 0.15)', border: '1px solid rgba(220, 20, 60, 0.35)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', color: '#fca5a5', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            <Award size={14} color="#ef4444" />
            <span>Trayectoria & Confianza</span>
          </div>

          <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ffffff', marginBottom: '1.25rem', lineHeight: '1.15' }}>
            Líderes en Seguridad Electrónica en Chascomús y la Región
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            En <strong>Alarmas Chascomús</strong> nos dedicamos a proteger lo que más te importa mediante soluciones de seguridad electrónica de última generación. Proveemos equipamiento de primeras marcas internacionales homologadas con instalación técnica profesional y asesoramiento personalizado.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '2rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <Shield size={22} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.35rem' }}>Equipamiento Homologado</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Trabajamos con fábricas líderes: Garnet Technology, Hikvision, Dahua y Paradox.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <Eye size={22} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.35rem' }}>Asesoramiento en Sitio</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Evaluamos cada inmueble en Chascomús para diseñar una solución a la medida exacta.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(220, 20, 60, 0.25) 0%, rgba(0, 0, 0, 0.9) 70%)', border: '3px solid #dc143c', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 50px rgba(220, 20, 60, 0.45)' }}>
            <div style={{ width: '270px', height: '270px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255, 255, 255, 0.2)' }}>
              <img src={logoPath} alt="Alarmas Chascomús" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
