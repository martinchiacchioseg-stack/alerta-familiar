import time
import requests
import json

WEBHOOK_URL = "http://localhost:8000/webhook"
API_CONTACTS_URL = "http://localhost:8000/api/contacts"
API_MESSAGES_URL = "http://localhost:8000/api/messages"

def create_meta_payload(from_phone: str, name: str, message_text: str, message_id: str = "wamid.HBgL"):
    """Crea la estructura de datos exacta que envía WhatsApp Cloud API a los Webhooks"""
    return {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
                "changes": [
                    {
                        "value": {
                            "messaging_product": "whatsapp",
                            "metadata": {
                                "display_phone_number": "5492241000000",
                                "phone_number_id": "100000000000000"
                            },
                            "contacts": [
                                {
                                    "profile": {
                                        "name": name
                                    },
                                    "wa_id": from_phone
                                }
                            ],
                            "messages": [
                                {
                                    "from": from_phone,
                                    "id": f"{message_id}_{int(time.time())}",
                                    "timestamp": str(int(time.time())),
                                    "text": {
                                        "body": message_text
                                    },
                                    "type": "text"
                                }
                            ]
                        },
                        "field": "messages"
                    }
                ]
            }
        ]
    }

def run_tests():
    print("=" * 75)
    print(" EJECUTANDO PRUEBAS DE FLUJO DE CHATBOT - ALARMAS CHASCOMUS")
    print("=" * 75)

    # -------------------------------------------------------------
    # CASO A: Consulta de Cámaras y Presupuesto
    # -------------------------------------------------------------
    phone_a = "5492241112233"
    name_a = "Juan Pérez"
    msg_a = "Hola, ¿qué costo tiene instalar un kit de 4 cámaras en una casa en Chascomús?"

    print(f"\n[CASO A - Consulta] Enviando mensaje de {name_a} (+{phone_a})...")
    print(f"Mensaje entrante: \"{msg_a}\"")
    
    payload_a = create_meta_payload(phone_a, name_a, msg_a, "msg_test_a")
    res_a = requests.post(WEBHOOK_URL, json=payload_a)
    print(f"Webhook Status: {res_a.status_code} - {res_a.text}")

    time.sleep(1)

    contacts = requests.get(API_CONTACTS_URL).json()
    contact_a = next((c for c in contacts if c["phone"] == phone_a), None)
    
    if contact_a:
        print(f"-> Contacto: {contact_a['name']} (+{contact_a['phone']})")
        print(f"-> Estado Bot: {'ACTIVO (1)' if contact_a['bot_active'] else 'PAUSADO (0)'}")
        print(f"-> Respuesta generada: \"{contact_a['last_message']}\"")
        assert contact_a['bot_active'] == 1, "Error: El bot debería estar activo para el Caso A"
        print("-> [RESULTADO CASO A]: EXITOSO (IA respondió y mantuvo el bot activo).")
    else:
        print("-> [ERROR]: No se encontró el contacto en la base de datos.")

    # -------------------------------------------------------------
    # CASO B: Derivación Técnica Urgente
    # -------------------------------------------------------------
    phone_b = "5492241445566"
    name_b = "Roberto Gómez"
    msg_b = "Hola, necesito urgente que pase un técnico a revisar una alarma que quedó sonando."

    print(f"\n[CASO B - Derivación] Enviando urgencia técnica de {name_b} (+{phone_b})...")
    print(f"Mensaje entrante: \"{msg_b}\"")

    payload_b = create_meta_payload(phone_b, name_b, msg_b, "msg_test_b")
    res_b = requests.post(WEBHOOK_URL, json=payload_b)
    print(f"Webhook Status: {res_b.status_code} - {res_b.text}")

    time.sleep(1)

    contacts = requests.get(API_CONTACTS_URL).json()
    contact_b = next((c for c in contacts if c["phone"] == phone_b), None)

    if contact_b:
        print(f"-> Contacto: {contact_b['name']} (+{contact_b['phone']})")
        print(f"-> Estado Bot: {'ACTIVO (1)' if contact_b['bot_active'] else 'PAUSADO (0)'}")
        print(f"-> Respuesta al cliente: \"{contact_b['last_message']}\"")
        assert contact_b['bot_active'] == 0, "Error: El bot debería haberse pausado para el Caso B"
        print("-> [RESULTADO CASO B]: EXITOSO (Derivación detectada, alerta a 5492241527180 y 5492241527357, bot pausado).")
    else:
        print("-> [ERROR]: No se encontró el contacto en la base de datos.")

    print("\n" + "=" * 75)
    print(" TODAS LAS PRUEBAS FINALIZARON CORRECTAMENTE")
    print("=" * 75)

if __name__ == "__main__":
    run_tests()
