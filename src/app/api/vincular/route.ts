import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const memberToken = searchParams.get("token");

    let usuario: any = null;

    if (userId) {
      usuario = await prisma.usuario.findUnique({
        where: { id: userId },
        include: { ecosistema: true },
      });
    } else if (memberToken) {
      usuario = await prisma.usuario.findUnique({
        where: { tokenVinculacion: memberToken },
        include: { ecosistema: true },
      });
    } else {
      const session = getSessionFromRequest(req);
      if (session?.userId && session.rol !== "SUPERADMIN") {
        usuario = await prisma.usuario.findUnique({
          where: { id: session.userId },
          include: { ecosistema: true },
        });
      }
    }

    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const botUsername = process.env.TELEGRAM_BOT_USERNAME || "AlarmasChascomusBot";
    // Formato estricto: bind_<ECOSISTEMA_ID>_<USER_ID>_<HASH_SEGURIDAD>
    const deepLinkParam = `bind_${usuario.ecosistemaId}_${usuario.id}_${usuario.tokenVinculacion}`;
    const telegramUrl = `https://t.me/${botUsername}?start=${deepLinkParam}`;

    // Generar imagen QR en Base64
    const qrDataUrl = await QRCode.toDataURL(telegramUrl, {
      margin: 2,
      width: 320,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        ecosistemaNombre: usuario.ecosistema?.nombre,
        telegramVinculado: Boolean(usuario.telegramChatId),
        telegramUsername: usuario.telegramUsername,
        vinculadoEn: usuario.vinculadoEn,
      },
      deepLinkParam,
      telegramUrl,
      qrDataUrl,
      botUsername,
    });
  } catch (error: any) {
    console.error("Error al generar enlace de vinculación:", error);
    return NextResponse.json({ error: "Error al generar enlace de vinculación: " + error.message }, { status: 500 });
  }
}
