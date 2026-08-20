import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppWidget() {
  const [showTooltip, setShowTooltip] = useState(true);
  const whatsappUrl = `https://wa.me/5492241527180?text=${encodeURIComponent("Hola, me gustaría conocer más sobre los servicios de Alarmas Chascomús")}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="mb-3 p-3 rounded-2xl bg-[#0e1626] border border-white/15 text-white shadow-2xl text-xs max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-1.5 text-gray-400 hover:text-white p-0.5"
            aria-label="Cerrar mensaje"
          >
            <X size={12} />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-emerald-400 text-[11px]">Asesor en línea</span>
          </div>
          <p className="text-gray-300 text-[11px]">
            ¿Tenés dudas o necesitás un presupuesto? ¡Escribinos por WhatsApp!
          </p>
        </div>
      )}

      {/* Floating Button */}
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(16,185,129,0.5)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.7)] transition-all duration-300 transform hover:scale-110 active:scale-95 group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={30} className="group-hover:rotate-12 transition-transform duration-300" />
      </a>

    </div>
  );
}
