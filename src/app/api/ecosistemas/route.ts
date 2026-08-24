import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, hashPassword } from "@/lib/auth";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["SUPERADMIN"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const ecosistemas = await prisma.ecosistema.findMany({
      include: {
        _count: {
          select: {
            usuarios: true,
            alertas: true,
          },
        },
        usuarios: {
          where: { rol: "ADMIN_ECOSISTEMA" },
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
            telegramChatId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, ecosistemas });
  } catch (error: any) {
    console.error("Error al listar ecosistemas:", error);
    return NextResponse.json({ error: "Error al listar ecosistemas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["SUPERADMIN"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { nombre, tipo, direccion, telefonoContacto, notas, adminNombre, adminEmail, adminPassword } = body;

    if (!nombre || !adminNombre || !adminEmail || !adminPassword) {
      return NextResponse.json({ error: "Nombre de ecosistema, nombre, email y contraseña del administrador titular son obligatorios." }, { status: 400 });
    }

    const emailExistente = await prisma.usuario.findUnique({
      where: { email: adminEmail.toLowerCase().trim() },
    });

    if (emailExistente) {
      return NextResponse.json({ error: "El correo electrónico del administrador ya está registrado." }, { status: 409 });
    }

    const hashedPassword = await hashPassword(adminPassword);
    const tokenVinculacion = crypto.randomBytes(16).toString("hex");

    // Crear Ecosistema y Usuario Titular en una sola transacción
    const resultado = await prisma.$transaction(async (tx) => {
      const eco = await tx.ecosistema.create({
        data: {
          nombre: nombre.trim(),
          tipo: tipo === "COMERCIO" ? "COMERCIO" : "FAMILIA",
          direccion: direccion?.trim() || null,
          telefonoContacto: telefonoContacto?.trim() || null,
          notas: notas?.trim() || null,
        },
      });

      const adminUser = await tx.usuario.create({
        data: {
          ecosistemaId: eco.id,
          nombre: adminNombre.trim(),
          email: adminEmail.toLowerCase().trim(),
          passwordHash: hashedPassword,
          rol: "ADMIN_ECOSISTEMA",
          tokenVinculacion,
        },
      });

      await tx.superAdminAudit.create({
        data: {
          usuarioId: auth.session.userId,
          accion: "ECOSISTEMA_CREADO",
          targetTipo: "Ecosistema",
          targetId: eco.id,
          detallesJson: JSON.stringify({
            ecosistemaNombre: eco.nombre,
            tipo: eco.tipo,
            adminEmail: adminUser.email,
          }),
        },
      });

      return { ecosistema: eco, admin: adminUser };
    });

    return NextResponse.json({
      success: true,
      ecosistema: resultado.ecosistema,
      admin: {
        id: resultado.admin.id,
        nombre: resultado.admin.nombre,
        email: resultado.admin.email,
        rol: resultado.admin.rol,
      },
    });
  } catch (error: any) {
    console.error("Error al crear ecosistema:", error);
    return NextResponse.json({ error: "Error al crear ecosistema: " + error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, ["SUPERADMIN"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id, estado, nombre, tipo, direccion } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID de ecosistema requerido" }, { status: 400 });
    }

    const updated = await prisma.ecosistema.update({
      where: { id },
      data: {
        ...(estado ? { estado } : {}),
        ...(nombre ? { nombre } : {}),
        ...(tipo ? { tipo } : {}),
        ...(direccion !== undefined ? { direccion } : {}),
      },
    });

    await prisma.superAdminAudit.create({
      data: {
        usuarioId: auth.session.userId,
        accion: estado === "SUSPENDIDO" ? "ECOSISTEMA_SUSPENDIDO" : "ECOSISTEMA_ACTUALIZADO",
        targetTipo: "Ecosistema",
        targetId: id,
        detallesJson: JSON.stringify({ nuevoEstado: estado, nombre }),
      },
    });

    return NextResponse.json({ success: true, ecosistema: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar ecosistema" }, { status: 500 });
  }
}
