import React from 'react';
import { Phone } from 'lucide-react';

export default function WhatsAppWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <a 
        href="tel:+5492241527180"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#DC143C] hover:bg-[#b91c1c] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(220,20,60,0.5)] hover:shadow-[0_12px_35px_rgba(220,20,60,0.7)] transition-all duration-300 transform hover:scale-110 active:scale-95 group"
        aria-label="Llamar por teléfono"
        title="Llamar al (02241) 15-527180"
      >
        <Phone size={28} className="group-hover:rotate-12 transition-transform duration-300" />
      </a>
    </div>
  );
}
