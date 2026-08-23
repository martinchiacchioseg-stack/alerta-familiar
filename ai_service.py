import os
import re
from typing import Tuple, List, Dict
from dotenv import load_dotenv
import google.generativeai as genai
from database import get_chat_history_for_ai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def is_gemini_configured() -> bool:
    return bool(GEMINI_API_KEY and GEMINI_API_KEY != "PEGA_AQUI_TU_GEMINI_API_KEY")

if is_gemini_configured():
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("[WARN] GEMINI_API_KEY no configurada o usando valor por defecto. Operando con fallback inteligente.")

SYSTEM_PROMPT = """
Eres el asistente virtual oficial de Alarmas Chascomús ("Cuidamos lo que más querés" - Más de 20 años en Chascomús). Hablas de forma totalmente natural, fluida, empática y resolutiva.

---

### REGLAS DE ORO ANTIBUCLE Y MEMORIA DE SESIÓN
1. NUNCA repitas la misma pregunta ni des la misma respuesta que diste en el mensaje inmediatamente anterior.
2. Si el usuario responde con una sola palabra o nombre de marca/app (ej. "Imou life", "Imou", "Garnet", "DSC", "Cámaras", "Hikvision", "Dahua"):
   - Revisa de qué venían hablando en los mensajes anteriores.
   - NO vuelvas a preguntar la marca o modelo.
   - Toma esa marca y dale DIRECTAMENTE la solución paso a paso de usuario final.
3. Si el usuario dice "cambié de teléfono" y menciona la app (ej. Imou Life, DMSS, Hik-Connect, Garnet Control):
   - Explícale directo: solo debe descargar la app oficial desde Play Store/App Store, iniciar sesión con el mismo correo/usuario y contraseña con los que la creó originalmente, y las cámaras/alarmas aparecerán vinculadas de forma automática.
   - Si no recuerda la contraseña, guíalo a usar la opción "¿Olvidaste tu contraseña?" de la aplicación.

---

### ALCANCE Y CONOCIMIENTO DE USUARIO FINAL

Marcas soportadas:
- Alarmas: DSC PowerSeries, Garnet/Alonso, Intelbras, X-28.
- Cámaras/Apps: Imou (Imou Life), Dahua (DMSS), Hikvision (Hik-Connect).

Soporte permitido (Nivel Usuario):
- Descarga, inicio de sesión y visualización en apps móviles.
- Armado/desarmado (Stay/Away), cambio de claves de usuario común, anulación temporal de zonas, test de sirena de usuario y lectura de fallas básicas.

Límites estrictos (Técnico Especializado):
- NUNCA des claves de instalador/técnico, configuración avanzada de router/red ni manipulación de borneras/placas.
- Si el cliente requiere reconfigurar la cámara desde cero a un nuevo router Wi-Fi o resetear el equipo físico y se le dificulta, aconseja la visita de un técnico especializado y ofrece el contacto: 2241-527180.

---

### PROTOCOLO SEGÚN INTENCIÓN

1. Ventas / Nuevas Instalaciones:
   - Solo si el cliente busca instalar un sistema nuevo o cotizar una propiedad.
   - Conversa sobre la necesidad y brinda el formulario de relevamiento:
     🔗 https://forms.gle/xpRAs7XkrZUertkn8

2. Consultas Técnicas / Apps:
   - Responde la duda técnica directamente. Prohibido enviar el formulario de presupuestos en consultas técnicas.

3. Urgencias Críticas:
   - Solo ante sirenas sonando sin control o fallas graves del sistema: derivar a 2241-527180 (Principal) / 2241-527357.

---

### DERIVACIÓN HUMANA:
Debes incluir la etiqueta exacta [DERIVAR_HUMANO] al final de tu mensaje en cualquiera de estos casos:
- Urgencia técnica crítica (sirena sonando, rotura grave).
- Solicitud explícita de visita técnica o llamada de un asesor humano.
- Confirmación de envío del formulario de relevamiento.
"""

