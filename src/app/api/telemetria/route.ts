import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["SUPERADMIN", "ADMIN_ECOSISTEMA"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const isSuperAdmin = auth.session.rol === "SUPERADMIN";
    const ecosistemaId = auth.session.ecosistemaId;

    if (isSuperAdmin) {
      const [totalEcosistemas, totalUsuarios, totalAlertas, alertasRecientes, auditorias] = await Promise.all([
        prisma.ecosistema.count(),
        prisma.usuario.count({ where: { rol: { not: "SUPERADMIN" } } }),
        prisma.alerta.count(),
        prisma.alerta.findMany({
          take: 15,
          orderBy: { createdAt: "desc" },
          include: {
            usuario: { select: { nombre: true } },
            ecosistema: { select: { nombre: true, tipo: true } },
          },
        }),
        prisma.superAdminAudit.findMany({
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            usuario: { select: { nombre: true, email: true } },
          },
        }),
      ]);

      const vinculadosTelegram = await prisma.usuario.count({
        where: { telegramChatId: { not: null }, rol: { not: "SUPERADMIN" } },
      });

      const alertasSos = await prisma.alerta.count({ where: { tipo: "SOS_PANICO" } });
      const alertasLlegada = await prisma.alerta.count({ where: { tipo: "LLEGADA_OK" } });
      const alertasExitosas = await prisma.alerta.count({ where: { estadoDespacho: "ENVIADO" } });
      const tasaExito = totalAlertas > 0 ? ((alertasExitosas / totalAlertas) * 100).toFixed(1) : "100.0";

      return NextResponse.json({
        success: true,
        stats: {
          totalEcosistemas,
          totalUsuarios,
          vinculadosTelegram,
          porcentajeVinculacion: totalUsuarios > 0 ? ((vinculadosTelegram / totalUsuarios) * 100).toFixed(1) : "0",
          totalAlertas,
          alertasSos,
          alertasLlegada,
          tasaExito,
        },
        alertasRecientes,
        auditorias,
      });
    } else {
      // Admin de Ecosistema
      if (!ecosistemaId) {
        return NextResponse.json({ error: "Usuario sin ecosistema asignado" }, { status: 400 });
      }

      const [miembrosTotal, miembrosVinculados, alertasTotal, alertasRecientes] = await Promise.all([
        prisma.usuario.count({ where: { ecosistemaId } }),
        prisma.usuario.count({ where: { ecosistemaId, telegramChatId: { not: null } } }),
        prisma.alerta.count({ where: { ecosistemaId } }),
        prisma.alerta.findMany({
          where: { ecosistemaId },
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            usuario: { select: { nombre: true } },
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        stats: {
          miembrosTotal,
          miembrosVinculados,
          alertasTotal,
        },
        alertasRecientes,
      });
    }
  } catch (error: any) {
    console.error("Error en telemetría:", error);
    return NextResponse.json({ error: "Error al recuperar telemetría" }, { status: 500 });
  }
}
