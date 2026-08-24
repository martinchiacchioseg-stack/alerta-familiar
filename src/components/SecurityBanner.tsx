"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, ChevronDown, ChevronUp, EyeOff } from "lucide-react";

export function SecurityBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full bg-slate-900/90 border-y sm:border sm:rounded-xl border-slate-800 backdrop-blur-md px-4 py-2.5 text-xs text-slate-300 shadow-md">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cifrado TLS/HTTPS Activo</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">Aislamiento Zero-Knowledge Multi-Tenant</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors py-0.5 px-1.5 rounded hover:bg-slate-800"
        >
          <span>{expanded ? "Ocultar detalles" : "Ver garantías"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-slate-400 space-y-2 leading-relaxed animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-start gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">Privacidad Estricta de Ecosistema</span>
                Sus coordenadas GPS y alertas viajan cifradas punto a punto y SOLO son despachadas a los integrantes autorizados de su propio grupo familiar o comercial.
              </div>
            </div>
            <div className="flex items-start gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
              <EyeOff className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">Cero Rastreo Continuo</span>
                La geolocalización se consulta de forma puntual únicamente al presionar un botón de alerta. No se realiza seguimiento pasivo de batería ni posición en segundo plano.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
