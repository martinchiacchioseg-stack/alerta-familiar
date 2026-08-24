import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    if (session.rol === "SUPERADMIN") {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.userId,
          nombre: session.nombre,
          email: session.email,
          rol: session.rol,
          ecosistemaNombre: "Central Global Alarmas Chascomús",
        },
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: session.userId },
      include: {
        ecosistema: {
          select: {
            id: true,
            nombre: true,
            tipo: true,
            estado: true,
          },
        },
      },
    });

    if (!usuario) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
        ecosistemaId: usuario.ecosistemaId,
        ecosistema: usuario.ecosistema,
        telegramChatId: usuario.telegramChatId,
        telegramUsername: usuario.telegramUsername,
        telegramVinculado: Boolean(usuario.telegramChatId),
        tokenVinculacion: usuario.tokenVinculacion,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: "Error al verificar sesión" }, { status: 500 });
  }
}
