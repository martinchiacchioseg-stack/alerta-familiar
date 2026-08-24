"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  ShieldAlert,
  Building2,
  Users,
  Activity,
  Plus,
  Power,
  Search,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Loader2,
  Send,
  Eye,
  Lock,
} from "lucide-react";

export default function SuperAdminPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [ecosistemas, setEcosistemas] = useState<any[]>([]);
  const [telemetria, setTelemetria] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states for new ecosystem
  const [nombreEco, setNombreEco] = useState("");
  const [tipoEco, setTipoEco] = useState<"FAMILIA" | "COMERCIO">("FAMILIA");
  const [direccion, setDireccion] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [adminNombre, setAdminNombre] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    try {
      const [userRes, ecoRes, telemRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/ecosistemas"),
        fetch("/api/telemetria"),
      ]);

      const userData = await userRes.json();
      const ecoData = await ecoRes.json();
      const telemData = await telemRes.json();

      if (userData.authenticated) setCurrentUser(userData.user);
      if (ecoData.success) setEcosistemas(ecoData.ecosistemas);
      if (telemData.success) setTelemetria(telemData);
    } catch (e) {
      console.error("Error al cargar SuperAdmin:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEcosystem = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/ecosistemas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreEco,
          tipo: tipoEco,
          direccion,
          telefonoContacto,
          adminNombre,
          adminEmail,
          adminPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setNombreEco("");
        setDireccion("");
        setTelefonoContacto("");
        setAdminNombre("");
        setAdminEmail("");
        setAdminPassword("");
        await loadData();
      } else {
        alert(data.error || "Error al crear ecosistema");
      }
    } catch (e) {
      alert("Fallo de conexión");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleState = async (id: string, currentEstado: string) => {
    const nuevoEstado = currentEstado === "ACTIVO" ? "SUSPENDIDO" : "ACTIVO";
    if (!confirm(`¿Confirma cambiar el estado del ecosistema a ${nuevoEstado}?`)) return;

    try {
      const res = await fetch("/api/ecosistemas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });
      const data = await res.json();
      if (data.success) {
        setEcosistemas(
          ecosistemas.map((eco) => (eco.id === id ? { ...eco, estado: nuevoEstado } : eco))
        );
      }
    } catch (e) {
      alert("Error al actualizar estado");
    }
  };

  const filteredEcosystems = ecosistemas.filter(
    (eco) =>
      eco.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eco.usuarios?.some((u: any) => u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-white">
      <Navbar user={currentUser} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Cabecera SuperAdmin */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider block">
                Central de Monitoreo Global
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                SuperAdmin • Alarmas Chascomús
              </h1>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/50 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Ecosistema</span>
          </button>
        </div>

        {/* Tarjetas de Telemetría Global */}
        {telemetria?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-slate-400 text-xs font-medium block">Ecosistemas Activos</span>
              <span className="text-2xl font-black text-white mt-1 block">
                {telemetria.stats.totalEcosistemas}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-slate-400 text-xs font-medium block">Usuarios / Vinculados</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-white">
                  {telemetria.stats.vinculadosTelegram}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  / {telemetria.stats.totalUsuarios} ({telemetria.stats.porcentajeVinculacion}%)
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-slate-400 text-xs font-medium block">Alertas SOS / Llegada</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black text-red-400">
                  {telemetria.stats.alertasSos} SOS
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  {telemetria.stats.alertasLlegada} OK
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-slate-400 text-xs font-medium block">Tasa de Entrega Telegram</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                {telemetria.stats.tasaExito}%
              </span>
            </div>
          </div>
        )}

        {/* Tabla de Ecosistemas */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-red-400" />
              <span>Ecosistemas Registrados ({ecosistemas.length})</span>
            </h2>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nombre o titular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-red-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Ecosistema</th>
                    <th className="pb-3 font-semibold">Tipo</th>
                    <th className="pb-3 font-semibold">Titular</th>
                    <th className="pb-3 font-semibold">Miembros</th>
                    <th className="pb-3 font-semibold">Alertas</th>
                    <th className="pb-3 font-semibold">Estado</th>
                    <th className="pb-3 font-semibold text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEcosystems.map((eco) => {
                    const titular = eco.usuarios?.[0];
                    return (
                      <tr key={eco.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 font-bold text-white">
                          <div>{eco.nombre}</div>
                          {eco.direccion && (
                            <span className="text-[11px] text-slate-500 font-normal">{eco.direccion}</span>
                          )}
                        </td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                            {eco.tipo}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-300">
                          {titular ? (
                            <div>
                              <div className="font-semibold text-white">{titular.nombre}</div>
                              <span className="text-[11px] text-slate-400">{titular.email}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500">Sin titular</span>
                          )}
                        </td>
                        <td className="py-3.5 font-semibold text-slate-200">
                          {eco._count?.usuarios || 0}
                        </td>
                        <td className="py-3.5 font-semibold text-slate-200">
                          {eco._count?.alertas || 0}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              eco.estado === "ACTIVO"
                                ? "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
                                : "bg-red-950 border border-red-500/40 text-red-300"
                            }`}
                          >
                            {eco.estado}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleToggleState(eco.id, eco.estado)}
                            className={`p-1.5 rounded-lg border text-xs transition-colors ${
                              eco.estado === "ACTIVO"
                                ? "border-red-500/30 text-red-400 hover:bg-red-950"
                                : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-950"
                            }`}
                            title={eco.estado === "ACTIVO" ? "Suspender Ecosistema" : "Reactivar"}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Registro de Auditoría de Seguridad */}
        {telemetria?.auditorias && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Registro de Auditoría de Eventos Globales</span>
            </h2>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {telemetria.auditorias.map((aud: any) => (
                <div
                  key={aud.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded">
                      {aud.accion}
                    </span>
                    <span className="text-slate-300 font-medium">{aud.targetTipo}</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">
                    {new Date(aud.createdAt).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de Creación de Ecosistema */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">Alta de Nuevo Ecosistema</h3>

            <form onSubmit={handleCreateEcosystem} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre del Ecosistema
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Familia Rossi / Kiosco Centro"
                    value={nombreEco}
                    onChange={(e) => setNombreEco(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo</label>
                  <select
                    value={tipoEco}
                    onChange={(e: any) => setTipoEco(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="FAMILIA">Familia / Hogar</option>
                    <option value="COMERCIO">Comercio / Negocio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dirección Física (Chascomús)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Av. Costanera España 123"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-200 block mb-2">
                  Cuenta del Administrador Titular
                </span>

                <div className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo del titular"
                    value={adminNombre}
                    onChange={(e) => setAdminNombre(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />

                  <input
                    type="email"
                    required
                    placeholder="correo@titular.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />

                  <input
                    type="password"
                    required
                    placeholder="Contraseña inicial segura"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Crear y Habilitar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
