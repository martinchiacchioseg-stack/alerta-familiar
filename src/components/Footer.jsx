import React from 'react';
import { Shield, Phone, MessageCircle, MapPin, Instagram, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/5492241527180?text=${encodeURIComponent("Hola, me gustaría comunicarme con Alarmas Chascomús")}`;

  return (
    <footer className="bg-[#04060a] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#DC143C] overflow-hidden bg-black flex items-center justify-center shadow-[0_0_15px_rgba(220,20,60,0.4)]">
                <img 
                  src="/logo-original.jpg" 
                  alt="Alarmas Chascomús" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <span className="font-black text-lg tracking-tight font-['Montserrat']">
                Alarmas <span className="text-[#DC143C]">Chascomús</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Líderes en seguridad electrónica desde 2006. Protegiendo hogares, comercios y empresas con excelencia tecnológica.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com/dealarma" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#DC143C] hover:bg-red-700 flex items-center justify-center text-white transition-colors"
                aria-label="Instagram de Alarmas Chascomús"
              >
                <Instagram size={18} />
              </a>

              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Services Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Servicios</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><a href="#servicios" className="hover:text-[#EF4444] transition-colors">Alarmas Residenciales</a></li>
              <li><a href="#servicios" className="hover:text-[#EF4444] transition-colors">CCTV y Cámaras 4K</a></li>
              <li><a href="#monitoreo" className="text-[#EF4444] font-semibold hover:underline">Monitoreo Inteligente 24/7</a></li>
              <li><a href="#servicios" className="hover:text-[#EF4444] transition-colors">Cercos Perimetrales</a></li>
              <li><a href="#servicios" className="hover:text-[#EF4444] transition-colors">Control de Acceso</a></li>
            </ul>
          </div>

          {/* Col 3: Cobertura */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Cobertura</h4>
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-400">
              <MapPin size={16} className="text-[#DC143C] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Chascomús y Alrededores</p>
                <p className="text-xs text-gray-400 mt-0.5">Barrios cerrados, quintas, lagunas, Lezama, Ranchos y Castelli.</p>
                <p className="text-xs text-gray-500 mt-1">Provincia de Buenos Aires</p>
              </div>
            </div>
          </div>

          {/* Col 4: Contacto */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contacto</h4>
            <div className="space-y-2 text-xs sm:text-sm text-gray-400">
              <a href="tel:+5492241527180" className="flex items-center gap-2 hover:text-[#DC143C] transition-colors">
                <Phone size={14} className="text-[#DC143C]" />
                <span>+54 9 224 152-7180</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                <MessageCircle size={14} className="text-emerald-500" />
                <span>WhatsApp: +54 9 224 152-7180</span>
              </a>
              <p className="text-xs text-gray-500 pt-1">Atención comercial y técnica en Chascomús.</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2006-2026 Alarmas Chascomús. Todos los derechos reservados.</p>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <span>Volver arriba</span>
            <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
}
