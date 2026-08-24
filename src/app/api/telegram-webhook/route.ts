import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseTelegramStartPayload, sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // Verificación básica de estructura Telegram Update
    if (!update || !update.message) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const message = update.message;
    const chatId = message.chat?.id;
    const text: string = message.text || "";
    const from = message.from || {};
    const telegramUsername = from.username || from.first_name || null;

    if (!chatId || !text) {
      return NextResponse.json({ ok: true });
    }

    // Comprobar si el mensaje es un comando /start con parámetro de vinculación
    if (text.startsWith("/start")) {
      const parts = text.trim().split(" ");
      const startParam = parts.length > 1 ? parts[1] : "";

      if (startParam.startsWith("bind_")) {
        const parsed = parseTelegramStartPayload(startParam);

        if (!parsed.isValid || !parsed.ecosistemaId || !parsed.usuarioId || !parsed.token) {
          await sendTelegramMessage(
            chatId,
            `⚠️ <b>Código de vinculación inválido o corrupto.</b>\n\nPor favor, genera un nuevo código o enlace QR desde la PWA de Alarmas Chascomús.`,
            { parseMode: "HTML" }
          );
          return NextResponse.json({ ok: true });
        }

        // Buscar el usuario en la base de datos
        const usuario = await prisma.usuario.findFirst({
          where: {
            id: parsed.usuarioId,
            ecosistemaId: parsed.ecosistemaId,
            tokenVinculacion: parsed.token,
            activo: true,
          },
          include: {
            ecosistema: true,
          },
        });

        if (!usuario) {
          await sendTelegramMessage(
            chatId,
            `❌ <b>Error de Autenticación:</b>\n\nNo se encontró una cuenta correspondiente o el token de seguridad ha expirado. Contacta al administrador de tu ecosistema.`,
            { parseMode: "HTML" }
          );
          return NextResponse.json({ ok: true });
        }

        // Actualizar chat_id y username de Telegram en el usuario
        const updatedUser = await prisma.usuario.update({
          where: { id: usuario.id },
          data: {
            telegramChatId: String(chatId),
            telegramUsername: telegramUsername ? String(telegramUsername) : null,
            vinculadoEn: new Date(),
          },
        });

        // Registrar auditoría de vinculación
        await prisma.superAdminAudit.create({
          data: {
            usuarioId: usuario.id,
            accion: "TELEGRAM_VINCULADO",
            targetTipo: "Usuario",
            targetId: usuario.id,
            detallesJson: JSON.stringify({
              ecosistemaId: usuario.ecosistemaId,
              ecosistemaNombre: usuario.ecosistema?.nombre,
              telegramChatId: String(chatId),
              telegramUsername,
            }),
          },
        });

        // Enviar mensaje de confirmación al usuario
        const confirmMsg =
          `🛡️ <b>¡VINCULACIÓN EXITOSA!</b>\n\n` +
          `Hola <b>${usuario.nombre}</b>, tu cuenta de Telegram ha quedado registrada y enlazada de forma segura al ecosistema <b>${usuario.ecosistema?.nombre}</b>.\n\n` +
          `✅ <b>Estado del canal:</b> ACTIVO Y OPERATIVO\n` +
          `📲 Recibirás las alertas de emergencia SOS, botones de pánico y avisos de llegada segura de todos los miembros de tu grupo.\n\n` +
          `<i>Alarmas Chascomús - Sistema de Seguridad y Alerta Familiar</i>`;

        await sendTelegramMessage(chatId, confirmMsg, { parseMode: "HTML" });

        return NextResponse.json({ ok: true, status: "VINCULADO_EXITOSAMENTE" });
      } else {
        // Comando /start genérico
        await sendTelegramMessage(
          chatId,
          `👋 <b>Bot de Notificaciones - Alarmas Chascomús</b>\n\n` +
          `Este bot envía alertas en tiempo real de su grupo familiar o comercial.\n\n` +
          `Para vincular su cuenta, ingrese a la PWA de Alarmas Chascomús en su teléfono y presione en <b>"Vincular Telegram"</b>.`,
          { parseMode: "HTML" }
        );
        return NextResponse.json({ ok: true });
      }
    }

    // Respuesta a mensajes no reconocidos
    if (text.startsWith("/ayuda") || text.startsWith("/help")) {
      await sendTelegramMessage(
        chatId,
        `ℹ️ <b>Centro de Ayuda - Alarmas Chascomús</b>\n\n` +
        `• <b>Alertas SOS:</b> Se envían con máxima prioridad sonora y mapa GPS cuando un integrante presiona el botón rojo en la PWA.\n` +
        `• <b>Llegué bien:</b> Notificación discreta con ubicación de arribo seguro.\n` +
        `• Si necesita soporte técnico, comuníquese con su administrador de Alarmas Chascomús.`,
        { parseMode: "HTML" }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error en Telegram Webhook:", error);
    return NextResponse.json({ ok: true, error: error.message });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "Alarmas Chascomús Telegram Webhook Serverless Handler",
    timestamp: new Date().toISOString(),
  });
}
