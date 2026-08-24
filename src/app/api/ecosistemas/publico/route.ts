import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const ecoId = searchParams.get("ecosistemaId") || searchParams.get("ecoId");

    let ecosistema: any = null;
    let miembroActivo: any = null;

    if (token) {
      const miembro = await prisma.usuario.findUnique({
        where: { tokenVinculacion: token },
        include: {
          ecosistema: {
            include: {
              usuarios: {
                where: { activo: true },
                select: {
                  id: true,
                  nombre: true,
                  rol: true,
                  tokenVinculacion: true,
                  telegramChatId: true,
                },
              },
            },
          },
        },
      });

      if (miembro && miembro.ecosistema) {
        ecosistema = miembro.ecosistema;
        miembroActivo = {
          id: miembro.id,
          nombre: miembro.nombre,
          rol: miembro.rol,
          tokenVinculacion: miembro.tokenVinculacion,
          telegramVinculado: Boolean(miembro.telegramChatId),
        };
      }
    } else if (ecoId) {
      ecosistema = await prisma.ecosistema.findUnique({
        where: { id: ecoId },
        include: {
          usuarios: {
            where: { activo: true },
            select: {
              id: true,
              nombre: true,
              rol: true,
              tokenVinculacion: true,
              telegramChatId: true,
            },
          },
        },
      });
    }

    if (!ecosistema) {
      return NextResponse.json({ error: "Ecosistema no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ecosistema: {
        id: ecosistema.id,
        nombre: ecosistema.nombre,
        tipo: ecosistema.tipo,
        estado: ecosistema.estado,
        miembros: ecosistema.usuarios.map((u: any) => ({
          id: u.id,
          nombre: u.nombre,
          rol: u.rol,
          tokenVinculacion: u.tokenVinculacion,
          telegramVinculado: Boolean(u.telegramChatId),
        })),
      },
      miembroActivo,
    });
  } catch (error: any) {
    console.error("Error en endpoint publico:", error);
    return NextResponse.json({ error: "Error al consultar ecosistema", details: error?.message }, { status: 500 });
  }
}
