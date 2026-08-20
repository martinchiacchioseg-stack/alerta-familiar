import React from 'react';
import { Award, Building, Sparkles, Cpu, CheckCircle } from 'lucide-react';

export default function AboutSection() {
  const pillars = [
    {
      icon: Award,
      title: "Nuestra Trayectoria",
      tag: "Desde 2006",
      desc: "Desde el año 2006, en Alarmas Chascomús nos hemos consolidado como referentes en seguridad electrónica, protegiendo lo que más importa: tu familia, tu hogar y tu comercio. Lo que comenzó como un proyecto familiar basado en el compromiso y la responsabilidad, hoy se transforma en una empresa con dos décadas de experiencia ininterrumpida en el sector."
    },
    {
      icon: Building,
      title: "Respaldo y Confianza",
      tag: "Alianzas Estratégicas",
      desc: "Nuestra capacidad técnica y profesionalismo nos permiten actuar como aliados estratégicos de grandes organizaciones. Actualmente, brindamos servicios de soporte técnico y atención especializada de forma tercerizada para clientes de entidades de primera línea, tales como Banco Santander, Banco Macro, Andreani y Correo Argentino, entre otros."
    },
    {
      icon: Sparkles,
      title: "Compromiso con la Calidad",
      tag: "Excelencia Técnica",
      desc: "Nuestra filosofía siempre ha sido clara: excelencia técnica al alcance de todos. Nos destacamos por ofrecer un servicio de instalación y mantenimiento de primer nivel, utilizando equipamiento de vanguardia. Gracias a nuestras alianzas estratégicas con marcas líderes, logramos el equilibrio perfecto entre la más alta calidad y costos competitivos."
    },
    {
      icon: Cpu,
      title: "Innovación Tecnológica",
      tag: "Monitoreo Inteligente 24/7",
      desc: "Al celebrar nuestros 20 años de trayectoria, damos un paso decisivo hacia el futuro de la seguridad. Inauguramos una nueva etapa con la incorporación de Monitoreo Inteligente, una solución avanzada que integra tecnología de última generación para una respuesta más rápida, eficiente y conectada."
    }
  ];

  return (
    <section id="quienes-somos" className="py-20 md:py-28 bg-[#0a0e17] relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#DC143C]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-[#EF4444]">
            <span>20 Años Cuidando Lo Que Más Querés (2006 - 2026)</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Montserrat']">
            Quiénes Somos
          </h2>
          
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Dos décadas de compromiso inquebrantable con la tranquilidad y protección de las familias y empresas de Chascomús.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="group relative p-8 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#DC143C]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#DC143C]/10 border border-[#DC143C]/30 flex items-center justify-center text-[#EF4444] group-hover:scale-110 group-hover:bg-[#DC143C] group-hover:text-white transition-all duration-300">
                      <Icon size={26} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#EF4444] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-[#EF4444]">
                  <CheckCircle size={15} />
                  <span>Estándar de Seguridad Certificado</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
