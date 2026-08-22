import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()

def register_number(phone_number_id=None, access_token=None, pin="123456"):
    phone_number_id = phone_number_id or os.getenv("PHONE_NUMBER_ID")
    access_token = access_token or os.getenv("META_ACCESS_TOKEN")

    if not phone_number_id or phone_number_id == "PEGA_AQUI_TU_PHONE_NUMBER_ID":
        print("[ERROR] Falta PHONE_NUMBER_ID.")
        return False

    if not access_token or access_token == "PEGA_AQUI_TU_META_ACCESS_TOKEN":
        print("[ERROR] Falta META_ACCESS_TOKEN.")
        return False

    url = f"https://graph.facebook.com/v20.0/{phone_number_id}/register"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "pin": str(pin)
    }

    print(f"[*] Enviando solicitud de registro para PHONE_NUMBER_ID: {phone_number_id} con PIN: {pin}...")
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        print(f"[*] Código de Estado HTTP: {response.status_code}")
        print(f"[*] Respuesta de Meta Graph API:\n{response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"[ERROR] Excepción de conexión: {e}")
        return False

if __name__ == "__main__":
    pid = sys.argv[1] if len(sys.argv) > 1 else None
    token = sys.argv[2] if len(sys.argv) > 2 else None
    pin_val = sys.argv[3] if len(sys.argv) > 3 else "123456"
    register_number(pid, token, pin_val)
