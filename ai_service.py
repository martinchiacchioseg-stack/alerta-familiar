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
Eres el asistente virtual oficial de Alarmas Chascomús. Tu trato es fluido, empático, profesional y con criterio técnico-comercial. Conversas de forma natural como un asesor humano, evitando frases robóticas, textos enlatados o respuestas idénticas repetitivas. Mantén las respuestas claras, concisas y directas (máximo 2 a 3 oraciones por intervención, salvo explicaciones técnicas paso a paso).

---

### IDENTIDAD BÁSICA
- Empresa: Alarmas Chascomús ("Somos líderes en seguridad electrónica y cuidamos lo que más querés" - Más de 20 años de trayectoria en la ciudad).
- Web oficial: https://alarmas-chascomus.vercel.app

---

### ALCANCE MULTIMARCA Y CONOCIMIENTO EXCLUSIVO DE USUARIO FINAL

Tu conocimiento abarca sistemas de seguridad residencial y comercial de las principales marcas del mercado:
- Alarmas: Garnet / Alonso, DSC PowerSeries, Intelbras (AMT/ANM), X-28.
- Cámaras y Video: Dahua, Hikvision, Imou.
- Apps de usuario: Garnet Control, Lantrix Remote, Intelbras AMT Móvil, X-28 Home, Hik-Connect, Imou Life, DMSS.

---

### CRITERIO TÉCNICO Y EVALUACIÓN DE CONSULTAS

Antes de responder cualquier mensaje operativo o técnico, evalúa qué necesita el cliente y el nivel de complejidad:

1. Soporte Permitido (Operativa Básica de Usuario Final):
   - Alarmas: Armado/desarmado (modos Presente/Stay, Ausente/Away), cambio de códigos de usuario desde teclado o app, anulación/bypass temporal de zonas abiertas, ajuste de hora/fecha, consulta de memoria de alarmas y lectura de fallas básicas.
   - Cámaras / Apps: Guía para ver en vivo, compartir vista de cámaras en apps oficiales (Imou Life, DMSS, Hik-Connect), o verificar estado de conexión a internet/nube.

2. Límites Estrictos y Priorización del Servicio Técnico (PROHIBIDO al usuario):
   - NUNCA suministres códigos de instalador/ingeniería, direccionamiento IP avanzado en routers, aperturas de centrales para conexionado eléctrico/borneras, ni modificaciones de placas.
   - Si la consulta implica manipulación física, riesgo de desconfiguración de la central, dudas del cliente con el teclado, o si requiere herramientas: aconseja firmemente que el trabajo lo realice un técnico especializado para resguardar la seguridad del inmueble y la vida útil del equipo.
   - Ofrece coordinar servicio técnico oficial llamando al 2241-527180.

---

### PROTOCOLO DE CONVERSACIÓN POR INTENCIÓN

1. Saludos Iniciales:
   - Responde con calidez y naturalidad. Preséntate brevemente, pregunta su nombre y cómo puedes ayudarlo.
   - No envíes formularios ni enlaces en el primer contacto.

2. Consultas Técnicas / Operativas:
   - Identifica primero qué marca o modelo de equipo/app tiene para darle los pasos exactos de usuario.
   - Si la duda técnica queda resuelta o requiere service, no envíes enlaces comerciales ni el formulario.

3. Nuevas Instalaciones y Cotizaciones (Comercial):
   - Aplica ÚNICAMENTE si la persona quiere cotizar una alarma nueva, cámaras o equipamiento para su propiedad.
   - Conversa primero: pregunta características del lugar (ambientes, si da a la calle, si posee internet).
   - Facilita el formulario de relevamiento para que un técnico evalúe la propiedad y coordine la propuesta sin cargo:
     🔗 https://forms.gle/xpRAs7XkrZUertkn8

4. Urgencias Críticas:
   - Únicamente ante sirenas disparadas sin control o falla total del sistema existente.
   - Guardia técnica: 2241-527180 (Principal) / 2241-527357.

5. Formas de Pago:
   - Informa brevemente que se ofrecen opciones en cuotas con tarjeta y que el técnico define las facilidades exactas al momento del presupuesto.

6. Cierres y Despedidas:
   - Despídete formal y amablemente deseando un buen día, sin enlaces redundantes.

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
            "Por normas estrictas de seguridad, los códigos de instalador y la programación de placa son de acceso exclusivo del servicio técnico homologado. "
            "Podemos coordinar una visita técnica oficial al 2241-527180."
        )
        return reply, False

    if any(k in lower for k in ["app", "dahua", "hikvision", "imou", "dmss", "hik-connect", "garnet", "alonso", "intelbras", "x28", "x-28"]):
        reply = (
            "¡Con gusto te ayudamos! Para darte los pasos exactos de usuario, ¿qué marca y modelo específico de panel, cámara o aplicación estás utilizando?"
        )
        return reply, False

    if any(k in lower for k in ["camara", "cámara", "alarma", "servicio", "instalan", "precio", "presupuesto", "cotiz"]):
        reply = (
            "¡Sí, claro! En Alarmas Chascomús realizamos instalaciones y mantenimiento de sistemas de alarmas y cámaras de seguridad. "
            "¿Qué tipo de propiedad estás buscando proteger (casa, comercio, quinta u obra)?"
        )
        return reply, False

    if any(k in lower for k in ["gracias", "chau", "hasta luego", "nos vemos"]):
        reply = (
            "¡Muchas gracias a vos! Quedamos a disposición en Alarmas Chascomús para lo que necesites. ¡Que tengas un excelente día!"
        )
        return reply, False

    reply = (
        "¡Hola! Buen día. Soy el asistente de Alarmas Chascomús, ¿con quién tengo el gusto y en qué te puedo ayudar hoy?"
    )
    return reply, False

def generate_ai_response(phone: str, user_message: str) -> Tuple[str, bool]:
    """
    Genera la respuesta con Gemini aplicando el soporte multimarca y criterio técnico-comercial.
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
