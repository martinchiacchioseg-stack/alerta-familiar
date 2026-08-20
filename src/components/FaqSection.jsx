import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "¿Qué sucede con el sistema de alarma si se corta la luz (energía 220V)?",
      a: "Nuestros sistemas cuentan con batería de respaldo autorecargable de larga duración. Si se interrumpe el suministro eléctrico, la alarma continúa operando con total normalidad y envía un aviso instantáneo a tu celular indicando el corte y la restauración de la energía."
    },
    {
      q: "¿Puedo ver las cámaras de seguridad y controlar la alarma desde mi celular?",
      a: "Sí, absolutamente. Configuramos la App oficial en tu smartphone (Android / iOS) para que puedas activar/desactivar la alarma, recibir alertas en tiempo real y visualizar las cámaras de seguridad en vivo y grabaciones desde cualquier lugar del mundo."
    },
    {
      q: "¿Los sensores de movimiento detectan a mis mascotas y activan falsas alarmas?",
      a: "No. Instalamos sensores infrarrojos pasivos con tecnología antimascotas (Pet Immune) que discriminan animales domésticos de hasta 20kg a 25kg, evitando por completo los falsos disparos."
    },
    {
      q: "¿Cómo funciona el nuevo servicio de Monitoreo Inteligente 24/7?",
      a: "Tu sistema se conecta directamente a nuestra central receptora. Ante un evento de disparo, pánico, corte de línea o sabotaje, nuestros operadores verifican la señal en segundos y coordinan la asistencia inmediata."
    },
    {
      q: "¿Cuál es la zona de cobertura para instalaciones y servicio técnico?",
      a: "Brindamos cobertura completa en la ciudad de Chascomús, barrios cerrados, zonas de quintas, lagunas y localidades aledañas como Ranchos, Lezama y Castelli."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#0a0e17] relative overflow-hidden border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-[#EF4444]">
            <HelpCircle size={15} />
            <span>Preguntas Frecuentes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Montserrat']">
            Resolvemos tus Dudas
          </h2>

          <p className="text-sm sm:text-base text-gray-400">
            Todo lo que necesitás saber antes de contratar o actualizar tu sistema de seguridad electrónica.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'bg-white/[0.06] border-[#DC143C]/40 shadow-lg' 
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#DC143C] text-white' : 'bg-white/5 text-gray-400'
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
