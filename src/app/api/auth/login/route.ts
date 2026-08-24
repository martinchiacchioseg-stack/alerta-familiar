import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";
import { signJwtToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password, memberToken } = await req.json();

    // 1. Acceso directo por Token de Miembro (Para terminales PWA / miembros rápidos)
    if (memberToken) {
      const miembro = await prisma.usuario.findUnique({
        where: { tokenVinculacion: memberToken },
        include: { ecosistema: true },
      });

      if (!miembro || !miembro.activo) {
        return NextResponse.json({ error: "Token de miembro inválido o cuenta inactiva" }, { status: 401 });
      }

      if (miembro.ecosistema && miembro.ecosistema.estado === "SUSPENDIDO") {
        return NextResponse.json({ error: "El ecosistema se encuentra suspendido. Contacte a soporte." }, { status: 403 });
      }

      const token = signJwtToken({
        userId: miembro.id,
        nombre: miembro.nombre,
        email: miembro.email,
        rol: miembro.rol,
        ecosistemaId: miembro.ecosistemaId,
        ecosistemaNombre: miembro.ecosistema?.nombre || null,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: miembro.id,
          nombre: miembro.nombre,
          rol: miembro.rol,
          ecosistemaId: miembro.ecosistemaId,
          ecosistemaNombre: miembro.ecosistema?.nombre,
          telegramVinculado: Boolean(miembro.telegramChatId),
        },
        token,
      });

      response.cookies.set("auth_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });

      return response;
    }

    // 2. Acceso por Correo y Contraseña (SuperAdmin / Admin de Ecosistema)
    if (!email || !password) {
      return NextResponse.json({ error: "Correo electrónico y contraseña requeridos" }, { status: 400 });
    }

    // Comprobar SuperAdmin por variable de entorno o base de datos
    const superAdminUser = process.env.SUPERADMIN_USER;
    const superAdminHash = process.env.SUPERADMIN_PASSWORD_HASH;

    if (superAdminUser && email.toLowerCase() === superAdminUser.toLowerCase()) {
      let isSuperValid = false;
      if (superAdminHash) {
        isSuperValid = await comparePassword(password, superAdminHash);
      } else if (password === "Admin2026!Chascomus") {
        isSuperValid = true;
      }

      if (isSuperValid) {
        const token = signJwtToken({
          userId: "superadmin-root",
          nombre: "SuperAdmin - Alarmas Chascomús",
          email: superAdminUser,
          rol: "SUPERADMIN",
          ecosistemaId: null,
          ecosistemaNombre: "Central Global Alarmas Chascomús",
        });

        const response = NextResponse.json({
          success: true,
          user: {
            id: "superadmin-root",
            nombre: "SuperAdmin - Alarmas Chascomús",
            email: superAdminUser,
            rol: "SUPERADMIN",
            ecosistemaNombre: "Central Global",
          },
          token,
        });

        response.cookies.set("auth_session", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }
    }

    // Buscar usuario en base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { ecosistema: true },
    });

    if (!usuario || !usuario.passwordHash) {
      return NextResponse.json({ error: "Credenciales de acceso incorrectas" }, { status: 401 });
    }

    const isValid = await comparePassword(password, usuario.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Credenciales de acceso incorrectas" }, { status: 401 });
    }

    if (!usuario.activo) {
      return NextResponse.json({ error: "Usuario deshabilitado." }, { status: 403 });
    }

    if (usuario.ecosistema && usuario.ecosistema.estado === "SUSPENDIDO") {
      return NextResponse.json({ error: "El ecosistema ha sido suspendido por administración." }, { status: 403 });
    }

    const token = signJwtToken({
      userId: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      ecosistemaId: usuario.ecosistemaId,
      ecosistemaNombre: usuario.ecosistema?.nombre || null,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        ecosistemaId: usuario.ecosistemaId,
        ecosistemaNombre: usuario.ecosistema?.nombre,
        telegramVinculado: Boolean(usuario.telegramChatId),
      },
      token,
    });

    response.cookies.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error("Error en login:", error);
    return NextResponse.json({ error: "Error interno en el servidor de autenticación" }, { status: 500 });
  }
}
