import prisma from "./prisma";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface SendMessageOptions {
  parseMode?: "HTML" | "MarkdownV2" | "Markdown";
  disableNotification?: boolean;
  replyMarkup?: any;
}

/**
 * Enviar mensaje de texto a un chat_id de Telegram
 */
export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  options: SendMessageOptions = {}
): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === "demo_token_for_development") {
    console.log(`[TELEGRAM MOCK] Message to ${chatId}: ${text}`);
    return { success: true, data: { mock: true, chatId, text } };
  }

  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options.parseMode || "HTML",
        disable_notification: options.disableNotification ?? false,
        reply_markup: options.replyMarkup,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      return { success: false, error: data.description || "Error al enviar mensaje a Telegram" };
    }
    return { success: true, data: data.result };
  } catch (error: any) {
    return { success: false, error: error.message || "Fallo de conexión con Telegram API" };
  }
}

/**
 * Enviar tarjeta nativa de geolocalización a Telegram
 */
export async function sendTelegramLocation(
  chatId: string | number,
  latitude: number,
  longitude: number,
  options: { disableNotification?: boolean } = {}
): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === "demo_token_for_development") {
    console.log(`[TELEGRAM MOCK] Location to ${chatId}: [${latitude}, ${longitude}]`);
    return { success: true, data: { mock: true, chatId, latitude, longitude } };
  }

  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/sendLocation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        latitude,
        longitude,
        disable_notification: options.disableNotification ?? false,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      return { success: false, error: data.description || "Error al enviar ubicación a Telegram" };
    }
    return { success: true, data: data.result };
  } catch (error: any) {
    return { success: false, error: error.message || "Fallo al enviar ubicación con Telegram API" };
  }
}

/**
 * Parsea el payload del comando /start bind_<ECOSISTEMA_ID>_<USER_ID>_<TOKEN>
 */
export function parseTelegramStartPayload(payload: string): {
  isValid: boolean;
  ecosistemaId?: string;
  usuarioId?: string;
  token?: string;
} {
  if (!payload || !payload.startsWith("bind_")) {
    return { isValid: false };
  }

  const parts = payload.split("_");
  // Esperado: ["bind", "<ecosistemaId>", "<usuarioId>", "<token>"]
  if (parts.length < 4) {
    return { isValid: false };
  }

  return {
    isValid: true,
    ecosistemaId: parts[1],
    usuarioId: parts[2],
    token: parts.slice(3).join("_"), // Reconstruir en caso de que el token contenga guiones bajos
  };
}

export interface DispatchResult {
  totalRecipients: number;
  successfulDispatches: number;
  failedDispatches: number;
  details: Array<{ chatId: string; usuarioNombre: string; success: boolean; error?: string }>;
}

/**
 * Despacho Concurrente de Alertas a todos los miembros con Telegram vinculado en el Ecosistema
 */
export async function dispatchAlertToEcosystem(params: {
  ecosistemaId: string;
  usuarioNombre: string;
  tipoAlerta: "LLEGADA_OK" | "SOS_PANICO";
  latitud?: number | null;
  longitud?: number | null;
  precisionGps?: number | null;
  timestamp: Date;
  metadata?: any;
}): Promise<DispatchResult> {
  const { ecosistemaId, usuarioNombre, tipoAlerta, latitud, longitud, precisionGps, timestamp, metadata } = params;

  // 1. Obtener todos los miembros activos del ecosistema con chat_id registrado
  const miembros = await prisma.usuario.findMany({
    where: {
      ecosistemaId,
      activo: true,
      telegramChatId: { not: null },
    },
    select: {
      id: true,
      nombre: true,
      telegramChatId: true,
    },
  });

  const isSOS = tipoAlerta === "SOS_PANICO";
  const disableNotification = !isSOS; // SOS es prioritario (con sonido/alerta), Llegada OK es discreta

  const formattedTime = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(timestamp);

  // Construir mapa URL
  let mapsUrl = "";
  let osmUrl = "";
  if (latitud && longitud) {
    mapsUrl = `https://www.google.com/maps?q=${latitud},${longitud}`;
    osmUrl = `https://www.openstreetmap.org/?mlat=${latitud}&mlon=${longitud}#map=17/${latitud}/${longitud}`;
  }

  // Formato de Mensaje HTML de Alta Visibilidad
  let messageText = "";
  if (isSOS) {
    messageText = `🚨 <b>¡ALERTA SOS / PÁNICO DE EMERGENCIA!</b> 🚨\n\n` +
      `👤 <b>Emitido por:</b> ${usuarioNombre}\n` +
      `⏱️ <b>Fecha y Hora:</b> ${formattedTime}\n` +
      `🛡️ <b>Sistema:</b> Alarmas Chascomús - Alerta Familiar\n\n` +
      `⚠️ <b>ESTADO CRÍTICO:</b> El integrante requiere asistencia inmediata.\n`;

    if (latitud && longitud) {
      messageText += `📍 <b>Ubicación GPS:</b> ${latitud.toFixed(6)}, ${longitud.toFixed(6)}\n` +
        `🎯 <b>Precisión estimada:</b> ±${Math.round(precisionGps || 0)} metros\n\n` +
        `🗺️ <a href="${mapsUrl}"><b>Abrir en Google Maps</b></a> | <a href="${osmUrl}">OpenStreetMap</a>\n`;
    } else {
      messageText += `📍 <b>Ubicación:</b> Sin GPS disponible en el momento del disparo.\n`;
    }

    if (metadata?.bateria) {
      messageText += `🔋 <b>Nivel de Batería:</b> ${metadata.bateria}%\n`;
    }
  } else {
    // Llegada segura
    messageText = `✅ <b>CONFIRMACIÓN: LLEGUÉ BIEN</b>\n\n` +
      `👤 <b>Integrante:</b> ${usuarioNombre}\n` +
      `⏱️ <b>Hora:</b> ${formattedTime}\n` +
      `🛡️ <b>Ecosistema:</b> Notificación Segura\n\n`;

    if (latitud && longitud) {
      messageText += `📍 <b>Punto de arribo:</b> <a href="${mapsUrl}">Ver Ubicación en Google Maps</a>\n`;
    }
  }

  // 2. Despacho Concurrente en Paralelo con Promise.allSettled
  const dispatchPromises = miembros.map(async (miembro) => {
    const chatId = miembro.telegramChatId!;
    try {
      // Enviar mensaje de texto
      const textResult = await sendTelegramMessage(chatId, messageText, {
        parseMode: "HTML",
        disableNotification,
      });

      // Si es SOS y hay coordenadas, despachar también la tarjeta de localización nativa de Telegram
      if (isSOS && latitud && longitud) {
        await sendTelegramLocation(chatId, latitud, longitud, { disableNotification: false });
      }

      return {
        chatId,
        usuarioNombre: miembro.nombre,
        success: textResult.success,
        error: textResult.error,
      };
    } catch (err: any) {
      return {
        chatId,
        usuarioNombre: miembro.nombre,
        success: false,
        error: err.message || "Excepción no controlada",
      };
    }
  });

  const settledResults = await Promise.allSettled(dispatchPromises);

  const details = settledResults.map((res) => {
    if (res.status === "fulfilled") {
      return res.value;
    }
    return {
      chatId: "UNKNOWN",
      usuarioNombre: "Desconocido",
      success: false,
      error: res.reason?.message || "Fallo de promesa",
    };
  });

  const successfulDispatches = details.filter((d) => d.success).length;
  const failedDispatches = details.length - successfulDispatches;

  return {
    totalRecipients: miembros.length,
    successfulDispatches,
    failedDispatches,
    details,
  };
}
