import React from 'react';
import { Shield, Video, Flame, KeyRound, Smartphone, Phone, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      id: 1,
      title: "Sistemas de Alarma Residencial y Comercial",
      desc: "Protección integral para tu hogar y negocio con tecnología de última generación.",
      icon: Shield,
      features: [
        "Sensores de movimiento inmunes a mascotas",
        "Avisos instantáneos al teléfono celular",
        "Batería de respaldo ante cortes de 220V",
        "Teclados táctiles y controles remotos"
      ]
    },
    {
      id: 2,
      title: "Cámaras de Seguridad (CCTV) con Acceso Remoto",
      desc: "Monitoreá tu propiedad en tiempo real desde cualquier lugar del mundo.",
      icon: Video,
      features: [
        "Visión nocturna a color las 24 horas",
        "Detección inteligente de personas y vehículos",
        "Grabación continua en alta definición (Full HD / 4K)",
        "App móvil para visualización en vivo"
      ]
    },
    {
      id: 3,
      title: "Sensores de Incendio y Protección Perimetral",
      desc: "Detectá amenazas antes de que se conviertan en problemas graves.",
      icon: Flame,
      features: [
        "Detección temprana de humo y temperatura",
        "Barreras infrarrojas para patios y fondos",
        "Cercos eléctricos de seguridad energizados",
        "Activación automática de sirenas de alta potencia"
      ]
    },
    {
      id: 4,
      title: "Sistemas de Control de Acceso",
      desc: "Controlá quién entra y sale con tecnología biométrica y de tarjetas.",
      icon: KeyRound,
      features: [
        "Reconocimiento facial y huella dactilar",
        "Cerraduras magnéticas de alta resistencia",
        "Registro de ingresos y horarios del personal",
        "Integración con porteros y alarmas"
      ]
    },
    {
      id: 5,
      title: "Automatización & Aviso Directo al Celular",
      desc: "Tu sistema te avisa directo a tu teléfono ante cualquier evento, sin pagar abonos mensuales.",
      icon: Smartphone,
      features: [
        "Notificaciones push instantáneas en tu smartphone",
        "Armado y desarmado remoto con un toque",
        "Reporte de estado de batería y cortes de 220V",
        "Sin contratos forzados ni cuotas mensuales"
      ]
    }
  ];

  return (
    <section id="servicios" className="py-20 md:py-28 bg-[#060911] relative overflow-hidden">
      
      {/* Glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#DC143C]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/30 text-xs sm:text-sm font-bold text-[#EF4444]">
            <span>Soluciones Integrales de Seguridad</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Montserrat']">
            Nuestros Servicios
          </h2>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Equipamiento de vanguardia, instalación profesional y soporte técnico continuo para tu total tranquilidad.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div 
                key={srv.id}
                className="relative rounded-3xl p-8 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#DC143C]/50 shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Top Bar with Icon & Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#DC143C]/10 border border-[#DC143C]/30 text-[#EF4444] group-hover:bg-[#DC143C] group-hover:text-white flex items-center justify-center transition-all duration-300">
                      <Icon size={26} />
                    </div>

                    <span className="text-xs font-bold text-gray-500">
                      #0{srv.id}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#EF4444] transition-colors font-['Montserrat']">
                    {srv.title}
                  </h3>

                  <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                    {srv.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 mb-8">
                    {srv.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card CTA: Direct Call */}
                <a 
                  href="tel:+5492241527180"
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 bg-white/5 hover:bg-[#DC143C] text-gray-200 hover:text-white border border-white/10 hover:border-transparent transition-all duration-200"
                >
                  <Phone size={15} />
                  <span>Consultar: (02241) 15-527180</span>
                  <ArrowRight size={15} className="ml-auto opacity-70" />
                </a>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
