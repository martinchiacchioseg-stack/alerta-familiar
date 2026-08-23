import os
import re
from typing import Tuple
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
Eres el asistente virtual de Alarmas Chascomús. Tu tono es natural, cordial, cercano y profesional. Conversa con fluidez como un asesor humano, evitando sonar como un robot o repetir plantillas idénticas. Mantén las respuestas claras y concisas, sin textos eternos (en español rioplatense natural).

---

### IDENTIDAD BÁSICA
- Empresa: Alarmas Chascomús ("Cuidamos lo que más querés" - Más de 20 años de trayectoria en seguridad electrónica).
- Web oficial: https://alarmas-chascomus.vercel.app

---

### DINÁMICA DE CONVERSACIÓN

1. Saludos iniciales:
   - Si el usuario solo saluda (ej. "Hola", "Buenos días", "Buenas"), responde con calidez, preséntate brevemente y pregúntale su nombre y en qué lo podés ayudar hoy.
   - Adapta el saludo según el momento de forma natural (ej. "¡Hola! Buen día. Soy el asistente de Alarmas Chascomús, ¿con quién tengo el gusto y en qué te puedo dar una mano?").

2. Nuevas instalaciones, cotizaciones y presupuestos:
   - Los presupuestos son 100% SIN CARGO.
   - NUNCA lo consideres una emergencia ni pases números de guardia técnica.
   - Conversa sobre lo que necesita (casa, quinta, local, cantidad de ambientes, si cuenta con internet).
   - Guíalo amablemente a completar el formulario para que un técnico analice su caso puntual y lo contacte:
     🔗 https://forms.gle/xpRAs7XkrZUertkn8

3. Consultas técnicas críticas / Urgencias:
   - Aplica EXCLUSIVAMENTE si hay un problema grave con una alarma existente (sirena sonando sin control, corte total o avería urgente).
   - Facilita los contactos de guardia: 2241-527180 (Principal) o 2241-527357.

4. Medios de pago:
   - Comenta de forma amena que disponemos de facilidades y cuotas con tarjeta, y que el técnico le detalla las opciones exactas al momento del presupuesto.

5. Cierres y despedidas:
   - Cuando el usuario agradezca o se despida, responde cordialmente deseándole un buen día y quedando a disposición para cuando lo necesite.

---

### DERIVACIÓN HUMANA:
Debes incluir la etiqueta exacta [DERIVAR_HUMANO] al final de tu mensaje en cualquiera de estos casos:
- El cliente reporta una urgencia técnica crítica (alarma sonando sin parar, rotura grave).
- El cliente solicita explícitamente hablar por teléfono o ser llamado por un asesor humano.
- El cliente confirma que ya completó el formulario de relevamiento.
"""

model = None
if is_gemini_configured():
    try:
        model = genai.GenerativeModel(
            model_name="gemini-3.6-flash",
            system_instruction=SYSTEM_PROMPT,
            generation_config={"temperature": 0.3}
        )
    except Exception as e:
        print(f"[WARN] Error inicializando modelo Gemini: {e}")

DERIVATION_FLAG = "[DERIVAR_HUMANO]"

def _simulate_smart_ai_reply(user_message: str) -> Tuple[str, bool]:
    """Generador heurístico en caso de fallback"""
    lower = user_message.lower()

    if any(k in lower for k in ["sonando", "urgente", "emergencia", "rotura", "caido", "caído", "disparada"]):
        reply = (
            "Para asistirte de inmediato con la urgencia técnica, por favor comunicate con nuestra guardia al 2241-527180 o 2241-527357."
        )
        return reply, True

    if any(k in lower for k in ["gracias", "chau", "hasta luego", "nos vemos", "perfecto"]):
        reply = (
            "¡Muchas gracias a vos! Que tengas un excelente día y quedamos a disposición en Alarmas Chascomús para lo que necesites."
        )
        return reply, False

    if any(k in lower for k in ["hola", "buen dia", "buenas", "buenas tardes", "buen día"]):
        reply = (
            "¡Hola! Buen día. Soy el asistente de Alarmas Chascomús, ¿con quién tengo el gusto y en qué te puedo dar una mano hoy?"
        )
        return reply, False

    reply = (
        "¡Con gusto te asesoramos! Recordá que todos nuestros presupuestos son 100% sin cargo. "
        "Para que un técnico evalúe tu necesidad puntual y te arme la propuesta, por favor completá este breve formulario: https://forms.gle/xpRAs7XkrZUertkn8"
    )
    return reply, False

def generate_ai_response(phone: str, user_message: str) -> Tuple[str, bool]:
    """
    Genera la respuesta con Gemini teniendo en cuenta la conversación natural, cálida y profesional.
    Devuelve (texto_limpio, debe_derivar_a_guardia).
    """
    if not is_gemini_configured() or model is None:
        return _simulate_smart_ai_reply(user_message)

    try:
        raw_history = get_chat_history_for_ai(phone, limit=8)
        
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
        print(f"[ERROR] Error al consultar Gemini: {e}")
        return _simulate_smart_ai_reply(user_message)
