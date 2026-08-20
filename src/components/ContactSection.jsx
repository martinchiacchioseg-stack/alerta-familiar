import React, { useState } from 'react';
import { Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="py-20 md:py-28 bg-[#060911] relative overflow-hidden border-t border-white/10">
      
      {/* Glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#DC143C]/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/30 text-xs sm:text-sm font-bold text-[#EF4444]">
            <span>Atención Personalizada e Inmediata</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Montserrat']">
            Contactanos
          </h2>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Estamos listos para responder tus consultas, evaluar tu propiedad y diseñar la solución de seguridad ideal.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Card 1: Phone */}
          <div className="p-8 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#DC143C]/50 transition-all duration-300 text-center flex flex-col items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-[#DC143C]/10 border border-[#DC143C]/30 flex items-center justify-center text-[#EF4444] mb-4">
              <Phone size={26} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Línea Principal</h3>
              <p className="text-xs text-gray-400 mb-4">Llamadas directas para asesoramiento</p>
            </div>
            <a 
              href="tel:+5492241527180"
              className="px-6 py-2.5 rounded-full bg-[#DC143C] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-md transition-colors"
            >
              (02241) 15-527180
            </a>
          </div>

          {/* Card 2: Phone Alternative */}
          <div className="p-8 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#DC143C]/50 transition-all duration-300 text-center flex flex-col items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Phone size={26} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Teléfono Directo</h3>
              <p className="text-xs text-gray-400 mb-4">Contacto comercial y técnico</p>
            </div>
            <a 
              href="tel:+5492241527180"
              className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
            >
              +54 9 224 152-7180
            </a>
          </div>

          {/* Card 3: Location */}
          <div className="p-8 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#DC143C]/50 transition-all duration-300 text-center flex flex-col items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <MapPin size={26} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Zona de Cobertura</h3>
              <p className="text-xs text-gray-400 mb-4">Chascomús, quintas y localidades vecinas</p>
            </div>
            <span className="text-xs font-semibold text-gray-300">
              Provincia de Buenos Aires
            </span>
          </div>

        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#111827] to-[#0a0e17] border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-['Montserrat']">
              Envianos tu Mensaje
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Completá el formulario y nos comunicaremos con vos a la brevedad.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">¡Gracias por tu mensaje!</h4>
              <p className="text-sm text-gray-300">Nos pondremos en contacto muy pronto para brindarte asesoramiento.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 bg-white/10 text-white rounded-full text-xs font-bold hover:bg-white/20"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Nombre Completo *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Tu nombre y apellido"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Email *
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>

              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                  Teléfono de Contacto (Opcional)
                </label>
                <input 
                  type="tel" 
                  placeholder="+54 9 2241 ..."
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                  Mensaje o Consulta *
                </label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Contanos sobre tu propiedad o necesidad de seguridad..."
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#DC143C] hover:bg-[#b91c1c] text-white text-base font-bold rounded-2xl shadow-[0_10px_25px_rgba(220,20,60,0.5)] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                <span>Enviar Consulta</span>
              </button>

              <p className="text-[11px] text-gray-500 text-center">
                * Tu información está segura y sólo será utilizada para responder tu consulta.
              </p>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
