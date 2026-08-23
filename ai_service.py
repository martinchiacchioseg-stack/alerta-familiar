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
1. NUNCA repitas el saludo inicial ("¡Hola! Buen día...") si la conversación ya está iniciada.
2. Si el usuario ya mencionó su nombre (ej. "Soy Martín") o su necesidad (ej. "ayuda con mi cámara", "cambié de teléfono", "no puedo ver mi cámara"):
   - Valida de inmediato su nombre y necesidad: "¡Hola Martín! Con gusto te ayudo a recuperar la vista de tus cámaras."
   - Pregunta SOLO la marca o aplicación que utiliza (ej. Imou Life, DMSS, Hik-Connect) si aún no la mencionó.
3. Si el usuario menciona la marca o app (ej. "Imou", "Imou life", "DMSS", "Hik-Connect"):
   - Dale DIRECTAMENTE la solución paso a paso de usuario final:
     * Descargar la app en el celular nuevo desde la tienda.
     * Iniciar sesión con su correo y contraseña habituales (las cámaras aparecen solas).
     * Usar '¿Olvidaste tu contraseña?' si no recuerda la clave.

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
    """Generador experto contextual inteligente (sin saludos en bucle)"""
    lower = user_message.lower().strip()
    
    # Analizar si ya hubo mensajes previos
    has_history = bool(history and len(history) > 1)
    
    # Extraer todo el contexto previo
    past_text = ""
    if history:
        for item in history:
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

    # 3. Soporte Imou / Imou Life
    if "imou" in lower or ("imou" in full_context and any(k in full_context for k in ["camara", "cámara", "app", "tel", "cel"])):
        reply = (
            "¡Perfecto! Para configurar tu cámara en un teléfono nuevo con la app **Imou Life**:\n\n"
            "1. Descargá la app **Imou Life** en tu celular nuevo desde Play Store o App Store.\n"
            "2. Iniciá sesión con el **mismo correo y contraseña** que usabas antes (las cámaras se cargan solas).\n"
            "3. Si no recordás la clave, usá la opción *'¿Olvidaste tu contraseña?'* en la app.\n\n"
            "¿Pudiste iniciar sesión correctamente?"
        )
        return reply, False

    # 4. Soporte Hikvision / Hik-Connect
    if any(k in lower for k in ["hik-connect", "hikconnect", "hikvision"]) or "hik" in full_context:
        reply = (
            "Para configurar **Hik-Connect** en tu nuevo celular:\n\n"
            "1. Descargá la app **Hik-Connect** e iniciá sesión con tu cuenta registrada (correo o usuario).\n"
            "2. Tus cámaras se sincronizarán solas. Si te solicita el código de verificación/cifrado, se encuentra en la etiqueta de la cámara o grabador.\n\n"
            "¿Pudiste ingresar con tu cuenta?"
        )
        return reply, False

    # 5. Soporte Dahua / DMSS
    if any(k in lower for k in ["dmss", "dahua"]) or "dmss" in full_context or "dahua" in full_context:
        reply = (
            "Para configurar la app **DMSS (Dahua)** en tu nuevo teléfono:\n\n"
            "1. Instalá **DMSS** desde la tienda de aplicaciones.\n"
            "2. Iniciá sesión con tu cuenta de DMSS para que se carguen tus dispositivos en la nube, o agregá el equipo escaneando el código QR.\n\n"
            "¿Pudiste ingresar a tu cuenta?"
        )
        return reply, False

    # 6. Cambio de teléfono / ayuda con cámaras (cuando aún no nombró la app)
    if any(k in full_context for k in ["cambie de tel", "cambié de tel", "cambio de telefono", "cambio de teléfono", "cambie de cel", "cambié de cel", "nuevo telefono", "nuevo teléfono", "ayuda con mi camara", "ayuda con mi cámara", "no puedo ver mi camara", "no puedo ver mi cámara"]):
        name_match = re.search(r'\bsoy\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)', lower)
        name_str = f" {name_match.group(1).capitalize()}" if name_match else ""
        
        reply = (
            f"¡Hola{name_str}! Con gusto te ayudo a recuperar la vista de tus cámaras en el celular nuevo. "
            "Para darte el paso a paso exacto, ¿qué aplicación o marca de cámaras utilizás (por ejemplo Imou Life, DMSS de Dahua o Hik-Connect)?"
        )
        return reply, False

    # 7. Si el usuario solo dijo su nombre
    if lower.startswith("soy ") or (len(lower.split()) <= 2 and any(k in full_context for k in ["camara", "cámara"])):
        clean_name = user_message.replace("Soy", "").replace("soy", "").strip().capitalize()
        reply = (
            f"¡Hola {clean_name}! Contame, ¿qué marca de cámaras o qué aplicación tenés instalada (Imou Life, DMSS, Hik-Connect, etc.) así te guío a configurarla?"
        )
        return reply, False

    # 8. Presupuestos y nuevas instalaciones
    if any(k in lower for k in ["quinta", "casa", "comercio", "negocio", "galpon", "galpón", "obra", "local", "presupuesto", "cotiz"]):
        reply = (
            "¡Excelente! Diseñamos sistemas de seguridad y cámaras a medida con presupuestos 100% sin cargo. "
            "Para coordinar la evaluación técnica, por favor completá este breve formulario: https://forms.gle/xpRAs7XkrZUertkn8"
        )
        return reply, False

    # 9. Despedidas
    if any(k in lower for k in ["gracias", "chau", "hasta luego", "nos vemos", "muchas gracias"]):
        reply = (
            "¡Muchas gracias a vos! Quedamos a disposición en Alarmas Chascomús para lo que necesites. ¡Que tengas un excelente día!"
        )
        return reply, False

    # 10. Si ya hay conversación iniciada, NO repetir el saludo ceremonial
    if has_history:
        reply = (
            "¿Qué marca de cámaras o sistema de alarma tenés instalado para que te indique los pasos exactos?"
        )
        return reply, False

    # 11. Saludo inicial estándar
    reply = (
        "¡Hola! Buen día. Soy el asistente de Alarmas Chascomús, ¿con quién tengo el gusto y en qué te puedo dar una mano hoy?"
    )
    return reply, False

def generate_ai_response(phone: str, user_message: str) -> Tuple[str, bool]:
    """
    Genera la respuesta contextual con Gemini o el motor antibucle con memoria de sesión.
    Devuelve (texto_limpio, debe_derivar_a_guardia).
    """
    raw_history = get_chat_history_for_ai(phone, limit=10)
    
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
