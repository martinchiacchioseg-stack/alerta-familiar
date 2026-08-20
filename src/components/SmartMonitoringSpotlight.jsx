import React from 'react';
import { Smartphone, Zap, BellRing, Eye, Phone, ShieldCheck, Wifi } from 'lucide-react';

export default function SmartMonitoringSpotlight() {
  return (
    <section id="app-movil" className="py-20 md:py-28 bg-[#0a0e17] relative overflow-hidden border-y border-white/10">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#DC143C]/15 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DC143C]/15 border border-[#DC143C]/40 text-xs sm:text-sm font-bold text-[#EF4444]">
              <Smartphone size={15} />
              <span>CONTROL TOTAL EN TU SMARTPHONE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Montserrat'] leading-tight">
              Tu Seguridad al Alcance de la Mano:{' '}
              <span className="text-[#EF4444]">Avisos Directos a tu Celular</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
              Instalamos sistemas modernos que se conectan a tu teléfono móvil. Tené el control total de tu alarma y cámaras sin intermediarios ni cargos mensuales.
            </p>

            {/* Benefit Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DC143C]/20 text-[#EF4444] flex items-center justify-center flex-shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Notificaciones Instantáneas</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Enterate en el segundo exacto si alguien abre una puerta o se dispara la alarma.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DC143C]/20 text-[#EF4444] flex items-center justify-center flex-shrink-0">
                  <Eye size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Cámaras en Vivo 24hs</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Mirá tu hogar o negocio en tiempo real en alta definición desde cualquier lugar.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DC143C]/20 text-[#EF4444] flex items-center justify-center flex-shrink-0">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Armado y Desarmado Remoto</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Activá la alarma aunque ya hayas salido de tu casa con un solo botón.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DC143C]/20 text-[#EF4444] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sin Abonos Mensuales</h4>
                  <p className="text-xs text-gray-400 mt-0.5">El equipo es tuyo y no pagás abonos fijos de mantenimiento forzoso.</p>
                </div>
              </div>

            </div>

            {/* Action CTA: Call */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a 
                href="tel:+5492241527180"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#DC143C] hover:bg-[#b91c1c] text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(220,20,60,0.45)] transition-all duration-300"
              >
                <Phone size={20} />
                <span>Consultar Instalación: (02241) 15-527180</span>
              </a>
            </div>

          </div>

          {/* Right Visual Box */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#111827] to-[#060911] border border-white/10 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-gray-200">APP MÓVIL SINCRONIZADA</span>
                </div>
                <span className="text-xs font-mono text-gray-400">ESTADO: ONLINE</span>
              </div>

              {/* Status Simulation */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-300 font-semibold">
                    <ShieldCheck size={16} />
                    <span>Alarma Residencial: ARMADA</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">ACTIVA</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-gray-300 font-medium">
                    <Eye size={16} className="text-[#EF4444]" />
                    <span>Cámaras CCTV Exteriores</span>
                  </div>
                  <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded font-bold">EN VIVO</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-gray-300 font-medium">
                    <BellRing size={16} className="text-amber-400" />
                    <span>Batería de Respaldo</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">100% CARGA</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#DC143C]/10 border border-[#DC143C]/30 text-center">
                <p className="text-xs text-[#EF4444] font-bold">¿Querés modernizar tu alarma actual?</p>
                <p className="text-[11px] text-gray-300 mt-0.5">Podemos agregarle módulo Wi-Fi / IP a tu sistema existente para recibir avisos en el celular.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
