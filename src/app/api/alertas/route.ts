import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { dispatchAlertToEcosystem } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    const body = await req.json();
    const { tipo, latitud, longitud, precisionGps, metadata, memberToken } = body;

    if (!tipo || !["LLEGADA_OK", "SOS_PANICO"].includes(tipo)) {
      return NextResponse.json({ error: "Tipo de alerta inválido. Debe ser 'LLEGADA_OK' o 'SOS_PANICO'" }, { status: 400 });
    }

    let usuarioId = session?.userId;
    let ecosistemaId = session?.ecosistemaId;
    let usuarioNombre = session?.nombre;

    // Si no hay sesión de cookie, intentar autenticar con memberToken
    if (!usuarioId && memberToken) {
      const miembro = await prisma.usuario.findUnique({
        where: { tokenVinculacion: memberToken },
        include: { ecosistema: true },
      });
      if (miembro && miembro.activo) {
        usuarioId = miembro.id;
        ecosistemaId = miembro.ecosistemaId;
        usuarioNombre = miembro.nombre;
      }
    }

    if (!usuarioId || !ecosistemaId || !usuarioNombre) {
      return NextResponse.json({ error: "No autorizado. Identificación de miembro o sesión requerida." }, { status: 401 });
    }

    // Verificar que el ecosistema esté activo
    const ecosistema = await prisma.ecosistema.findUnique({
      where: { id: ecosistemaId },
    });

    if (!ecosistema || ecosistema.estado === "SUSPENDIDO") {
      return NextResponse.json({ error: "El ecosistema está inactivo o suspendido por la administración." }, { status: 403 });
    }

    const timestamp = new Date();

    // 1. Despacho Concurrente vía Telegram
    const dispatchResult = await dispatchAlertToEcosystem({
      ecosistemaId,
      usuarioNombre,
      tipoAlerta: tipo,
      latitud: typeof latitud === "number" ? latitud : null,
      longitud: typeof longitud === "number" ? longitud : null,
      precisionGps: typeof precisionGps === "number" ? precisionGps : null,
      timestamp,
      metadata,
    });

    let estadoDespacho: "ENVIADO" | "ERROR_PARCIAL" | "FALLIDO" = "ENVIADO";
    if (dispatchResult.totalRecipients > 0) {
      if (dispatchResult.successfulDispatches === 0) {
        estadoDespacho = "FALLIDO";
      } else if (dispatchResult.failedDispatches > 0) {
        estadoDespacho = "ERROR_PARCIAL";
      }
    } else {
      estadoDespacho = "ENVIADO"; // Sin destinatarios vinculados aún, guardado con éxito
    }

    // 2. Persistir Alerta en Base de Datos
    const nuevaAlerta = await prisma.alerta.create({
      data: {
        ecosistemaId,
        usuarioId,
        tipo,
        latitud: typeof latitud === "number" ? latitud : null,
        longitud: typeof longitud === "number" ? longitud : null,
        precisionGps: typeof precisionGps === "number" ? precisionGps : null,
        estadoDespacho,
        destinatariosTotal: dispatchResult.totalRecipients,
        destinatariosExito: dispatchResult.successfulDispatches,
        metadataJson: JSON.stringify({
          ...metadata,
          dispatchDetails: dispatchResult.details,
        }),
      },
    });

    // 3. Auditoría en tiempo real
    await prisma.superAdminAudit.create({
      data: {
        usuarioId,
        accion: tipo === "SOS_PANICO" ? "ALERTA_SOS_DISPARADA" : "ALERTA_LLEGADA_OK_DISPARADA",
        targetTipo: "Alerta",
        targetId: nuevaAlerta.id,
        detallesJson: JSON.stringify({
          ecosistemaId,
          tipo,
          latitud,
          longitud,
          destinatariosTotal: dispatchResult.totalRecipients,
          destinatariosExito: dispatchResult.successfulDispatches,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      alertaId: nuevaAlerta.id,
      tipo: nuevaAlerta.tipo,
      estadoDespacho,
      destinatariosTotal: dispatchResult.totalRecipients,
      destinatariosExito: dispatchResult.successfulDispatches,
      timestamp: nuevaAlerta.createdAt,
      mensaje:
        tipo === "SOS_PANICO"
          ? `Alerta SOS emitida a ${dispatchResult.successfulDispatches} integrante(s) de tu grupo.`
          : `Aviso "Llegué bien" despachado con éxito.`,
    });
  } catch (error: any) {
    console.error("Error al procesar alerta:", error);
    return NextResponse.json({ error: "Error interno al despachar la alerta", details: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") || 50), 100);

    // Multi-Tenant Isolation:
    // Si es SUPERADMIN puede ver todas o filtrar por ecosistemaId query param.
    // Si no es SuperAdmin, está ESTRICTAMENTE limitado a su ecosistemaId.
    let whereClause: any = {};
    if (session.rol === "SUPERADMIN") {
      const filterEco = searchParams.get("ecosistemaId");
      if (filterEco) {
        whereClause.ecosistemaId = filterEco;
      }
    } else {
      if (!session.ecosistemaId) {
        return NextResponse.json({ error: "Usuario sin ecosistema asignado" }, { status: 400 });
      }
      whereClause.ecosistemaId = session.ecosistemaId;
    }

    const alertas = await prisma.alerta.findMany({
      where: whereClause,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
        ecosistema: {
          select: {
            id: true,
            nombre: true,
            tipo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ success: true, count: alertas.length, alertas });
  } catch (error: any) {
    console.error("Error al obtener historial de alertas:", error);
    return NextResponse.json({ error: "Error al recuperar alertas" }, { status: 500 });
  }
}
