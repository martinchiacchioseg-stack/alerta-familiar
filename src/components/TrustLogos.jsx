import React from 'react';
import { Building2, Shield, CheckCircle2 } from 'lucide-react';

export default function TrustLogos() {
  const clients = [
    { name: "Banco Santander", role: "Soporte Técnico Especializado" },
    { name: "Banco Macro", role: "Servicios Tercerizados" },
    { name: "Andreani", role: "Seguridad Logística" },
    { name: "Correo Argentino", role: "Mantenimiento Técnico" }
  ];

  return (
    <div className="relative z-20 py-10 bg-[#070b14] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-6">
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#EF4444] uppercase">
            Respaldo y Confianza Institucional
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Brindamos servicios y soporte técnico especializado para clientes de entidades líderes
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {clients.map((client, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-[#DC143C]/40 transition-all duration-300 text-center flex flex-col items-center justify-center group"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#DC143C]/20 flex items-center justify-center text-gray-300 group-hover:text-[#EF4444] transition-colors mb-2">
                <Building2 size={16} />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {client.name}
              </h4>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                {client.role}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
