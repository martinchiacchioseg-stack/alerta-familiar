import React from 'react';
import { Radio, ShieldAlert, Smartphone, Zap, Clock, BellRing, ArrowRight, MessageCircle } from 'lucide-react';

export default function SmartMonitoringSpotlight() {
  const whatsappUrl = `https://wa.me/5492241527180?text=${encodeURIComponent("Hola, me gustaría recibir más información sobre el nuevo servicio de Monitoreo Inteligente 24/7 de Alarmas Chascomús")}`;

  return (
    <section id="monitoreo" className="py-20 md:py-28 bg-[#0a0e17] relative overflow-hidden border-y border-white/10">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#DC143C]/15 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DC143C]/15 border border-[#DC143C]/40 text-xs sm:text-sm font-bold text-[#EF4444]">
              <Radio size={15} className="animate-pulse" />
              <span>NUEVO LANZAMIENTO 2026</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Montserrat'] leading-tight">
              Monitoreo Inteligente 24/7:{' '}
              <span className="text-[#EF4444]">Respuesta en Tiempo Real</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
              Evolucionamos la seguridad electrónica con una central de monitoreo conectada las 24 horas del día, los 365 días del año. Tu alarma reporta de forma instantánea ante cualquier evento.
            </p>

            {/* Benefit Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DC143C]/20 text-[#EF4444] flex items-center justify-center flex-shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Alerta Instantánea</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Notificación a la central y a tu teléfono en milisegundos.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DC143C]/20 text-[#EF4444] flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Guardia Activa 24/7</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Operadores capacitados listos para actuar ante emergencias.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DC143C]/20 text-[#EF4444] flex items-center justify-center flex-shrink-0">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">App Móvil Completa</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Activá, desactivá y chequeá el estado desde cualquier lugar.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DC143C]/20 text-[#EF4444] flex items-center justify-center flex-shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Doble Vía de Enlace</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Conectividad Wi-Fi / IP + 4G celular contra cortes de luz.</p>
                </div>
              </div>

            </div>

            {/* Action CTA */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#DC143C] hover:bg-[#b91c1c] text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(220,20,60,0.45)] transition-all duration-300"
              >
                <MessageCircle size={20} />
                <span>Pedir Monitoreo 24/7 para mi Alarma</span>
              </a>
            </div>

          </div>

          {/* Right Visual Box */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#111827] to-[#060911] border border-white/10 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-gray-200">CENTRAL MONITOREO ACTIVA</span>
                </div>
                <span className="text-xs font-mono text-gray-400">LATENCIA: 12ms</span>
              </div>

              {/* Status Simulation */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-300 font-semibold">
                    <ShieldAlert size={16} />
                    <span>Panel Principal: ARMADO TOTAL</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">OK</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-gray-300 font-medium">
                    <Radio size={16} className="text-[#EF4444]" />
                    <span>Canal de Comunicación 4G/IP</span>
                  </div>
                  <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded font-bold">ONLINE</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-gray-300 font-medium">
                    <BellRing size={16} className="text-amber-400" />
                    <span>Batería de Emergencia</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">100% CARGA</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#DC143C]/10 border border-[#DC143C]/30 text-center">
                <p className="text-xs text-[#EF4444] font-bold">¿Ya tenés alarma instalada?</p>
                <p className="text-[11px] text-gray-300 mt-0.5">Podemos conectar tu sistema existente a nuestro monitoreo sin cambiar tus equipos.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
