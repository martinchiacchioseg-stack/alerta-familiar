"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2, MapPin, Loader2, Send, AlertTriangle, Radio } from "lucide-react";

interface EmergencyTriggerProps {
  user?: {
    id: string;
    nombre: string;
    ecosistemaNombre?: string;
    telegramVinculado?: boolean;
  } | null;
  token?: string;
}

export function EmergencyTrigger({ user, token }: EmergencyTriggerProps) {
  const [gpsStatus, setGpsStatus] = useState<"IDLE" | "LOCATING" | "READY" | "ERROR">("IDLE");
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [activeAlert, setActiveAlert] = useState<"SOS" | "LLEGADA" | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "SUCCESS" | "ERROR" | "INFO";
    text: string;
    details?: string;
  } | null>(null);

  // Inicializar detección de GPS
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      setGpsStatus("LOCATING");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
          setGpsStatus("READY");
        },
        (err) => {
          console.warn("GPS inicial no disponible:", err.message);
          setGpsStatus("ERROR");
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 10000 }
      );
    }
  }, []);

  // Manejar cooldown anti-spam
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Obtener geolocalización rápida con timeout
  const getQuickLocation = async (): Promise<{ lat?: number; lng?: number; accuracy?: number }> => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return {};
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
          setCoords(c);
          setGpsStatus("READY");
          resolve(c);
        },
        () => {
          // Si falla o excede timeout, devolver las últimas coordenadas conocidas o vacío
          resolve(coords ? coords : {});
        },
        { enableHighAccuracy: true, timeout: 4000, maximumAge: 5000 }
      );
    });
  };

  // Obtener estado de batería si está disponible en el navegador
  const getBatteryLevel = async (): Promise<number | undefined> => {
    try {
      if (typeof window !== "undefined" && "getBattery" in navigator) {
        const battery: any = await (navigator as any).getBattery();
        return Math.round(battery.level * 100);
      }
    } catch (e) {
      // Ignorar fallo de API de batería
    }
    return undefined;
  };

  // Ejecutar disparo de alerta
  const handleTriggerAlert = async (tipo: "SOS_PANICO" | "LLEGADA_OK") => {
    if (cooldown > 0 || isSending) return;

    setIsSending(true);
    setActiveAlert(tipo === "SOS_PANICO" ? "SOS" : "LLEGADA");

    // Retroalimentación háptica inmediata en el dispositivo móvil
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      if (tipo === "SOS_PANICO") {
        navigator.vibrate([300, 100, 300, 100, 500]);
      } else {
        navigator.vibrate([150]);
      }
    }

    try {
      const effectiveToken = token || (typeof window !== "undefined" ? localStorage.getItem("alerta_token") : null);

      if (!effectiveToken && !user) {
        setFeedbackMessage({
          type: "ERROR",
          text: "⚠️ Dispositivo no vinculado",
          details: "Para enviar alertas, primero vinculá este celular ingresando el código de tu grupo o abriendo tu enlace de invitación.",
        });
        setIsSending(false);
        setActiveAlert(null);
        return;
      }

      // Captura de GPS concurrente con el envío
      const loc = await getQuickLocation();
      const bateria = await getBatteryLevel();

      const response = await fetch("/api/alertas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          latitud: loc.lat,
          longitud: loc.lng,
          precisionGps: loc.accuracy,
          memberToken: effectiveToken || undefined,
          metadata: {
            bateria,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFeedbackMessage({
          type: "SUCCESS",
          text:
            tipo === "SOS_PANICO"
              ? "🚨 ALERTA SOS EMITIDA CON ÉXITO"
              : "✅ CONFIRMACIÓN ENVIADA",
          details: `Despachada a ${data.destinatariosExito} de ${data.destinatariosTotal} integrantes en Telegram.`,
        });
        setCooldown(5); // 5 segundos de cooldown preventivo
      } else {
        setFeedbackMessage({
          type: "ERROR",
          text: "Error al enviar alerta",
          details: data.error || "No se pudo comunicar con el servidor central.",
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: "ERROR",
        text: "Fallo de conexión",
        details: "Verifique su conexión a Internet o datos móviles.",
      });
    } finally {
      setIsSending(false);
      setActiveAlert(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 py-4 px-2">
      {/* Estado del Sistema y GPS */}
      <div className="w-full flex items-center justify-between bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="text-slate-300 font-medium">
            {user?.ecosistemaNombre ? user.ecosistemaNombre : "Ecosistema Conectado"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin
            className={`w-3.5 h-3.5 ${
              gpsStatus === "READY"
                ? "text-emerald-400"
                : gpsStatus === "LOCATING"
                ? "text-amber-400 animate-spin"
                : "text-slate-500"
            }`}
          />
          <span
            className={`${
              gpsStatus === "READY"
                ? "text-emerald-400"
                : gpsStatus === "LOCATING"
                ? "text-amber-300"
                : "text-slate-400"
            }`}
          >
            {gpsStatus === "READY"
              ? `GPS ±${Math.round(coords?.accuracy || 10)}m`
              : gpsStatus === "LOCATING"
              ? "Buscando GPS..."
              : "GPS Standby"}
          </span>
        </div>
      </div>

      {/* Retroalimentación Visual de Despacho */}
      {feedbackMessage && (
        <div
          className={`w-full p-4 rounded-2xl border text-center animate-fadeIn ${
            feedbackMessage.type === "SUCCESS"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/60 border-red-500/40 text-red-200"
          }`}
        >
          <div className="font-bold text-base">{feedbackMessage.text}</div>
          {feedbackMessage.details && (
            <div className="text-xs opacity-90 mt-1">{feedbackMessage.details}</div>
          )}
        </div>
      )}

      {/* BOTÓN ROJO: SOS / PÁNICO DE EMERGENCIA */}
      <div className="w-full flex flex-col items-center">
        <button
          onClick={() => handleTriggerAlert("SOS_PANICO")}
          disabled={isSending || cooldown > 0}
          className={`relative w-full aspect-[1.7/1] max-h-56 rounded-3xl font-black text-2xl tracking-wider text-white uppercase shadow-2xl transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-2 overflow-hidden border-2 border-red-400/50 ${
            cooldown > 0
              ? "bg-red-950 opacity-60 cursor-not-allowed"
              : isSending && activeAlert === "SOS"
              ? "bg-red-700 animate-pulse"
              : "bg-gradient-to-b from-red-500 via-red-600 to-red-700 glow-sos hover:brightness-110"
          }`}
        >
          {/* Overlay de reflejo táctico */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20 pointer-events-none" />

          {isSending && activeAlert === "SOS" ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-12 h-12 animate-spin text-white" />
              <span className="text-base font-semibold">DESPACHANDO ALERTA...</span>
            </div>
          ) : cooldown > 0 ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl font-bold">ALERTA ENVIADA</span>
              <span className="text-xs font-medium text-red-300">
                Pausa preventiva ({cooldown}s)
              </span>
            </div>
          ) : (
            <>
              <ShieldAlert className="w-14 h-14 text-white drop-shadow-md animate-pulse" />
              <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-extrabold drop-shadow">SOS / PÁNICO</span>
                <span className="text-xs font-bold text-red-100 tracking-widest mt-1 opacity-90">
                  DESPACHO INMEDIATO A TELEGRAM
                </span>
              </div>
            </>
          )}
        </button>
      </div>

      {/* BOTÓN VERDE: LLEGUÉ BIEN */}
      <div className="w-full flex flex-col items-center">
        <button
          onClick={() => handleTriggerAlert("LLEGADA_OK")}
          disabled={isSending || cooldown > 0}
          className={`relative w-full py-5 px-6 rounded-2xl font-bold text-lg text-white shadow-xl transition-all duration-200 active:scale-98 flex items-center justify-center gap-3 border border-emerald-400/40 ${
            cooldown > 0
              ? "bg-emerald-950 opacity-60 cursor-not-allowed"
              : isSending && activeAlert === "LLEGADA"
              ? "bg-emerald-700 animate-pulse"
              : "bg-gradient-to-r from-emerald-600 to-green-600 glow-ok hover:brightness-105"
          }`}
        >
          {isSending && activeAlert === "LLEGADA" ? (
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          ) : (
            <CheckCircle2 className="w-7 h-7 text-white shrink-0" />
          )}
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xl font-extrabold">LLEGUÉ BIEN</span>
            <span className="text-xs text-emerald-100 font-medium opacity-90">
              Aviso seguro con ubicación silenciosa
            </span>
          </div>
        </button>
      </div>

      {/* Información para el usuario final */}
      <div className="text-center text-xs text-slate-400 max-w-xs space-y-1">
        <p className="flex items-center justify-center gap-1.5 text-slate-300">
          <Send className="w-3 h-3 text-blue-400" />
          <span>Las alertas llegan en tiempo real al grupo familiar.</span>
        </p>
      </div>
    </div>
  );
}
