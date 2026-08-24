"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Send,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Download,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

export default function VincularPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  const fetchLinkData = async () => {
    try {
      setChecking(true);
      const res = await fetch("/api/vincular");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchLinkData();
    // Polling cada 4 segundos para detectar en tiempo real si el usuario presionó INICIAR en Telegram
    const interval = setInterval(fetchLinkData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = () => {
    if (data?.telegramUrl) {
      navigator.clipboard.writeText(data.telegramUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-white">
      <Navbar user={data?.usuario} />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-6 flex flex-col items-center justify-center">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-4">
          {/* Encabezado */}
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md">
            <Send className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">Vincular con Telegram</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Enlace de un solo toque para recibir alertas de pánico y confirmaciones de llegada de tu grupo familiar.
            </p>
          </div>

          {/* AVISO IMPORTANTE DE REQUISITO DE TELEGRAM */}
          <div className="w-full bg-amber-950/50 border border-amber-500/40 rounded-2xl p-4 text-left text-xs space-y-2 text-amber-200">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>REQUISITO PREVIO INDISPENSABLE:</span>
            </div>
            <p className="text-amber-100/90 leading-relaxed">
              Para <b>recibir</b> las alertas sonoras y mapas de emergencia en tu celular, debés tener una cuenta y la aplicación de <b>Telegram</b> instalada.
            </p>

            <div className="pt-2 border-t border-amber-500/20 flex flex-wrap gap-2">
              <span className="text-[11px] text-amber-300/80 w-full font-medium">
                ¿No tenés Telegram instalado todavía? Descárgalo gratis:
              </span>
              <a
                href="https://play.google.com/store/apps/details?id=org.telegram.messenger"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg text-[11px] font-semibold border border-amber-500/30 transition-colors"
              >
                <Smartphone className="w-3 h-3" />
                <span>Android (Play Store)</span>
              </a>
              <a
                href="https://apps.apple.com/app/telegram-messenger/id686449807"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg text-[11px] font-semibold border border-amber-500/30 transition-colors"
              >
                <Smartphone className="w-3 h-3" />
                <span>iPhone (App Store)</span>
              </a>
            </div>
          </div>

          {loading ? (
            <div className="py-10 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
              <span className="text-xs text-slate-400">Generando enlace seguro para tu usuario...</span>
            </div>
          ) : data ? (
            <div className="w-full flex flex-col items-center gap-4">
              {/* Estado actual de vinculación */}
              <div
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                  data.usuario?.telegramVinculado
                    ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                    : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {data.usuario?.telegramVinculado ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping"></span>
                  )}
                  <span className="font-semibold">
                    {data.usuario?.telegramVinculado
                      ? `¡Vinculado con éxito! (@${data.usuario.telegramUsername || "Chat Activo"})`
                      : "Paso 2: Pulsa abajo para iniciar el Bot"}
                  </span>
                </div>

                <button
                  onClick={fetchLinkData}
                  disabled={checking}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Actualizar estado"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Código QR */}
              {data.qrDataUrl && (
                <div className="bg-white p-3 rounded-2xl shadow-xl border-4 border-slate-800">
                  <img
                    src={data.qrDataUrl}
                    alt="Código QR de Vinculación a Telegram"
                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg"
                  />
                </div>
              )}

              {/* Botón de Apertura Rápida en Telegram */}
              <div className="w-full flex flex-col gap-2">
                <a
                  href={data.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-950/50 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Abrir e Iniciar en Telegram</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 font-medium text-xs rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "¡Enlace copiado al portapapeles!" : "Copiar enlace para enviar por WhatsApp"}</span>
                </button>
              </div>

              {/* Pasos Finales */}
              <div className="w-full text-left bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-200 block">¿Cómo completar la vinculación?</span>
                <p>1. Toca el botón azul de arriba o escanea el QR.</p>
                <p>2. Se abrirá tu aplicación de Telegram: presiona el botón <b>"INICIAR"</b>.</p>
                <p>3. El bot te responderá confirmando que quedaste registrado en tu grupo.</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-xs text-red-400">
              No se pudo cargar la información de vinculación.
            </div>
          )}

          <div className="pt-2">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Volver a la pantalla principal
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
