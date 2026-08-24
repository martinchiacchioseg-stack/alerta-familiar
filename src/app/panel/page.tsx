"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Users,
  UserPlus,
  Send,
  Trash2,
  CheckCircle2,
  Clock,
  Shield,
  Loader2,
  QrCode,
  Copy,
  Check,
  AlertTriangle,
  History,
  Radio,
} from "lucide-react";

export default function PanelEcosistemaPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [miembros, setMiembros] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMemberQR, setSelectedMemberQR] = useState<any>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // New member form
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [nuevoRol, setNuevoRol] = useState<"MIEMBRO" | "ADMIN_ECOSISTEMA">("MIEMBRO");
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    try {
      const [userRes, miembrosRes, alertasRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/miembros"),
        fetch("/api/alertas?limit=20"),
      ]);

      const userData = await userRes.json();
      const miembrosData = await miembrosRes.json();
      const alertasData = await alertasRes.json();

      if (userData.authenticated) setCurrentUser(userData.user);
      if (miembrosData.success) setMiembros(miembrosData.miembros);
      if (alertasData.success) setAlertas(alertasData.alertas);
    } catch (e) {
      console.error("Error al cargar panel:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/miembros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevoNombre,
          telefono: nuevoTelefono,
          rol: nuevoRol,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNuevoNombre("");
        setNuevoTelefono("");
        setShowAddModal(false);
        await loadData();
      } else {
        alert(data.error || "Error al agregar integrante");
      }
    } catch (err) {
      alert("Error al comunicar con el servidor");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteMember = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar al integrante "${nombre}" del ecosistema?`)) return;
    try {
      const res = await fetch(`/api/miembros?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMiembros(miembros.filter((m) => m.id !== id));
      }
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  const handleShowQR = async (miembro: any) => {
    try {
      const res = await fetch(`/api/vincular?userId=${miembro.id}`);
      const json = await res.json();
      if (json.success) {
        setSelectedMemberQR(json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-white">
      <Navbar user={currentUser} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Cabecera del Ecosistema */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                Panel de Administración Titular
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {currentUser?.ecosistema?.nombre || "Ecosistema Familiar / Comercial"}
              </h1>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950/50 transition-all active:scale-98"
          >
            <UserPlus className="w-4 h-4" />
            <span>Agregar Integrante</span>
          </button>
        </div>

        {/* Sección: Integrantes y Estado de Vinculación */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Integrantes del Grupo ({miembros.length})</span>
            </h2>
            <span className="text-xs text-slate-400">
              {miembros.filter((m) => m.telegramChatId).length} de {miembros.length} vinculados a Telegram
            </span>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : miembros.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No hay integrantes registrados en este ecosistema.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {miembros.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-inner"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200">
                        {m.nombre.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{m.nombre}</span>
                          {m.rol === "ADMIN_ECOSISTEMA" && (
                            <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-semibold">
                              Titular
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 block">{m.telefono || m.email || "Sin contacto"}</span>
                      </div>
                    </div>

                    {/* Estado de Telegram */}
                    <div className="shrink-0">
                      {m.telegramChatId ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-2 py-1 rounded-lg">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Telegram Activo</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-950 border border-amber-500/40 text-amber-300 px-2 py-1 rounded-lg">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>No Vinculado</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones de Miembro */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShowQR(m)}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Ver QR Telegram</span>
                      </button>

                      <button
                        onClick={() => handleCopy(m.tokenVinculacion, m.id)}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Copiar token de acceso"
                      >
                        {copiedToken === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedToken === m.id ? "Copiado" : "Token"}</span>
                      </button>
                    </div>

                    {m.id !== currentUser?.id && (
                      <button
                        onClick={() => handleDeleteMember(m.id, m.nombre)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Eliminar integrante"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección: Historial de Alertas del Grupo */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-red-400" />
            <span>Historial Reciente de Alertas</span>
          </h2>

          {alertas.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No se han emitido alertas recientemente en este ecosistema.
            </div>
          ) : (
            <div className="space-y-2">
              {alertas.map((a) => (
                <div
                  key={a.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-md font-bold text-[10px] ${
                        a.tipo === "SOS_PANICO"
                          ? "bg-red-600/20 text-red-400 border border-red-500/30"
                          : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {a.tipo === "SOS_PANICO" ? "🚨 SOS PÁNICO" : "✅ LLEGUÉ BIEN"}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-200">{a.usuario?.nombre}</span>
                      <span className="text-slate-500 text-[11px] block">
                        {new Date(a.createdAt).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block font-medium">
                      Despachado: {a.destinatariosExito}/{a.destinatariosTotal}
                    </span>
                    {a.latitud && a.longitud && (
                      <a
                        href={`https://www.google.com/maps?q=${a.latitud},${a.longitud}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-[11px]"
                      >
                        Ver Mapa
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal para Agregar Integrante */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Agregar Nuevo Integrante</h3>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej: Sofía Martínez"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono (Opcional)</label>
                <input
                  type="tel"
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  placeholder="+54 9 2241 123456"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Rol</label>
                <select
                  value={nuevoRol}
                  onChange={(e: any) => setNuevoRol(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="MIEMBRO">Miembro de Grupo</option>
                  <option value="ADMIN_ECOSISTEMA">Administrador / Co-Titular</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal QR de Integrante */}
      {selectedMemberQR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-4">
            <h3 className="text-base font-bold text-white">
              Vincular a {selectedMemberQR.usuario?.nombre}
            </h3>
            <p className="text-xs text-slate-400">
              Escanee este código con la cámara del celular del integrante o envíele el enlace directo de Telegram.
            </p>

            <div className="bg-white p-3 rounded-2xl border-4 border-slate-800 shadow-lg">
              <img
                src={selectedMemberQR.qrDataUrl}
                alt="QR Telegram"
                className="w-48 h-48 rounded-lg"
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <a
                href={selectedMemberQR.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Abrir Telegram</span>
              </a>

              <button
                onClick={() => setSelectedMemberQR(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