model = None
if is_gemini_configured():
    try:
        model = genai.GenerativeModel(
            model_name="gemini-3.6-flash",
            system_instruction=SYSTEM_PROMPT,
            generation_config={"temperature": 0.2}
        )
    except Exception as e:
        print(f"[WARN] Error inicializando modelo Gemini: {e}")

DERIVATION_FLAG = "[DERIVAR_HUMANO]"

def _simulate_smart_ai_reply(user_message: str, history: List[Dict] = None) -> Tuple[str, bool]:
    """Generador experto con memoria contextual completa para contingencia"""
    lower = user_message.lower().strip()
    
    # Combinar historial reciente para análisis contextual
    past_text = ""
    if history:
        for item in history[-4:]:
            past_text += " " + item.get("parts", [""])[0].lower()
    
    full_context = (past_text + " " + lower).strip()

    # 1. Urgencias
    if any(k in lower for k in ["sonando", "urgente", "emergencia", "rotura", "caido", "caído", "disparada"]):
        reply = (
            "Para asistirte de inmediato con la urgencia técnica, por favor comunicate con nuestra guardia al 2241-527180 o al 2241-527357."
        )
        return reply, True

    # 2. Seguridad estricta
    if any(k in lower for k in ["codigo instalador", "código instalador", "ingenieria", "placa", "programacion de zona"]):
        reply = (
            "Por normas estrictas de seguridad, los códigos de instalador y la programación interna son de acceso exclusivo del servicio técnico homologado. "
            "Podemos coordinar una visita técnica oficial al 2241-527180."
        )
        return reply, False

    # 3. Imou / Imou Life (antibucle contextual)
    if "imou" in lower or ("imou" in full_context and any(k in full_context for k in ["camara", "cámara", "app", "tel", "cel"])):
        reply = (
            "¡Hola! Para configurar tu cámara en un teléfono nuevo con la app **Imou Life**:\n\n"
            "1. Descargá la app **Imou Life** en tu nuevo celular desde Play Store o App Store.\n"
            "2. Iniciá sesión con el **mismo correo electrónico y contraseña** con los que creaste tu cuenta originalmente. Al ingresar, tus cámaras aparecerán vinculadas de forma automática.\n"
            "3. Si no recordás la clave, usá la opción *'¿Olvidaste tu contraseña?'* para restablecerla por email.\n\n"
            "¿Pudiste iniciar sesión o necesitás vincularla desde cero escaneando el código QR de la cámara?"
        )
        return reply, False

    # 4. Hikvision / Hik-Connect (antibucle contextual)
    if any(k in lower for k in ["hik-connect", "hikconnect", "hikvision"]) or "hik" in full_context:
        reply = (
            "Para configurar **Hik-Connect** en tu nuevo celular:\n\n"
            "1. Descargá la app **Hik-Connect** e iniciá sesión con tu cuenta registrada (correo o usuario).\n"
            "2. Tus cámaras se sincronizarán solas. Si te solicita el código de verificación/cifrado, se encuentra en la etiqueta de la cámara o grabador.\n\n"
            "¿Pudiste ingresar con tu cuenta?"
        )
        return reply, False

    # 5. Dahua / DMSS (antibucle contextual)
    if any(k in lower for k in ["dmss", "dahua"]) or "dmss" in full_context or "dahua" in full_context:
        reply = (
            "Para configurar la app **DMSS (Dahua)** en tu nuevo teléfono:\n\n"
            "1. Instalá **DMSS** desde la tienda de aplicaciones.\n"
            "2. Iniciá sesión con tu cuenta de DMSS para que se carguen tus dispositivos en la nube, o agregá el equipo escaneando el código QR.\n\n"
            "¿Pudiste ingresar a tu cuenta?"
        )
        return reply, False

    # 6. Garnet / Alonso (Garnet Control / Lantrix)
    if any(k in lower for k in ["garnet", "alonso", "lantrix"]) or "garnet" in full_context:
        reply = (
            "Para la app **Garnet Control / Lantrix** en tu celular nuevo:\n\n"
            "1. Descargá la app oficial desde la tienda de aplicaciones.\n"
            "2. Ingresá tu usuario y contraseña habituales para acceder al estado de tu alarma y recibir los avisos de armado/desarmado."
        )
        return reply, False

    # 7. DSC PowerSeries
    if "dsc" in lower or "dsc" in full_context:
        reply = (
            "Para paneles DSC:\n"
            "- Cambiar clave de usuario: `[*][5] + Código Maestro + N° de usuario (01 a 32) + Nueva clave + [#]`.\n"
            "- Ver fallas en teclado: `[*][2]`.\n"
            "- Anular zona: `[*][1] + N° de zona`."
        )
        return reply, False

    # 8. X-28
    if any(k in lower for k in ["x28", "x-28"]) or "x28" in full_context or "x-28" in full_context:
        reply = (
            "Para sistemas X-28 podés gestionar tu sistema desde el teclado o mediante la app **X-28 Home** iniciando sesión con tu cuenta registrada."
        )
        return reply, False

    # 9. Cambio de teléfono general sin marca aún
    if any(k in lower for k in ["cambie de tel", "cambié de tel", "cambie de cel", "cambié de cel", "nuevo telefono", "nuevo teléfono"]):
        reply = (
            "¡Hola! Para recuperar tus cámaras en el celular nuevo, solo tenés que descargar la app correspondiente (Imou Life, DMSS, Hik-Connect) e iniciar sesión con tu cuenta habitual (correo y contraseña). "
            "¿Qué aplicación o marca de cámaras utilizás?"
        )
        return reply, False

    # 10. Presupuestos y nuevas instalaciones
    if any(k in lower for k in ["quinta", "casa", "comercio", "negocio", "galpon", "galpón", "obra", "local", "presupuesto", "cotiz"]):
        reply = (
            "¡Excelente! Diseñamos sistemas de seguridad y cámaras a medida con presupuestos 100% sin cargo. "
            "Para coordinar la evaluación técnica, por favor completá este breve formulario: https://forms.gle/xpRAs7XkrZUertkn8"
        )
        return reply, False

    # 11. Despedidas
    if any(k in lower for k in ["gracias", "chau", "hasta luego", "nos vemos", "muchas gracias"]):
        reply = (
            "¡Muchas gracias a vos! Quedamos a disposición en Alarmas Chascomús para lo que necesites. ¡Que tengas un excelente día!"
        )
        return reply, False

    # 12. Saludos por defecto
    reply = (
        "¡Hola! Buen día. Soy el asistente de Alarmas Chascomús, ¿con quién tengo el gusto y en qué te puedo dar una mano hoy?"
    )
    return reply, False

