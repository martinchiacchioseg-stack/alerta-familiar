import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["SUPERADMIN", "ADMIN_ECOSISTEMA", "MIEMBRO"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    let targetEcoId = auth.session.ecosistemaId;

    if (auth.session.rol === "SUPERADMIN") {
      const paramEco = searchParams.get("ecosistemaId");
      if (paramEco) targetEcoId = paramEco;
    }

    if (!targetEcoId && auth.session.rol !== "SUPERADMIN") {
      return NextResponse.json({ error: "No pertenece a ningún ecosistema" }, { status: 400 });
    }

    const whereClause = targetEcoId ? { ecosistemaId: targetEcoId } : {};

    const miembros = await prisma.usuario.findMany({
      where: whereClause,
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        telegramChatId: true,
        telegramUsername: true,
        tokenVinculacion: true,
        vinculadoEn: true,
        activo: true,
        createdAt: true,
        ecosistema: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: [{ rol: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ success: true, miembros });
  } catch (error: any) {
    console.error("Error al listar miembros:", error);
    return NextResponse.json({ error: "Error al listar miembros" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["SUPERADMIN", "ADMIN_ECOSISTEMA"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { nombre, telefono, email, rol, ecosistemaId } = body;

    if (!nombre) {
      return NextResponse.json({ error: "El nombre del integrante es obligatorio" }, { status: 400 });
    }

    const targetEcoId = auth.session.rol === "SUPERADMIN" && ecosistemaId ? ecosistemaId : auth.session.ecosistemaId;

    if (!targetEcoId) {
      return NextResponse.json({ error: "Ecosistema no especificado" }, { status: 400 });
    }

    // Token criptográfico seguro para deep link de Telegram
    const tokenVinculacion = crypto.randomBytes(16).toString("hex");

    const nuevoMiembro = await prisma.usuario.create({
      data: {
        ecosistemaId: targetEcoId,
        nombre: nombre.trim(),
        telefono: telefono?.trim() || null,
        email: email ? email.toLowerCase().trim() : null,
        rol: rol === "ADMIN_ECOSISTEMA" ? "ADMIN_ECOSISTEMA" : "MIEMBRO",
        tokenVinculacion,
      },
    });

    await prisma.superAdminAudit.create({
      data: {
        usuarioId: auth.session.userId,
        accion: "MIEMBRO_CREADO",
        targetTipo: "Usuario",
        targetId: nuevoMiembro.id,
        detallesJson: JSON.stringify({
          nombre: nuevoMiembro.nombre,
          rol: nuevoMiembro.rol,
          ecosistemaId: targetEcoId,
        }),
      },
    });

    return NextResponse.json({ success: true, miembro: nuevoMiembro });
  } catch (error: any) {
    console.error("Error al agregar miembro:", error);
    return NextResponse.json({ error: "Error al agregar miembro: " + error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req, ["SUPERADMIN", "ADMIN_ECOSISTEMA"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de integrante requerido" }, { status: 400 });
    }

    // Aislamiento Multi-Tenant:
    // Si no es SuperAdmin, verificar que el miembro pertenezca a su propio ecosistema
    const targetUser = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Integrante no encontrado" }, { status: 404 });
    }

    if (auth.session.rol !== "SUPERADMIN" && targetUser.ecosistemaId !== auth.session.ecosistemaId) {
      return NextResponse.json({ error: "No tiene permisos para modificar integrantes de otro ecosistema" }, { status: 403 });
    }

    await prisma.usuario.delete({
      where: { id },
    });

    await prisma.superAdminAudit.create({
      data: {
        usuarioId: auth.session.userId,
        accion: "MIEMBRO_ELIMINADO",
        targetTipo: "Usuario",
        targetId: id,
        detallesJson: JSON.stringify({
          nombre: targetUser.nombre,
          ecosistemaId: targetUser.ecosistemaId,
        }),
      },
    });

    return NextResponse.json({ success: true, message: "Integrante eliminado con éxito" });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al eliminar integrante" }, { status: 500 });
  }
}
