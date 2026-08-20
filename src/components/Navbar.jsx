import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, Phone, MessageCircle, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const whatsappUrl = `https://wa.me/5492241527180?text=${encodeURIComponent("Hola, me gustaría conocer más sobre los servicios de Alarmas Chascomús")}`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#060911]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3' 
        : 'bg-[#060911]/80 backdrop-blur-sm border-b border-white/5 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a 
            href="#inicio" 
            onClick={(e) => { e.preventDefault(); scrollToSection('inicio'); }}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#DC143C] bg-black flex items-center justify-center shadow-[0_0_20px_rgba(220,20,60,0.45)] group-hover:scale-105 transition-transform duration-200">
              <img 
                src="/logo-original.jpg" 
                alt="Alarmas Chascomús" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full bg-[#DC143C] items-center justify-center text-white font-bold">
                <Shield size={22} />
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1 font-['Montserrat']">
                Alarmas <span className="text-[#DC143C]">Chascomús</span>
              </span>
              <span className="text-[11px] text-gray-400 font-medium tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Seguridad Electrónica • Desde 2006
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
            <button 
              onClick={() => scrollToSection('inicio')} 
              className="px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('quienes-somos')} 
              className="px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Quiénes Somos
            </button>
            <button 
              onClick={() => scrollToSection('servicios')} 
              className="px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Servicios
            </button>
            <button 
              onClick={() => scrollToSection('monitoreo')} 
              className="px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold text-[#EF4444] bg-[#DC143C]/15 hover:bg-[#DC143C]/25 transition-all duration-200 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping"></span>
              Monitoreo 24/7
            </button>
            <button 
              onClick={() => scrollToSection('galeria')} 
              className="px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Galería
            </button>
            <button 
              onClick={() => scrollToSection('cotizador')} 
              className="px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Cotizador
            </button>
            <button 
              onClick={() => scrollToSection('contacto')} 
              className="px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Contacto
            </button>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="tel:+5492241527180" 
              className="flex items-center gap-2 text-xs xl:text-sm text-gray-300 hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Phone size={14} className="text-[#DC143C]" />
              <span>(02241) 15-527180</span>
            </a>
            
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#DC143C] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-full text-xs xl:text-sm font-bold shadow-[0_0_20px_rgba(220,20,60,0.4)] hover:shadow-[0_0_25px_rgba(220,20,60,0.7)] transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#DC143C] text-white rounded-full shadow-md active:scale-95"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Abrir menú"
            >
              {isOpen ? <X size={26} className="text-[#DC143C]" /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0a0e17] border-b border-white/10 px-4 pt-3 pb-6 space-y-1.5 shadow-2xl animate-in slide-in-from-top duration-200">
          <button 
            onClick={() => scrollToSection('inicio')}
            className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-200 hover:bg-white/5 hover:text-[#DC143C] transition-colors flex items-center justify-between"
          >
            <span>Inicio</span>
            <ArrowRight size={16} className="opacity-40" />
          </button>
          
          <button 
            onClick={() => scrollToSection('quienes-somos')}
            className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-200 hover:bg-white/5 hover:text-[#DC143C] transition-colors flex items-center justify-between"
          >
            <span>Quiénes Somos (20 Años)</span>
            <ArrowRight size={16} className="opacity-40" />
          </button>

          <button 
            onClick={() => scrollToSection('servicios')}
            className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-200 hover:bg-white/5 hover:text-[#DC143C] transition-colors flex items-center justify-between"
          >
            <span>Nuestros Servicios</span>
            <ArrowRight size={16} className="opacity-40" />
          </button>

          <button 
            onClick={() => scrollToSection('monitoreo')}
            className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-[#EF4444] bg-[#DC143C]/10 border border-[#DC143C]/30 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
              Monitoreo Inteligente 24/7
            </span>
            <ArrowRight size={16} />
          </button>

          <button 
            onClick={() => scrollToSection('galeria')}
            className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-200 hover:bg-white/5 hover:text-[#DC143C] transition-colors flex items-center justify-between"
          >
            <span>Galería de Trabajos</span>
            <ArrowRight size={16} className="opacity-40" />
          </button>

          <button 
            onClick={() => scrollToSection('cotizador')}
            className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-200 hover:bg-white/5 hover:text-[#DC143C] transition-colors flex items-center justify-between"
          >
            <span>Cotizador Express Online</span>
            <ArrowRight size={16} className="opacity-40" />
          </button>

          <button 
            onClick={() => scrollToSection('contacto')}
            className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-200 hover:bg-white/5 hover:text-[#DC143C] transition-colors flex items-center justify-between"
          >
            <span>Contacto y Ubicación</span>
            <ArrowRight size={16} className="opacity-40" />
          </button>

          <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2.5">
            <a 
              href="tel:+5492241527180" 
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-gray-200 font-semibold border border-white/10 active:bg-white/10"
            >
              <Phone size={16} className="text-[#DC143C]" />
              <span>Llamar: (02241) 15-527180</span>
            </a>
            
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#DC143C] hover:bg-[#b91c1c] text-white font-bold shadow-lg"
            >
              <MessageCircle size={18} />
              <span>Enviar WhatsApp Directo</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
