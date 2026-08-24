const { Client } = require("pg");
const crypto = require("crypto");

const DATABASE_URL =
  "postgresql://postgres.yxzlbykarrlnwxgfhool:Chiacchio%401938@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function seed() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
  });

  try {
    console.log("⏳ Conectando a Supabase...");
    await client.connect();
    console.log("✅ Conexión exitosa!\n");

    // 1. Crear Ecosistema de prueba
    const ecoResult = await client.query(`
      INSERT INTO "Ecosistema" ("nombre", "tipo", "estado", "direccion")
      VALUES ('Familia Chascomús (Prueba)', 'FAMILIA', 'ACTIVO', 'Chascomús, Pcia. de Buenos Aires')
      ON CONFLICT DO NOTHING
      RETURNING *;
    `);

    let ecosistema;
    if (ecoResult.rows.length > 0) {
      ecosistema = ecoResult.rows[0];
      console.log(`✅ Ecosistema creado: "${ecosistema.nombre}" (ID: ${ecosistema.id})`);
    } else {
      const existing = await client.query(`SELECT * FROM "Ecosistema" WHERE "nombre" = 'Familia Chascomús (Prueba)' LIMIT 1`);
      ecosistema = existing.rows[0];
      console.log(`ℹ️  Ecosistema ya existía: "${ecosistema.nombre}"`);
    }

    // 2. Crear usuario de prueba personal (titular del ecosistema de prueba)
    const tokenTitular = crypto.randomBytes(16).toString("hex");
    const titularResult = await client.query(`
      INSERT INTO "Usuario" ("ecosistemaId", "nombre", "email", "rol", "tokenVinculacion", "activo")
      VALUES ($1, 'Martín (Titular - Prueba)', 'martin@alarmaschascomus.com.ar', 'ADMIN_ECOSISTEMA', $2, true)
      ON CONFLICT ("email") DO UPDATE SET "tokenVinculacion" = $2
      RETURNING *;
    `, [ecosistema.id, tokenTitular]);

    const titular = titularResult.rows[0];
    console.log(`✅ Usuario titular de prueba: "${titular.nombre}"`);
    console.log(`   📧 Email: ${titular.email}`);
    console.log(`   🔑 Token de acceso: ${titular.tokenVinculacion}`);

    // 3. Crear miembro adicional de prueba
    const tokenMiembro = crypto.randomBytes(16).toString("hex");
    await client.query(`
      INSERT INTO "Usuario" ("ecosistemaId", "nombre", "telefono", "rol", "tokenVinculacion", "activo")
      VALUES ($1, 'Familiar (Miembro - Prueba)', '+54 9 2241 000-0001', 'MIEMBRO', $2, true)
      ON CONFLICT DO NOTHING;
    `, [ecosistema.id, tokenMiembro]);

    console.log(`✅ Miembro de prueba creado`);
    console.log(`   🔑 Token miembro: ${tokenMiembro}`);

    console.log(`\n${"─".repeat(50)}`);
    console.log(`🎉 DATOS DE PRUEBA LISTOS`);
    console.log(`${"─".repeat(50)}`);
    console.log(`\n🌐 App local:  http://localhost:3000`);
    console.log(`\n🔐 SuperAdmin:`);
    console.log(`   Email:     superadmin@alarmaschascomus.com.ar`);
    console.log(`   Contraseña: Admin2026!Chascomus`);
    console.log(`   URL:       http://localhost:3000/login`);
    console.log(`\n👤 Titular del ecosistema de prueba:`);
    console.log(`   Email:     martin@alarmaschascomus.com.ar`);
    console.log(`   Token:     ${titular.tokenVinculacion}`);
    console.log(`\n📲 Para vincular tu Telegram personal:`);
    console.log(`   1. Ingresá con el token de arriba en http://localhost:3000`);
    console.log(`   2. Andá a http://localhost:3000/vincular`);
    console.log(`   3. Escaneá el QR o tocá el botón azul "Abrir en Telegram"`);
    console.log(`   4. Presioná INICIAR en el bot @AlarmasChascomusBot`);
    console.log(`${"─".repeat(50)}\n`);

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
