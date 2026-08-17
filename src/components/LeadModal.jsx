import React, { useState } from 'react';
import { X, Send, PhoneCall, CheckCircle, Shield } from 'lucide-react';

export default function LeadModal({ isOpen, onClose, settings }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappCleaned = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappCleaned}?text=${encodeURIComponent(
    `Hola ${settings.businessName}, estuve consultando en su web con el Asistente IA. Mi nombre es ${name || 'un cliente'} y me gustaría solicitar presupuesto / asesoramiento sobre: ${details || 'instalación de seguridad electrónica'}.`
  )}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 2000,
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
        maxWidth: '480px',
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

        {!submitted ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                <Shield size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Solicitar Presupuesto o Asesoramiento</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Atención directa por un especialista de {settings.businessName}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tu nombre..."
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Teléfono / WhatsApp o Email</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="+54 9 2241 ... o correo@ejemplo.com"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>¿Qué proyecto o instalación necesitas?</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder="Ej: Necesito instalar alarmas o cámaras en una propiedad en Chascomús..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                  <Send size={16} />
                  <span>Enviar datos para ser contactado</span>
                </button>

                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-secondary"
                  style={{ textDecoration: 'none', justifyContent: 'center', background: '#16a34a', color: 'white', borderColor: '#16a34a' }}
                >
                  <PhoneCall size={16} />
                  <span>Contactar directamente por WhatsApp</span>
                </a>
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle size={48} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem' }}>¡Solicitud Recibida!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Gracias <strong>{name}</strong>. Un especialista técnico de <strong>{settings.businessName}</strong> revisará tu requerimiento y te contactará a la brevedad.
            </p>
            <button className="btn-secondary" onClick={() => { setSubmitted(false); onClose(); }} style={{ margin: '0 auto' }}>
              Volver a la Web
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
