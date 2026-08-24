"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, KeyRound, Mail, Loader2, ArrowRight, UserCheck, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ADMIN" | "TOKEN">("ADMIN");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [memberToken, setMemberToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = activeTab === "ADMIN" ? { email, password } : { memberToken };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Credenciales incorrectas");
        return;
      }

      if (data.user.rol === "SUPERADMIN") {
        router.push("/admin");
      } else if (data.user.rol === "ADMIN_ECOSISTEMA") {
        router.push("/panel");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg("Fallo al conectar con el servidor central.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Cabecera */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-900/50 mb-3">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">Alarmas Chascomús</h1>
          <p className="text-xs text-slate-400 mt-1">Plataforma de Seguridad y Alerta Familiar</p>
        </div>

        {/* Tabs de selección de acceso */}
        <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab("ADMIN");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "ADMIN"
                ? "bg-red-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Administración / Titular
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("TOKEN");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "TOKEN"
                ? "bg-red-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Token de Integrante
          </button>
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-red-200 text-xs text-center font-medium animate-fadeIn">
            {errorMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "ADMIN" ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="titular@familia.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contraseña de Seguridad
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Código o Token de Vinculación
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={memberToken}
                  onChange={(e) => setMemberToken(e.target.value)}
                  placeholder="Ingrese el token proporcionado por su titular"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Puede solicitar este token al administrador de su ecosistema familiar o comercial.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 mt-2 active:scale-98"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Ingresar al Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Volver a la pantalla de Alertas
          </Link>
        </div>
      </div>
    </div>
  );
}
