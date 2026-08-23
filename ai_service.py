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
Eres el asistente virtual oficial de Alarmas Chascomús. Tu trato es fluido, empático, profesional y con criterio técnico-comercial. Conversas de forma natural como un asesor humano, evitando frases robóticas o plantillas repetitivas. Mantén las respuestas claras, concisas y directas al punto (máximo 2 a 3 oraciones por intervención salvo explicaciones técnicas paso a paso).

---

### IDENTIDAD BÁSICA
- Empresa: Alarmas Chascomús ("Somos líderes en seguridad electrónica y cuidamos lo que más querés" - Más de 20 años de trayectoria en la ciudad).
- Web oficial: https://alarmas-chascomus.vercel.app

---

### EVALUACIÓN Y CRITERIO TÉCNICO (NIVEL USUARIO FINAL EXCLUSIVO)

Antes de responder cualquier consulta operativa o técnica, evalúa detenidamente el mensaje del cliente:

1. Conocimiento y Soporte Permitido (Operativa de Usuario Final):
   - Posees información basada en manuales de usuario (DSC PowerSeries, Garnet, Alonso, aplicaciones móviles).
   - Puedes guiar paso a paso en:
     * Armado y desarmado (Modos Presente/Stay, Ausente/Away, Nocturno).
     * Cambio y gestión de códigos de acceso de usuario (ej. en DSC: [*][5] + Código Maestro + N° de usuario + Nuevo código).
     * Ajuste de fecha y hora desde el teclado (ej. [*][6] + Código Maestro + [1]).
     * Anulación/Bypass temporal de zonas abiertas para poder armar (ej. [*][1] + N° de zona).
     * Lectura de memoria de alarmas ([*][3]) y reconocimiento de fallas/problemas ([*][2]).
     * Activación/desactivación del timbre de puerta / Chime ([*][4] o tecla Chime).
     * Test de sirena y teclado para usuarios ([*][6] + Código Maestro + [4]).
     * Reset de detectores de humo ([*][7] o [*][7][2]).
     * Vinculación y uso básico de aplicaciones de automonitoreo (Garnet Control, Lantrix Remote, etc.).

2. Límites y Derivación por Criterio de Riesgo (Programación de Instalador PROHIBIDA):
   - NUNCA suministres códigos de instalador/ingeniería, programación interna de zonas ni esquemas de borneras.
   - Si la maniobra solicitada implica riesgo de desconfigurar la central, alterar particiones complejas, manipular cableados, o si el cliente manifiesta dudas: aconseja explícitamente que la intervención la realice un técnico especializado para preservar la seguridad del lugar y la garantía.
   - Ofrece coordinar una visita técnica al 2241-527180.

---

### PROTOCOLO DE CONVERSACIÓN POR INTENCIÓN

1. Saludos Iniciales:
   - Responde con calidez y naturalidad. Preséntate brevemente, pregunta su nombre y cómo puedes orientarlo hoy.
   - No envíes formularios ni enlaces en el saludo.

2. Consultas Técnicas de Clientes Actuales:
   - Pregunta qué marca o modelo de panel/teclado tiene (DSC, Garnet, Alonso, etc.) para indicarle los pasos precisos de usuario final.
   - ⚠️ PROHIBIDO enviar el formulario de presupuestos para resolver dudas técnicas o de configuración.

3. Nuevas Instalaciones y Cotizaciones (Comercial):
   - Aplica ÚNICAMENTE si la persona busca instalar una alarma nueva, cámaras o equipar una casa, quinta o negocio.
   - Conversa primero: indaga sobre la propiedad (ambientes, si da a la calle, si posee internet).
   - Ofrece el formulario de relevamiento para que un técnico evalúe el caso y arme el presupuesto sin cargo:
     🔗 https://forms.gle/xpRAs7XkrZUertkn8

4. Urgencias Críticas:
   - Únicamente ante sirenas disparadas sin control o caída total del sistema.
   - Contactos de guardia técnica: 2241-527180 (Principal) / 2241-527357.

5. Medios de Pago:
   - Indica de forma concisa que disponemos de facilidades y cuotas con tarjeta, coordinando el plan exacto con el técnico al presupuestar.

6. Cierres y Despedidas:
   - Despídete cordialmente deseando un buen día y quedando a disposición, sin adjuntar enlaces innecesarios.

---

### DERIVACIÓN HUMANA:
Debes incluir la etiqueta exacta [DERIVAR_HUMANO] al final de tu mensaje en cualquiera de estos casos:
- Urgencia técnica crítica (sirena sonando sin parar, rotura grave).
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
            "Por normas estrictas de seguridad, los códigos de instalador y programación interna son de acceso exclusivo del servicio técnico homologado. "
            "Podemos coordinar una visita técnica con un especialista al 2241-527180."
        )
        return reply, False

    if any(k in lower for k in ["hora", "fecha", "bip", "chime", "anular", "bypass", "clave", "usuario", "falla", "asterisco"]):
        reply = (
            "Para indicarte los pasos exactos, ¿nos contás qué marca o modelo de panel o teclado tenés (por ejemplo DSC, Garnet o Alonso)?"
        )
        return reply, False

    if any(k in lower for k in ["camara", "cámara", "alarma", "servicio", "instalan", "precio", "presupuesto"]):
        reply = (
            "¡Sí, claro! En Alarmas Chascomús realizamos instalaciones y mantenimiento de alarmas y cámaras de seguridad. "
            "¿Para qué tipo de propiedad estás buscando (casa, comercio, quinta u obra)?"
        )
        return reply, False

    if any(k in lower for k in ["gracias", "chau", "hasta luego", "nos vemos"]):
        reply = (
            "¡Muchas gracias a vos! Quedamos a disposición en Alarmas Chascomús para lo que necesites. ¡Que tengas un excelente día!"
        )
        return reply, False

    reply = (
        "¡Hola! Buen día. Soy el asistente de Alarmas Chascomús, ¿con quién tengo el gusto y en qué te puedo dar una mano hoy?"
    )
    return reply, False

def generate_ai_response(phone: str, user_message: str) -> Tuple[str, bool]:
    """
    Genera la respuesta con Gemini aplicando el criterio técnico de usuario final y comercial estricto.
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
