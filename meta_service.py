import os
import asyncio
import httpx
from dotenv import load_dotenv

def get_meta_credentials():
    """Recarga y devuelve las credenciales actuales de Meta sanitizadas"""
    load_dotenv(override=True)
    token = os.getenv("META_ACCESS_TOKEN", "").strip()
    phone_id = os.getenv("PHONE_NUMBER_ID", "").strip()
    return token, phone_id

def is_meta_configured() -> bool:
    """Verifica si las credenciales de Meta están presentes y no son placeholders"""
    token, phone_id = get_meta_credentials()
    return bool(
        token 
        and token != "PEGA_AQUI_TU_META_ACCESS_TOKEN" 
        and phone_id 
        and phone_id != "PEGA_AQUI_TU_PHONE_NUMBER_ID"
    )

async def send_whatsapp_message(to_phone: str, text: str) -> bool:
    """
    Envía un mensaje de texto a través de WhatsApp Cloud API de Meta.
    Si no están las credenciales, opera en modo simulación.
    """
    token, phone_id = get_meta_credentials()

    if not is_meta_configured():
        print(f"\n[SIMULACION WHATSAPP OUT] >>> Para: +{to_phone}")
        print(f"Texto: \"{text}\"\n")
        return True

    # Limpiar formato de teléfono
    clean_phone = str(to_phone).strip().replace("+", "").replace(" ", "").replace("-", "")

    graph_url = f"https://graph.facebook.com/v20.0/{phone_id}/messages"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": clean_phone,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": text
        }
    }

    print(f"\n[POST Graph API] -> Enviando WhatsApp a +{to_phone}...")
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(graph_url, headers=headers, json=payload)
            print(f"[Meta Response {response.status_code}]: {response.text}")
            if response.status_code == 200:
                return True
            else:
                return False
    except Exception as e:
        print(f"[Meta Exception Error]: {e}")
        return False

async def notify_guards(user_phone: str, user_name: str, last_message: str):
    """
    Envía notificación simultánea a los teléfonos de guardia configurados (en vivo o simulado).
    """
    load_dotenv(override=True)
    guard_1 = os.getenv("NOTIFY_PHONE_1", "5492241527180")
    guard_2 = os.getenv("NOTIFY_PHONE_2", "5492241527357")

    display_name = user_name if user_name and user_name != user_phone else "No especificado"
    
    alert_text = (
        "*ALERTA DE DERIVACION - ALARMAS CHASCOMUS*\n\n"
        f"*Cliente:* {display_name}\n"
        f"*Telefono:* +{user_phone}\n"
        f"*Ultimo mensaje:* \"{last_message}\"\n\n"
        "_El bot se pauso automaticamente para este contacto. Ingrese al panel o responda directamente al cliente._"
    )

    targets = [p for p in [guard_1, guard_2] if p]
    if not targets:
        print("[WARN] No hay numeros de guardia configurados para notificaciones.")
        return

    print("\n" + "="*60)
    print(f"[DISPARO ALERTA GUARDIA] Destinatarios: {', '.join(targets)}")
    print(alert_text)
    print("="*60 + "\n")

    if is_meta_configured():
        tasks = [send_whatsapp_message(phone, alert_text) for phone in targets]
        await asyncio.gather(*tasks, return_exceptions=True)
