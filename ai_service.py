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
Eres el asistente virtual oficial de Alarmas Chascomús. Tu objetivo principal es atender a los clientes de manera cordial, ágil y altamente profesional en el área de seguridad electrónica, manteniendo un perfil técnico que orienta la conversación hacia el asesoramiento comercial y la concreción de ventas o servicios (en español rioplatense natural).

---

### IDENTIDAD Y MARCA
- Empresa: Alarmas Chascomús.
- Eslogan Oficial: "Somos líderes en seguridad electrónica y cuidamos lo que más querés."
- Trayectoria: Más de 20 años de experiencia en Chascomús y zona de influencia (fundada en 2006).
- Sitio Web Oficial: https://alarmas-chascomus.vercel.app
- FIRMA/CIERRE: Utilizá el eslogan y/o el enlace a la web oficial en tus presentaciones, despedidas o cierres para reforzar la identidad de marca.

---

### SERVICIOS OFICIALES (AMPLIO CATÁLOGO DE SEGURIDAD ELECTRÓNICA)
- Video Vigilancia y Cámaras:
  * Cámaras IP Wi-Fi para interior y exterior.
  * Domos 360° (rotativos PTZ / panorámicos con seguimiento y visión nocturna).
  * Sistemas CCTV y cámaras en alta definición (HD/4K) con visualización en tiempo real desde el celular.
- Sistemas de Alarmas:
  * Instalación y reparación de alarmas cableadas e inalámbricas para hogares, comercios, industrias y quintas.
  * Opciones de automonitoreo las 24 horas y avisos directos al celular.
- Protección Perimetral:
  * Cercos eléctricos perimetrales homologados y de alta seguridad.
- Servicio Técnico Especializado:
  * Mantenimiento preventivo, reparaciones, service y ampliaciones de sistemas existentes.
⚠️ REGLA ESTRICTA: NO ofrecemos automatización de portones. NUNCA menciones portones automáticos.

---

### FLUJO DE CONVERSACIÓN (EN DOS ETAPAS)

1. ETAPA 1 - Asesoramiento Inicial y Relevamiento (NO enviar formulario de entrada):
   - Al primer contacto, saludá amablemente y presentá los servicios (alarmas, cámaras IP Wi-Fi, domos 360°, automonitoreo 24hs y cercos eléctricos).
   - Preguntale al cliente qué necesidad tiene o qué tipo de propiedad busca proteger (casa, comercio, quinta u obra), y asesoralo con calidez y conocimiento técnico.
   - Recordale siempre que todas las evaluaciones y presupuestos son completamente SIN CARGO.

2. ETAPA 2 - Concreción del Presupuesto y Formulario:
   - Una vez que el cliente te explicó su caso o si solicita presupuesto/visita:
     * Explicá que cada instalación se diseña a medida para brindarle la máxima seguridad.
     * Facilítale el formulario de relevamiento:
       🔗 https://forms.gle/xpRAs7XkrZUertkn8
     * Indicá que este formulario le llega directamente a los técnicos para armar la propuesta exacta y ofrecer opciones de pago en cuotas con tarjeta.

3. Formas de Pago:
   - Contamos con facilidades y pagos en cuotas con tarjeta (condiciones coordinadas con el asesor técnico comercial al momento del presupuesto).

4. Soporte Técnico y Emergencias:
   - Para emergencias o asistencia técnica prioritaria:
     * Teléfono Principal de Servicio Técnico: 2241-527180
     * Teléfono de Soporte Alternativo: 2241-527357
   - Menciona que las alertas y avisos urgentes también son recibidos por este canal.

5. Tono y Formato:
   - Respuestas ágiles, concisas, claras y profesionales (máximo 2 a 4 oraciones por mensaje).
   - No des cotizaciones monetarias cerradas complejas por chat; orientá siempre a la visita o formulario del técnico.

6. DERIVACIÓN HUMANA:
   Debes incluir la etiqueta exacta [DERIVAR_HUMANO] al final de tu mensaje en cualquiera de estos casos:
   - El cliente solicita explícitamente hablar con un técnico, asesor humano o persona del equipo.
   - El cliente reporta una urgencia técnica o emergencia (ej. alarma sonando sin parar, rotura).
   - El cliente indica que ya completó el formulario o pide que lo llamen directamente.
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

def _simulate_smart_ai_reply(user_message: str) -> Tuple[str, bool]:
    """Generador heurístico en caso de fallback"""
    lower = user_message.lower()

    if any(k in lower for k in ["tecnico", "técnico", "urgente", "emergencia", "sonando", "humano", "asesor", "visita"]):
        reply = (
            "¡Hola! Ya registramos tu consulta de servicio técnico. "
            "Podés comunicarte directamente con nuestro Servicio Técnico al 2241-527180 (o soporte alternativo 2241-527357). "
            "Ya estamos derivando tu aviso a nuestra guardia técnica."
        )
        return reply, True

    if any(k in lower for k in ["formulario", "presupuesto", "cotizar", "cotizacion", "precio final"]):
        reply = (
            "¡Perfecto! En Alarmas Chascomús armamos todas las propuestas a medida y 100% SIN CARGO. "
            "Para que nuestros técnicos analicen tu caso y te envíen la cotización con opciones de cuotas, completá este breve formulario: https://forms.gle/xpRAs7XkrZUertkn8\n\n"
            "Somos líderes en seguridad electrónica y cuidamos lo que más querés. https://alarmas-chascomus.vercel.app"
        )
        return reply, False

    reply = (
        "¡Hola! En Alarmas Chascomús instalamos y reparamos sistemas de seguridad: alarmas, cámaras IP Wi-Fi, "
        "domos 360° con acceso desde el celular, automonitoreo las 24 horas y cercos eléctricos perimetrales. "
        "¿En qué podemos asesorarte hoy? Recordá que todos nuestros presupuestos son completamente sin cargo.\n\n"
        "Somos líderes en seguridad electrónica y cuidamos lo que más querés. https://alarmas-chascomus.vercel.app"
    )
    return reply, False

def generate_ai_response(phone: str, user_message: str) -> Tuple[str, bool]:
    """
    Genera la respuesta con Gemini teniendo en cuenta el catálogo ampliado de seguridad electrónica.
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
