"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Shield, Send, Users, LayoutDashboard, LogOut, LogIn, AlertCircle } from "lucide-react";

interface NavbarProps {
  user?: {
    id: string;
    nombre: string;
    rol: string;
    ecosistemaNombre?: string;
    telegramVinculado?: boolean;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Marca */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-tight">
              Alarmas Chascomús
            </span>
            <span className="text-[11px] font-medium text-red-400 block tracking-wider uppercase">
              Alerta Familiar
            </span>
          </div>
        </Link>

        {/* Acciones de Navegación */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {user.rol === "SUPERADMIN" ? (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pathname === "/admin"
                      ? "bg-red-600/20 text-red-400 border border-red-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">SuperAdmin</span>
                </Link>
              ) : (
                <Link
                  href="/panel"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pathname === "/panel"
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Mi Ecosistema</span>
                </Link>
              )}

              {user.rol !== "SUPERADMIN" && (
                <Link
                  href="/vincular"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    user.telegramVinculado
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
                  }`}
                  title={user.telegramVinculado ? "Telegram Sincronizado" : "Telegram Pendiente de Vinculación"}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">
                    {user.telegramVinculado ? "Telegram OK" : "Vincular Telegram"}
                  </span>
                  {!user.telegramVinculado && (
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
                </Link>
              )}

              {/* Botón Salir */}
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Acceder</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
