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
Sos el asistente virtual de Alarmas Chascomús, empresa líder en seguridad electrónica en Chascomús y zona de influencia.
Tu objetivo es atender consultas por WhatsApp de forma cordial, profesional, ágil y en español rioplatense natural (voseo).

Servicios ofrecidos:
- Sistemas de alarmas monitoreadas y autónomas (hogar, comercios, industrias, quintas).
- Cámaras de seguridad / CCTV y videovigilancia en alta definición (acceso desde el celular).
- Monitoreo 24hs y respuesta ante eventos.
- Cercos eléctricos perimetrales homologados y de alta seguridad.
- Control de acceso, automatización de portones y porteros visores.
- Cobertura: Chascomús, Lezama, Ranchos y alrededores.

Reglas estrictas de atención:
1. NUNCA des precios finales ni presupuestos cerrados por chat. Explicá que cada instalación requiere un relevamiento a medida.
2. Si el cliente consulta por un servicio o presupuesto, pedile amablemente estos 3 datos:
   a) ¿Qué servicio busca (alarmas, cámaras, monitoreo, cercos, portones)?
   b) ¿Tipo de propiedad (casa particular, comercio, quinta, obra en construcción)?
   c) ¿En qué barrio o zona de Chascomús se ubica?
3. DERIVACIÓN HUMANA:
   Debes incluir la etiqueta exacta [DERIVAR_HUMANO] al final de tu mensaje en cualquiera de estos casos:
   - El cliente ya te proporcionó los datos de su propiedad/ubicación para recibir el presupuesto.
   - El cliente solicita explícitamente hablar con un técnico, asesor humano o persona del equipo.
   - Se trata de una emergencia técnica (ej. alarma sonando sin parar, rotura urgente).
   - El cliente solicita coordinar una visita técnica a su domicilio.
4. Mantené siempre respuestas breves, claras y profesionales (máximo 2 a 3 oraciones).
"""

model = None
if is_gemini_configured():
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=SYSTEM_PROMPT,
            generation_config={"temperature": 0.2}
        )
    except Exception as e:
        print(f"[WARN] Error inicializando modelo Gemini: {e}")

DERIVATION_FLAG = "[DERIVAR_HUMANO]"

def _simulate_smart_ai_reply(user_message: str) -> Tuple[str, bool]:
    """Generador heurístico en caso de no contar aún con GEMINI_API_KEY"""
    lower = user_message.lower()

    # Caso derivación: técnico, urgencia, alarma sonando, asesor
    if any(k in lower for k in ["tecnico", "técnico", "urgente", "emergencia", "sonando", "humano", "asesor", "visita"]):
        reply = (
            "¡Hola! Ya registramos tu urgencia técnica. "
            "En este momento estamos derivando tu consulta a nuestra guardia técnica de Alarmas Chascomús para que se comuniquen con vos de inmediato."
        )
        return reply, True

    # Caso consulta de cámaras / alarmas / precios
    if any(k in lower for k in ["camara", "cámara", "alarma", "precio", "costo", "presupuesto", "instalar"]):
        reply = (
            "¡Hola! En Alarmas Chascomús armamos cada propuesta a medida según la propiedad. "
            "¿Nos podrías detallar en qué barrio o zona de Chascomús se ubica la propiedad y si es casa, comercio o quinta?"
        )
        return reply, False

    # Mensaje general
    reply = (
        "¡Hola! Gracias por comunicarte con Alarmas Chascomús. "
        "¿En qué podemos asesorarte hoy? Ofrecemos alarmas monitoreadas, cámaras de seguridad, monitoreo 24hs, cercos eléctricos y control de accesos."
    )
    return reply, False

def generate_ai_response(phone: str, user_message: str) -> Tuple[str, bool]:
    """
    Genera la respuesta con Gemini (o fallback inteligente) teniendo en cuenta el historial del chat.
    Devuelve (texto_limpio, debe_derivar_a_guardia).
    """
    if not is_gemini_configured() or model is None:
        return _simulate_smart_ai_reply(user_message)

    try:
        # 1. Obtener historial reciente para dar contexto
        raw_history = get_chat_history_for_ai(phone, limit=8)
        
        # Filtrar historial para evitar errores de roles consecutivos de Gemini
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

        # 2. Detectar si Gemini incluyó el flag de derivación
        should_derive = DERIVATION_FLAG in raw_reply
        
        # 3. Limpiar el flag de la respuesta que recibirá el cliente
        clean_reply = raw_reply.replace(DERIVATION_FLAG, "").strip()

        return clean_reply, should_derive

    except Exception as e:
        print(f"[ERROR] Error al consultar Gemini: {e}")
        return _simulate_smart_ai_reply(user_message)
