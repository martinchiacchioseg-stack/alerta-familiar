import React from 'react';
import { Video, Bell, Key, Flame, Cpu, ShieldAlert } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      icon: <Video size={24} />,
      title: "Videovigilancia (CCTV / IP)",
      desc: "Sistemas de cámaras 4K, térmicas, domos PTZ y NVRs con inteligencia artificial para detección facial y lectura de patentes."
    },
    {
      icon: <Bell size={24} />,
      title: "Alarmas e Intrusión",
      desc: "Centrales híbridas e inalámbricas anti-sabotaje, barreras perimetrales fotoeléctricas y sensores anti-mascotas."
    },
    {
      icon: <Key size={24} />,
      title: "Control de Acceso & Biometría",
      desc: "Molinete peatonal, cerraduras electromagnéticas, molinetes y reconocimiento facial ultra veloz sin contacto."
    },
    {
      icon: <Flame size={24} />,
      title: "Detección de Incendio",
      desc: "Centrales direccionables NFPA 72, detectores ópticos de humo, estaciones manuales y sirenas de evacuación."
    }
  ];

  return (
    <section className="services-section">
      <div className="section-title">
        <h3>Especialidades en Seguridad Electrónica</h3>
        <p>Soluciones certificadas de alta tecnología para la protección de personas y activos</p>
      </div>

      <div className="services-grid">
        {services.map((srv, idx) => (
          <div key={idx} className="service-card">
            <div className="service-icon">
              {srv.icon}
            </div>
            <h4>{srv.title}</h4>
            <p>{srv.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
