import os
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, Request, Response, HTTPException, status
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Módulos del proyecto
from database import (
    init_db,
    save_message,
    get_contacts,
    get_messages,
    toggle_bot,
    is_bot_active,
    mark_as_read
)
from ai_service import generate_ai_response
from meta_service import send_whatsapp_message, notify_guards

load_dotenv()

VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "alarmas_chascomus_2026")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicialización en el arranque
    init_db()
    print("[OK] Servidor de Alarmas Chascomus iniciado correctamente.")
    yield

app = FastAPI(title="Alarmas Chascomús - Chatbot & Panel", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# MODELOS PYDANTIC
# ==========================================
class ToggleBotRequest(BaseModel):
    phone: str
    bot_active: bool

class SendMessageRequest(BaseModel):
    phone: str
    text: str

# ==========================================
# 1. WEBHOOKS META (WHATSAPP CLOUD API) - PÚBLICO
# ==========================================

@app.get("/webhook")
async def verify_webhook(request: Request):
    """Verificación obligatoria del Webhook requerida por Meta for Developers"""
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        print("[OK] Webhook de Meta verificado exitosamente.")
        return Response(content=challenge, media_type="text/plain", status_code=200)

    print("[ERROR] Fallo de validacion en Webhook de Meta.")
    raise HTTPException(status_code=403, detail="Token de verificación inválido")

@app.post("/webhook")
async def receive_webhook(request: Request):
    """Recibe eventos y mensajes entrantes de WhatsApp"""
    data = await request.json()
    print(f"\n{'='*60}\n[WEBHOOK INCOMING] POST recibido en /webhook:\n{data}\n{'='*60}\n")

    try:
        if data.get("entry"):
            for entry in data["entry"]:
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    
                    # Registrar actualizaciones de entrega/estado de Meta
                    if "statuses" in value:
                        for st in value["statuses"]:
                            msg_id = st.get("id")
                            status_name = st.get("status")
                            recipient_id = st.get("recipient_id")
                            errors = st.get("errors", [])
                            print(f"[META DELIVERY STATUS] Para {recipient_id} ({msg_id}) -> {status_name}")
                            if errors:
                                print(f"[META DELIVERY ERROR]: {errors}")

                    # Extraer nombre del perfil si viene provisto por WhatsApp
                    sender_name = None
                    if "contacts" in value and len(value["contacts"]) > 0:
                        sender_name = value["contacts"][0].get("profile", {}).get("name")

                    # Procesar mensajes entrantes
                    if "messages" in value:
                        for msg in value["messages"]:
                            if msg.get("type") == "text":
                                from_phone = msg["from"]
                                user_text = msg["text"]["body"]
                                
                                print(f"[Recibido de {from_phone}]: {user_text}")

                                # 1. Persistir mensaje del usuario en SQLite
                                save_message(from_phone, "user", user_text, sender_name)

                                # 2. Verificar si el bot está habilitado para este contacto
                                if is_bot_active(from_phone):
                                    # Generar respuesta contextual con Gemini
                                    ai_reply, should_derive = generate_ai_response(from_phone, user_text)

                                    # Persistir y enviar respuesta del bot
                                    save_message(from_phone, "bot", ai_reply)
                                    await send_whatsapp_message(from_phone, ai_reply)

                                    # 3. Si se detectó necesidad de derivación técnica
                                    if should_derive:
                                        print(f"[ALERTA] Derivacion detectada para {from_phone}. Pausando bot y alertando guardias...")
                                        toggle_bot(from_phone, False)
                                        await notify_guards(from_phone, sender_name or from_phone, user_text)
                                else:
                                    print(f"[INFO] Bot pausado para {from_phone}. Mensaje guardado a la espera de atencion manual.")

    except Exception as e:
        print(f"[ERROR] Error procesando payload de Webhook: {e}")

    return JSONResponse(content={"status": "EVENT_RECEIVED"}, status_code=200)

# ==========================================
# 2. REST API PARA EL PANEL DE CONTROL (PÚBLICO PARA REVISIÓN DE META)
# ==========================================

@app.get("/api/contacts")
async def api_get_contacts():
    """Devuelve la lista ordenada de contactos y su último estado"""
    contacts = get_contacts()
    return JSONResponse(content=contacts)

@app.get("/api/messages/{phone}")
async def api_get_messages(phone: str):
    """Devuelve los mensajes de una conversación y marca como leídos"""
    messages = get_messages(phone)
    mark_as_read(phone)
    return JSONResponse(content=messages)

@app.post("/api/toggle-bot")
async def api_toggle_bot(req: ToggleBotRequest):
    """Activa o pausa la IA para un número particular"""
    status_updated = toggle_bot(req.phone, req.bot_active)
    return JSONResponse(content={"phone": req.phone, "bot_active": status_updated})

@app.post("/api/send-message")
async def api_send_message(req: SendMessageRequest):
    """Envía un mensaje manual de operador hacia el cliente por WhatsApp"""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")

    # Guardar en base de datos como 'agent'
    saved = save_message(req.phone, "agent", req.text.strip())

    # Enviar por WhatsApp Cloud API
    await send_whatsapp_message(req.phone, req.text.strip())

    return JSONResponse(content=saved)

@app.get("/api/debug-meta/{phone}")
async def api_debug_meta(phone: str):
    """Diagnóstico en vivo para probar el envío y ver el error exacto de Meta"""
    import httpx
    load_dotenv(override=True)
    token = os.getenv("META_ACCESS_TOKEN", "")
    phone_id = os.getenv("PHONE_NUMBER_ID", "")
    
    debug_info = {
        "token_configured": bool(token and token != "PEGA_AQUI_TU_META_ACCESS_TOKEN"),
        "token_prefix": token[:10] if token else "None",
        "token_length": len(token) if token else 0,
        "phone_id": phone_id,
        "target_phone": phone
    }
    
    if not token or not phone_id or token == "PEGA_AQUI_TU_META_ACCESS_TOKEN" or phone_id == "PEGA_AQUI_TU_PHONE_NUMBER_ID":
        return JSONResponse(content={"status": "CONFIG_ERROR", "detail": "Variables de entorno no configuradas en Render", "debug": debug_info}, status_code=400)
        
    url = f"https://graph.facebook.com/v20.0/{phone_id}/messages"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": str(phone),
        "type": "text",
        "text": {"preview_url": False, "body": "Prueba de conexion directa desde Render a WhatsApp"}
    }
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.post(url, headers=headers, json=payload)
            try:
                res_body = res.json()
            except:
                res_body = res.text
            return JSONResponse(content={
                "debug": debug_info,
                "meta_http_status": res.status_code,
                "meta_response": res_body
            })
    except Exception as e:
        return JSONResponse(content={"status": "EXCEPTION", "error": str(e), "debug": debug_info}, status_code=500)


