import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Shield, Users, Wrench } from 'lucide-react';

export default function GallerySection() {
  const images = [
    {
      id: 1,
      title: "Instalación Residencial",
      desc: "Sistema de alarma profesional en vivienda moderna con cámaras de vigilancia en alta definición.",
      src: "/gallery-1-residential.webp"
    },
    {
      id: 2,
      title: "Sistema CCTV Comercial",
      desc: "Múltiples cámaras de vigilancia profesionales para cobertura 360° en edificio comercial.",
      src: "/gallery-2-cctv.webp"
    },
    {
      id: 3,
      title: "Panel de Control Digital",
      desc: "Panel de control moderno con indicadores LED, teclado táctil y monitoreo 24/7.",
      src: "/gallery-3-panel.webp"
    },
    {
      id: 4,
      title: "Seguridad Comercial",
      desc: "Sistema integral de seguridad para locales comerciales, depósitos y tiendas.",
      src: "/gallery-4-commercial.webp"
    },
    {
      id: 5,
      title: "Protección Perimetral",
      desc: "Barreras infrarrojas y cercos eléctricos energizados para prevención perimetral de intrusiones.",
      src: "/gallery-5-perimeter.webp"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx === 0 ? images.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx === images.length - 1 ? 0 : prevIdx + 1));
  };

  const current = images[currentIndex];

  return (
    <section id="galeria" className="py-20 md:py-28 bg-[#060911] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-[#EF4444]">
            <span>Calidad y Prolijidad Comprobada</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Montserrat']">
            Galería de Trabajos
          </h2>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Conocé algunos de nuestros proyectos e instalaciones realizadas en Chascomús y alrededores.
          </p>
        </div>

        {/* Carousel Showcase */}
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#111827] to-[#0a0e17] border border-white/10 shadow-2xl">
          
          {/* Main Slide Image */}
          <div className="relative aspect-[16/10] md:aspect-[16/9] bg-black overflow-hidden group">
            <img 
              src={current.src} 
              alt={current.title} 
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

            {/* Prev / Next Buttons */}
            <button 
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-[#DC143C] text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-[#DC143C] text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={24} />
            </button>

            {/* Counter Badge */}
            <div className="absolute top-4 right-4 bg-[#DC143C] text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-lg">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Slide Title & Description Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 font-['Montserrat']">
                {current.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                {current.desc}
              </p>
            </div>

          </div>

          {/* Thumbnails Row */}
          <div className="p-4 sm:p-6 bg-[#0a0e17] flex items-center justify-center gap-3 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                  idx === currentIndex 
                    ? 'border-[#DC143C] scale-105 shadow-[0_0_15px_rgba(220,20,60,0.5)]' 
                    : 'border-white/15 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        {/* Stats Metrics Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#DC143C]/10 text-[#EF4444] flex items-center justify-center mb-3">
              <Shield size={24} />
            </div>
            <p className="text-3xl sm:text-4xl font-black text-white font-['Montserrat']">20+</p>
            <p className="text-sm text-gray-400 mt-1 font-medium">Años de Trayectoria (2006-2026)</p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#DC143C]/10 text-[#EF4444] flex items-center justify-center mb-3">
              <Wrench size={24} />
            </div>
            <p className="text-3xl sm:text-4xl font-black text-[#EF4444] font-['Montserrat']">1000+</p>
            <p className="text-sm text-gray-400 mt-1 font-medium">Proyectos e Instalaciones</p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#DC143C]/10 text-[#EF4444] flex items-center justify-center mb-3">
              <Users size={24} />
            </div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400 font-['Montserrat']">99%</p>
            <p className="text-sm text-gray-400 mt-1 font-medium">Clientes Satisfechos</p>
          </div>

        </div>

      </div>
    </section>
  );
}
