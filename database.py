import sqlite3
import os
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "alarmas_chats.db")
ARG_TZ = timezone(timedelta(hours=-3))

def get_db_connection() -> sqlite3.Connection:
    """Crea una conexión con sqlite3 configurada con row_factory como diccionario"""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inicializa las tablas de la base de datos si no existen"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Tabla de contactos
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            phone TEXT PRIMARY KEY,
            name TEXT,
            bot_active INTEGER DEFAULT 1,
            last_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            unread_count INTEGER DEFAULT 0
        )
    """)

    # Tabla de mensajes
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT NOT NULL,
            sender TEXT NOT NULL,  -- 'user', 'bot', 'agent'
            text TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (phone) REFERENCES contacts(phone)
        )
    """)

    # Índices para mejorar velocidad de consulta
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_messages_phone ON messages(phone)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)")
    
    conn.commit()
    conn.close()
    print("[OK] Base de datos SQLite (alarmas_chats.db) inicializada correctamente.")

def save_message(phone: str, sender: str, text: str, name: Optional[str] = None) -> Dict[str, Any]:
    """
    Guarda un mensaje en la base de datos y actualiza o crea el contacto asociado.
    sender: 'user' | 'bot' | 'agent'
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now(ARG_TZ).strftime('%Y-%m-%d %H:%M:%S')

    # 1. Verificar si el contacto existe
    cursor.execute("SELECT phone, name, unread_count FROM contacts WHERE phone = ?", (phone,))
    contact = cursor.fetchone()

    if contact is None:
        unread = 1 if sender == 'user' else 0
        display_name = name if name else phone
        cursor.execute("""
            INSERT INTO contacts (phone, name, bot_active, last_interaction, unread_count)
            VALUES (?, ?, 1, ?, ?)
        """, (phone, display_name, now, unread))
    else:
        # Actualizar contacto existente
        new_unread = (contact["unread_count"] + 1) if sender == 'user' else contact["unread_count"]
        if name and (not contact["name"] or contact["name"] == phone):
            cursor.execute("""
                UPDATE contacts 
                SET last_interaction = ?, unread_count = ?, name = ?
                WHERE phone = ?
            """, (now, new_unread, name, phone))
        else:
            cursor.execute("""
                UPDATE contacts 
                SET last_interaction = ?, unread_count = ?
                WHERE phone = ?
            """, (now, new_unread, phone))

    # 2. Insertar mensaje
    cursor.execute("""
        INSERT INTO messages (phone, sender, text, timestamp)
        VALUES (?, ?, ?, ?)
    """, (phone, sender, text, now))
    
    message_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": message_id,
        "phone": phone,
        "sender": sender,
        "text": text,
        "timestamp": now
    }

def get_contacts() -> List[Dict[str, Any]]:
    """Devuelve la lista de contactos ordenada por interacción más reciente con el último mensaje"""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        SELECT 
            c.phone, 
            c.name, 
            c.bot_active, 
            c.last_interaction, 
            c.unread_count,
            (SELECT text FROM messages WHERE phone = c.phone ORDER BY id DESC LIMIT 1) as last_message,
            (SELECT sender FROM messages WHERE phone = c.phone ORDER BY id DESC LIMIT 1) as last_sender,
            (SELECT timestamp FROM messages WHERE phone = c.phone ORDER BY id DESC LIMIT 1) as last_message_time
        FROM contacts c
        ORDER BY c.last_interaction DESC
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    contacts = [dict(row) for row in rows]
    conn.close()
    return contacts

def get_messages(phone: str) -> List[Dict[str, Any]]:
    """Devuelve todos los mensajes cronológicos de un número específico"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, phone, sender, text, timestamp 
        FROM messages 
        WHERE phone = ? 
        ORDER BY id ASC
    """, (phone,))
    rows = cursor.fetchall()
    messages = [dict(row) for row in rows]
    conn.close()
    return messages

def mark_as_read(phone: str):
    """Limpia el contador de mensajes no leídos al abrir el chat"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE contacts SET unread_count = 0 WHERE phone = ?", (phone,))
    conn.commit()
    conn.close()

def toggle_bot(phone: str, bot_active: bool) -> bool:
    """Activa o desactiva la respuesta automática de IA para un contacto"""
    conn = get_db_connection()
    cursor = conn.cursor()
    val = 1 if bot_active else 0
    cursor.execute("UPDATE contacts SET bot_active = ? WHERE phone = ?", (val, phone))
    conn.commit()
    conn.close()
    return bot_active

def is_bot_active(phone: str) -> bool:
    """Verifica si el bot está activo para responder a este número"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT bot_active FROM contacts WHERE phone = ?", (phone,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        return True # Por defecto activo para números nuevos
    return bool(row["bot_active"])

def get_chat_history_for_ai(phone: str, limit: int = 8) -> List[Dict[str, Any]]:
    """Devuelve el historial en formato estructurado para Gemini (roles 'user' y 'model')"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT sender, text 
        FROM messages 
        WHERE phone = ? 
        ORDER BY id DESC 
        LIMIT ?
    """, (phone, limit))
    rows = cursor.fetchall()
    conn.close()

    history = []
    # Invertir para orden cronológico
    for row in reversed(rows):
        role = "user" if row["sender"] == "user" else "model"
        history.append({
            "role": role,
            "parts": [row["text"]]
        })
    return history
