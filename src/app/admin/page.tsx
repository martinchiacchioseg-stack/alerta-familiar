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

  // Estados para gestionar miembros de un ecosistema específico desde SuperAdmin
  const [selectedEcoForMembers, setSelectedEcoForMembers] = useState<any>(null);
  const [ecoMembers, setEcoMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"MIEMBRO" | "ADMIN_ECOSISTEMA">("MIEMBRO");
  const [creatingMember, setCreatingMember] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

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

  const openMembersModal = async (eco: any) => {
    setSelectedEcoForMembers(eco);
    setLoadingMembers(true);
    try {
      const res = await fetch(`/api/miembros?ecosistemaId=${eco.id}`);
      const data = await res.json();
      if (data.success) {
        setEcoMembers(data.miembros);
      }
    } catch (e) {
      console.error("Error al cargar miembros del ecosistema:", e);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAddMemberToEco = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEcoForMembers) return;
    setCreatingMember(true);
    try {
      const res = await fetch("/api/miembros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ecosistemaId: selectedEcoForMembers.id,
          nombre: newMemberName,
          telefono: newMemberPhone,
          rol: newMemberRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewMemberName("");
        setNewMemberPhone("");
        setShowAddMemberModal(false);
        await openMembersModal(selectedEcoForMembers);
        await loadData();
      } else {
        alert(data.error || "Error al agregar integrante");
      }
    } catch (err) {
      alert("Error al comunicar con el servidor");
    } finally {
      setCreatingMember(false);
    }
  };

  const handleDeleteMemberFromEco = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar al integrante "${nombre}" del ecosistema?`)) return;
    try {
      const res = await fetch(`/api/miembros?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setEcoMembers(ecoMembers.filter((m) => m.id !== id));
        await loadData();
      }
    } catch (e) {
      alert("Error al eliminar integrante");
    }
  };

  const filteredEcosystems = ecosistemas.filter(
    (eco) =>
      eco.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eco.usuarios?.some((u: any) => u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!loading && currentUser?.rol !== "SUPERADMIN") {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-white">
        <Navbar user={currentUser} />

        <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Consola Restringida</h2>
              <p className="text-xs text-slate-400 mt-1">
                Actualmente tu navegador tiene abierta la sesión de tu grupo familiar (<b>{currentUser?.nombre || "Miembro"}</b>).
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 text-left space-y-1">
              <span className="font-semibold text-slate-200 block">¿Querés gestionar tus integrantes?</span>
              <p>Podés hacerlo directamente desde el <b>Panel de tu Familia</b> sin necesidad de salir.</p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href="/panel"
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/50 flex items-center justify-center gap-1.5 transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Ir al Panel de mi Familia</span>
              </a>

              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  localStorage.removeItem("alerta_token");
                  window.location.href = "/login";
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all"
              >
                Cerrar sesión y entrar como SuperAdmin
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openMembersModal(eco)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              title="Gestionar Integrantes"
                            >
                              <Users className="w-3.5 h-3.5 text-blue-400" />
                              <span>Integrantes</span>
                            </button>

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
                          </div>
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
      {/* Modal de Gestión de Miembros del Ecosistema */}
      {selectedEcoForMembers && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider block">
                  Gestión de Integrantes
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedEcoForMembers.nombre}
                </h3>
              </div>

              <button
                onClick={() => setSelectedEcoForMembers(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Lista de Miembros */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Integrantes Registrados ({ecoMembers.length})
                </span>

                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-red-950/40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Agregar Integrante</span>
                </button>
              </div>

              {loadingMembers ? (
                <div className="py-6 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                </div>
              ) : ecoMembers.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                  No hay integrantes en este ecosistema.
                </div>
              ) : (
                <div className="space-y-2">
                  {ecoMembers.map((m) => {
                    const inviteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/unirse?token=${m.tokenVinculacion}`;
                    return (
                      <div
                        key={m.id}
                        className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{m.nombre}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                m.rol === "ADMIN_ECOSISTEMA"
                                  ? "bg-red-950/80 text-red-300 border border-red-500/30"
                                  : "bg-slate-800 text-slate-300"
                              }`}
                            >
                              {m.rol === "ADMIN_ECOSISTEMA" ? "TITULAR" : "MIEMBRO"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                            {m.email && <span>📧 {m.email}</span>}
                            {m.telefono && <span>📞 {m.telefono}</span>}
                            <span>
                              {m.telegramChatId ? (
                                <span className="text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Telegram Conectado (@{m.telegramUsername || "Chat"})</span>
                                </span>
                              ) : (
                                <span className="text-amber-400 font-medium">
                                  ⏳ Telegram No Vinculado
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Botón para copiar enlace de unirse */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(inviteUrl);
                              setCopiedToken(m.tokenVinculacion);
                              setTimeout(() => setCopiedToken(null), 2500);
                            }}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
                            title="Copiar enlace de invitación para este celular"
                          >
                            <span>{copiedToken === m.tokenVinculacion ? "✅ ¡Copiado!" : "📋 Copiar Enlace"}</span>
                          </button>

                          {/* Botón eliminar */}
                          <button
                            onClick={() => handleDeleteMemberFromEco(m.id, m.nombre)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/60 rounded-lg border border-red-500/30 transition-colors"
                            title="Eliminar este integrante"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Anidado para Crear Nuevo Integrante */}
            {showAddMemberModal && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Nuevo Integrante para {selectedEcoForMembers.nombre}
                  </span>
                  <button
                    onClick={() => setShowAddMemberModal(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddMemberToEco} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Lucas / Mamá / Abuelo"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Teléfono Móvil (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: +54 9 2241 123456"
                        value={newMemberPhone}
                        onChange={(e) => setNewMemberPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddMemberModal(false)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={creatingMember}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      {creatingMember && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Guardar Integrante</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
