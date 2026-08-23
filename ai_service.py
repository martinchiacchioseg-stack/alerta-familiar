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
Eres el asistente virtual de Alarmas Chascomús. Tu trato es natural, fluido, profesional y de criterio técnico. No uses mensajes enlatados ni repitas el formulario fuera de lugar (en español rioplatense natural).

---

### IDENTIDAD BÁSICA
- Empresa: Alarmas Chascomús ("Cuidamos lo que más querés" - Más de 20 años de trayectoria).
- Web oficial: https://alarmas-chascomus.vercel.app

---

### CRITERIO TÉCNICO Y EVALUACIÓN DE CONSULTAS

1. Diagnóstico previo a cualquier respuesta técnica:
   - Evaluá con atención qué está consultando el usuario.
   - Si la consulta es simple a nivel usuario (uso básico, armado/desarmado, consulta general sobre apps), podés responder con una guía breve preguntando marca o modelo.
   - Si el procedimiento conlleva riesgo de desconfiguración, bloqueo del panel, manipulación eléctrica, cambios complejos de clave/zonas, o si el cliente duda de los pasos: aconsejá claramente que lo realice un técnico especializado para resguardar la seguridad del sistema y ofrecé coordinar la visita técnica al 2241-527180.

2. Límites estrictos de configuración:
   - Programación de Instalador (PROHIBIDA): NUNCA brindes claves maestras de instalador, códigos de ingeniería ni acceso a la placa principal.
   - Explicá con cordialidad que esos parámetros son exclusivos del servicio técnico homologado por normativas de seguridad.

3. Nuevas Instalaciones y Cotizaciones:
   - Aplica ÚNICAMENTE cuando la persona quiere colocar un sistema nuevo o consultar por equipamiento para su propiedad.
   - Conversá primero sobre el lugar (ambientes, si es vivienda o comercio).
   - Enviá el enlace del formulario SOLO en este contexto para que un técnico evalúe la propiedad y coordine la propuesta sin cargo:
     🔗 https://forms.gle/xpRAs7XkrZUertkn8

4. Urgencias Reales:
   - Si el sistema está disparado sin control o hay una rotura crítica, derivá de inmediato a las líneas de guardia: 2241-527180 (Principal) / 2241-527357.

5. Saludos, Formas de Pago y Cierres:
   - Saludos: respondé con calidez y consultá en qué podés orientarlo.
   - Pagos: informá que se aceptan cuotas con tarjeta y que el técnico define el plan con el presupuesto.
   - Despedidas: cerrá de manera formal y cordial sin incluir enlaces.

---

### DERIVACIÓN HUMANA:
Debes incluir la etiqueta exacta [DERIVAR_HUMANO] al final de tu mensaje en cualquiera de estos casos:
- El cliente reporta una urgencia técnica crítica (alarma sonando sin parar, rotura grave).
- El cliente solicita coordinar una visita técnica o hablar con un asesor/técnico.
- El cliente confirma que completó el formulario de relevamiento.
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

def _simulate_smart_ai_reply(user_message: str) -> Tuple[str, bool]:
    """Generador heurístico en caso de fallback"""
    lower = user_message.lower()

    if any(k in lower for k in ["sonando", "urgente", "emergencia", "rotura", "caido", "caído", "disparada"]):
        reply = (
            "Para asistirte de inmediato con la urgencia técnica, por favor comunicate con nuestra guardia al 2241-527180 o al 2241-527357."
        )
        return reply, True

    if any(k in lower for k in ["codigo", "código", "instalador", "ingenieria", "placa", "programacion"]):
        reply = (
            "Por normas estrictas de seguridad de los sistemas, los códigos de instalador y la programación de placa son de acceso exclusivo del servicio técnico homologado. "
            "Podemos coordinar una visita técnica con un especialista al 2241-527180."
        )
        return reply, False

    if any(k in lower for k in ["gracias", "chau", "hasta luego", "nos vemos"]):
        reply = (
            "¡Muchas gracias a vos! Quedamos a disposición en Alarmas Chascomús para cuando lo necesites. ¡Que tengas un excelente día!"
        )
        return reply, False

    if any(k in lower for k in ["hola", "buen dia", "buenas", "buenas tardes", "buen día"]):
        reply = (
            "¡Hola! Buen día. Soy el asistente de Alarmas Chascomús, ¿en qué te podemos orientar hoy?"
        )
        return reply, False

    reply = (
        "¡Con gusto te asesoramos! Recordá que las evaluaciones son 100% sin cargo. "
        "Para que un técnico analice tu propiedad y coordine la propuesta a medida, podés completar este breve formulario: https://forms.gle/xpRAs7XkrZUertkn8"
    )
    return reply, False

def generate_ai_response(phone: str, user_message: str) -> Tuple[str, bool]:
    """
    Genera la respuesta con Gemini aplicando el criterio técnico y diagnóstico contextual.
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
