import React from 'react';
import { Star, ExternalLink, ShieldCheck, CheckCircle2, ThumbsUp, MapPin } from 'lucide-react';

export default function SocialProofSection() {
  const googleMapsUrl = "https://www.google.com/search?kgmid=%2Fg%2F11fl0fcj4y&hl=es-419&q=Alarmas%20Chascom%C3%BAs&shem=epsd1%2Cltac%2Crimspwouoe&shndl=30&source=sh%2Fx%2Floc%2Fosrp%2Fm5%2F2&kgs=7fd5d11bbc3519dc";

  const reviews = [
    {
      name: "Vecino y Cliente Residencial",
      loc: "Chascomús",
      stars: 5,
      highlight: "Instalaciones impecables",
      text: "Nuestro equipo realiza trabajos de calidad profesional con máxima atención al detalle, limpieza y prolijidad en cada ambiente."
    },
    {
      name: "Comercio de Zona Céntrica",
      loc: "Chascomús",
      stars: 5,
      highlight: "Soporte técnico rápido",
      text: "Respuesta inmediata ante cualquier consulta técnica o duda con la app de cámaras. Muy recomendable el servicio local."
    },
    {
      name: "Empresa Local",
      loc: "Chascomús y Región",
      stars: 5,
      highlight: "Profesionalismo garantizado",
      text: "Más de 20 años de experiencia al servicio de la comunidad avalan la seriedad y confiabilidad en cada sistema instalado."
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#060911] relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Card */}
        <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-b from-[#111827] to-[#0a0e17] border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Rating Hero Badge */}
            <div className="lg:col-span-4 text-center p-8 rounded-3xl bg-gradient-to-b from-[#DC143C] to-[#990f2b] text-white shadow-[0_15px_40px_rgba(220,20,60,0.4)]">
              
              <div className="flex justify-center gap-1 mb-3 text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} fill="currentColor" />
                ))}
              </div>

              <p className="text-5xl sm:text-6xl font-black font-['Montserrat'] tracking-tight">4.9</p>
              <p className="text-sm font-semibold text-white/90 mt-1">de 5 estrellas en Google</p>
              
              <div className="mt-4 pt-4 border-t border-white/20 text-xs text-white/80">
                Basado en más de 46 opiniones de clientes reales
              </div>

              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#DC143C] text-xs font-bold hover:bg-gray-100 transition-colors shadow-md"
              >
                <span>Ver en Google Mi Negocio</span>
                <ExternalLink size={14} />
              </a>

            </div>

            {/* Reviews Highlights */}
            <div className="lg:col-span-8 space-y-6">
              
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Montserrat']">
                  Lo que dicen nuestros clientes
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  La satisfacción y tranquilidad de nuestros vecinos es nuestro mejor aval
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-3">
                    <div className="flex text-amber-400">
                      {[...Array(rev.stars)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>

                    <p className="text-xs font-bold text-[#EF4444]">
                      {rev.highlight}
                    </p>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      "{rev.text}"
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                      <span className="font-semibold text-gray-200">{rev.name}</span>
                      <span className="flex items-center gap-0.5 text-gray-400">
                        <MapPin size={10} /> {rev.loc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
