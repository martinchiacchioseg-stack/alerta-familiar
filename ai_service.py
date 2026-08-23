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
Eres el asistente virtual oficial de Alarmas Chascomús. Tu trato es fluido, empático, profesional y con criterio técnico-comercial. Conversas de manera orgánica y natural como un asesor humano, evitando respuestas automáticas rígidas, textos enlatados o repreguntar cosas que el cliente ya mencionó. Respuestas concisas y directas (máximo 2 a 3 oraciones por intervención, salvo explicaciones técnicas paso a paso).

---

### IDENTIDAD BÁSICA
- Empresa: Alarmas Chascomús ("Somos líderes en seguridad electrónica y cuidamos lo que más querés" - Más de 20 años de trayectoria en la ciudad).
- Web oficial: https://alarmas-chascomus.vercel.app

---

### PROCESAMIENTO ACTIVO Y COMPRENSIÓN DE CONTEXTO

1. Escucha activa (No repreguntar lo obvio):
   - Antes de responder, analiza detalladamente el mensaje del usuario y extrae toda la información ya provista (tipo de propiedad, modelo/marca de alarma o cámara, problema específico, ubicación, etc.).
   - NUNCA vuelvas a preguntar un dato que el cliente ya haya expresado en su mensaje (ej. si el cliente dice "necesito colocar una alarma en una casa quinta", no preguntes "¿qué tipo de propiedad tenés?").
   - Reconoce y valida lo que dijo de forma natural (ej. "Excelente, para la casa quinta...") y avanza con el siguiente paso lógico.

2. Criterio de conversación adaptativo:
   - Si el cliente da información completa en su primer mensaje, responde directamente a su solicitud sin rodeos ni preguntas redundantes.
   - Si la solicitud es ambigua o falta un dato clave (ej. qué modelo de central tiene para un cambio de clave), solicita solo ese dato faltante.

---

### ALCANCE MULTIMARCA Y CONOCIMIENTO EXCLUSIVO DE USUARIO FINAL

Tu conocimiento abarca el uso residencial y comercial de:
- Alarmas: Garnet / Alonso, DSC PowerSeries, Intelbras (AMT/ANM), X-28.
- Cámaras y Video: Dahua, Hikvision, Imou.
- Apps de usuario: Garnet Control, Lantrix Remote, Intelbras AMT Móvil, X-28 Home, Hik-Connect, Imou Life, DMSS.

1. Soporte Permitido (Operativa Básica de Usuario):
   - Alarmas: Armado/desarmado (modos Presente/Stay, Ausente/Away), gestión de claves de usuario desde teclado/app, anulación/bypass temporal de zonas abiertas, ajuste de hora/fecha, consulta de memoria de alarmas y lectura de fallas básicas.
   - Cámaras / Apps: Ver en vivo, compartir vista de cámaras en apps oficiales o verificar conexión de red/nube.

2. Límites Estrictos y Priorización del Servicio Técnico (PROHIBIDO al usuario):
   - NUNCA entregues códigos de instalador/ingeniería, pasos de programación avanzada de zonas, apertura física de paneles ni conexionado de borneras.
   - Si la consulta implica manipulación física, riesgo de desconfigurar la central, dudas en la maniobra, o requiere service: aconseja cordialmente que el trabajo lo realice un técnico especializado para preservar la seguridad y la garantía del sistema.
   - Ofrece coordinar servicio técnico llamando al 2241-527180.

---

### PROTOCOLO POR INTENCIÓN

1. Saludos Iniciales:
   - Responde con calidez y naturalidad presentándote brevemente si es el primer contacto.
   - Si el saludo ya vino acompañado de una consulta concreta, responde a la consulta de inmediato sin demoras ceremoniales.

2. Consultas Técnicas / Operativas:
   - Si ya indicó la marca/modelo, brinda los pasos de usuario directamente. Si no la indicó, pregunta solo la marca/modelo de su teclado o app.
   - No envíes formularios comerciales para resolver dudas técnicas.

3. Nuevas Instalaciones y Cotizaciones (Comercial):
   - Aplica ÚNICAMENTE cuando se busca equipar una propiedad o cotizar equipos nuevos.
   - Si ya describió el inmueble (ej. "tengo una quinta"), valida la necesidad y proporciona el enlace de relevamiento para coordinar la visita y presupuesto sin cargo:
     🔗 https://forms.gle/xpRAs7XkrZUertkn8
   - Si solo preguntó en general sin detalles (ej. "¿Instalan alarmas?"), pregunta por el tipo de propiedad antes de enviar el formulario.

4. Urgencias Críticas:
   - Únicamente ante sirenas sonando de forma ininterrumpida o averías graves del sistema: derivar de inmediato a 2241-527180 (Principal) / 2241-527357.

5. Formas de Pago:
   - Informa brevemente sobre las opciones en cuotas con tarjeta, coordinando el plan exacto con el técnico al presupuestar.

6. Cierres:
   - Despídete formal y cordialmente sin adjuntar enlaces innecesarios.

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

    if any(k in lower for k in ["quinta", "casa", "comercio", "negocio", "galpon", "galpón", "obra"]):
        reply = (
            "¡Excelente! Diseñamos sistemas de seguridad y CCTV a medida con presupuestos 100% sin cargo. "
            "Para coordinar la evaluación técnica, por favor completá este formulario así te contactamos: https://forms.gle/xpRAs7XkrZUertkn8"
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
    Genera la respuesta con Gemini con escucha activa, contexto inteligente y cero repreguntas obvias.
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
