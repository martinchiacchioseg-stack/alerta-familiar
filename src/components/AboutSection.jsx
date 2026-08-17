import React from 'react';
import { Shield, Lock, Eye, Award } from 'lucide-react';

export default function AboutSection({ settings }) {
  return (
    <section id="nosotros" style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '4rem 1.25rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(220, 20, 60, 0.15)', border: '1px solid rgba(220, 20, 60, 0.35)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', color: '#fca5a5', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            <Award size={14} color="#ef4444" />
            <span>Trayectoria & Confianza</span>
          </div>

          <h3 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#ffffff', marginBottom: '1.25rem', lineHeight: '1.2' }}>
            Líderes en Seguridad Electrónica en Chascomús y la Región
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7' }}>
            En <strong>Alarmas Chascomús</strong> nos dedicamos a proteger lo que más te importa mediante soluciones de seguridad electrónica de última generación. Proveemos equipamiento de primeras marcas internacionales homologadas con instalación técnica profesional y asesoramiento personalizado.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Shield size={24} color="#ef4444" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>Equipamiento Homologado</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Trabajamos exclusivamente con fábricas líderes y verificadas: Garnet Technology, Hikvision, Dahua y Paradox.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Eye size={24} color="#ef4444" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>Asesoramiento en Sitio</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Evaluamos cada inmueble en Chascomús para diseñar una solución a la medida exacta de tus necesidades.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Lock size={24} color="#ef4444" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>Soporte & Garantía</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Instalaciones certificadas con respaldo técnico local permanente y atención directa por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
