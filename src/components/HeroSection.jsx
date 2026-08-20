import React from 'react';
import { ShieldCheck, MessageCircle, Eye, Star, CheckCircle, Bell, Wifi, Smartphone } from 'lucide-react';

export default function HeroSection() {
  const whatsappUrl = `https://wa.me/5492241527180?text=${encodeURIComponent("Hola, me gustaría conocer más sobre los servicios de Alarmas Chascomús")}`;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 76;
      const elPos = el.getBoundingClientRect().top;
      const offset = elPos + window.pageYOffset - navHeight;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-[#060911] via-[#0a0e17] to-[#060911]">
      
      {/* Background Decorative Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#DC143C]/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/30 text-xs sm:text-sm font-semibold text-gray-200 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC143C]"></span>
              </span>
              <span>20 Años Protegiendo Chascomús y la Región</span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight font-['Montserrat']">
                Protegé lo que más querés con{' '}
                <span className="bg-gradient-to-r from-[#DC143C] via-[#EF4444] to-red-400 bg-clip-text text-transparent block sm:inline">
                  Alarmas Chascomús
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Líderes en seguridad electrónica, videovigilancia y monitoreo inteligente. Más de 20 años de trayectoria y excelencia técnica cuidando a los vecinos de la zona.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#DC143C] hover:bg-[#b91c1c] text-white text-base sm:text-lg font-bold rounded-2xl shadow-[0_10px_30px_rgba(220,20,60,0.45)] hover:shadow-[0_15px_35px_rgba(220,20,60,0.65)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
              >
                <MessageCircle size={22} className="text-white" />
                <span>Contactar por WhatsApp</span>
              </a>

              <button 
                onClick={() => scrollTo('servicios')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-base sm:text-lg font-semibold rounded-2xl border border-white/15 hover:border-white/30 backdrop-blur-md transition-all duration-200"
              >
                <Eye size={20} className="text-gray-400" />
                <span>Ver Servicios</span>
              </button>
            </div>

            {/* Micro Social Proof & Guarantee Badges */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-gray-300">
              
              {/* Google Rating */}
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <div className="flex text-amber-400">
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                </div>
                <span className="font-bold text-white">4.9 / 5</span>
                <span className="text-gray-400 text-xs">(46+ opiniones)</span>
              </div>

              {/* Guarantees */}
              <div className="flex items-center gap-1.5 text-gray-300 font-medium">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>Asistencia Local Directa</span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-300 font-medium">
                <ShieldCheck size={16} className="text-[#DC143C]" />
                <span>Garantía Oficial</span>
              </div>

            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glow Behind Container */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#DC143C]/30 via-transparent to-red-500/20 rounded-3xl blur-2xl transform scale-105"></div>

              {/* Card Container */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/15 bg-gradient-to-b from-[#111827]/90 to-[#0a0e17]/90 backdrop-blur-xl shadow-2xl p-2 sm:p-3 group">
                
                {/* Hero Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-gray-900">
                  <img 
                    src="/hero-alarmas-chascomus.webp" 
                    alt="Sistema de Seguridad Integral Alarmas Chascomús" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = '/hero-residential.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-black/20 to-transparent"></div>
                  
                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 bg-[#0a0e17]/85 backdrop-blur-md border border-white/15 rounded-full px-3 py-1 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Sistema Operativo 24/7</span>
                  </div>

                  {/* Bottom Image Overlay Tag */}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#0a0e17]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#DC143C]/20 border border-[#DC143C]/40 flex items-center justify-center text-[#EF4444]">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">App Móvil en Vivo</p>
                        <p className="text-[11px] text-gray-400">Control total en tu celular</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                        CONECTADO
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub Features Grid below image */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-sm sm:text-base font-black text-white">2006</p>
                    <p className="text-[10px] text-gray-400 font-medium">Fundación</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-sm sm:text-base font-black text-[#EF4444]">100%</p>
                    <p className="text-[10px] text-gray-400 font-medium">Chascomús</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-sm sm:text-base font-black text-emerald-400">24/7</p>
                    <p className="text-[10px] text-gray-400 font-medium">Monitoreo</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
