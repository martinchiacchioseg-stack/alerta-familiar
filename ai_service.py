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
Eres el asistente virtual oficial de Alarmas Chascomús ("Cuidamos lo que más querés" - Más de 20 años en Chascomús). Hablas de forma totalmente natural, fluida, empática y con criterio técnico.

---

### DINÁMICA DE CONVERSACIÓN TÉCNICA PASO A PASO (DIAGNÓSTICO REAL)

1. NO Asumir problemas que el usuario no mencionó:
   - Si el cliente solo dice que tiene un problema con su cámara/alarma o si solo te responde la marca/modelo (ej. "Imou", "DSC", "Garnet", "Dahua"):
     * NUNCA dispares tutoriales específicos (como cambio de teléfono o reseteos) si el usuario no los pidió explícitamente.
     * Valida la marca y pregúntale cuál es el problema o consulta puntual que tiene con su equipo:
       (ej. "¡Entendido! Con tu equipo Imou, ¿qué inconveniente estás teniendo o qué necesitás hacer? ¿Es para ver en vivo, conexión, clave o alguna otra duda?").

2. Soporte Específico (Solo cuando el problema ya fue identificado):
   - Cambio de teléfono / Nueva instalación de app: Guía para descargar la app e iniciar sesión con usuario y clave habitual.
   - Modificación de claves de usuario: Secuencia de teclado según la marca (DSC: [*][5], Garnet, etc.).
   - Pérdida de conexión Wi-Fi / Fuera de línea: Verificar que el router tenga internet y que la luz testigo de la cámara esté encendida.
   - Detección de fallas en teclado: Guiar en lectura de fallas (DSC: [*][2]).

3. Límites Estrictos de Seguridad (Técnico Especializado):
   - NUNCA entregues códigos de instalador/ingeniería ni guía en aperturas de centrales o borneras.
   - Si la maniobra implica riesgo o requiere configuración compleja de router/red, ofrece coordinar la visita técnica al 2241-527180.

---

### NUEVAS INSTALACIONES Y PRESUPUESTOS (COMERCIAL)
- Aplica ÚNICAMENTE si busca colocar un sistema nuevo o equipar una casa, quinta, comercio o empresa.
- Los presupuestos son 100% SIN CARGO.
- Conversa sobre la propiedad y facilita el formulario de relevamiento:
  🔗 https://forms.gle/xpRAs7XkrZUertkn8

---

### URGENCIAS CRÍTICAS
- Alarma sonando sin parar o corte total: derivar de inmediato a 2241-527180 (Principal) / 2241-527357.

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
            generation_config={"temperature": 0.25}
        )
    except Exception as e:
        print(f"[WARN] Error inicializando modelo Gemini: {e}")

DERIVATION_FLAG = "[DERIVAR_HUMANO]"