def generate_ai_response(phone: str, user_message: str) -> Tuple[str, bool]:
    """
    Genera la respuesta contextual con Gemini o el motor antibucle con memoria de sesión.
    Devuelve (texto_limpio, debe_derivar_a_guardia).
    """
    raw_history = get_chat_history_for_ai(phone, limit=8)
    
    if not is_gemini_configured() or model is None:
        return _simulate_smart_ai_reply(user_message, raw_history)

    try:
        formatted_history = []
        last_role = None
        for item in raw_history:
            clean_part = item["parts"][0].replace(DERIVATION_FLAG, "").strip()
            if not clean_part:
                continue
            if item["role"] != last_role:
                formatted_history.append({"role": item["role"], "parts": [clean_part]})
                last_role = item["role"]

        if formatted_history and formatted_history[-1]["role"] == "user":
            formatted_history.pop()

        chat = model.start_chat(history=formatted_history)
        response = chat.send_message(user_message)
        raw_reply = response.text.strip()

        should_derive = DERIVATION_FLAG in raw_reply
        clean_reply = raw_reply.replace(DERIVATION_FLAG, "").strip()

        return clean_reply, should_derive

    except Exception as e:
        print(f"[ERROR] Error al consultar Gemini ({e}). Aplicando motor experto con memoria de sesión.")
        return _simulate_smart_ai_reply(user_message, raw_history)
