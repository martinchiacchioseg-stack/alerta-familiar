"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, CheckCircle2, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

function UnirseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function bindDevice() {
      if (!token) {
        setErrorMsg("Enlace de vinculación incompleto o inválido.");
        setLoading(false);
        return;
      }

      try {
        // Iniciar sesión con el token de miembro para fijar cookie de sesión
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberToken: token }),
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok || !loginData.success) {
          setErrorMsg(loginData.error || "Código o token no reconocido.");
          setLoading(false);
          return;
        }

        // Guardar en localStorage para recordar permanentemente este dispositivo
        localStorage.setItem("alerta_token", token);
        localStorage.setItem("alerta_usuario_id", loginData.user.id);
        localStorage.setItem("alerta_usuario_nombre", loginData.user.nombre);
        localStorage.setItem("alerta_ecosistema_id", loginData.user.ecosistemaId);
        localStorage.setItem("alerta_ecosistema_nombre", loginData.user.ecosistemaNombre || "");

        setSuccessData(loginData.user);
        setLoading(false);

        // Redirección automática en 2 segundos
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 2200);
      } catch (err: any) {
        setErrorMsg("Error de conexión al vincular el dispositivo.");
        setLoading(false);
      }
    }

    bindDevice();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Logo */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-950/50 mb-4">
          <Shield className="w-7 h-7 text-white" />
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <h2 className="text-base font-bold text-white">Vinculando dispositivo...</h2>
            <p className="text-xs text-slate-400">
              Configurando el acceso directo para tu grupo familiar.
            </p>
          </div>
        ) : successData ? (
          <div className="py-4 flex flex-col items-center gap-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-white">¡Dispositivo Vinculado!</h2>
              <p className="text-xs text-slate-300">
                Bienvenido/a <b>{successData.nombre}</b> al ecosistema{" "}
                <b className="text-emerald-400">{successData.ecosistemaNombre}</b>.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-400 text-left w-full space-y-1">
              <span className="font-semibold text-slate-200 block">Acceso Directo Activado:</span>
              <p>✅ La aplicación ya no te pedirá contraseñas.</p>
              <p>✅ Podrás emitir alertas de emergencia SOS con 1 solo toque.</p>
            </div>

            <Link
              href="/"
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Ir a la Pantalla de Alertas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-base font-bold text-white">No se pudo vincular</h2>
            <p className="text-xs text-red-300">{errorMsg}</p>

            <Link
              href="/login"
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
            >
              Ingresar manualmente
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnirsePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      }
    >
      <UnirseContent />
    </Suspense>
  );
}