def _simulate_smart_ai_reply(user_message: str, history: List[Dict] = None) -> Tuple[str, bool]:
    """Generador contextual inteligente que indaga el problema antes de dar tutoriales"""
    lower = user_message.lower().strip()
    
    # Extraer contexto previo
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

    # 3. Si el usuario pide explícitamente configurar en nuevo teléfono / cambio de celular
    if any(k in full_context for k in ["cambie de tel", "cambié de tel", "cambio de telefono", "cambio de teléfono", "cambie de cel", "cambié de cel", "nuevo telefono", "nuevo teléfono"]):
        if "imou" in full_context:
            reply = (
                "Para configurar tu cámara en un teléfono nuevo con la app **Imou Life**:\n\n"
                "1. Descargá la app **Imou Life** en tu celular nuevo desde Play Store o App Store.\n"
                "2. Iniciá sesión con el **mismo correo y contraseña** que usabas antes (las cámaras se cargan solas).\n"
                "3. Si no recordás la clave, usá la opción *'¿Olvidaste tu contraseña?'* en la app.\n\n"
                "¿Pudiste iniciar sesión correctamente?"
            )
            return reply, False
        if any(k in full_context for k in ["hik", "hik-connect", "hikvision"]):
            reply = (
                "Para configurar **Hik-Connect** en tu nuevo celular:\n\n"
                "1. Descargá la app **Hik-Connect** e iniciá sesión con tu cuenta registrada (correo o usuario).\n"
                "2. Tus cámaras se sincronizarán solas. Si te solicita el código de verificación/cifrado, se encuentra en la etiqueta de la cámara o grabador.\n\n"
                "¿Pudiste ingresar con tu cuenta?"
            )
            return reply, False
        if any(k in full_context for k in ["dmss", "dahua"]):
            reply = (
                "Para configurar la app **DMSS (Dahua)** en tu nuevo teléfono:\n\n"
                "1. Instalá **DMSS** desde la tienda de aplicaciones.\n"
                "2. Iniciá sesión con tu cuenta de DMSS para que se carguen tus dispositivos en la nube.\n\n"
                "¿Pudiste ingresar a tu cuenta?"
            )
            return reply, False

    # 4. Si el usuario SOLO responde la marca (ej: 'Imou', 'Garnet', 'DSC', 'Dahua', 'Hikvision')
    # NO asumir el problema: preguntar qué problema puntual tiene
    brands = {
        "imou": "Imou",
        "hikvision": "Hikvision",
        "hik-connect": "Hikvision",
        "dahua": "Dahua",
        "dmss": "Dahua",
        "garnet": "Garnet / Alonso",
        "alonso": "Garnet / Alonso",
        "dsc": "DSC",
        "intelbras": "Intelbras",
        "x28": "X-28",
        "x-28": "X-28"
    }
    for b_key, b_name in brands.items():
        if b_key in lower and len(lower.split()) <= 4:
            reply = (
                f"¡Entendido! Con tu equipo {b_name}, ¿qué problema puntual estás teniendo o qué necesitás hacer? "
                "(Por ejemplo: ver en vivo, cambio de clave, problema de conexión Wi-Fi o aviso de falla)."
            )
            return reply, False

    # 5. Clave de usuario
    if any(k in lower for k in ["clave", "codigo", "código", "contraseña"]) and "dsc" in full_context:
        reply = (
            "Para cambiar la clave de usuario en DSC:\n"
            "1. Presioná `[*][5]`.\n"
            "2. Ingresá tu Código Maestro actual.\n"
            "3. Digitá el número de usuario de dos dígitos (ej. `01`).\n"
            "4. Ingresá la nueva clave de 4 dígitos y presioná `[#]`."
        )
        return reply, False

    # 6. Presupuestos y nuevas instalaciones
    if any(k in lower for k in ["quinta", "casa", "comercio", "negocio", "galpon", "galpón", "obra", "local", "presupuesto", "cotiz"]):
        reply = (
            "¡Excelente! Diseñamos sistemas de seguridad y cámaras a medida con presupuestos 100% sin cargo. "
            "Para coordinar la evaluación técnica, por favor completá este breve formulario: https://forms.gle/xpRAs7XkrZUertkn8"
        )
        return reply, False

    # 7. Despedidas
    if any(k in lower for k in ["gracias", "chau", "hasta luego", "nos vemos", "muchas gracias"]):
        reply = (
            "¡Muchas gracias a vos! Quedamos a disposición en Alarmas Chascomús para lo que necesites. ¡Que tengas un excelente día!"
        )
        return reply, False

    # 8. Saludo inicial estándar
    reply = (
        "¡Hola! Buen día. Soy el asistente de Alarmas Chascomús, ¿con quién tengo el gusto y en qué te puedo dar una mano hoy?"
    )
    return reply, False

def generate_ai_response(phone: str, user_message: str) -> Tuple[str, bool]:
    """
    Genera la respuesta contextual con Gemini o el motor de diagnóstico real.
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
        print(f"[ERROR] Error al consultar Gemini ({e}). Aplicando motor de diagnóstico real.")
        return _simulate_smart_ai_reply(user_message, raw_history)