# ==========================================
# 3. SPA FRONTEND (ESTILO WHATSAPP WEB)
# ==========================================

@app.get("/", response_class=HTMLResponse)
async def serve_spa():
    html_content = """
<!DOCTYPE html>
<html lang="es" class="h-full bg-slate-950 text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alarmas Chascomús | Panel de Control & Chats</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    /* Scrollbar personalizada */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
    .chat-bg {
      background-color: #0b141a;
      background-image: radial-gradient(#1e293b 0.75px, transparent 0.75px);
      background-size: 16px 16px;
    }
  </style>
</head>
<body class="h-full flex overflow-hidden font-sans select-none">

  <!-- CONTENEDOR PRINCIPAL TIPO WHATSAPP WEB -->
  <div class="flex w-full h-full">

    <!-- 1. BARRA LATERAL IZQUIERDA (CONTACTOS) -->
    <aside class="w-full md:w-[380px] lg:w-[420px] h-full flex flex-col bg-slate-900 border-r border-slate-800 shrink-0">
      
      <!-- Encabezado Sidebar -->
      <div class="h-16 px-4 bg-slate-900 flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/40">
            <i class="fa-solid fa-shield-halved text-lg"></i>
          </div>
          <div>
            <h1 class="font-bold text-sm leading-tight text-slate-100">Alarmas Chascomús</h1>
            <p class="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Panel de Atención
            </p>
          </div>
        </div>
        <button onclick="fetchContacts()" title="Recargar contactos" class="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition">
          <i class="fa-solid fa-rotate-right"></i>
        </button>
      </div>

      <!-- Buscador -->
      <div class="p-3 border-b border-slate-800/80 bg-slate-900/50">
        <div class="relative">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input 
            type="text" 
            id="searchInput" 
            placeholder="Buscar por nombre o teléfono..." 
            oninput="filterContacts()"
            class="w-full bg-slate-950 text-xs rounded-lg pl-9 pr-4 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-200 placeholder-slate-500 transition"
          />
        </div>
      </div>

      <!-- Lista de Conversaciones -->
      <div id="contactsList" class="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        <div class="p-8 text-center text-slate-500 text-xs">Cargando conversaciones...</div>
      </div>

      <!-- Pie de sidebar -->
      <div class="p-2 text-center text-[10px] text-slate-500 bg-slate-950 border-t border-slate-800">
        Guardias: 5492241527180 / 5492241527357
      </div>
    </aside>

    <!-- 2. ÁREA PRINCIPAL DE CHAT (DERECHA) -->
    <main class="flex-1 h-full flex flex-col bg-slate-950 overflow-hidden relative">

      <!-- Estado Vacío (Sin chat seleccionado) -->
      <div id="emptyChatState" class="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950">
        <div class="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-emerald-500 text-3xl shadow-inner">
          <i class="fa-regular fa-comments"></i>
        </div>
        <h2 class="text-xl font-bold text-slate-200 mb-1">Centro de Monitoreo de Chats</h2>
        <p class="text-sm text-slate-500 max-w-md mb-4">Selecciona un cliente de la lista lateral para supervisar la conversación, pausar la IA o responder de forma manual.</p>
        <div class="flex items-center gap-4 text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800">
          <span><i class="fa-solid fa-robot text-emerald-400 mr-1"></i> Bot IA</span>
          <span>•</span>
          <span><i class="fa-solid fa-user-tie text-blue-400 mr-1"></i> Operador</span>
          <span>•</span>
          <span><i class="fa-solid fa-bell text-amber-400 mr-1"></i> Derivaciones a Guardia</span>
        </div>
      </div>

      <!-- Contenedor del Chat Activo -->
      <div id="activeChatContainer" class="hidden h-full flex-col flex-1">
        
        <!-- Header del Chat -->
        <header class="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
          <div class="flex items-center space-x-3">
            <div id="chatAvatar" class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-sm shadow">
              U
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 id="chatName" class="font-semibold text-sm text-slate-100">Nombre de Cliente</h3>
                <span id="chatBotBadge" class="px-2 py-0.5 text-[10px] rounded-full font-medium"></span>
              </div>
              <p id="chatPhone" class="text-xs text-slate-400 font-mono"></p>
            </div>
          </div>

          <!-- Acciones Header -->
          <div class="flex items-center space-x-3">
            <!-- Botón Toggle Bot -->
            <button 
              id="toggleBotBtn" 
              onclick="toggleCurrentBot()" 
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition border shadow-sm">
              <i id="toggleBotIcon" class="fa-solid"></i>
              <span id="toggleBotText"></span>
            </button>

            <a id="chatDirectWa" href="#" target="_blank" class="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg text-sm transition" title="Abrir en WhatsApp Web externo">
              <i class="fa-brands fa-whatsapp text-lg"></i>
            </a>
          </div>
        </header>

        <!-- Mensajes (Área con scroll) -->
        <div id="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4 chat-bg select-text">
          <!-- Inyección dinámica de burbujas -->
        </div>

        <!-- Input Bar (Envío manual) -->
        <footer class="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          <form onsubmit="handleSendMessage(event)" class="flex items-center gap-3">
            <input 
              type="text" 
              id="messageInput" 
              placeholder="Escribe un mensaje como operador (presiona Enter para enviar)..." 
              class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              autocomplete="off"
            />
            <button 
              type="submit" 
              class="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-emerald-950">
              <span>Enviar</span>
              <i class="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </footer>

      </div>

    </main>
  </div>

  <!-- SCRIPT FRONTEND SPA -->
  <script>
    let currentPhone = null;
    let currentBotState = true;
    let allContacts = [];
    let pollingInterval = null;

    // Iniciar al cargar
    document.addEventListener("DOMContentLoaded", () => {
      fetchContacts();
      // Polling cada 2.5 segundos para datos en tiempo real
      pollingInterval = setInterval(() => {
        fetchContacts(false);
        if (currentPhone) {
          fetchMessages(currentPhone, false);
        }
      }, 2500);
    });

    // 1. Obtener lista de contactos
    async function fetchContacts(renderEmpty = true) {
      try {
        const res = await fetch("/api/contacts");
        if (!res.ok) return;
        allContacts = await res.json();
        renderContactsList();
      } catch (err) {
        console.error("Error al cargar contactos:", err);
      }
    }

    // 2. Renderizar lista de contactos con filtro
    function renderContactsList() {
      const listEl = document.getElementById("contactsList");
      const filter = document.getElementById("searchInput").value.toLowerCase();
      
      const filtered = allContacts.filter(c => 
        (c.name && c.name.toLowerCase().includes(filter)) || 
        (c.phone && c.phone.includes(filter)) ||
        (c.last_message && c.last_message.toLowerCase().includes(filter))
      );

      if (filtered.length === 0) {
        listEl.innerHTML = `
          <div class="p-8 text-center text-slate-500 text-xs">
            <i class="fa-regular fa-folder-open text-xl mb-2 block"></i>
            No se encontraron conversaciones
          </div>
        `;
        return;
      }

      listEl.innerHTML = filtered.map(c => {
        const isSelected = c.phone === currentPhone;
        const activeClass = isSelected ? "bg-slate-800/90 border-l-4 border-emerald-500" : "hover:bg-slate-800/40";
        const botBadge = c.bot_active 
          ? `<span class="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">🤖 Bot</span>` 
          : `<span class="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-1.5 py-0.5 rounded">👤 Humano</span>`;
        
        const unreadBadge = c.unread_count > 0 
          ? `<span class="bg-emerald-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">${c.unread_count}</span>` 
          : "";

        const time = c.last_message_time ? c.last_message_time.split(" ")[1].slice(0, 5) : "";
        const initial = (c.name || c.phone || "U").charAt(0).toUpperCase();

        return `
          <div onclick="selectChat('${c.phone}')" class="p-3.5 flex items-center gap-3 cursor-pointer transition ${activeClass}">
            <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm shrink-0">
              ${initial}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="font-semibold text-xs text-slate-200 truncate">${c.name || c.phone}</span>
                <span class="text-[10px] text-slate-500 shrink-0">${time}</span>
              </div>
              <div class="flex items-center justify-between text-xs text-slate-400">
                <p class="truncate text-[11px] pr-2">${escapeHtml(c.last_message || "Sin mensajes...")}</p>
                <div class="flex items-center gap-1 shrink-0">
                  ${botBadge}
                  ${unreadBadge}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    function filterContacts() {
      renderContactsList();
    }

    // 3. Seleccionar conversación
    async function selectChat(phone) {
      currentPhone = phone;
      document.getElementById("emptyChatState").classList.add("hidden");
      document.getElementById("activeChatContainer").classList.remove("hidden");
      document.getElementById("activeChatContainer").classList.add("flex");

      const contact = allContacts.find(c => c.phone === phone);
      if (contact) {
        updateChatHeader(contact);
      }

      await fetchMessages(phone, true);
      renderContactsList();
    }

    function updateChatHeader(contact) {
      currentBotState = Boolean(contact.bot_active);
      document.getElementById("chatName").textContent = contact.name || contact.phone;
      document.getElementById("chatPhone").textContent = "+" + contact.phone;
      document.getElementById("chatAvatar").textContent = (contact.name || contact.phone || "U").charAt(0).toUpperCase();
      document.getElementById("chatDirectWa").href = `https://wa.me/${contact.phone}`;

      const btn = document.getElementById("toggleBotBtn");
      const icon = document.getElementById("toggleBotIcon");
      const text = document.getElementById("toggleBotText");
      const badge = document.getElementById("chatBotBadge");

      if (currentBotState) {
        btn.className = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-emerald-700 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900";
        icon.className = "fa-solid fa-robot text-emerald-400";
        text.textContent = "Bot Activo (Pausar)";
        badge.className = "px-2 py-0.5 text-[10px] rounded-full font-medium bg-emerald-900/60 text-emerald-400 border border-emerald-700";
        badge.textContent = "IA Respondiente";
      } else {
        btn.className = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-amber-700 bg-amber-950/60 text-amber-300 hover:bg-amber-900";
        icon.className = "fa-solid fa-user-tie text-amber-400";
        text.textContent = "Atención Humana (Activar Bot)";
        badge.className = "px-2 py-0.5 text-[10px] rounded-full font-medium bg-amber-900/60 text-amber-400 border border-amber-700";
        badge.textContent = "Modo Operador";
      }
    }

    // 4. Obtener y renderizar mensajes
    async function fetchMessages(phone, shouldScroll = false) {
      if (!phone || phone !== currentPhone) return;
      try {
        const res = await fetch(`/api/messages/${phone}`);
        if (!res.ok) return;
        const messages = await res.json();
        renderMessages(messages, shouldScroll);
      } catch (err) {
        console.error("Error al obtener mensajes:", err);
      }
    }

    function renderMessages(messages, shouldScroll) {
      const container = document.getElementById("messagesContainer");
      const prevScrollHeight = container.scrollHeight;
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 80;

      container.innerHTML = messages.map(m => {
        const time = m.timestamp ? m.timestamp.split(" ")[1].slice(0, 5) : "";
        
        if (m.sender === "user") {
          return `
            <div class="flex justify-start">
              <div class="max-w-[75%] bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-md border border-slate-700/60">
                <div class="text-xs leading-relaxed whitespace-pre-wrap">${escapeHtml(m.text)}</div>
                <div class="text-[10px] text-slate-400 text-right mt-1">${time}</div>
              </div>
            </div>
          `;
        } else if (m.sender === "bot") {
          return `
            <div class="flex justify-end">
              <div class="max-w-[75%] bg-emerald-950/80 text-emerald-100 rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-md border border-emerald-800/60">
                <div class="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 mb-1 border-b border-emerald-900/60 pb-0.5">
                  <i class="fa-solid fa-robot"></i> Asistente IA (Gemini)
                </div>
                <div class="text-xs leading-relaxed whitespace-pre-wrap">${escapeHtml(m.text)}</div>
                <div class="text-[10px] text-emerald-400/70 text-right mt-1">${time}</div>
              </div>
            </div>
          `;
        } else {
          // sender == 'agent'
          return `
            <div class="flex justify-end">
              <div class="max-w-[75%] bg-blue-950/80 text-blue-100 rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-md border border-blue-800/60">
                <div class="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 mb-1 border-b border-blue-900/60 pb-0.5">
                  <i class="fa-solid fa-user-shield"></i> Operador Técnico
                </div>
                <div class="text-xs leading-relaxed whitespace-pre-wrap">${escapeHtml(m.text)}</div>
                <div class="text-[10px] text-blue-400/70 text-right mt-1">${time}</div>
              </div>
            </div>
          `;
        }
      }).join("");

      if (shouldScroll || isAtBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }

    // 5. Enviar mensaje manual
    async function handleSendMessage(e) {
      e.preventDefault();
      const input = document.getElementById("messageInput");
      const text = input.value.trim();
      if (!text || !currentPhone) return;

      input.value = "";

      try {
        const res = await fetch("/api/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: currentPhone, text })
        });
        if (res.ok) {
          await fetchMessages(currentPhone, true);
          await fetchContacts(false);
        }
      } catch (err) {
        alert("Error al enviar mensaje");
      }
    }

    // 6. Alternar estado del bot
    async function toggleCurrentBot() {
      if (!currentPhone) return;
      const newState = !currentBotState;

      try {
        const res = await fetch("/api/toggle-bot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: currentPhone, bot_active: newState })
        });

        if (res.ok) {
          currentBotState = newState;
          const contact = allContacts.find(c => c.phone === currentPhone);
          if (contact) contact.bot_active = newState ? 1 : 0;
          updateChatHeader({ ...contact, bot_active: newState ? 1 : 0 });
          renderContactsList();
        }
      } catch (err) {
        alert("Error al alternar estado del bot");
      }
    }

    function escapeHtml(text) {
      if (!text) return "";
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }
  </script>
</body>
</html>
    """
    return HTMLResponse(content=html_content)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
