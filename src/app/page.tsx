"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SecurityBanner } from "@/components/SecurityBanner";
import { EmergencyTrigger } from "@/components/EmergencyTrigger";
import {
  Shield,
  Send,
  Users,
  QrCode,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  KeyRound,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [ecosistema, setEcosistema] = useState<any>(null);
  const [miembros, setMiembros] = useState<any[]>([]);
  const [activeMemberToken, setActiveMemberToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Formulario rápido para vincular dispositivo por primera vez
  const [inputToken, setInputToken] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const loadSessionAndEcosystem = async () => {
    try {
      // 1. Verificar si hay sesión activa en cookie
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      let activeToken = localStorage.getItem("alerta_token");

      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
        if (data.user.tokenVinculacion) {
          activeToken = data.user.tokenVinculacion;
          setActiveMemberToken(activeToken);
        }

        // Cargar integrantes del ecosistema para el selector rápido
        if (data.user.ecosistemaId) {
          const ecoRes = await fetch(`/api/ecosistemas/publico?ecoId=${data.user.ecosistemaId}`);
          const ecoData = await ecoRes.json();
          if (ecoData.success) {
            setEcosistema(ecoData.ecosistema);
            setMiembros(ecoData.ecosistema.miembros || []);
          }
        }
      } else if (activeToken) {
        // 2. Auto-recuperar sesión desde localStorage
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberToken: activeToken }),
        });
        const loginData = await loginRes.json();
        if (loginData.success) {
          setCurrentUser(loginData.user);
          setActiveMemberToken(activeToken);

          if (loginData.user.ecosistemaId) {
            const ecoRes = await fetch(`/api/ecosistemas/publico?ecoId=${loginData.user.ecosistemaId}`);
            const ecoData = await ecoRes.json();
            if (ecoData.success) {
              setEcosistema(ecoData.ecosistema);
              setMiembros(ecoData.ecosistema.miembros || []);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error al cargar sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessionAndEcosystem();
  }, []);

  // Cambio de integrante con 1 solo toque (sin contraseñas)
  const handleSelectMember = async (m: any) => {
    try {
      setActiveMemberToken(m.tokenVinculacion);
      localStorage.setItem("alerta_token", m.tokenVinculacion);
      localStorage.setItem("alerta_usuario_id", m.id);
      localStorage.setItem("alerta_usuario_nombre", m.nombre);

      // Iniciar sesión transparente en backend
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberToken: m.tokenVinculacion }),
      });

      setCurrentUser((prev: any) => ({
        ...prev,
        id: m.id,
        nombre: m.nombre,
        telegramVinculado: m.telegramVinculado,
      }));
    } catch (e) {
      console.error("Error al cambiar de integrante:", e);
    }
  };

  // Vincular por primera vez con código
  const handleManualLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) return;
    setLinking(true);
    setLinkError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberToken: inputToken.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("alerta_token", inputToken.trim());
        await loadSessionAndEcosystem();
      } else {
        setLinkError(data.error || "Código no válido");
      }
    } catch (err) {
      setLinkError("Error de conexión");
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen bg-slate-950 text-white">
      <Navbar user={currentUser} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-3 flex flex-col justify-between items-center gap-3">
        {/* Banner de Garantías de Privacidad y Cifrado */}
        <div className="w-full max-w-md">
          <SecurityBanner />
        </div>

        {/* 1. DISPOSITIVO VINCULADO: Identidad Familiar y Selector de Integrantes */}
        {currentUser ? (
          <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            {/* Cabecera del Ecosistema */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Ecosistema Protegido
                  </span>
                  <span className="text-sm font-extrabold text-white block">
                    {currentUser.ecosistemaNombre || ecosistema?.nombre || "Familia Chascomús"}
                  </span>
                </div>
              </div>

              {!currentUser.telegramVinculado ? (
                <Link
                  href="/vincular"
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg animate-pulse"
                >
                  <Send className="w-3 h-3" />
                  <span>Vincular Bot</span>
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Telegram OK</span>
                </span>
              )}
            </div>

            {/* Selector Rápido de Integrante (1 Toque) */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 px-0.5">
                <span className="font-semibold text-slate-300">¿Quién está usando la app?</span>
                <span className="text-[10px] text-slate-500">Toca para cambiar emisor</span>
              </div>

              {miembros.length > 0 ? (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {miembros.map((m) => {
                    const isSelected = currentUser.id === m.id || currentUser.nombre === m.nombre;
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMember(m)}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-red-600 text-white shadow-md shadow-red-950 scale-102 border border-red-400"
                            : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                        <span>{m.nombre}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-950 px-3 py-2 rounded-xl text-xs text-slate-300 font-medium">
                  Emitiendo como: <b className="text-white">{currentUser.nombre}</b>
                </div>
              )}
            </div>

            {/* Aviso si falta vincular Telegram */}
            {!currentUser.telegramVinculado && (
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-2.5 flex items-center justify-between text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <span className="text-base">📲</span>
                  <span className="text-[11px] leading-tight">
                    Para <b>recibir</b> las alertas sonoras de tu familia, necesitás Telegram.
                  </span>
                </div>
                <Link
                  href="/vincular"
                  className="shrink-0 text-[11px] font-bold text-amber-300 hover:underline ml-2"
                >
                  Vincular →
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* 2. DISPOSITIVO NO VINCULADO (Primer uso en un celular nuevo) */
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Vincular a tu Grupo Familiar</h2>
                <p className="text-xs text-slate-400">
                  Solo se hace una vez. Desde entonces abrirás directo la app.
                </p>
              </div>
            </div>

            {linkError && (
              <div className="p-2.5 bg-red-950/70 border border-red-500/50 rounded-xl text-red-200 text-xs text-center font-medium">
                {linkError}
              </div>
            )}

            <form onSubmit={handleManualLink} className="space-y-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Código de Invitación / Token de Miembro
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Pega aquí el código que te dio el titular"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={linking}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-1.5"
              >
                <span>{linking ? "Vinculando..." : "Activar este Dispositivo"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                ¿Sos el Titular? Iniciar sesión
              </Link>
            </div>
          </div>
        )}

        {/* Botones Tácticos de Emergencia (SOS / Llegué Bien) */}
        <EmergencyTrigger user={currentUser} token={activeMemberToken || undefined} />

        {/* Footer Informativo */}
        <footer className="w-full max-w-md text-center py-1.5 text-[11px] text-slate-500 border-t border-slate-900">
          <span>Alarmas Chascomús © 2026 • Plataforma de Seguridad y Alerta Familiar</span>
        </footer>
      </main>
    </div>
  );
}
