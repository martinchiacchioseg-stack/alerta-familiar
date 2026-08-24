# 🚨 Alarmas Chascomús - Alerta Familiar & Comercial
> Progressive Web App (PWA) de nivel profesional y grado de producción para despacho inmediato de alertas SOS y confirmaciones de llegada segura, con arquitectura **Multi-Tenant estricta**, geolocalización de alta precisión y vinculación sin fricción mediante **Telegram Bot API**.

---

## 🌟 Características Principales

- **Aislamiento Multi-Tenant Estricto (Zero-Knowledge):** Los ecosistemas (Familias y Comercios) están estrictamente particionados a nivel de consultas en base de datos. Ningún dato cruza entre cuentas.
- **Doble Botón Táctico de Emergencia:**
  - 🔴 **SOS / PÁNICO (Rojo):** Alerta crítica destacada (`disable_notification: false`), vibración háptica en la app (`[300, 100, 300]`), envío de mensaje de texto prioritario + objeto nativo `sendLocation` de Telegram y enlaces a Google Maps / OpenStreetMap.
  - 🟢 **Llegué bien (Verde):** Notificación informativa silenciosa y discreta (`disable_notification: true`) con coordenadas exactas de arribo.
- **Vinculación sin Fricción con Telegram (Deep Linking):**
  - Generador de Códigos QR y enlaces inteligentes: `https://t.me/<BOT_USER>?start=bind_<ECOSISTEMA_ID>_<USER_ID>_<HASH_SEGURIDAD>`.
  - Webhook Serverless en `/api/telegram-webhook` que captura el `chat_id` privado al presionar "INICIAR" y valida el token criptográfico contra PostgreSQL.
- **Despacho Concurrente de Alta Velocidad:** Al disparar una alerta, el backend despacha en paralelo (`Promise.allSettled`) a todos los `chat_id` registrados en ese ecosistema.
- **PWA Instalable y Resiliente:** Service Worker (`sw.js`), `manifest.json`, iconos de alta fidelidad, soporte offline y cooldown visual anti-pánico.
- **Arquitectura de 3 Roles:**
  1. **SuperAdmin (Alarmas Chascomús Global):** Gestión y suspensión de ecosistemas, telemetría global, tasas de éxito y auditoría.
  2. **Admin de Ecosistema (Titular):** Gestión de integrantes, monitoreo en vivo de vinculación Telegram e historial de alertas.
  3. **Miembro / Usuario Final:** Interfaz simplificada de disparo ergonómico y geolocalización asistida.

---

## 📁 Estructura del Proyecto

```
alarmas-chascomus/
├── prisma/
│   └── schema.prisma          # Esquema Multi-Tenant (Ecosistemas, Usuarios, Alertas, Auditoría)
├── public/
│   ├── icon.svg               # Escudo e isotipo vectorial de alta fidelidad
│   ├── manifest.json          # Manifest PWA Standalone
│   ├── offline.html           # Pantalla de respaldo sin conexión
│   └── sw.js                  # Service Worker y cacheo inteligente
├── scripts/
│   └── seed.js                # Semilla de datos de prueba
├── src/
│   ├── app/
│   │   ├── admin/             # Panel Central Global SuperAdmin
│   │   ├── api/
│   │   │   ├── alertas/       # Disparo transaccional e historial Multi-Tenant
│   │   │   ├── auth/          # Login, sesión JWT y verificación RBAC
│   │   │   ├── ecosistemas/   # CRUD de Ecosistemas para SuperAdmin
│   │   │   ├── miembros/      # Gestión de integrantes por grupo
│   │   │   ├── telegram-webhook/ # Webhook Serverless de Telegram
│   │   │   ├── telemetria/    # Métricas y tasas de entrega
│   │   │   └── vincular/      # Generador de QR y Deep Links
│   │   ├── login/             # Pantalla de acceso por email o token
│   │   ├── panel/             # Panel del Titular de Ecosistema
│   │   ├── vincular/          # Pantalla interactiva de escaneo QR Telegram
│   │   ├── globals.css        # Paleta táctica y animaciones de pulso
│   │   ├── layout.tsx         # Layout raíz con Service Worker
│   │   └── page.tsx           # Home PWA de disparo ergonómico
│   ├── components/
│   │   ├── EmergencyTrigger.tsx # Botones SOS / Llegada con GPS y háptica
│   │   ├── Navbar.tsx         # Barra superior con estado de Telegram y sesión
│   │   └── SecurityBanner.tsx # Banner de transparencia y cifrado TLS
│   └── lib/
│       ├── auth.ts            # Bcrypt y verificación de roles
│       ├── jwt.ts             # Firma y validación de tokens JWT
│       ├── prisma.ts          # Singleton Prisma para Serverless
│       └── telegram.ts        # Motor de despacho concurrente a Telegram
├── .env.example               # Variables de entorno documentadas
├── next.config.mjs            # Configuración de Next.js App Router
├── tailwind.config.ts         # Configuración de estilos Tailwind
└── tsconfig.json              # Configuración de TypeScript
```

---

## ⚙️ Configuración y Variables de Entorno (.env)

Cree un archivo `.env` basado en `.env.example`:

```env
# 1. Base de Datos PostgreSQL (Neon, Vercel Postgres, Supabase o Docker)
DATABASE_URL="postgresql://usuario:password@host:5432/alarmas_chascomus?sslmode=require"

# 2. Telegram Bot API (Obtenido desde @BotFather)
TELEGRAM_BOT_TOKEN="123456789:ABCDefghIJKlmnoPQRstuvWXyz-EXAMPLE"
TELEGRAM_BOT_USERNAME="AlarmasChascomusBot"

# 3. Autenticación y Criptografía
JWT_SECRET="clave_secreta_jwt_de_alta_seguridad_2026"
NEXTAUTH_SECRET="clave_secreta_jwt_de_alta_seguridad_2026"

# 4. SuperAdmin Global (Bootstrap)
SUPERADMIN_USER="superadmin@alarmaschascomus.com.ar"
SUPERADMIN_PASSWORD_HASH="$2a$10$w8.1tA/Xj4gN29yS0s/NGeNq3m2e8GjJp/3iM1m5s0e4r5t6u7v8w"

# 5. Dominio de Despliegue
NEXT_PUBLIC_APP_URL="https://tu-dominio.vercel.app"
NODE_ENV="production"
```

---

## 🤖 Configuración del Bot de Telegram

1. Abra Telegram y busque a **`@BotFather`**.
2. Envíe `/newbot` y elija el nombre: `Alarmas Chascomús - Alerta Familiar`.
3. Guarde el **Token HTTP API** obtenido y configúrelo en `TELEGRAM_BOT_TOKEN`.
4. Una vez desplegada la aplicación en Vercel o su dominio público, configure el Webhook ejecutando en su navegador o terminal:
   ```bash
   curl "https://api.telegram.org/bot<TU_TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<TU_DOMINIO>/api/telegram-webhook"
   ```

---

## 🚀 Despliegue en Vercel

1. Suba este repositorio a GitHub / GitLab.
2. Importe el proyecto en **Vercel**.
3. En la sección **Environment Variables**, agregue las variables de `.env`.
4. En **Storage**, puede conectar una base de datos **Neon Serverless Postgres** o **Vercel Postgres** con 1 solo clic.
5. Vercel ejecutará automáticamente `prisma generate` y construirá la aplicación con optimización Serverless.
