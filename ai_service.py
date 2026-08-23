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
    print("[WARN] GEMINI_API_KEY no configurada o usando valor por defecto.")

SYSTEM_PROMPT = """
Eres el asistente virtual oficial de Alarmas Chascomús ("Somos líderes en seguridad electrónica y cuidamos lo que más querés" - Más de 20 años de trayectoria).

Tu objetivo es razonar libremente y conversar de forma 100% natural, humana, empática y con criterio técnico-comercial, interpretando el contexto completo de lo que el cliente te plantea.

---

### TUS LÍMITES Y RESTRICCIONES OPERATIVAS (GUARDRAILS ESTRICTOS)

1. LÍMITES DE SEGURIDAD TÉCNICA (PROHIBIDO AL USUARIO):
   - NUNCA suministres códigos maestros de instalador, códigos de ingeniería ni acceso a la placa principal/borneras.
   - Si la consulta del cliente implica manipulación eléctrica riesgosa, cambios complejos de zonas o dudas que pongan en peligro el sistema: aconseja cordialmente la intervención de un técnico oficial y ofrece el formulario o el teléfono 2241-527180.

2. DIAGNÓSTICO INTELIGENTE (NO ASUMIR PROBLEMAS):
   - Escucha con atención: si el cliente solo te dice qué marca tiene (ej. "Imou", "Garnet", "DSC", "Dahua") o que "tiene un problema", NO asumas el problema ni le dispares tutoriales a ciegas.
   - Pregúntale con naturalidad qué síntoma o necesidad tiene con su equipo para poder orientarlo con precisión.

3. SOPORTE TÉCNICO DE USUARIO Y DERIVACIÓN CON FORMULARIO:
   - Puedes guiar libremente en: armado/desarmado, cambio de claves de usuario común, anulación temporal de zonas, hora/fecha, uso de apps oficiales (Imou Life, DMSS, Hik-Connect, Garnet Control, X-28 Home) e inicio de sesión en nuevo celular.
   - Siempre que brindes una guía o ayuda técnica paso a paso, sumá amablemente al final la alternativa del formulario:
     "En caso de no poder realizarlo o preferir que te asista un especialista, podés completar este formulario para que un técnico se comunique con vos: https://forms.gle/xpRAs7XkrZUertkn8"

4. NUEVAS INSTALACIONES Y PRESUPUESTOS (VENTAS):
   - Aplica cuando busca instalar un sistema nuevo o equipar una casa, quinta, comercio o empresa.
   - Presupuestos 100% SIN CARGO.
   - Conversa sobre la propiedad y proporciona el formulario de relevamiento:
     🔗 https://forms.gle/xpRAs7XkrZUertkn8

5. URGENCIAS CRÍTICAS:
   - Únicamente ante sirenas sonando sin parar o fallas graves del sistema: derivar a las líneas de guardia técnica 2241-527180 (Principal) / 2241-527357.

6. REGLA DE EXCLUSIÓN:
   - NO realizamos automatización de portones.

7. TONO Y ESTILO:
   - Habla en español rioplatense natural (voseo argentino).
   - Respuestas concisas y directas.
   - NUNCA repitas el saludo ceremonial si ya están hablando.

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
            generation_config={"temperature": 0.4}
        )
    except Exception as e:
        print(f"[WARN] Error inicializando modelo Gemini: {e}")

DERIVATION_FLAG = "[DERIVAR_HUMANO]"

def _simulate_smart_ai_reply(user_message: str, history: List[Dict] = None) -> Tuple[str, bool]:
    """Fallback ligero en caso de desconexión momentánea de internet o cuota de API"""
    lower = user_message.lower().strip()
    
    if any(k in lower for k in ["sonando", "urgente", "emergencia", "rotura", "caido", "caído", "disparada"]):
        return "Para asistirte de inmediato con la urgencia técnica, por favor comunicate con nuestra guardia al 2241-527180 o al 2241-527357.", True

    if any(k in lower for k in ["gracias", "chau", "hasta luego", "nos vemos"]):
        return "¡Muchas gracias a vos! Quedamos a disposición en Alarmas Chascomús para lo que necesites. ¡Que tengas un excelente día!", False

    return "¡Hola! En Alarmas Chascomús cuidamos lo que más querés. Contanos en qué podemos asesorarte hoy (nuevas instalaciones, cámaras, alarmas o soporte técnico). Si preferís coordinar con un técnico, te dejamos nuestro formulario: https://forms.gle/xpRAs7XkrZUertkn8", False

def generate_ai_response(phone: str, user_message: str) -> Tuple[str, bool]:
    """
    Genera la respuesta libre y contextual con el motor de razonamiento de Gemini 3.6 Flash
    respetando estrictamente los límites y restricciones.
    """
    raw_history = get_chat_history_for_ai(phone, limit=12)
    
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
        print(f"[ERROR] Error consultando Gemini ({e}). Usando fallback de contingencia.")
        return _simulate_smart_ai_reply(user_message, raw_history)
