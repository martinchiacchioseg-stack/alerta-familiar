const { Client } = require("pg");

const DATABASE_URL =
  "postgresql://postgres.yxzlbykarrlnwxgfhool:Chiacchio%401938@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const SQL = `
-- Verificar y crear enums solo si no existen
DO $$ BEGIN
  CREATE TYPE "TipoEcosistema" AS ENUM ('FAMILIA', 'COMERCIO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "EstadoEcosistema" AS ENUM ('ACTIVO', 'SUSPENDIDO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "RolUsuario" AS ENUM ('SUPERADMIN', 'ADMIN_ECOSISTEMA', 'MIEMBRO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "TipoAlerta" AS ENUM ('LLEGADA_OK', 'SOS_PANICO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "EstadoDespacho" AS ENUM ('ENVIADO', 'ERROR_PARCIAL', 'FALLIDO', 'MODO_LOCAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tabla Ecosistemas
CREATE TABLE IF NOT EXISTS "Ecosistema" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "nombre" TEXT NOT NULL,
  "tipo" "TipoEcosistema" NOT NULL DEFAULT 'FAMILIA',
  "estado" "EstadoEcosistema" NOT NULL DEFAULT 'ACTIVO',
  "direccion" TEXT,
  "telefonoContacto" TEXT,
  "notas" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Ecosistema_pkey" PRIMARY KEY ("id")
);

-- Tabla Usuarios
CREATE TABLE IF NOT EXISTS "Usuario" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "ecosistemaId" TEXT,
  "nombre" TEXT NOT NULL,
  "email" TEXT,
  "telefono" TEXT,
  "passwordHash" TEXT,
  "rol" "RolUsuario" NOT NULL DEFAULT 'MIEMBRO',
  "telegramChatId" TEXT,
  "telegramUsername" TEXT,
  "tokenVinculacion" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "vinculadoEn" TIMESTAMP(3),
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- Tabla Alertas
CREATE TABLE IF NOT EXISTS "Alerta" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "ecosistemaId" TEXT NOT NULL,
  "usuarioId" TEXT NOT NULL,
  "tipo" "TipoAlerta" NOT NULL,
  "latitud" DOUBLE PRECISION,
  "longitud" DOUBLE PRECISION,
  "precisionGps" DOUBLE PRECISION,
  "direccionAprox" TEXT,
  "estadoDespacho" "EstadoDespacho" NOT NULL DEFAULT 'ENVIADO',
  "destinatariosTotal" INTEGER NOT NULL DEFAULT 0,
  "destinatariosExito" INTEGER NOT NULL DEFAULT 0,
  "metadataJson" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Alerta_pkey" PRIMARY KEY ("id")
);

-- Tabla Auditoría SuperAdmin
CREATE TABLE IF NOT EXISTS "SuperAdminAudit" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "usuarioId" TEXT,
  "accion" TEXT NOT NULL,
  "targetTipo" TEXT,
  "targetId" TEXT,
  "detallesJson" TEXT,
  "ip" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SuperAdminAudit_pkey" PRIMARY KEY ("id")
);

-- Índices únicos (IF NOT EXISTS no existe para UNIQUE INDEX, usamos DO EXCEPTION)
DO $$ BEGIN
  CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
EXCEPTION WHEN duplicate_table THEN NULL; END $$;

DO $$ BEGIN
  CREATE UNIQUE INDEX "Usuario_telegramChatId_key" ON "Usuario"("telegramChatId");
EXCEPTION WHEN duplicate_table THEN NULL; END $$;

DO $$ BEGIN
  CREATE UNIQUE INDEX "Usuario_tokenVinculacion_key" ON "Usuario"("tokenVinculacion");
EXCEPTION WHEN duplicate_table THEN NULL; END $$;

-- Índices de performance
CREATE INDEX IF NOT EXISTS "Ecosistema_estado_idx" ON "Ecosistema"("estado");
CREATE INDEX IF NOT EXISTS "Usuario_ecosistemaId_idx" ON "Usuario"("ecosistemaId");
CREATE INDEX IF NOT EXISTS "Usuario_tokenVinculacion_idx" ON "Usuario"("tokenVinculacion");
CREATE INDEX IF NOT EXISTS "Usuario_telegramChatId_idx" ON "Usuario"("telegramChatId");
CREATE INDEX IF NOT EXISTS "Alerta_ecosistemaId_createdAt_idx" ON "Alerta"("ecosistemaId", "createdAt");
CREATE INDEX IF NOT EXISTS "Alerta_usuarioId_idx" ON "Alerta"("usuarioId");
CREATE INDEX IF NOT EXISTS "SuperAdminAudit_accion_idx" ON "SuperAdminAudit"("accion");
CREATE INDEX IF NOT EXISTS "SuperAdminAudit_createdAt_idx" ON "SuperAdminAudit"("createdAt");

-- Foreign Keys (IF NOT EXISTS no aplica para constraints, usamos DO EXCEPTION)
DO $$ BEGIN
  ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_ecosistemaId_fkey"
    FOREIGN KEY ("ecosistemaId") REFERENCES "Ecosistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_ecosistemaId_fkey"
    FOREIGN KEY ("ecosistemaId") REFERENCES "Ecosistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_usuarioId_fkey"
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "SuperAdminAudit" ADD CONSTRAINT "SuperAdminAudit_usuarioId_fkey"
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
`;

async function migrate() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
    statement_timeout: 60000,
  });

  try {
    console.log("⏳ Conectando a Supabase...");
    await client.connect();
    console.log("✅ Conexión exitosa a Supabase!\n");

    console.log("⏳ Creando tablas e índices...");
    await client.query(SQL);
    console.log("✅ Tablas creadas correctamente:\n");
    console.log("   📦 Ecosistema");
    console.log("   👤 Usuario");
    console.log("   🚨 Alerta");
    console.log("   📋 SuperAdminAudit");
    console.log("\n🎉 Migración completada con éxito!");
  } catch (err) {
    console.error("❌ Error en migración:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
