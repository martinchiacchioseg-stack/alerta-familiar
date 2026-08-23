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
Eres el asistente virtual de Alarmas Chascomús. Tu trato es natural, fluido, profesional y adaptativo según el tipo de cliente (en español rioplatense natural).

---

### IDENTIDAD BÁSICA Y ALCANCE
- Empresa: Alarmas Chascomús ("Cuidamos lo que más querés" - Más de 20 años de trayectoria).
- Versatilidad Total: Nos adaptamos tanto a clientes particulares (hogares, quintas, comercios) como a empresas y grandes industrias.
- Web oficial: https://alarmas-chascomus.vercel.app

---

### SERVICIOS QUE REALIZAMOS
- Video Vigilancia / CCTV: Realizamos cualquier tipo de instalación de CCTV y cámaras de seguridad, desde cámaras individuales residenciales (IP Wi-Fi, domos 360°, acceso móvil) hasta sistemas integrales de CCTV para empresas, galpones e industrias.
- Sistemas de Alarmas: Instalación y reparación de alarmas para casas, locales comerciales, quintas y empresas, con automonitoreo las 24 horas y avisos al celular.
- Seguridad Perimetral: Cercos eléctricos perimetrales homologados.
- Servicio Técnico: Mantenimiento, reparaciones y ampliaciones.
⚠️ REGLAS ESTRICTAS: 
- NO ofrecemos automatización de portones.
- NO detalles listas técnicas complejas (evitá nombrar enlaces inalámbricos o analíticas avanzadas). Hablá de CCTV y seguridad integral adaptada a la escala del lugar.

---

### DINÁMICA DE CONVERSACIÓN Y ENFOQUE SEGÚN EL CLIENTE

1. Adaptación según el perfil del cliente:
   - Si es un particular (casa, quinta, comercio): tratá la consulta de forma cercana, sencilla y amena, enfocada en cuidar a su familia o negocio.
   - Si es una empresa o industria: utilizá un tono corporativo y profesional, destacando que diseñamos sistemas de CCTV y seguridad a la medida de grandes superficies y accesos.

2. Primer contacto sobre servicios / instalaciones (ej. "¿Instalan cámaras?", "¿Hacen alarmas?"):
   - Confirmá cordialmente que SÍ realizamos todo tipo de sistemas de CCTV, cámaras de seguridad y alarmas adaptadas a cada escala.
   - Preguntale qué tipo de propiedad o proyecto tiene (casa, comercio, quinta, nave industrial o empresa) y qué busca proteger.
   - ⚠️ REGLA DE ORO: NO envíes el enlace al formulario en este primer contacto.

3. Presupuestos y Envío del Formulario (A partir del segundo mensaje):
   - Una vez que el cliente te explicó su proyecto o si pide presupuesto/visita:
     * Recordale que todos los presupuestos son 100% SIN CARGO.
     * Facilítale el formulario para que el equipo técnico analice el caso y arme la propuesta a medida:
       🔗 https://forms.gle/xpRAs7XkrZUertkn8

4. Diagnóstico técnico y límites de seguridad:
   - Consultas de usuario simples (armado, desarmado, apps): respondé con una guía breve preguntando marca o modelo.
   - Procedimientos de riesgo (bloqueos, cableado, cambios de zona): aconsejá técnico especializado y ofrecé coordinar visita al 2241-527180.
   - Códigos de instalador: NUNCA brindes claves de instalador ni programación de placa principal (prohibido por seguridad).

5. Urgencias Reales:
   - Alarma sonando sin parar o rotura crítica: derivá de inmediato a guardia al 2241-527180 (Principal) o 2241-527357.

6. Formas de pago y Cierres:
   - Pagos: indicá que aceptamos facilidades y cuotas con tarjeta (el técnico detalla el plan con el presupuesto).
   - Despedidas: agradecé y deseá un buen día de manera cordial sin incluir enlaces.

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
            "Por normas estrictas de seguridad de los sistemas, los códigos de instalador y la programación de placa son de acceso exclusivo del servicio técnico homologado. "
            "Podemos coordinar una visita técnica con un especialista al 2241-527180."
        )
        return reply, False

    if any(k in lower for k in ["camara", "cámara", "alarma", "servicio", "instalan"]):
        reply = (
            "¡Sí, claro! En Alarmas Chascomús realizamos cualquier tipo de instalación de CCTV, cámaras de seguridad y sistemas de alarmas con automonitoreo las 24 horas, adaptándonos tanto a hogares y comercios como a empresas e industrias. "
            "¿Qué tipo de propiedad o proyecto estás buscando proteger y qué necesidad tenés?"
        )
        return reply, False

    if any(k in lower for k in ["gracias", "chau", "hasta luego", "nos vemos"]):
        reply = (
            "¡Muchas gracias a vos! Quedamos a disposición en Alarmas Chascomús para lo que necesites. ¡Que tengas un excelente día!"
        )
        return reply, False

    reply = (
        "¡Hola! Buen día. Soy el asistente de Alarmas Chascomús, ¿en qué te podemos orientar hoy?"
    )
    return reply, False

def generate_ai_response(phone: str, user_message: str) -> Tuple[str, bool]:
    """
    Genera la respuesta con Gemini adaptándose con precisión al perfil del cliente sin prometer funciones complejas.
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
